# GitHub 提交检查清单

提交项目之前，建议按下面顺序检查。

## 本地检查

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

如果暂时没有配置 `OPENAI_API_KEY`，项目仍可演示链上查询、风险评估和规则版 Markdown 导出。

## 必备文件

- [ ] `README.md` 已说明项目目标、技术栈、运行方式和安全边界。
- [ ] `.env.example` 已提供必要环境变量示例。
- [ ] `.env` / `.env.local` 没有提交到 GitHub。
- [ ] `docs/PRD.md` 和 `docs/TECHNICAL.md` 已提交。
- [ ] `docs/SECURITY.md` 已说明安全边界。
- [ ] `docs/EXAMPLES.md` 已说明建议演示交易类型。
- [ ] `docs/DEPLOYMENT.md` 已说明部署方式。

## Demo 检查

- [ ] 可以输入 Sepolia 或 Base Sepolia 交易哈希。
- [ ] 可以展示交易状态、from、to、value、Gas、区块高度。
- [ ] 可以打开区块浏览器链接。
- [ ] 可以查看 input data。
- [ ] 可以展示风险等级和人工确认清单。
- [ ] 可以生成并复制 Markdown 学习记录。

## 安全检查

- [ ] 项目没有任何真实私钥、助记词或钱包敏感凭证。
- [ ] 前端没有 `NEXT_PUBLIC_OPENAI_API_KEY`。
- [ ] 项目不提供自动签名、自动转账、自动授权功能。
- [ ] AI 输出仅作为学习参考，不作为投资建议或安全审计结论。
