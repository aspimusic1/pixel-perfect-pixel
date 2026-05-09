import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  computeBookScoreSnapshot,
  createOffer,
  getDashboard,
  getDeal,
  getOffer,
  getViewerState,
  listBrowseProfiles,
  listNotifications,
  listOffers,
  recordWaitlistEntry,
  respondToOffer,
  roleSchema,
  setViewerRole,
} from "./getbooked";

const waitlistInput = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  roleInterest: z.string().min(2).max(60),
  notes: z.string().max(400).optional(),
});

const browseInput = z.object({
  role: z.enum(["all", "artist", "promoter", "venue", "crew", "creative"]).default("all"),
  city: z.string().optional(),
  genre: z.string().optional(),
  venueType: z.string().optional(),
  skill: z.string().optional(),
  creativeType: z.string().optional(),
  minScore: z.number().min(0).max(100).optional(),
  priceMax: z.number().positive().optional(),
  search: z.string().optional(),
});

const createOfferInput = z.object({
  artistName: z.string().min(2).max(120),
  eventName: z.string().min(2).max(120),
  eventDate: z.string().min(4).max(40),
  venueName: z.string().min(2).max(120),
  city: z.string().min(2).max(120),
  feeLabel: z.string().min(2).max(80),
  depositLabel: z.string().min(2).max(80),
  dealType: z.string().min(2).max(80),
});

const offerResponseInput = z.object({
  id: z.string().min(2),
  status: z.enum(["accepted", "countered", "declined"]),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  waitlist: router({
    join: publicProcedure.input(waitlistInput).mutation(async ({ input }) => recordWaitlistEntry(input)),
  }),
  platform: router({
    viewer: protectedProcedure.query(async ({ ctx }) => getViewerState(ctx.user)),
    dashboard: protectedProcedure.query(async ({ ctx }) => {
      const viewer = await getViewerState(ctx.user);
      const role = viewer.role ?? "artist";
      return {
        viewer,
        dashboard: getDashboard(role),
      };
    }),
    bookscorePreview: protectedProcedure.query(() => computeBookScoreSnapshot()),
  }),
  onboarding: router({
    setRole: protectedProcedure
      .input(z.object({ role: roleSchema }))
      .mutation(async ({ ctx, input }) => setViewerRole(ctx.user, input.role)),
  }),
  browse: router({
    list: publicProcedure.input(browseInput).query(async ({ input }) => listBrowseProfiles(input)),
  }),
  offers: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const viewer = await getViewerState(ctx.user);
      return listOffers(viewer.role ?? "artist");
    }),
    get: protectedProcedure.input(z.object({ id: z.string() })).query(({ input }) => getOffer(input.id)),
    create: protectedProcedure.input(createOfferInput).mutation(({ ctx, input }) => createOffer(ctx.user, input)),
    respond: protectedProcedure.input(offerResponseInput).mutation(({ ctx, input }) => respondToOffer(ctx.user, input.id, input.status)),
  }),
  deals: router({
    get: protectedProcedure.input(z.object({ id: z.string() })).query(({ input }) => getDeal(input.id)),
  }),
  notifications: router({
    list: protectedProcedure.query(({ ctx }) => listNotifications(ctx.user)),
  }),
});

export type AppRouter = typeof appRouter;
