# 部署说明

本项目推荐部署到 Vercel，也可以作为普通 Next.js 应用部署到支持 Node.js 的平台。

## 本地检查

提交前建议运行：

```bash
npm run typecheck
npm run lint
npm run build
```

## Vercel 部署

1. 将项目推送到 GitHub。
2. 在 Vercel 中选择 `Add New Project`。
3. 导入当前 GitHub 仓库。
4. 配置环境变量：

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

5. 点击 Deploy。

## 无 AI Key 演示

如果暂时没有配置 `OPENAI_API_KEY`，项目仍然可以完成链上交易查询、规则风险检查和规则版 Markdown 导出。AI 中文解释会降级为本地规则说明。

## GitHub Actions

仓库包含 `.github/workflows/ci.yml`。推送到 `main` 或 `master` 后会自动运行：

- TypeScript 类型检查
- ESLint
- Next.js 构建
