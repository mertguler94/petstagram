/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import BoxSDK from "box-node-sdk";

const clientID = process.env.STORAGE_CLIENT_ID;
const clientSecret = process.env.STORAGE_CLIENT_SECRET;

const sdk = new BoxSDK({
  clientID,
  clientSecret,
});

const boxClient = sdk.getAppAuthClient("enterprise", "petstagram");

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    data: FormData;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const { data } = req.body;
  console.log(data);

  const file = data.get("file");

  if (!file) {
    return res.status(400).send("not found");
  }
  const image = file as File;
  const bufferArray = await image.arrayBuffer();
  const bufferImage = Buffer.from(bufferArray);

  const resp = await boxClient.files.uploadFile(
    "1",
    Date.now().toString(),
    bufferImage
  );

  res.status(200).json(resp);
}
