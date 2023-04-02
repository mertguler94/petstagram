import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getSignedInUser: publicProcedure.query(() => {
    return {};
  }),
  getUserWithUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const userData = await clerkClient.users.getUser(input.userId);

      if (!userData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return userData;
    }),

  saveBio: privateProcedure
    .input(z.object({ userId: z.string(), bio: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.userId !== input.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Method called from not logged in user",
        });
      }

      const userData = await clerkClient.users.getUser(input.userId);
      if (!userData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return clerkClient.users.updateUserMetadata(input.userId, {
        privateMetadata: { customBio: input.bio },
      });
    }),
});
