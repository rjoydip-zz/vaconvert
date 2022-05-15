import { describe, expect, it } from "vitest";
import { getVideoID, isValidURL } from "../utils";

describe("VAconverT utils", () => {
  it("validate YT URL", () => {
    [
      "https://youtu.be/yVpbFMhOAwE",
      "https://www.youtube.com/embed/yVpbFMhOAwE",
      "youtu.be/yVpbFMhOAwE",
      "youtube.com/watch?v=yVpbFMhOAwE",
      "http://youtu.be/yVpbFMhOAwE",
      "http://www.youtube.com/embed/yVpbFMhOAwE",
      "http://www.youtube.com/watch?v=yVpbFMhOAwE",
      "http://www.youtube.com/watch?v=yVpbFMhOAwE&feature=g-vrec",
      "http://www.youtube.com/watch?v=yVpbFMhOAwE&feature=player_embedded",
      "http://www.youtube.com/v/yVpbFMhOAwE?fs=1&hl=en_US",
      "http://www.youtube.com/ytscreeningroom?v=yVpbFMhOAwE",
      "http://www.youtube.com/watch?NR=1&feature=endscreen&v=yVpbFMhOAwE",
      "http://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo",
      "http://www.youtube.com/watch?v=6zUVS4kJtrA&feature=c4-overview-vl&list=PLbzoR-pLrL6qucl8-lOnzvhFc2UM1tcZA",
      "https://www.youtube.com/watch?v=FZu097wb8wU&list=RDFZu097wb8wU",
    ].map((url) => expect(isValidURL(url)).toBeTruthy());
    [
      "http://yout.be/yVpbFMhOAwE",
      "h://youtu.be/yVpbFMhOAwE",
      "www.abc.youtu.be/yVpbFMhOAwE",
      "abc.youtu.be/yVpbFMhOAwE",
    ].map((url) => expect(isValidURL(url)).toBeFalsy());
  });

  it("validate YT video ID", () => {
    [
      "https://youtu.be/yVpbFMhOAwE",
      "https://www.youtube.com/embed/yVpbFMhOAwE",
      "youtu.be/yVpbFMhOAwE",
      "youtube.com/watch?v=yVpbFMhOAwE",
      "http://youtu.be/yVpbFMhOAwE",
      "http://www.youtube.com/embed/yVpbFMhOAwE",
      "http://www.youtube.com/watch?v=yVpbFMhOAwE",
      "http://www.youtube.com/watch?v=yVpbFMhOAwE&feature=g-vrec",
      "http://www.youtube.com/watch?v=yVpbFMhOAwE&feature=player_embedded",
      "http://www.youtube.com/v/yVpbFMhOAwE?fs=1&hl=en_US",
      "http://www.youtube.com/ytscreeningroom?v=yVpbFMhOAwE",
      "http://www.youtube.com/watch?NR=1&feature=endscreen&v=yVpbFMhOAwE",
    ].map((url) => expect(getVideoID(url)).toBe("yVpbFMhOAwE"));

    [
      {
        id: "1p3vcRhsYGo",
        url: "http://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo",
      },
      {
        id: "6zUVS4kJtrA",
        url: "http://www.youtube.com/watch?v=6zUVS4kJtrA&feature=c4-overview-vl&list=PLbzoR-pLrL6qucl8-lOnzvhFc2UM1tcZA",
      },
      {
        id: "FZu097wb8wU",
        url: "https://www.youtube.com/watch?v=FZu097wb8wU&list=RDFZu097wb8wU",
      },
    ].map((item) => expect(getVideoID(item.url)).toBe(item.id));
  });
});
