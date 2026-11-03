import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const PORT = Number(process.env.PORT ?? 4173);
const HOST = "0.0.0.0";

const MIME_TYPES = Object.freeze({
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
});

export function resolveStaticFilePath(requestPath, root = PROJECT_ROOT) {
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(String(requestPath).split("?")[0] || "/");
  } catch {
    return null;
  }

  if (!decodedPath.startsWith("/") || decodedPath.includes(String.fromCharCode(0))) {
    return null;
  }

  const relativePath = decodedPath === "/" ? "index.html" : decodedPath.slice(1);
  const absolutePath = path.resolve(root, relativePath);
  const normalizedRoot = path.resolve(root);

  if (absolutePath !== normalizedRoot && !absolutePath.startsWith(normalizedRoot + path.sep)) {
    return null;
  }

  return absolutePath;
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    "content-type": "text/plain; charset=utf-8",
    "x-content-type-options": "nosniff",
    "cache-control": "no-store"
  });
  response.end(message);
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("allow", "GET, HEAD");
    sendText(response, 405, "Method not allowed");
    return;
  }

  let targetPath;
  try {
    targetPath = resolveStaticFilePath(request.url ?? "/");
  } catch {
    sendText(response, 400, "Invalid request path");
    return;
  }

  if (!targetPath) {
    sendText(response, 403, "Forbidden");
    return;
  }

  try {
    const content = await readFile(targetPath);
    const contentType = MIME_TYPES[path.extname(targetPath).toLowerCase()] ?? "application/octet-stream";

    response.writeHead(200, {
      "content-type": contentType,
      "content-length": content.byteLength,
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "cache-control": "no-store"
    });

    response.end(request.method === "HEAD" ? undefined : content);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      sendText(response, 404, "Not found");
      return;
    }

    sendText(response, 500, "Unable to serve this file");
  }
});

const isDirectExecution = process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new RangeError("PORT must be an integer between 1 and 65535.");
  }

  server.listen(PORT, HOST, () => {
    process.stdout.write("NEXUS preview available on http://" + HOST + ":" + PORT + "\n");
  });
}
