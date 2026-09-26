import { renderPage } from "./templates/render";

const OUT_DIR = import.meta.dir + "/../dist";

// 先清空输出目录：CI 每次都会把整个 dist/ 作为 Pages 构件上传，
// 残留的旧文件会让线上内容与源码不一致
await Bun.$`rm -rf ${OUT_DIR}`.quiet();
await Bun.$`mkdir -p ${OUT_DIR}/css ${OUT_DIR}/js ${OUT_DIR}/videos`;

const html = renderPage();
await Bun.write(`${OUT_DIR}/index.html`, html);

// 关闭 Jekyll 处理：避免下划线开头的文件/目录被忽略，也省去一次无谓的构建
await Bun.write(`${OUT_DIR}/.nojekyll`, "");

// 复制 public 下静态资源
const publicDir = import.meta.dir + "/../public";
for (const category of ["css", "js", "videos"] as const) {
  const dir = `${publicDir}/${category}`;
  const files = new Bun.Glob("*").scanSync({ cwd: dir, absolute: true });
  for (const f of files) {
    const name = f.split("/").pop()!;
    await Bun.write(`${OUT_DIR}/${category}/${name}`, Bun.file(f));
  }
}

console.log(`✔ 构建完成: ${OUT_DIR}/index.html`);
