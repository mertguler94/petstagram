/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { NextApiRequest, NextApiResponse } from "next";
import uploadcare, {
  UploadcareSimpleAuthSchema,
} from "@uploadcare/rest-client";
import { base } from "@uploadcare/upload-client";

interface NextApiRequestExtended extends NextApiRequest {
  body: Buffer;
}

// const clientID = process.env.STORAGE_CLIENT_ID;
// const clientSecret = process.env.STORAGE_CLIENT_SECRET;
const publicKey = process.env.NEXT_PUBLIC_UPLOAD;
const secretKey = process.env.UPLOADCARE_SECRET;
if (!publicKey || !secretKey) throw new Error("key not found");

const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
  publicKey,
  secretKey,
});

export default async function handler(
  req: NextApiRequestExtended,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  if (!publicKey) return;

  const fileData = req.body;

  const resp = await base(fileData, { publicKey, store: "auto" });

  res.status(200).send(resp);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
