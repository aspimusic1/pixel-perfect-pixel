export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      advance_requests: {
        Row: {
          amount_requested: number
          artist_id: string
          booking_id: string
          collected_at: string | null
          created_at: string
          evaluated_at: string | null
          fee_amount: number
          fee_percent: number
          guarantee_net: number
          id: string
          paid_at: string | null
          rejection_reason: string | null
          status: string
        }
        Insert: {
          amount_requested?: number
          artist_id: string
          booking_id: string
          collected_at?: string | null
          created_at?: string
          evaluated_at?: string | null
          fee_amount?: number
          fee_percent?: number
          guarantee_net?: number
          id?: string
          paid_at?: string | null
          rejection_reason?: string | null
          status?: string
        }
        Update: {
          amount_requested?: number
          artist_id?: string
          booking_id?: string
          collected_at?: string | null
          created_at?: string
          evaluated_at?: string | null
          fee_amount?: number
          fee_percent?: number
          guarantee_net?: number
          id?: string
          paid_at?: string | null
          rejection_reason?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "advance_requests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_availability: {
        Row: {
          artist_id: string
          created_at: string
          date: string
          flash_bid_deadline: string | null
          flash_bid_enabled: boolean
          flash_bid_min_price: number | null
          id: string
          is_available: boolean
          notes: string | null
        }
        Insert: {
          artist_id: string
          created_at?: string
          date: string
          flash_bid_deadline?: string | null
          flash_bid_enabled?: boolean
          flash_bid_min_price?: number | null
          id?: string
          is_available?: boolean
          notes?: string | null
        }
        Update: {
          artist_id?: string
          created_at?: string
          date?: string
          flash_bid_deadline?: string | null
          flash_bid_enabled?: boolean
          flash_bid_min_price?: number | null
          id?: string
          is_available?: boolean
          notes?: string | null
        }
        Relationships: []
      }
      artist_claims: {
        Row: {
          artist_listing_id: string
          created_at: string
          id: string
          manager_name: string | null
          proof_text: string | null
          reviewed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          artist_listing_id: string
          created_at?: string
          id?: string
          manager_name?: string | null
          proof_text?: string | null
          reviewed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          artist_listing_id?: string
          created_at?: string
          id?: string
          manager_name?: string | null
          proof_text?: string | null
          reviewed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_claims_artist_listing_id_fkey"
            columns: ["artist_listing_id"]
            isOneToOne: false
            referencedRelation: "artist_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_expenses: {
        Row: {
          amount: number
          booking_id: string | null
          category: string
          created_at: string
          description: string
          expense_date: string
          id: string
          tour_stop_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          booking_id?: string | null
          category?: string
          created_at?: string
          description?: string
          expense_date?: string
          id?: string
          tour_stop_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          category?: string
          created_at?: string
          description?: string
          expense_date?: string
          id?: string
          tour_stop_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_expenses_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artist_expenses_tour_stop_id_fkey"
            columns: ["tour_stop_id"]
            isOneToOne: false
            referencedRelation: "tour_stops"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_listings: {
        Row: {
          bandsintown_url: string | null
          claim_status: string
          claimed_by: string | null
          created_at: string
          genre: string | null
          id: string
          name: string
          notes: string | null
          origin: string | null
          upcoming_concerts: number | null
        }
        Insert: {
          bandsintown_url?: string | null
          claim_status?: string
          claimed_by?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          name: string
          notes?: string | null
          origin?: string | null
          upcoming_concerts?: number | null
        }
        Update: {
          bandsintown_url?: string | null
          claim_status?: string
          claimed_by?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          name?: string
          notes?: string | null
          origin?: string | null
          upcoming_concerts?: number | null
        }
        Relationships: []
      }
      artist_stats: {
        Row: {
          created_at: string
          followers: number | null
          id: string
          monthly_listeners: number | null
          snapshot_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          followers?: number | null
          id?: string
          monthly_listeners?: number | null
          snapshot_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          followers?: number | null
          id?: string
          monthly_listeners?: number | null
          snapshot_date?: string
          user_id?: string
        }
        Relationships: []
      }
      booking_financing: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          installments: number | null
          interest_rate: number | null
          monthly_payment: number | null
          plan_type: string
          promoter_id: string
          status: string
          total_amount: number
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          installments?: number | null
          interest_rate?: number | null
          monthly_payment?: number | null
          plan_type?: string
          promoter_id: string
          status?: string
          total_amount?: number
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          installments?: number | null
          interest_rate?: number | null
          monthly_payment?: number | null
          plan_type?: string
          promoter_id?: string
          status?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_financing_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_insurance: {
        Row: {
          booking_id: string
          coverage_amount: number
          coverage_type: string
          created_at: string
          id: string
          policy_id: string | null
          policy_type: string
          premium: number
          purchased_at: string | null
          purchased_by: string | null
          status: string
        }
        Insert: {
          booking_id: string
          coverage_amount?: number
          coverage_type: string
          created_at?: string
          id?: string
          policy_id?: string | null
          policy_type?: string
          premium?: number
          purchased_at?: string | null
          purchased_by?: string | null
          status?: string
        }
        Update: {
          booking_id?: string
          coverage_amount?: number
          coverage_type?: string
          created_at?: string
          id?: string
          policy_id?: string | null
          policy_type?: string
          premium?: number
          purchased_at?: string | null
          purchased_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_insurance_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          artist_id: string
          contract_url: string | null
          created_at: string
          event_date: string
          event_time: string | null
          guarantee: number
          id: string
          offer_id: string
          promoter_id: string
          status: string
          updated_at: string
          venue_name: string
        }
        Insert: {
          artist_id: string
          contract_url?: string | null
          created_at?: string
          event_date: string
          event_time?: string | null
          guarantee?: number
          id?: string
          offer_id: string
          promoter_id: string
          status?: string
          updated_at?: string
          venue_name: string
        }
        Update: {
          artist_id?: string
          contract_url?: string | null
          created_at?: string
          event_date?: string
          event_time?: string | null
          guarantee?: number
          id?: string
          offer_id?: string
          promoter_id?: string
          status?: string
          updated_at?: string
          venue_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: true
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_signatures: {
        Row: {
          booking_id: string
          id: string
          signature_data: string
          signature_type: string
          signed_at: string
          user_id: string
        }
        Insert: {
          booking_id: string
          id?: string
          signature_data: string
          signature_type?: string
          signed_at?: string
          user_id: string
        }
        Update: {
          booking_id?: string
          id?: string
          signature_data?: string
          signature_type?: string
          signed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_signatures_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      counter_offers: {
        Row: {
          created_at: string
          door_split: number | null
          event_date: string
          event_time: string | null
          guarantee: number
          id: string
          merch_split: number | null
          message: string | null
          offer_id: string
          sender_id: string
          status: string
        }
        Insert: {
          created_at?: string
          door_split?: number | null
          event_date: string
          event_time?: string | null
          guarantee?: number
          id?: string
          merch_split?: number | null
          message?: string | null
          offer_id: string
          sender_id: string
          status?: string
        }
        Update: {
          created_at?: string
          door_split?: number | null
          event_date?: string
          event_time?: string | null
          guarantee?: number
          id?: string
          merch_split?: number | null
          message?: string | null
          offer_id?: string
          sender_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "counter_offers_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      crew_members: {
        Row: {
          created_at: string
          day_rate: number | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          role: string
          tour_id: string
        }
        Insert: {
          created_at?: string
          day_rate?: number | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          role: string
          tour_id: string
        }
        Update: {
          created_at?: string
          day_rate?: number | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          role?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crew_members_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          deal_room_id: string
          description: string | null
          due_date: string | null
          id: string
          sort_order: number
          status: string
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          deal_room_id: string
          description?: string | null
          due_date?: string | null
          id?: string
          sort_order?: number
          status?: string
          title: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          deal_room_id?: string
          description?: string | null
          due_date?: string | null
          id?: string
          sort_order?: number
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_milestones_deal_room_id_fkey"
            columns: ["deal_room_id"]
            isOneToOne: false
            referencedRelation: "deal_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_rooms: {
        Row: {
          booking_id: string
          created_at: string
          id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_rooms_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      flash_bids: {
        Row: {
          amount: number
          artist_id: string
          availability_id: string
          bidder_id: string
          created_at: string
          id: string
          status: string
        }
        Insert: {
          amount: number
          artist_id: string
          availability_id: string
          bidder_id: string
          created_at?: string
          id?: string
          status?: string
        }
        Update: {
          amount?: number
          artist_id?: string
          availability_id?: string
          bidder_id?: string
          created_at?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "flash_bids_availability_id_fkey"
            columns: ["availability_id"]
            isOneToOne: false
            referencedRelation: "artist_availability"
            referencedColumns: ["id"]
          },
        ]
      }
      income_smoothing: {
        Row: {
          artist_id: string
          created_at: string
          end_date: string | null
          fee_percent: number
          id: string
          is_active: boolean
          monthly_payout: number
          start_date: string | null
          total_managed_income: number
          updated_at: string
        }
        Insert: {
          artist_id: string
          created_at?: string
          end_date?: string | null
          fee_percent?: number
          id?: string
          is_active?: boolean
          monthly_payout?: number
          start_date?: string | null
          total_managed_income?: number
          updated_at?: string
        }
        Update: {
          artist_id?: string
          created_at?: string
          end_date?: string | null
          fee_percent?: number
          id?: string
          is_active?: boolean
          monthly_payout?: number
          start_date?: string | null
          total_managed_income?: number
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          backline: string | null
          commission_amount: number | null
          commission_rate: number
          created_at: string
          door_split: number | null
          event_date: string
          event_time: string | null
          guarantee: number
          hospitality: string | null
          id: string
          merch_split: number | null
          notes: string | null
          recipient_id: string
          sender_id: string
          status: string
          updated_at: string
          venue_name: string
        }
        Insert: {
          backline?: string | null
          commission_amount?: number | null
          commission_rate?: number
          created_at?: string
          door_split?: number | null
          event_date: string
          event_time?: string | null
          guarantee?: number
          hospitality?: string | null
          id?: string
          merch_split?: number | null
          notes?: string | null
          recipient_id: string
          sender_id: string
          status?: string
          updated_at?: string
          venue_name: string
        }
        Update: {
          backline?: string | null
          commission_amount?: number | null
          commission_rate?: number
          created_at?: string
          door_split?: number | null
          event_date?: string
          event_time?: string | null
          guarantee?: number
          hospitality?: string | null
          id?: string
          merch_split?: number | null
          notes?: string | null
          recipient_id?: string
          sender_id?: string
          status?: string
          updated_at?: string
          venue_name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          apple_music: string | null
          avatar_url: string | null
          bandcamp: string | null
          bandsintown: string | null
          banner_url: string | null
          beatport: string | null
          bio: string | null
          city: string | null
          completion_score: number | null
          created_at: string
          display_name: string | null
          facebook: string | null
          genre: string | null
          id: string
          instagram: string | null
          is_verified: boolean | null
          onboarding_steps: Json | null
          pitch_card_url: string | null
          profile_complete: boolean | null
          rate_max: number | null
          rate_min: number | null
          role: Database["public"]["Enums"]["app_role"] | null
          slug: string | null
          songkick: string | null
          soundcloud: string | null
          spotify: string | null
          state: string | null
          streaming_stats: Json | null
          subscription_plan: string
          suspended: boolean
          threads: string | null
          tiktok: string | null
          timezone: string | null
          twitter: string | null
          updated_at: string
          user_id: string
          website: string | null
          youtube: string | null
        }
        Insert: {
          apple_music?: string | null
          avatar_url?: string | null
          bandcamp?: string | null
          bandsintown?: string | null
          banner_url?: string | null
          beatport?: string | null
          bio?: string | null
          city?: string | null
          completion_score?: number | null
          created_at?: string
          display_name?: string | null
          facebook?: string | null
          genre?: string | null
          id?: string
          instagram?: string | null
          is_verified?: boolean | null
          onboarding_steps?: Json | null
          pitch_card_url?: string | null
          profile_complete?: boolean | null
          rate_max?: number | null
          rate_min?: number | null
          role?: Database["public"]["Enums"]["app_role"] | null
          slug?: string | null
          songkick?: string | null
          soundcloud?: string | null
          spotify?: string | null
          state?: string | null
          streaming_stats?: Json | null
          subscription_plan?: string
          suspended?: boolean
          threads?: string | null
          tiktok?: string | null
          timezone?: string | null
          twitter?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          youtube?: string | null
        }
        Update: {
          apple_music?: string | null
          avatar_url?: string | null
          bandcamp?: string | null
          bandsintown?: string | null
          banner_url?: string | null
          beatport?: string | null
          bio?: string | null
          city?: string | null
          completion_score?: number | null
          created_at?: string
          display_name?: string | null
          facebook?: string | null
          genre?: string | null
          id?: string
          instagram?: string | null
          is_verified?: boolean | null
          onboarding_steps?: Json | null
          pitch_card_url?: string | null
          profile_complete?: boolean | null
          rate_max?: number | null
          rate_min?: number | null
          role?: Database["public"]["Enums"]["app_role"] | null
          slug?: string | null
          songkick?: string | null
          soundcloud?: string | null
          spotify?: string | null
          state?: string | null
          streaming_stats?: Json | null
          subscription_plan?: string
          suspended?: boolean
          threads?: string | null
          tiktok?: string | null
          timezone?: string | null
          twitter?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      reel_clips: {
        Row: {
          created_at: string
          file_path: string
          id: string
          sort_order: number
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          sort_order?: number
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          sort_order?: number
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      show_attendance: {
        Row: {
          actual_attendance: number
          artist_id: string
          booking_id: string
          created_at: string
          id: string
          promoter_id: string
          reported_by: string
          venue_capacity: number | null
          venue_name: string
        }
        Insert: {
          actual_attendance: number
          artist_id: string
          booking_id: string
          created_at?: string
          id?: string
          promoter_id: string
          reported_by: string
          venue_capacity?: number | null
          venue_name: string
        }
        Update: {
          actual_attendance?: number
          artist_id?: string
          booking_id?: string
          created_at?: string
          id?: string
          promoter_id?: string
          reported_by?: string
          venue_capacity?: number | null
          venue_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "show_attendance_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tour_budget_items: {
        Row: {
          actual_cost: number | null
          category: string
          created_at: string
          description: string
          estimated_cost: number
          id: string
          notes: string | null
          tour_id: string
        }
        Insert: {
          actual_cost?: number | null
          category: string
          created_at?: string
          description: string
          estimated_cost?: number
          id?: string
          notes?: string | null
          tour_id: string
        }
        Update: {
          actual_cost?: number | null
          category?: string
          created_at?: string
          description?: string
          estimated_cost?: number
          id?: string
          notes?: string | null
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_budget_items_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_documents: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          tour_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          tour_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          tour_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_documents_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_stops: {
        Row: {
          city: string | null
          created_at: string
          date: string
          doors_time: string | null
          guarantee: number | null
          id: string
          load_in_time: string | null
          notes: string | null
          show_time: string | null
          sort_order: number
          sound_check_time: string | null
          state: string | null
          tour_id: string
          venue_name: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          date: string
          doors_time?: string | null
          guarantee?: number | null
          id?: string
          load_in_time?: string | null
          notes?: string | null
          show_time?: string | null
          sort_order?: number
          sound_check_time?: string | null
          state?: string | null
          tour_id: string
          venue_name: string
        }
        Update: {
          city?: string | null
          created_at?: string
          date?: string
          doors_time?: string | null
          guarantee?: number | null
          id?: string
          load_in_time?: string | null
          notes?: string | null
          show_time?: string | null
          sort_order?: number
          sound_check_time?: string | null
          state?: string | null
          tour_id?: string
          venue_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_stops_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transport_bookings: {
        Row: {
          booked_by: string
          created_at: string
          dropoff_location: string | null
          id: string
          listing_id: string
          pickup_location: string | null
          pickup_time: string | null
          provider_id: string
          status: string
          total_cost: number
          tour_stop_id: string
        }
        Insert: {
          booked_by: string
          created_at?: string
          dropoff_location?: string | null
          id?: string
          listing_id: string
          pickup_location?: string | null
          pickup_time?: string | null
          provider_id: string
          status?: string
          total_cost?: number
          tour_stop_id: string
        }
        Update: {
          booked_by?: string
          created_at?: string
          dropoff_location?: string | null
          id?: string
          listing_id?: string
          pickup_location?: string | null
          pickup_time?: string | null
          provider_id?: string
          status?: string
          total_cost?: number
          tour_stop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_bookings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "transport_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_bookings_tour_stop_id_fkey"
            columns: ["tour_stop_id"]
            isOneToOne: false
            referencedRelation: "tour_stops"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_listings: {
        Row: {
          cities_served: string[] | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          provider_id: string
          rate_per_hour: number | null
          rate_per_trip: number | null
          rating: number | null
          review_count: number | null
          vehicle_capacity: number
          vehicle_type: string
        }
        Insert: {
          cities_served?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          provider_id: string
          rate_per_hour?: number | null
          rate_per_trip?: number | null
          rating?: number | null
          review_count?: number | null
          vehicle_capacity?: number
          vehicle_type?: string
        }
        Update: {
          cities_served?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          provider_id?: string
          rate_per_hour?: number | null
          rate_per_trip?: number | null
          rating?: number | null
          review_count?: number | null
          vehicle_capacity?: number
          vehicle_type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      venue_availability: {
        Row: {
          available_date: string
          created_at: string
          id: string
          notes: string | null
          venue_id: string
        }
        Insert: {
          available_date: string
          created_at?: string
          id?: string
          notes?: string | null
          venue_id: string
        }
        Update: {
          available_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_availability_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venue_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_availability_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venue_listings_public"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_claims: {
        Row: {
          business_name: string | null
          created_at: string
          id: string
          proof_text: string | null
          reviewed_at: string | null
          status: string
          user_id: string
          venue_id: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          id?: string
          proof_text?: string | null
          reviewed_at?: string | null
          status?: string
          user_id: string
          venue_id: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          id?: string
          proof_text?: string | null
          reviewed_at?: string | null
          status?: string
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_claims_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venue_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_claims_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venue_listings_public"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_listings: {
        Row: {
          address: string | null
          amenities: string[] | null
          capacity: number | null
          city: string | null
          claim_status: string
          claimed_by: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          region: string | null
          state: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          capacity?: number | null
          city?: string | null
          claim_status?: string
          claimed_by?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          region?: string | null
          state?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          capacity?: number | null
          city?: string | null
          claim_status?: string
          claimed_by?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          region?: string | null
          state?: string | null
          website?: string | null
        }
        Relationships: []
      }
      venue_photos: {
        Row: {
          caption: string | null
          created_at: string
          file_path: string
          id: string
          sort_order: number | null
          uploaded_by: string
          venue_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          file_path: string
          id?: string
          sort_order?: number | null
          uploaded_by: string
          venue_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          file_path?: string
          id?: string
          sort_order?: number | null
          uploaded_by?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_photos_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venue_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_photos_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venue_listings_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_profiles: {
        Row: {
          apple_music: string | null
          avatar_url: string | null
          bandcamp: string | null
          bandsintown: string | null
          banner_url: string | null
          beatport: string | null
          bio: string | null
          city: string | null
          display_name: string | null
          facebook: string | null
          genre: string | null
          id: string | null
          instagram: string | null
          is_verified: boolean | null
          pitch_card_url: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          slug: string | null
          songkick: string | null
          soundcloud: string | null
          spotify: string | null
          state: string | null
          streaming_stats: Json | null
          threads: string | null
          tiktok: string | null
          twitter: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
          youtube: string | null
        }
        Insert: {
          apple_music?: string | null
          avatar_url?: string | null
          bandcamp?: string | null
          bandsintown?: string | null
          banner_url?: string | null
          beatport?: string | null
          bio?: string | null
          city?: string | null
          display_name?: string | null
          facebook?: string | null
          genre?: string | null
          id?: string | null
          instagram?: string | null
          is_verified?: boolean | null
          pitch_card_url?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          slug?: string | null
          songkick?: string | null
          soundcloud?: string | null
          spotify?: string | null
          state?: string | null
          streaming_stats?: Json | null
          threads?: string | null
          tiktok?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          youtube?: string | null
        }
        Update: {
          apple_music?: string | null
          avatar_url?: string | null
          bandcamp?: string | null
          bandsintown?: string | null
          banner_url?: string | null
          beatport?: string | null
          bio?: string | null
          city?: string | null
          display_name?: string | null
          facebook?: string | null
          genre?: string | null
          id?: string | null
          instagram?: string | null
          is_verified?: boolean | null
          pitch_card_url?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          slug?: string | null
          songkick?: string | null
          soundcloud?: string | null
          spotify?: string | null
          state?: string | null
          streaming_stats?: Json | null
          threads?: string | null
          tiktok?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      venue_listings_public: {
        Row: {
          address: string | null
          amenities: string[] | null
          capacity: number | null
          city: string | null
          claim_status: string | null
          created_at: string | null
          description: string | null
          id: string | null
          name: string | null
          region: string | null
          state: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          capacity?: number | null
          city?: string | null
          claim_status?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          name?: string | null
          region?: string | null
          state?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          capacity?: number | null
          city?: string | null
          claim_status?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          name?: string | null
          region?: string | null
          state?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "artist" | "promoter" | "venue" | "production" | "photo_video"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["artist", "promoter", "venue", "production", "photo_video"],
    },
  },
} as const
