# HoldReveal 上线清单（Vercel + Cloudflare DNS + GSC）

## 1. 推代码

```bash
cd D:\project\web\projects\holdreveal
git init
git add .
git commit -m "feat: HoldReveal MVP"
# 创建 GitHub 私有/公开仓后
git remote add origin <your-repo-url>
git push -u origin main
```

## 2. Vercel

1. [vercel.com](https://vercel.com) → Add New Project → Import 仓库  
2. Framework Preset: **Vite**  
3. Build Command: `npm run build`  
4. Output Directory: `dist`  
5. Deploy  

## 3. Cloudflare DNS（域名已买）

在 Cloudflare 控制台 → holdreveal.com → DNS：

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `@` | `cname.vercel-dns.com` | DNS only（灰云）或按 Vercel 文档 |
| CNAME | `www` | `cname.vercel-dns.com` | 同上 |

> Vercel → Project → Settings → Domains → 添加 `holdreveal.com` 与 `www`，以面板显示的 **准确 CNAME 目标** 为准。  
> 若 Vercel 要求 A 记录，按其给的 IP 配置。  
> 推荐 **DNS only（关闭橙云代理）** 避免双层 SSL 问题；SSL 交给 Vercel。

## 4. Google Search Console

1. 添加资源：网址前缀 `https://holdreveal.com/` 或域名资源  
2. DNS TXT 验证（Cloudflare 加 TXT）或 HTML 标签  
3. 验证通过后：**站点地图** → 提交 `https://holdreveal.com/sitemap.xml`  
4. 请求编入索引：首页 URL 检查 → 请求编入索引  

已准备：

- `public/robots.txt` → Sitemap 指向  
- `public/sitemap.xml`  
- `index.html` 内 canonical / OG / JSON-LD  

## 5. 自测

1. 打开站 → 上传 A/B → 白/黑预览切换  
2. 下载 PNG-8  
3. **x.com 网页版** 发帖验证变化  
4. 手机 App 对照（可能丢透明）  
