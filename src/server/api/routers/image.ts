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
    .input(z.object({ postUrl: z.string() }))
    .mutation(({ ctx, input }) => {
      const postData = { postUrl: input.postUrl, userId: ctx.userId };
      return ctx.prisma.post.create({
        data: postData,
      });
    }),
});
