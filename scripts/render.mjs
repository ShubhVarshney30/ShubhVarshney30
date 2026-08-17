import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import MarkdownIt from "markdown-it";

const scriptDir = dirname(fileURLToPath(import.meta.url));
export const repoRoot = join(scriptDir, "..");

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// GitHub renders README files inside a `.markdown-body` container using the
// styles shipped by `github-markdown-css`, so mirror that here for an accurate
// local preview.
export async function renderReadmeToHtml(markdownPath = join(repoRoot, "README.md")) {
  const [markdown, css] = await Promise.all([
    readFile(markdownPath, "utf8"),
    readFile(
      join(repoRoot, "node_modules", "github-markdown-css", "github-markdown.css"),
      "utf8",
    ),
  ]);

  const body = md.render(markdown);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml("brainRottedCoder profile preview")}</title>
    <style>
      ${css}
      body {
        box-sizing: border-box;
        margin: 0 auto;
        max-width: 830px;
        padding: 45px;
      }
      @media (max-width: 767px) {
        body { padding: 15px; }
      }
    </style>
  </head>
  <body class="markdown-body">
    ${body}
  </body>
</html>
`;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
