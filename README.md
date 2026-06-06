# Tracemind AI Web3

AI Web3 Transaction Explainer 是一个面向 Web3 新手和 AI × Web3 学员的工具，帮助用户输入测试网交易哈希后读取链上数据，并生成中文 AI 解释、风险提示与 Markdown 学习记录。

## 主要功能

- 支持输入交易哈希并查询 Sepolia / Base Sepolia 链上交易信息
- 展示交易状态、发送方、接收方、ETH 值、Gas、区块高度、日志数量、合约地址与 input data
- 提供区块浏览器链接，并支持复制交易哈希和地址
- 通过 AI 生成中文解释和风险提示
- 自动判断交易风险等级并给出人工确认清单
- 生成可复制的 Markdown 学习记录

## 技术栈

- Next.js App Router
- React + Tailwind CSS
- TypeScript
- viem 链上查询
- OpenAI API

## 快速开始

1. 克隆或进入项目目录
2. 安装依赖：

```bash
npm install
```

3. 创建 `.env` 文件并填写 RPC URL 与 OpenAI API Key：

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

4. 启动开发服务器：

```bash
npm run dev
```

5. 打开浏览器访问 `http://localhost:3000`

如果暂时没有配置 `OPENAI_API_KEY`，项目仍然可以查询链上交易、展示规则风险评估，并生成一份规则版 Markdown 学习记录。

## 使用方法

1. 在首页选择测试网，例如 Sepolia 或 Base Sepolia。
2. 输入 0x 开头的 66 位交易哈希。
3. 点击“查询交易”，等待链上数据和 AI 解读返回。
4. 查看交易概览、风险评估和人工确认清单。
5. 复制 Markdown 学习记录，保存到 GitHub repo 或个人笔记。

## 常用命令

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
```

## 部署与 CI

- 推荐部署平台：Vercel
- 部署文档：`docs/DEPLOYMENT.md`
- GitHub Actions：提交到 `main` / `master` 后自动运行类型检查、Lint 和构建

## 环境变量

| 变量 | 说明 |
|---|---|
| `OPENAI_API_KEY` | 服务端调用 OpenAI API 使用 |
| `OPENAI_MODEL` | AI 模型名，默认可使用 `gpt-4.1-mini` |
| `SEPOLIA_RPC_URL` | Sepolia RPC URL |
| `BASE_SEPOLIA_RPC_URL` | Base Sepolia RPC URL |

## 项目结构

- `src/app`：页面与 API Routes
- `src/components`：UI 组件
- `src/lib`：链条配置、查询、AI 解释、风险判断、Markdown 生成
- `src/types`：类型定义
- `docs`：需求与技术设计文档
- `prompts`：AI prompt 模板
- `.github/workflows`：GitHub Actions 自动检查配置

## 安全说明

- 不读取、不存储、不上传私钥或助记词
- AI API Key 仅在服务端环境变量使用
- 只做链上数据解释，不执行转账、签名或授权
- AI 输出仅供学习参考，不构成投资建议或安全审计结论

## 后续计划

- 增加更多示例交易
- 增加 ABI 输入与 input data 解码
- 增加钱包连接，只用于展示当前地址
- 增加本地历史记录和 PDF 导出
