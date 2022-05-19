export const AUDIO_EXT = "m4a"

export const isValidURL = (url: string) =>
  !!url.match(/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/i);

export const getVideoID = (url: string) => {
  const r = url.match(
    /(?:http|https|)(?::\/\/|)(?:www.|)(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[a-z0-9;:@#?&%=+\/\$_.-]*/
  );
  return r && r[1];
};

