# HoldReveal 市场调研（長押しで変化）

> 调研日期：2026-07-25  
> 状态：X 爆火 / Google 几乎空白 / 适合抢域名上站  
> 原帖：https://x.com/sarasara_aiart/status/2080126609290674237

---

## 1. 现象锚定

| 项 | 内容 |
|---|---|
| 原帖作者 | @sarasara_aiart（さらさら）日文 AI 插画号，约 14.6 万粉 |
| 文案 | **長押しで変化？** |
| 时间 | 2026-07-23 |
| 数据（约） | 1.02 亿 views / 53 万 likes / 4.2 万 RT / 6.4 万 bookmark |
| 系列词 | 作者此前已有「タップで変化イラスト」系列 |

**本质**：引导用户长按/点开图片，画面“变了” → 高互动 CTA 梗。  
**不是** 2025 的「長押しして4Kで読み込む」，也不是 APNG 动画。

---

## 2. 实现原理（已拆原图）

原图：`PNG` 1664×2432，约 867KB

- **不是 APNG**（无 acTL/fcTL 动画块）
- **Indexed PNG + tRNS 透明**（palette 模式）
- 透明像素约 184 万，不透明约 220 万（约 45% 区域透明）

### 核心机制：UI 背景差

```
时间线背景 ≈ 白
点开 lightbox 背景 ≈ 黑
```

一张带透明通道的 PNG：

- **白底时间线**：白线/白细节“隐身”，只见状态 A  
- **黑底大图**：透明区露出黑底，白线/第二层浮出 → 状态 B  

作者写「長押し」是**互动引导**（iOS 长按常打开菜单/放大），本质是 **open/lightbox 时背景变黑** 造成的视觉切换。

### 限制与坑

- 深色主题时间线可能提前露馅  
- 手机 App 发图可能把 PNG 压成 JPG → 透明丢失  
- 必须保留 alpha；Web 发图更稳  
- 同类旧梗：2013 日推 transparent PNG rollover；2026 教程站「クリックしたら変わる絵」

---

## 3. Google 生态现状

**结论：X 上爆、Google 上几乎还是空的。**

搜 `長押しで変化` / `tap to change illustration` / `hold to reveal twitter` 等，目前基本是：

- 无关「长按 UI」教程  
- 旧的「透过 PNG + 点开变图」技术文  
- **几乎没有**针对这次 7/23 梗的英文 SEO 站、工具站、品牌词  

→ **SEO 窗口还在，适合抢域名 + 做 maker。**

同类现象参考：土耳其媒体 2026-02 曾报导「点开变图」类 PNG 透明 + 黑底幻觉（说明全球有理解基础）。

---

## 4. 关键词矩阵

### 日文（主需求，跟原帖一致）

| 词 | 用途 | 优先级 |
|---|---|---|
| **長押しで変化** | 核心词 | P0 |
| **長押しで変化？** | 原帖原句 | P0 |
| **タップで変化イラスト** | 作者系列词 / 教程 | P0 |
| **タップで変化** | 短词 | P1 |
| 長押し 画像 変化 / 長押し 変わる 絵 | 长尾 how-to | P1 |
| 透過PNG 変化 / 透明PNG X | 原理/技术流 | P1 |

### 英文（域名 + 出海 SEO，几乎没人用）

| 词 | 备注 | 优先级 |
|---|---|---|
| **hold to reveal** | 最好记，适合品牌 | P0 |
| **holdreveal** | 域名形态 | P0 |
| **long press change image** | 搜索意图直白 | P1 |
| **tap to change illustration** | 对应日文「タップで変化」 | P1 |
| **transparent PNG twitter** / **PNG reveal twitter** | 技术词 | P1 |
| **click to reveal image X** | 英文更常说 tap/click | P1 |

### 中文（次要，可并行）

- 长按变图 / 点开变画 / 透明PNG变图  

---

## 5. 流量覆盖区域

| 区域 | 强度 | 说明 |
|---|---|---|
| **日本 X / AI 插画圈** | ★★★★★ | 原帖日文、作者日系 AI 画风 |
| **全球 X（英/西/韩评论）** | ★★★★ | 1 亿级曝光，外文评论多 |
| **英文 Google** | ★★☆ | 受众有、词没定型 → 可抢 |
| 中文圈 | ★★☆ | 二次扩散中，SEO 未起 |
| 土耳其等 | ★★ | 已有同类「点开变图」报导 |

**用户画像**：AI 画师、二次元、壁纸党、想涨互动的创作者。

**需求分层**：

1. 想看懂怎么玩  
2. 想自己做一张  
3. 想批量 / AI 一键出“变化图”  

**英文受众：有，且值得做。** 现象不依赖日语；谁先立住 `holdreveal` / `hold to reveal`，谁拿走 Google。

---

## 6. 域名情况（2026-07-25 DNS 粗测）

> 非注册局最终结果，上站前务必用 Cloudflare / Porkbun 再查。

### 优先注册

| 域名 | 粗测 | 建议 |
|---|---|---|
| **holdreveal.com** | FREE? | **首选品牌** |
| **holdreveal.app** | FREE? | 产品/App 感 |
| **nagaoshi.app** | FREE? | 日文读音，日本向 |
| holdtochange.com | FREE? | 次选 |
| pressreveal.com | FREE? | 次选 |
| revealpng.com / pngreveal.com | FREE? | 技术向 |
| longpressreveal.com / longpresschange.com | FREE? | 长尾 |
| tapchange.app / taptochange.app | FREE? | 对应タップ |
| holdchange.com / holdchange.app | FREE? | 备选 |
| holdflip.app | FREE? | 备选 |

### 已占 / 慎用

| 域名 | 状态 |
|---|---|
| nagaoshi.com | 已有 A |
| henka.app | 已有 A |
| holdflip.com | 已有 A |
| holdmagic.com | 已有 A |
| revealhold.com | 已有 A |
| longhold.app | 已有 A |
| nagaoshihenka.com | 有 NS 迹象 |

**建议一次拿 2–3 个**：`holdreveal.com` + `holdreveal.app` + `nagaoshi.app`

---

## 7. 竞品 / 现有网站

| 类型 | 现状 |
|---|---|
| 专用「長押しで変化」生成器 | **几乎没有** |
| 原理教程 | 有（透过 PNG + 白/黑底），分散博客 |
| 通用抠图/透明 PNG | 很多（remove.bg、Canva…） |
| 纵並べ / 4 分割工具 | 多（另一波 X 玩法） |
| 4K 长按 | 另一旧梗，易混淆 |

**空白**：  
「上传图 A + 图 B → 导出可发 X 的変化 PNG + 预览白/黑底 + 文案模板」  
一站式 maker 目前基本空缺。

---

## 8. 产品机会（初判）

### 优先做

1. **変化 PNG Maker（网页）**  
   - 输入：图 A（时间线）+ 图 B（点开后）或单图 AI 生第二态  
   - 输出：Indexed/透明 PNG + 白底/黑底预览  
   - 附：文案包「長押しで変化？」「タップで変化」  

2. **SEO 教程站（日文优先 + 英文）**  
   - `長押しで変化 やり方` / `hold to reveal twitter how to`  

3. **模板商店**  
   - 翅膀展开、昼夜切换、衣服变装、隐藏彩蛋  

### 变现方向（待技术方案收束）

- 免费限次 + Pro 去水印 / 高清 / 批量  
- 面向 AI 画师的月订阅  
- 企业/IP 联名互动图  

### 风险

- 梗生命周期短（数周～数月）→ 先做工具+模板  
- 深色模式失效 → 产品页必须写清  
- 平台可能改 lightbox 背景  

---

## 9. 一句话结论

这是 **2026-07-23 日推 AI 画师带火的「長押しで変化」**，本质是 **透明 PNG × X 白时间线/黑大图** 的 UI 黑客。  

**新词窗口**：`長押しで変化` / `holdreveal` 仍新；**专用生成器几乎空白**；流量在 **日本 X + 全球二次元/AI 插画**，搜索侧可抢占。

---

## 10. 文档索引

| 文件 | 内容 |
|---|---|
| `01-market-research.md` | 本文件：市场/关键词/域名 |
| `02-tech-and-product.md` | 技术方案 + 用户需求 + 变现定位（子 agent） |
| `03-mvp-spec.md` | MVP 规格（后续） |
