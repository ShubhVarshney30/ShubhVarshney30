import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { renderReadmeToHtml, repoRoot } from "./render.mjs";

const outDir = join(repoRoot, "dist");
const outFile = join(outDir, "index.html");

await mkdir(outDir, { recursive: true });
const html = await renderReadmeToHtml();
await writeFile(outFile, html, "utf8");

console.log(`Wrote ${outFile}`);
