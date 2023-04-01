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
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      return userData;
    }),

  saveBio: privateProcedure
    .input(z.object({ userId: z.string(), bio: z.string() }))
    .mutation(async ({ input }) => {
      const userData = await clerkClient.users.getUser(input.userId);

      if (!userData) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      return clerkClient.users.updateUserMetadata(input.userId, {
        privateMetadata: { customBio: input.bio },
      });
    }),
});
