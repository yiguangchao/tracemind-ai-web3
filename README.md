# Tracemind AI Web3

AI Web3 Transaction Explainer 是一个面向 Web3 新手和 AI × Web3 学员的工具，帮助用户输入测试网交易哈希后读取链上数据，并生成中文 AI 解释、风险提示与 Markdown 学习记录。

## 主要功能

- 支持输入交易哈希并查询 Sepolia / Base Sepolia 链上交易信息
- 展示交易状态、发送方、接收方、ETH 值、Gas、区块高度、日志数量
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

## 项目结构

- `src/app`：页面与 API Routes
- `src/components`：UI 组件
- `src/lib`：链条配置、查询、AI 解释、风险判断
- `src/types`：类型定义
- `docs`：需求与技术设计文档
- `prompts`：AI prompt 模板

## 安全说明

- 不读取、不存储、不上传私钥或助记词
- AI API Key 仅在服务端环境变量使用
- 只做链上数据解释，不执行转账或签名
