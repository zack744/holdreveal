# HoldReveal

長押しで変化 / タップで変化イラスト用 PNG メーカー（MVP）

- 双图合成：白底见 A、黑底见 B
- 全客户端处理（不上传图片）
- 日文 UI
- 静态站：Vite + React → **Vercel** 部署，**Cloudflare** 管 DNS

## 开发

```bash
npm install
npm run dev
npm run build
```

## 部署（Vercel + Cloudflare DNS）

1. GitHub 推送本仓库
2. Vercel Import → Framework Vite → Build `npm run build` → Output `dist`
3. Cloudflare DNS：`holdreveal.com` 的 CNAME `@` / `www` → `cname.vercel-dns.com`（按 Vercel 域名面板提示）
4. Vercel 添加 Domain `holdreveal.com`，SSL 自动
5. GSC：验证域名后提交 `https://holdreveal.com/sitemap.xml`

## 注意

- 请用 **X Web** 上传 PNG，App 可能压成 JPG 丢透明
- 深色主题时间线可能提前露馅
