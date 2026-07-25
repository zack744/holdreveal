# HoldReveal 次日优化交接文档

> 写于：2026-07-25  
> 用途：明天直接指派 Agent / 自己开干，无需重新调研  
> 站点：https://holdreveal.com  
> 仓库：https://github.com/zack744/holdreveal  
> 本地：`D:\project\web\projects\holdreveal`

---

## 0. 一页上下文（先读这个）

### 产品是什么

**HoldReveal** = 背景差揭秘图 Maker。  
用户上传 **图 A（时间线/白底态）+ 图 B（点开/黑底态）** → 浏览器内合成透明 PNG → 在 X 上白时间线见 A、黑 lightbox 见 B。

- 品牌词：HoldReveal / hold to reveal  
- 日文主词：`長押しで変化` / `タップで変化イラスト`  
- **不是** 4K 长按，**不是** APNG 动画  

### 原理（已验证）

透明 PNG + X UI：时间线背景偏白、扩大显示偏黑。  
算法：由白底观感 W、黑底观感 B 解 \(\alpha\) 与前景色（Luma / RGB 模式），导出 PNG-8（UPNG.js）或 RGBA。

### 技术栈

| 项 | 选型 |
|----|------|
| 框架 | Vite + React + TypeScript |
| 图像 | Canvas 2D + `upng-js` |
| 部署 | Vercel 生产 + Cloudflare DNS（灰云） |
| 后端 | 无（全客户端） |
| UI 语言 | **仅日文**（英文暂缓） |
| 统计 | GA4 `G-SPFR4DJ4L4` |
| SEO | `robots.txt` / `sitemap.xml` / OG / JSON-LD |

### 当前已上线能力（MVP）

- [x] 双图上传、Luma/RGB、强度滑条  
- [x] 白 / 黑 / 卡片灰预览  
- [x] PNG-8 / RGBA 下载  
- [x] 投稿文案复制  
- [x] 首页短 FAQ + Web 投稿警告  
- [x] 域名 https://holdreveal.com 与 www  
- [x] GSC / Bing sitemap 已交  
- [x] GitHub 推送 + Vercel 自动/手动部署  
- [x] 真站骨架：`/how-it-works/` `/examples/` `/faq/` `/privacy/` + 页脚/顶栏互链  
- [x] 首页 H2 说明 + 事例区 + デモ一键読み込み  
- [x] sitemap 含全 URL；合成算法 e2e 验证通过  

### 明确未做（勿膨胀）

| 不做（短期） | 可选后续 |
|--------------|----------|
| AI 第二态生成 | Pro 水印/次数 |
| 账号 / 支付 / Pro | 全站英文化 |
| 复杂编辑器 | 更多事例 / 对齐拖拽 |

---

## 1. 为何要优化（对齐哥飞原文）

调研与社群原文结论（见 `01`/`02` 与 `webcafe-articles`）：

1. **「至少页面得满足需求」** — 工具能出图即可上线（已满足）。  
2. **工具站也要有内容** — 让谷歌理解工具用途；不是堆页数。  
3. **时间戳教程结构** — `/` 工具 + H2 解释长尾 + `/{关键词}/` 内页 + 互链 + sitemap。  
4. **新词站** — 先传播（X）再补厚度；内页差会掉排名。  

**明天目标：** 把单页 MVP 补成「小而真」工具站骨架，**不重做产品**。

---

## 2. 明天任务清单（建议顺序）

### P0 — 真站骨架（优先）

| # | 任务 | 验收 |
|---|------|------|
| 1 | 新增 `/privacy/` 隐私页（日文）：图片仅浏览器处理、不上传服务器、GA 说明 | 可打开、页脚可点 |
| 2 | 新增 `/how-it-works/`：原理（白/黑背景）、操作步骤、Web 投稿坑、≠4K | 含主词 `長押しで変化` |
| 3 | 新增 `/faq/`：从首页 FAQ 拆出并加长 | 内链回首页 |
| 4 | 全局页脚：ホーム / 仕組み / FAQ / プライバシー + 域名 | 全页一致 |
| 5 | 首页下方增加 **H2 内容区**（やり方、注意、长尾一句） | 非空壳单页 |
| 6 | 更新 `sitemap.xml` 含新 URL，部署后 GSC/Bing 可再抓 | 生产可访问 |

### P1 — 体验（有余力）

| # | 任务 | 验收 |
|---|------|------|
| 7 | 内置 demo：一键加载示例 A/B（或静态预览 GIF/双图说明） | 冷启动能看懂 |
| 8 | 合成失败/尺寸提示更友好 | 无 silent fail |
| 9 | Lighthouse 移动端扫一眼（别过度） | 无明显炸分 |

### P2 — 运营（人做，Agent 可写文案）

| # | 任务 |
|---|------|
| 10 | X 发 1～2 条示范帖（成品图 + holdreveal.com） |
| 11 | GA 实时确认；GSC/Bing sitemap 状态 |

### 明确不做

- 支付、登录、AI、英文全站、改域名策略  
- 为了「看起来大」堆 20 篇博客  

---

## 3. 关键文件路径

```
D:\project\web\projects\holdreveal\
  src\App.tsx              # 主 UI
  src\lib\compose.ts       # 合成算法
  src\lib\exportPng.ts     # PNG-8 / RGBA
  index.html               # TDK / GA / SEO
  public\sitemap.xml
  public\robots.txt
  vercel.json
  docs\
    01-market-research.md
    02-tech-and-product.md
    03-next-day-handoff.md   # 本文件
```

部署：

```bash
cd D:\project\web\projects\holdreveal
npm run build
git add . && git commit -m "..." && git push origin main
npx vercel --yes --prod
# 或 push 后等 Vercel Git 集成自动部署
```

路由建议（Vite SPA 时二选一）：

- **A（推荐快）**：多 HTML 或简单 React 多路由（react-router）`/how-it-works` 等  
- **B**：`public/how-it-works/index.html` 静态页 + 链回 `/`  
- SPA 深链注意：Vercel 需 rewrite 到 index 或用真实静态子路径  

生产域名：**https://holdreveal.com**（证书已好）。

---

## 4. 给 Agent 的系统上下文（可整段粘贴）

```
你在维护 HoldReveal（https://holdreveal.com），仓库 D:\project\web\projects\holdreveal。

产品：双图合成「長押しで変化」透明 PNG（白底见 A、黑底见 B），Vite+React+TS，全客户端，日文 UI，Vercel 部署。

已完成：MVP 工具页、GA4 G-SPFR4DJ4L4、GSC/Bing、域名。

明天目标（哥飞工具站标准）：在不大改工具的前提下，补「真站」骨架——privacy / how-it-works / faq 内页、页脚导航、首页 H2 说明文字、更新 sitemap，然后 build + 部署。

禁止：AI 生图、支付、账号、英文化、无关重构。

算法与产品细节见：docs/02-tech-and-product.md、docs/01-market-research.md。
```

---

## 5. 可直接指派的任务提示词

### 提示词 A — 补真站页面（主任务）

```
请阅读 D:\project\web\projects\holdreveal\docs\03-next-day-handoff.md 与 docs/02-tech-and-product.md。

在 HoldReveal 项目中完成「真站骨架」：
1. 日文页面：/privacy/ /how-it-works/ /faq/（实现方式自选：react-router 或 public 静态子目录，保证生产可打开）
2. 全局页脚导航：ホーム・仕組み・FAQ・プライバシー
3. 首页工具下方增加 H2 内容区：長押しで変化のやり方、X Web 投稿注意、深色主题说明、与 4K 长按的区别
4. 更新 public/sitemap.xml 与必要 SEO（title/description）
5. npm run build 通过；git commit；npx vercel --yes --prod（或 push main）

验收：https://holdreveal.com 及新路径 200；页脚互链；sitemap 含新 URL。
不要做 AI/支付/英文全站。
```

### 提示词 B — 仅写日文文案（内容先定）

```
为 HoldReveal（長押しで変化 PNG メーカー）撰写日文文案，输出 Markdown 即可：
- how-it-works：原理、步骤、注意（Web 投稿/ダークテーマ/非 4K）
- privacy：端末内処理、不送信、GA
- faq：5～8 条
- 首页 H2 区块 3～4 段
关键词自然覆盖：長押しで変化、タップで変化イラスト。不要堆砌。
```

### 提示词 C — X 发帖文案

```
写 2 条日文 X 帖文案（可复制）：
- 展示 HoldReveal 做的変化イラスト
- 引导 長押し/タップ 看变化
- 带链接 https://holdreveal.com
- 短、口语、适合 AI イラスト账号
```

### 提示词 D — 部署与 SEO 检查

```
检查 holdreveal.com：sitemap、robots、新页面是否 200、GA 是否仍在、canonical 是否正确。列出 GSC/Bing 是否需要重新提交 sitemap。给出结果清单。
```

---

## 6. 相关文档索引

| 文件 | 内容 |
|------|------|
| `docs/01-market-research.md` | 市场、关键词、域名、原帖数据 |
| `docs/02-tech-and-product.md` | 需求分层、算法、变现、MVP 边界 |
| `docs/03-next-day-handoff.md` | **本文件：次日任务 + 提示词** |
| `DEPLOY.md` | Vercel + Cloudflare + GSC |
| 哥飞参考（本机） | `D:\project\web\webcafe-articles\tutorials\343-以时间戳Timestamp...` |
|  | `007-养网站防老第5步：内页和内链建设` |
|  | `206-做站策略之辩`（「页面得满足需求」） |

---

## 7. 验收清单（明天收工勾选）

- [ ] `/` 工具仍可用（回归合成 + 下载）  
- [ ] `/how-it-works/` `/faq/` `/privacy/` 可访问  
- [ ] 页脚全站可点  
- [ ] 首页有实质说明文字（H2）  
- [ ] sitemap 已更新并已部署  
- [ ] GA 仍加载 `G-SPFR4DJ4L4`  
- [ ] 未引入支付/AI/大重构  

---

*交接完毕。明天对 Agent 说：「按 docs/03-next-day-handoff.md 提示词 A 执行」即可。*
