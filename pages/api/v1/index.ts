import type { NextApiRequest, NextApiResponse } from "next";
import { createReadStream, existsSync } from "fs";
import { join, sep } from "path";
import { spawn } from "child_process";
import { AUDIO_EXT, getVideoID } from "../../../utils";
import { platform } from "os";

type ResponseData = {
  error: boolean;
  message: string | Error;
  errMessage?: Error;
};

const sendFileResponse = async (
  res: NextApiResponse<ResponseData>,
  filePath: string
) => {
  const fileStream = createReadStream(filePath);
  return await new Promise((resolve) => {
    res.setHeader("Content-Type", `audio/${AUDIO_EXT}`);
    fileStream.pipe(res);
    fileStream.on("end", resolve);
    fileStream.on("error", (err) => {
      if (err) {
        res.status(500).json({
          error: true,
          errMessage: err,
          message: "Sorry we could not find the file you requested!",
        });
        return res.end();
      } else {
        res
          .status(500)
          .json({ error: true, message: "Sorry, something went wrong!" });
        return res.end();
      }
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { url } = req.query;
  const videoId = getVideoID(url.toString());

  if (videoId) {
    const filePath = join(process.cwd(), "temp", `${videoId}.${AUDIO_EXT}`);
    if (existsSync(filePath)) {
      return await sendFileResponse(res, filePath);
    } else {
      const ytdl = spawn(join(process.cwd(), "bin", platform(), "youtube-dl"), [
        "-x",
        "-o",
        `${join(process.cwd(), "temp")}${sep}%(id)s.%(ext)s`,
        "-f",
        "bestaudio",
        videoId,
      ]);

      ytdl.stderr.on("data", (data) => {
        console.log(data.toString());
        res.status(500).json({
          error: true,
          message: data.toString(),
        });
        return res.end();
      });

      ytdl.once("close", async () => {
        return await sendFileResponse(res, filePath);
      });
    }
  } else {
    res
      .status(500)
      .json({ error: true, message: "Unable to extract videoId from url!" });
    return res.end();
  }
}
