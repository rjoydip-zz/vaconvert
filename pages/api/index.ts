// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { join } from "path";

type ResponseData = {
  error: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { file } = req.query;
  const temp = join(process.cwd(), "temp");
  const fileStream = fs.createReadStream(join(temp, file.toString()));
  await new Promise((resolve) => {
    res.setHeader("Content-Type", "audio/mp3");
    fileStream.pipe(res);
    fileStream.on("end", resolve);
    fileStream.on("error", (err) => {
      if (err) {
        res.status(400).json({
          error: true,
          message: "Sorry we could not find the file you requested!",
        });
        res.end();
      } else {
        res
          .status(500)
          .json({ error: true, message: "Sorry, something went wrong!" });
        res.end();
      }
    });
  });
}
