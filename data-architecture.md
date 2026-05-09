# GetBooked.Live Data Architecture

## Core Data Strategy

The platform will use **Supabase** as the primary application data layer for browse records, user role records, offers, deals, notifications, reviews, and BookScore storage. The web application will access Supabase from server-side code so that role resolution, offer mutations, scheduled recalculation, and notification creation are not dependent on client-side state.

## Primary Tables

| Table | Purpose | Key Fields |
| --- | --- | --- |
| `user_profiles` | Canonical per-user record mapped to the authenticated account | `id`, `open_id`, `email`, `display_name`, `role`, `onboarding_complete`, `profile_completion`, `avatar_url`, `city`, `created_at`, `updated_at` |
| `artist_profiles` | Public artist listing details | `id`, `user_profile_id`, `slug`, `genre`, `fee_min`, `fee_max`, `bookscore`, `available_dates`, `city`, `hero_image_url`, `bio`, `is_published` |
| `venue_profiles` | Public venue listing details | `id`, `user_profile_id`, `slug`, `venue_type`, `capacity`, `rate_min`, `rate_max`, `city`, `availability_summary`, `hero_image_url`, `is_published` |
| `crew_profiles` | Public crew listing details | `id`, `user_profile_id`, `slug`, `primary_skill`, `rate_min`, `rate_max`, `city`, `availability_summary`, `is_published` |
| `creative_profiles` | Public creative listing details | `id`, `user_profile_id`, `slug`, `creative_type`, `rate_min`, `rate_max`, `city`, `portfolio_cover_url`, `is_published` |
| `offers` | Structured booking offers | `id`, `created_by_user_profile_id`, `recipient_user_profile_id`, `role_context`, `event_name`, `event_date`, `venue_name`, `city`, `attendance_estimate`, `deal_type`, `fee_amount`, `deposit_amount`, `status`, `step_snapshot`, `sent_at`, `updated_at` |
| `offer_activity` | Immutable timeline for offer events | `id`, `offer_id`, `actor_user_profile_id`, `event_type`, `payload_json`, `created_at` |
| `deals` | Accepted-offer canonical deal room record | `id`, `offer_id`, `status`, `contract_status`, `payment_status`, `deposit_due_at`, `final_payment_due_at`, `created_at`, `updated_at` |
| `deal_messages` | Message thread inside the deal room | `id`, `deal_id`, `sender_user_profile_id`, `message_body`, `created_at` |
| `notifications` | In-app notification inbox | `id`, `user_profile_id`, `kind`, `title`, `body`, `action_url`, `email_status`, `read_at`, `created_at` |
| `reviews` | Reputation inputs after completed work | `id`, `deal_id`, `reviewed_user_profile_id`, `reviewer_user_profile_id`, `rating`, `response_score`, `professionalism_score`, `created_at` |
| `bookscore_snapshots` | Historical score storage for each artist | `id`, `artist_profile_id`, `booking_completion_score`, `response_rate_score`, `review_score`, `bookscore_total`, `calculated_at` |
| `platform_jobs` | Durable scheduled-job ownership record | `id`, `job_name`, `schedule_cron_task_uid`, `last_run_at`, `last_result`, `created_at`, `updated_at` |

## Role Resolution

The authenticated account is mapped to `user_profiles.open_id`. The stored `role` field is the single source of truth for `/signup/role`, `/app`, protected navigation, and role-aware actions. No route should infer role from URL guesses or client-side assumptions.

## Browse Query Strategy

Each `/browse/*` route will query the matching profile table through server-side Supabase queries. Filter selections must produce a new query with real predicates for city, pricing, role-specific attributes, and BookScore. Mobile and desktop filters share the same query state.

## Offer and Deal Lifecycle

| Stage | Record Changes |
| --- | --- |
| Draft wizard | Local state collected across six steps and submitted to `offers` |
| Sent offer | `offers.status = 'sent'`; create `offer_activity` row and artist notification |
| Counter / decline / accept | Update `offers.status`; append `offer_activity`; create promoter notification |
| Accepted offer | Create `deals` row linked to the offer |
| Active booking | Use `deals`, `deal_messages`, and payment metadata as the system of record |

## Notification Design

Every supported business trigger creates an in-app row in `notifications` and also enqueues an email send operation. The first release includes the following triggers:

| Trigger | Recipient | In-app | Email |
| --- | --- | --- | --- |
| New offer received | Artist | Yes | Yes |
| Offer accepted | Promoter | Yes | Yes |
| Offer countered | Promoter | Yes | Yes |
| Offer declined | Promoter | Yes | Yes |

## BookScore Formula

BookScore is stored per artist as a 0–100 integer. The initial weighted formula will be:

| Component | Weight | Source |
| --- | --- | --- |
| Booking completion | 40% | Ratio of completed deals to accepted deals |
| Response rate | 30% | Ratio of timely responses across received offers |
| Review performance | 30% | Average normalized review scores |

The scheduled job will calculate each component, clamp values between 0 and 100, and write the combined score to both `artist_profiles.bookscore` and `bookscore_snapshots` for auditability.

## Scheduled Job Design

The BookScore recalculation is deterministic, so it should run as a **Heartbeat HTTP cron** rather than an agent-driven task. The implementation will:

1. expose an authenticated cron endpoint under `/api/scheduled/bookscore-refresh`;
2. validate that the caller is a cron execution;
3. recalculate BookScore for all artist profiles idempotently;
4. update the snapshot table and latest artist score;
5. return structured JSON for logging and investigation.

The cron ownership record will store the returned `schedule_cron_task_uid` so the job can be updated, paused, or re-created later without depending on mutable names.

## Email Delivery Strategy

Email notification dispatch will be implemented from server-side code and kept separate from UI mutation logic. Business actions will first persist the in-app notification, then attempt email delivery, and finally update the notification row with the email delivery result so failures remain visible to admins.
