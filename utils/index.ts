import fs from "fs";
import { spawn } from "child_process";
import { join, sep } from "path";

export const isValidURL = (url: string) =>
  !!url.match(/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/);

export const getVideoID = (url: string) => {
  const r = url.match(/(?:http|https|)(?::\/\/|)(?:www.|)(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[a-z0-9;:@#?&%=+\/\$_.-]*/);
  return r && r[1];
};

export const ytdl = async (ytID: string) => {
  const videoID = `https://youtu.be/${ytID}`;
  const temp = join(process.cwd(), "temp");

  const ytdl = spawn(join(process.cwd(), "bin", "youtube-dl.exe"), [
    "-x",
    "-o",
    `${temp}${sep}%(id)s.mp3`,
    "-f",
    "bestaudio",
    "--audio-format",
    "mp3",
    videoID,
  ]);

  ytdl.on("close", async (code) => {
    if (code !== 0) {
      return `Download process exited with code ${code}`;
    }
    const temp = join(process.cwd(), "temp");
    const fileStream = fs.createReadStream(join(temp, ytID));
    await new Promise((resolve) => {
      fileStream.on("end", resolve);
      fileStream.on("error", (err: Error) => {
        if (err) {
          return "Sorry we could not find the file you requested!";
        } else {
          return "Sorry, something went wrong!";
        }
      });
    });
    return "Download completed";
  });
};
