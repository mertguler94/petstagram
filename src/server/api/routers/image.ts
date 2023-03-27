/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import BoxSDK from "box-node-sdk";
import { Readable } from "stream";

const clientID = process.env.STORAGE_CLIENT_ID;
const clientSecret = process.env.STORAGE_CLIENT_SECRET;

const sdk = new BoxSDK({
  clientID,
  clientSecret,
});

const boxClient = sdk.getAppAuthClient("enterprise", "petstagram");

export const imageRouter = createTRPCRouter({
  test: publicProcedure
    .input(z.object({ file: z.string() }))
    .mutation(async ({ input }) => {
      console.log("file", input.file);

      // const readable = Readable.from(input.file);
      try {
        console.log("file", input.file);
        const response = await boxClient.files.uploadFile(
          "1",
          Date.now().toString(),
          input.file
        );
        console.log(response);
        // return { url: response.result.preview_url };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  //   getAll: publicProcedure.query(({ ctx }) => {
  // return ctx.prisma.post.findMany();
  //   }),
});
