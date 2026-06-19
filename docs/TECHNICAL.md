# AI Web3 Transaction Explainer 技术文档

## 技术目标

本项目要实现一个 Web 应用：用户输入测试网交易哈希，系统通过 RPC / viem 查询链上数据，调用 AI 生成中文解释，并输出风险检查结果和 Markdown 学习记录。

系统必须满足以下技术目标：

1. 前端页面清晰易用。
2. 链上查询稳定可靠。
3. AI API Key 不暴露到前端。
4. 风险规则可维护、可扩展。
5. Markdown 生成逻辑独立。
6. 项目可部署到 Vercel。
7. 项目适合放入 GitHub 作为 AI × Web3 demo。

## 推荐技术栈

| 层级 | 技术 | 用途 |
|---|---|---|
| 前端框架 | Next.js App Router | 页面、API Route、部署 |
| UI | React + Tailwind CSS | 组件化页面和样式 |
| 语言 | TypeScript | 类型安全 |
| 链上查询 | viem | 查询交易、receipt、格式化 ETH |
| 钱包连接 | wagmi，后续可选 | 后续支持连接钱包展示地址 |
| AI 服务 | OpenAI API / GLM API / Claude API | 生成交易解释 |
| 部署 | Vercel | 快速部署 Web 应用 |
| 代码管理 | GitHub | 项目展示和课程交付 |

说明：MVP 阶段不必须连接钱包，使用 viem public client 查询交易即可。

## 总体架构

```
用户浏览器
  │
  │ 输入网络 + 交易哈希
  ▼
Next.js 前端页面
  │
  ├── 调用 /api/transaction?network=xxx&hash=xxx
  │       │
  │       └── viem public client 查询链上数据
  │
  ├── 调用 /api/explain
  │       │
  │       └── 后端安全调用 AI API
  │
  ├── 本地 risk-check 模块生成风险等级
  │
  └── markdown 模块生成学习记录
```

### 架构原则

- 链上数据是事实来源。
- AI 输出只是解释层，不作为唯一判断依据。
- API Key 只存在服务端环境变量中。
- 风险判断采用“规则优先 + AI 辅助解释”。
- 高风险动作不自动执行。

## 项目目录结构

推荐目录：

```
ai-web3-tx-explainer/
├── README.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── .gitignore
├── .env.example
├── docs/
│   ├── PRD.md
│   ├── TECHNICAL.md
│   ├── SECURITY.md
│   └── EXAMPLES.md
├── prompts/
│   └── transaction-explainer.md
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── api/
│   │       ├── transaction/
│   │       │   └── route.ts
│   │       └── explain/
│   │           └── route.ts
│   ├── components/
│   │   ├── TxInputCard.tsx
│   │   ├── TransactionOverview.tsx
│   │   ├── AiExplanation.tsx
│   │   ├── RiskPanel.tsx
│   │   └── MarkdownExport.tsx
│   ├── lib/
│   │   ├── chains.ts
│   │   ├── viemClient.ts
│   │   ├── transaction.ts
│   │   ├── riskCheck.ts
│   │   ├── ai.ts
│   │   └── validators.ts
│   └── types/
│       └── transaction.ts
└── public/
    └── screenshots/
```

## 环境变量设计

`.env.example`

```env
# AI provider
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini

# RPC URLs
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

### 安全要求

- `.env` 必须加入 `.gitignore`。
- 不允许在前端使用 `NEXT_PUBLIC_OPENAI_API_KEY`。
- AI API 调用只能放在 API Route 或服务端函数中。
- RPC URL 可以使用公共 RPC，但生产环境建议使用稳定节点服务。

## 链配置设计

文件：`src/lib/chains.ts`

```ts
import { sepolia, baseSepolia } from 'viem/chains';

export const supportedChains = {
  sepolia: {
    id: sepolia.id,
    name: 'Sepolia',
    chain: sepolia,
    explorerBaseUrl: 'https://sepolia.etherscan.io/tx/',
    rpcEnvKey: 'SEPOLIA_RPC_URL',
  },
  baseSepolia: {
    id: baseSepolia.id,
    name: 'Base Sepolia',
    chain: baseSepolia,
    explorerBaseUrl: 'https://sepolia.basescan.org/tx/',
    rpcEnvKey: 'BASE_SEPOLIA_RPC_URL',
  },
} as const;

export type SupportedNetwork = keyof typeof supportedChains;
```

## viem Client 设计

文件：`src/lib/viemClient.ts`

```ts
import { createPublicClient, http } from 'viem';
import { supportedChains, SupportedNetwork } from './chains';

export function createClient(network: SupportedNetwork) {
  const config = supportedChains[network];
  const rpcUrl = process.env[config.rpcEnvKey];

  if (!rpcUrl) {
    throw new Error(`Missing RPC URL for ${network}`);
  }

  return createPublicClient({
    chain: config.chain,
    transport: http(rpcUrl),
  });
}
```
