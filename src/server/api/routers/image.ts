import { type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.post.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      take: 99,
    });
  }),

  savePost: privateProcedure
    .input(z.object({ postUrl: z.string(), caption: z.string() }))
    .mutation(({ ctx, input }) => {
      const postData = {
        postUrl: input.postUrl,
        caption: input.caption,
        userId: ctx.userId,
      };
      return ctx.prisma.post.create({
        data: postData,
      });
    }),

  getPostsByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findMany({
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        take: 99,
        where: {
          userId: input.userId,
        },
      });
    }),

  likeToggle: privateProcedure
    .input(
      z.object({ userId: z.string(), postId: z.string(), like: z.boolean() })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Post not found",
        });
      }

      let peopleLiked = post.likedBy as Prisma.JsonArray;
      if (!peopleLiked) {
        peopleLiked = [];
      }

      let newPeopleLiked = [...peopleLiked] as Prisma.JsonArray;
      if (input.like) {
        const peopleSet = new Set(newPeopleLiked);
        peopleSet.add(input.userId);
        newPeopleLiked = Array.from(peopleSet);
      } else {
        console.log("else statement");

        newPeopleLiked = peopleLiked.filter((id) => id !== input.userId);
      }

      return ctx.prisma.post.update({
        where: {
          id: input.postId,
        },
        data: { likedBy: newPeopleLiked },
      });
    }),
});
