// Passenger entry for cPanel's "Setup Node.js App".
// Boots Next.js in production mode and hands requests to its default handler.
// The port comes from Passenger (via process.env.PORT) — do not hardcode it.

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://${hostname}:${port}  (dev=${dev})`);
  });
});
