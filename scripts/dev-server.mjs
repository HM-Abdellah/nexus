import { createServer } from "node:http";
import { readFile, realpath } from "node:fs/promises";
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
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8"
});

const PUBLIC_ASSET_EXTENSIONS = new Set([
  ".css", ".js", ".mjs", ".json", ".svg", ".png",
  ".jpg", ".jpeg", ".webp", ".ico", ".woff2"
]);

export function isPublicRelativePath(relativePath) {
  if (relativePath === "index.html") return true;

  const segments = String(relativePath).split("/");
  if (segments.length < 3 || segments.some((segment) => !segment || segment === "." || segment === "..")) {
    return false;
  }

  const extension = path.extname(relativePath).toLowerCase();
  const [rootName, area] = segments;

  if (rootName === "src") {
    if (area === "app" || area === "core") {
      return extension === ".js" || extension === ".mjs";
    }

    if (area === "data") {
      return [".js", ".mjs", ".json"].includes(extension);
    }

    if (area === "styles") {
      return extension === ".css";
    }

    return false;
  }

  return rootName === "public" && PUBLIC_ASSET_EXTENSIONS.has(extension);
}

export function resolveStaticFilePath(requestPath, root = PROJECT_ROOT) {
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(String(requestPath).split("?")[0] || "/");
  } catch {
    return null;
  }

  if (
    !decodedPath.startsWith("/") ||
    decodedPath.includes(String.fromCharCode(0)) ||
    decodedPath.includes("\\")
  ) {
    return null;
  }

  const segments = decodedPath === "/" ? [] : decodedPath.slice(1).split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
    return null;
  }

  const relativePath = decodedPath === "/" ? "index.html" : segments.join("/");
  if (!isPublicRelativePath(relativePath)) return null;

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
    // Resolve symlinks before reading, then re-check the resolved target against
    // the public-file allowlist to prevent a public path from exposing private files.
    const [realProjectRoot, realTargetPath] = await Promise.all([
      realpath(PROJECT_ROOT),
      realpath(targetPath)
    ]);
    const realRelativePath = path.relative(realProjectRoot, realTargetPath).split(path.sep).join("/");

    if (!isPublicRelativePath(realRelativePath)) {
      sendText(response, 403, "Forbidden");
      return;
    }

    const content = await readFile(realTargetPath);
    const contentType = MIME_TYPES[path.extname(realTargetPath).toLowerCase()] ?? "application/octet-stream";

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
