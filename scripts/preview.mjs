import { createServer } from "node:http";
import { renderReadmeToHtml } from "./render.mjs";

const host = process.env.HOST ?? "0.0.0.0";
const port = Number(process.env.PORT ?? 6419);

const server = createServer(async (req, res) => {
  if (req.url === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // Re-render on every request so edits to README.md are reflected on refresh.
    const html = await renderReadmeToHtml();
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(html);
  } catch (error) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end(`Failed to render README.md:\n${error?.stack ?? error}`);
  }
});

server.listen(port, host, () => {
  console.log(`README preview available at http://${host}:${port}/`);
});
