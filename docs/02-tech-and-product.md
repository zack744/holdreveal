# HoldReveal 产品 + 技术方案

> 调研日期：2026-07-25  
> 关联：`01-market-research.md`  
> 结论先行：**做「图 A + 图 B → 可发 X 的背景差揭秘 PNG」全客户端 Maker**；1 周内可上；先免费验证，Pro 卖次数/水印/批量。

---

## 0. 一页决策摘要

| 项 | 决策 |
|---|---|
| **产品** | HoldReveal：上传时间线态 + 揭开态 → 导出 transparent/indexed PNG + 白/黑底预览 + 文案模板 |
| **不做** | 不做 APNG/视频、不做 4K 长按梗、不做通用抠图 SaaS、MVP 不做 AI 生图 |
| **技术** | Vite + React + Canvas 2D + UPNG.js（PNG-8）；全客户端；Cloudflare Pages；日/英 i18n |
| **变现** | 免费 3 次/日 + 角标水印 → Pro $4.99–9.99/月（¥750–1500）去水印/高清/批量 |
| **风险** | 梗短命 → 品牌绑「背景差揭秘」不绑 X；深色主题失效需产品页明示 |

---

## A. 用户需求（分层 + JTBD）

### A1. 围观用户（看懂 / 试玩 / 分享）

| 维度 | 内容 |
|---|---|
| **JTBD** | When 刷到「長押しで変化？」, I want to 理解并亲自试一次, so I can 跟风发帖或转给朋友 |
| **痛点** | 不懂原理；自己不会做；怕试了没效果丢人 |
| **付费意愿** | 几乎为 0；愿意用免费工具玩 1 次 |
| **成功指标** | 落地页停留 >45s；预览白↔黑切换 CTR；分享/回流 UV |

### A2. 创作者（AI 画师 / 二次元 / 想涨互动）

| 维度 | 内容 |
|---|---|
| **JTBD** | When 我想发一张能拉互动的图, I want 3 分钟内做出可发 X 的変化 PNG, so I can 蹭梗涨赞/书签 |
| **痛点** | PS 手动叠层门槛高；教程分散；导出后 X 压成 JPG 透明丢了；不知道尺寸/格式坑 |
| **付费意愿** | 低–中；单次成功发帖后愿付小额（咖啡价）或月订 |
| **成功指标** | 完成导出率 >40%；「复制文案」点击；回访 7 日 ≥15% |

### A3. 进阶创作者（批量 / 模板 / 可复现）

| 维度 | 内容 |
|---|---|
| **JTBD** | When 我要连续发系列/人设变装, I want 批量与模板稳定复现, so I can 把玩法产品化成内容管线 |
| **痛点** | 每张手搓；对齐/色差不一致；无模板库 |
| **付费意愿** | 中；月订 $5–15 合理 |
| **成功指标** | 批量导出使用；模板选用率；Pro 转化 |

### A4. 品牌 / 运营（活动互动图）

| 维度 | 内容 |
|---|---|
| **JTBD** | When 做联名/活动, I want 可预期的互动图资产, so I can 提高活动参与与 UGC |
| **痛点** | 外包贵；效果不可控；合规/品牌色 |
| **付费意愿** | 高（项目制 $200–2000+）但来得慢 |
| **成功指标** | 询盘；定制模板成交（Phase 3） |

**付费优先级**：A3 > A2 ≫ A4（早期）≫ A1（只做获客）

---

## B. 网站到底做什么

### B1. 产品定位（一句话）

**HoldReveal = 背景差揭秘图 Maker**  
输入两张图（时间线态 A + 揭开态 B），输出一张在**白底看 A、黑底看 B** 的透明 PNG，专为 X 时间线/lightbox 等 UI 背景差场景优化。

品牌：**HoldReveal**（hold to reveal）  
日文副标：長押しで変化メーカー / タップで変化イラスト作成  
域名：`holdreveal.com`（主）+ `holdreveal.app` + `nagaoshi.app`（日向跳转）

### B2. MVP 功能（严格）

| 优先级 | 功能 | 说明 |
|---|---|---|
| **主功能（P0）** | **双图合成导出** | 上传 A + B → 合成 → 下载 PNG-8/RGBA + 白底/黑底实时预览 |
| **增强 1（P0）** | **文案包 + 发帖指引** | 一键复制「長押しで変化？」「Hold to reveal」「タップで変化」+ Web 发帖注意 |
| **增强 2（P1，同周可做）** | **模板区（静态）** | 3–5 个示例槽位（翅膀/昼夜/变装/彩蛋）+ before/after 演示，降低冷启动 |

### B3. 明确不做（防膨胀）

- ❌ APNG / GIF / 视频动画  
- ❌ 「長押し 4K 读取」类假高清  
- ❌ 通用 remove.bg 级抠图 SaaS  
- ❌ 账号体系 / 云端图库（MVP）  
- ❌ AI 第二态生成（Phase 2）  
- ❌ 原生 App、Discord bot、批量 API（Phase 2+）  
- ❌ 复杂图层编辑器（对标 PS）

### B4. 差异化

| 类型 | 他们做什么 | HoldReveal |
|---|---|---|
| 纯教程站 | 讲原理，要自己 PS | **一键产出可发文件** |
| 纯抠图站（remove.bg 等） | 去背景 | **双态合成 + 白/黑预览 + X 格式坑处理** |
| 4K / 假加载工具 | 另一梗 | **明确不做，文案切割** |
| Canva 手动 | 通用设计 | **专用算法 + 预览模拟 X UI** |

---

## C. 技术方案

### C1. 核心算法（可直接实现）

#### 原理

标准 alpha 合成（假设预乘前、背景不透明）：

\[
C_{out} = C_{fg} \cdot \alpha + C_{bg} \cdot (1 - \alpha)
\]

令 \(W\) = 白底上希望看到的颜色（图 A），\(B\) = 黑底上希望看到的颜色（图 B），解 \(\alpha\) 与前景色 \(C\)：

\[
\begin{aligned}
W &= C \cdot \alpha + 1 \cdot (1 - \alpha) \\
B &= C \cdot \alpha + 0 \cdot (1 - \alpha) = C \cdot \alpha
\end{aligned}
\]

逐通道（或先转亮度）得：

\[
\begin{aligned}
\alpha &= \mathrm{clamp}\!\left(\frac{1 - W + B}{1}\right) \quad \text{（0–1 空间；8bit 则 } \alpha = \frac{255 - W + B}{255}\text{）} \\
C &= \begin{cases} B / \alpha & \alpha > \epsilon \\ 0 & \text{otherwise} \end{cases}
\end{aligned}
\]

参考实现（社区已验证）：

- Qiita：easegis「タップで絵が変わる」— 公式同上 + **PNG-8 + UPNG.js** 应对 X 压缩  
- Gist：`u-haru/dual_vision_rgba.py` — 线性光/sRGB 更准的 dual vision

#### 前端伪代码（Canvas）

```js
// A = timeline (white bg look), B = reveal (black bg look), same size
for each pixel i:
  const W = A[i] / 255, Bk = B[i] / 255  // per channel or luminance
  let a = (1 - W + Bk)
  a = clamp(a, 0, 1)
  const c = a > 1e-6 ? clamp(Bk / a, 0, 1) : 0
  out.rgb[i] = c * 255
  out.a[i]   = a * 255
```

**MVP 推荐两档模式：**

1. **Luma 模式（默认）**：用亮度算单一 α，再把 B 的色塞进 RGB → 稳、快，适合插画  
2. **RGB 模式（高级）**：每通道独立解 α，取 max/mean 约束 → 彩差更大时更好，需亮度微调滑条

#### 预处理（必做）

1. 两图缩放到同尺寸（cover + 中心裁或用户拖对齐）  
2. 可选：轻度对比度/曝光，保证 \(B \le W\) 在多数像素成立（否则 α 失真）  
3. 可选「对齐叠层」：半透明叠加拖动

#### 边界情况

| 场景 | 现象 | 产品对策 |
|---|---|---|
| **X 深色主题时间线** | 未点开已露馅 | 落地页警告；预览加「暗色时间线」模拟条 |
| **半透明/渐变插画** | 串色、灰雾 | 默认 Luma + 强度滑条；提示选对比强的 A/B |
| **有色背景（非纯白/黑）** | 公式失效 | 高级：自定义 \(C_{bg1}/C_{bg2}\) 解算（Phase 1.5） |
| **手机 App 发图 → JPG** | 透明丢失 | 显著提示「请用 **X Web** 上传 PNG」 |
| **超大图** | 内存炸 | 长边 cap 2048（免费）/ 4096（Pro） |
| **X 二次压缩** | 透明被啃 | **导出 PNG-8（indexed + tRNS）** 优先；备选 RGBA |

#### 导出规格

| 项 | MVP 建议 |
|---|---|
| 格式 | **PNG-8（256 色 + tRNS）主推**；可选 PNG-32 RGBA |
| 库 | `upng-js` 编码；`pako` 压缩 |
| 尺寸 | 默认长边 ≤ **1600–2048**（对齐常见插画）；原帖级 1664×2432 可 Pro |
| 体积 | 目标 < 2–3MB（X 友好） |
| 预览 | 并排/切换：纯白底、纯黑底、模拟 X 卡片灰底、深色主题条 |
| 水印 | 免费：角标「holdreveal.com」半透明；Pro 关闭 |

### C2. 前端栈（快上线）

**最终推荐：Vite + React + TypeScript + Canvas 2D + UPNG.js**

| 层 | 选型 | 理由 |
|---|---|---|
| 构建 | Vite | 秒级起、静态产物 |
| UI | React + 轻量 CSS（或 Tailwind） | 组件化预览/上传 |
| 图像 | Canvas 2D `getImageData` | 无需 WebGL；算法简单 |
| PNG-8 | UPNG.js | 社区已验证 X 场景 |
| i18n | 简单 JSON（`ja` / `en`） | 日优先、英 SEO |
| 分析 | Plausible / Cloudflare Web Analytics | 隐私友好、无 cookie 墙 |
| 支付（后期） | Lemon Squeezy / Stripe | 数字商品订阅 |

**不推荐 MVP 上 Next.js SSR**：无 SEO 可静态生成；SSR 增加复杂度。若强 SEO 博客，**工具页 Vite + 教程用 Astro/纯 MD** 亦可；更简单是 **单仓 Vite + 多路由静态页**。

备选：纯 HTML + 单 `main.ts`（3 天极简），功能够但难扩模板/i18n。

### C3. 是否需要后端？

| 阶段 | 后端 | 说明 |
|---|---|---|
| **MVP** | **不需要** | 全客户端处理 → 隐私好、0 算力成本、Cloudflare 免费档够用 |
| Phase 1.5 | 可选 | 邮件列表（Formspree / Buttondown）、Pro license key 校验（edge function） |
| Phase 2 | 需要 | AI img2img、账号、批量队列、模板商店 CMS |

**MVP 架构：**

```
用户浏览器
  ├─ 上传 A/B（不离机）
  ├─ Canvas 合成
  ├─ UPNG 导出 Blob 下载
  └─ 静态站：Cloudflare Pages
```

### C4. AI 能力（Phase 2，不进 MVP）

| 能力 | 说明 | 时机 |
|---|---|---|
| 第二态 img2img | 只传 A，AI 生成 B（翅膀/夜景/变装） | 有付费验证后 |
| 风格一致性 | 同角色两态 | 与方舟/SD 等 API 对接 |
| 成本 | 按次计费，必须 Pro 或积分 | — |

MVP 只做「用户自带两图」——验证核心合成与需求。

### C5. 上站路径

| 步骤 | 动作 |
|---|---|
| 1 | 注册 `holdreveal.com` / `.app` / `nagaoshi.app`（Cloudflare Registrar 或 Porkbun） |
| 2 | GitHub 私有仓 → Cloudflare Pages 连接，构建 `pnpm build`，产物 `dist` |
| 3 | 自定义域 + 强制 HTTPS；`nagaoshi.app` 301 → `holdreveal.com/?lang=ja` |
| 4 | i18n：默认按 `Accept-Language` / 路径 `/ja` `/en`；日文关键词落地页独立 H1 |
| 5 | SEO：标题含 `長押しで変化` / `Hold to reveal`；OG 图展示白→黑切换 GIF 或双帧 |
| 6 | 合规：隐私页写清「图片不上传服务器」 |

**备选宿主**：Vercel 同等可用；选 Cloudflare 因 DNS+Pages+Registrar 一条龙。

### C6. 关键页面信息架构（MVP）

```
/                 工具（上传 → 预览 → 下载）
/ja /en           语言
/how-it-works     原理 + 深色主题坑
/templates        示例（静态）
/faq              X 上传、JPG 坑、尺寸
```

首屏 CTA：**「上传两张图，3 秒出変化 PNG」**

---

## D. 变现模型

### D1. 免费 vs Pro

| | Free | Pro |
|---|---|---|
| 合成次数 | 3 次/日（localStorage） | 无限 |
| 分辨率 | 长边 ≤ 1600 | 长边 ≤ 4096 |
| 水印 | 有 | 无 |
| PNG-8 / RGBA | 仅 PNG-8 | 双格式 |
| 批量 | 1 对 1 | 多对队列（zip） |
| 模板 | 基础 3 个 | 全库 + 优先新模板 |
| 导出预设 | 基础 | X / Threads 预设包 |

### D2. 价格带

| 市场 | 建议 |
|---|---|
| 全球 USD | **$4.99/月** 或 **$29/年**；一次买断 lifetime **$19–29**（早期） |
| 日本 JPY | **¥750–980/月** 或 **¥4,800/年**（心理锚在「一杯咖啡～一顿午饭」） |
| 单次包 | $1.99 / 10 次（验证支付意愿，可后置） |

创作者月订心理价位参考：Canva Pro ~$15、小工具 $3–10 → **$5 档最易转化**。

### D3. 早期 0 成本验证

1. 域名 + Cloudflare 免费档  
2. 全客户端工具上线，无支付  
3. 页脚：Discord / 邮件 waitlist（「Pro 去水印通知我」）  
4. 自己发 3–5 条 X 示范帖带链接  
5. 看：导出次数、回访、waitlist 数  

**7 天内不接支付也行**；有 50+ waitlist 或日导出 >200 再开 Lemon Squeezy。

### D4. 延长 LTV（梗死后怎么办）

| 策略 | 做法 |
|---|---|
| 解绑 X | 品牌定位「**任意白/黑（或双背景）揭秘图**」— 博客、Notion 暗色、PPT、官网 |
| 模板库 | 季节活动、角色变装、商品前后对比 |
| 教育 SEO | 日文 how-to 长尾持续收搜索 |
| B 端 | IP 活动互动图定制 |
| 通用化 | 自定义双背景色合成（不限白黑） |

---

## E. 竞品 / 替代方案

### E1. 手动成本

| 路径 | 时间 | 门槛 |
|---|---|---|
| Photoshop 手搓图层 + 导出 PNG | 15–60 分钟/张 | 高 |
| Canva 抠图 + 透明 | 抠图可以，**不会自动解双态 α** | 中；仍要懂原理 |
| GIMP / Photopea | 免费但步骤多 | 中高 |

**HoldReveal 价值**：把 30 分钟+懂原理 → **1 分钟不懂原理**。

### E2. 抠图站为什么不够

remove.bg / Fotor / UltClip / VanceAI 等：

- 只输出「无底主体」  
- **没有** \(W,B \to (C,\alpha)\) 双态合成  
- 没有 X lightbox 预览与 PNG-8 坑指引  

### E3. 已有类似 / 开源（点名）

| 名称 | 形态 | 备注 |
|---|---|---|
| **Qiita easegis** 分割工具 + 隠し画像 | 个人开发文章 + 实现思路 | 公式与 PNG-8/UPNG 路径清晰；**无独立品牌 SEO 站** |
| **Gist u-haru dual_vision_rgba.py** | Python 脚本 | 暗/亮模式 dual vision；非网页产品 |
| 日文博客「クリックしたら変わる絵」 | 教程 | 原理有、工具无 |
| 2013 日推 transparent rollover | 旧梗 | 无 2026 maker |

**结论：专用「Hold to reveal」网页 Maker + 品牌域名仍近乎空白。** 需快速上线抢词，算法不必从零发明。

---

## F. 决策建议（给老板）

### F1. MVP 范围（1 周内能上）

| Day | 交付 |
|---|---|
| D0 | 买域名 ×3；建仓；CF Pages 空站 |
| D1–2 | Canvas 合成算法 + 白/黑预览 + 下载 PNG-8 |
| D3 | 上传/对齐 UI、文案包、FAQ（深色主题/JPG 坑） |
| D4 | 日/英 i18n + SEO 基础 meta + OG |
| D5 | 3 个静态模板示例 + 自测真机发 X |
| D6–7 | 打磨文案、分析埋点、X 宣发帖 |

**Must ship：** 双图合成、预览、下载、日文首屏、注意事项。  
**Can cut：** 批量、支付、AI、账号。

### F2. 技术选型最终推荐

| 项 | 选择 |
|---|---|
| 框架 | **Vite + React + TS** |
| 图像 | **Canvas 2D + UPNG.js** |
| 宿主 | **Cloudflare Pages** |
| 后端 | **MVP 无** |
| 语言 | **ja 默认优先展示 / en 并行** |
| 支付（后） | Lemon Squeezy |

### F3. 变现第一钩子

**「免费做出第一张 → 水印碍眼 / 要高清 → Pro $4.99」**  
辅钩：waitlist「批量与 AI 第二态」。

### F4. 上线后 7 天验证指标

| 指标 | 绿灯 | 黄灯 | 红灯 |
|---|---|---|---|
| 日 UV（自然+自宣） | >500 | 100–500 | <100 |
| 导出完成率 | >35% | 15–35% | <15% |
| 日导出次数 | >150 | 30–150 | <30 |
| Waitlist / Discord | >50 | 10–50 | <10 |
| 至少 1 条外部 UGC 带链接 | 有 | — | 无且无互动 |

### F5. 红灯（pivot / 停）

| 信号 | 动作 |
|---|---|
| X 改 lightbox 为非黑底 / 全面 flatten PNG | 立即验证；转「自定义双背景」通用工具或停 |
| 7 日导出完成率 <15% 且反馈「看不懂」 | 改 UX/模板，勿加 AI |
| 仅围观无创作者（只看不传） | 加强模板一键试玩（内置 demo 图） |
| 竞品同质品牌抢占 SEO 且已付费规模化 | 差异化日文社区运营或 pivot 模板订阅 |
| 法律/版权投诉增多（他人角色二创） | 加 ToS；不做图床；不存图 |

---

## G. 立刻行动清单（域名买完后怎么上站）

1. **注册** `holdreveal.com` + `holdreveal.app` + `nagaoshi.app`，DNS 放 Cloudflare。  
2. **建 Git 仓** `holdreveal-web`，初始化 Vite React TS。  
3. **实现核心循环**：双文件 input → 对齐 canvas → 按 §C1 写像素 → UPNG 出 PNG-8 → `URL.createObjectURL` 下载。  
4. **预览 UI**：白底 / 黑底 Toggle（应用 CSS 背景，图片本身透明）。  
5. **文案组件**：日/英 CTA 复制按钮 +「请用网页版 X 上传」红字警告。  
6. **FAQ 页**：深色主题、App 压 JPG、非 4K/非 APNG 说明。  
7. **Cloudflare Pages** 连接 main 分支，自定义域绑定，`nagaoshi.app` 跳转 `?lang=ja`。  
8. **埋点**：pageview、export_success、copy_caption、lang_switch。  
9. **真机验证**：用工具出图 → X Web 发帖 → 浅色时间线 vs 点开 lightbox 录屏。  
10. **宣发**：日文+英文各 1 帖示范 + 置顶工具链接；开 Discord/邮件收集 Pro 意向。

---

## 文档索引

| 文件 | 内容 |
|---|---|
| `01-market-research.md` | 市场 / 关键词 / 域名 |
| `02-tech-and-product.md` | 本文件：需求 / 产品 / 技术 / 变现 / 决策 |
| `03-mvp-spec.md` | （后续）界面与验收标准细稿 |

---

*算法参考：Qiita easegis 隠し画像合成；Gist u-haru dual_vision_rgba；W3C PNG alpha compositing。产品窗口：2026-07 梗热 + SEO 空窗，宜 7 日内上线。*
