import { TikTokScraper } from "tiktok-scraper";

const tiktokScraper = new TikTokScraper({
  download: true,
  filepath: "path/to/download/directory",
  filetype: "mp4", // or 'mp3'
  proxy: "http://your-proxy-url:port",
  strictSSL: true,
  cli: true,
  event: true,
  progress: true,
  asyncDownload: 1,
  asyncScraping: 1,
  input: "tiktok-username-or-hashtag",
  number: 10, // number of videos to download
  since: new Date().getTime(), // only download videos posted after this date
  type: "user", // or 'hashtag'
  by_user_id: false, // set to true if input is a user ID
  store_history: true, // store downloaded videos in history file
  historyPath: "path/to/history/file",
  noWaterMark: true, // remove watermark from downloaded videos
  useTestEndpoints: false, // set to true to use test endpoints
  fileName: "custom-file-name", // custom file name for downloaded videos
  timeout: 10000, // request timeout in milliseconds
  bulk: true, // number of concurrent downloads
  zip: false, // zip downloaded videos
  test: false, // test mode
  hdVideo: false, // download HD videos
  webHookUrl: "http://your-webhook-url", // webhook URL for sending data
  method: "POST", // HTTP method for webhook requests
  headers: [
    // custom headers for webhook requests
    ["user-agent", "pee"],
    ["Content-Type", "application/json"],
    ["X-Custom-Header", "custom-value"],
  ],
  verifyFp: "path/to/fingerprint/file", // path to fingerprint file
  sessionList: ["path/to/session/cookies/file"], // path(s) to session cookie file(s)
});

// Make a request with the TikTokScraper instance to get the session cookie
await scraper.scrape();

// Get the session cookie from the TikTokScraper's cookieJar
const sessionCookie = scraper.cookieJar
  .getCookies("https://www.tiktok.com")
  .find((cookie) => cookie.key === "SESSION");

console.log(sessionCookie); // Outputs the session cookie object
