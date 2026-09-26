import { resolve } from "node:path";
import { renderPage } from "./templates/render";

const PORT = Number(process.env.PORT ?? 3000);
const PUBLIC_DIR = import.meta.dir + "/../public";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function mimeFor(path: string): string {
  const i = path.lastIndexOf(".");
  if (i < 0) return "application/octet-stream";
  return MIME[path.slice(i)] ?? "application/octet-stream";
}

/**
 * 样式与脚本体积小但改动频繁，用 no-cache 每次回源校验，避免改完样式
 * 却被浏览器缓存挡住；视频体积大且基本不变，给足缓存时间。
 */
function cacheControlFor(path: string): string {
  const ext = path.slice(path.lastIndexOf("."));
  return ext === ".css" || ext === ".js" || ext === ".html"
    ? "no-cache"
    : "public, max-age=86400";
}

/** 去掉连续与结尾斜杠，得到形如 /abs/public 的比较基准 */
const PUBLIC_ROOT = resolve(PUBLIC_DIR).replace(/\/+$/, "");

/**
 * 把 URL 路径安全地映射到 public 目录内的真实文件路径。
 *
 * 必须先真正解析 `..` 再判断前缀：仅比较字符串拼接结果是无效防护，
 * `public/../package.json` 依然以 `public` 开头，却指向目录之外。
 * 返回 null 表示路径非法（越界或编码畸形），调用方应返回 400/403。
 */
function safePublicPath(urlPath: string): string | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    // 畸形百分号编码（如 /%zz、/%E4）会抛 URIError
    return null;
  }

  if (decoded.includes("\0")) return null;

  // 反斜杠在 Windows 上同样是路径分隔符，统一按 POSIX 语义解析后再还原
  const normalized = decoded.replace(/\\/g, "/").replace(/^\/+/, "");
  const resolved = resolve(PUBLIC_ROOT, normalized);

  if (resolved !== PUBLIC_ROOT && !resolved.startsWith(PUBLIC_ROOT + "/")) {
    return null;
  }
  return resolved;
}

async function serveStatic(pathname: string): Promise<Response | null> {
  const filePath = safePublicPath(pathname);
  if (!filePath) return new Response("Bad Request", { status: 400 });

  const file = Bun.file(filePath);
  if (!(await file.exists())) {
    // 尝试作为目录下的 index
    const idx = Bun.file(`${filePath}/index.html`);
    if (await idx.exists()) {
      return new Response(idx, {
        headers: {
          "Content-Type": mimeFor("index.html"),
          "Cache-Control": cacheControlFor("index.html"),
        },
      });
    }
    return null;
  }

  return new Response(file, {
    headers: {
      "Content-Type": mimeFor(filePath),
      "Cache-Control": cacheControlFor(filePath),
    },
  });
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const { pathname } = url;

    if (req.method !== "GET" && req.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (pathname === "/" || pathname === "/index.html") {
      const res = new Response(renderPage(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
      return req.method === "HEAD" ? new Response(null, res) : res;
    }

    const staticRes = await serveStatic(pathname);
    if (staticRes) return req.method === "HEAD" ? new Response(null, staticRes) : staticRes;

    return new Response("404 Not Found", { status: 404 });
  },
});

console.log(`✔ 简历网站已启动: http://localhost:${server.port}`);
