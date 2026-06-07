import type { SupportedNetwork } from './chains';

export type ExampleTransactionKind = 'transfer' | 'contractCall' | 'contractDeploy' | 'failed' | 'approve';

export interface ExampleTransaction {
  id: ExampleTransactionKind;
  title: string;
  network: SupportedNetwork;
  hash: `0x${string}`;
  description: string;
}

export const exampleTransactions: ExampleTransaction[] = [
  {
    id: 'approve',
    title: 'Approve 授权',
    network: 'sepolia',
    hash: '0xf578f20136b282c393c63e7735bd042a25ed916782fb83bad18678e5fe43287b',
    description: 'Sepolia 上的疑似 ERC-20 approve，可用于观察高风险授权提示。',
  },
  {
    id: 'failed',
    title: '失败交易',
    network: 'sepolia',
    hash: '0x7f6c5003243106116ec9524dd307e32abb74984ba531c93133dc399c3c3a028f',
    description: 'Sepolia 上的 reverted 交易，可用于观察失败状态和风险原因。',
  },
  {
    id: 'contractDeploy',
    title: '合约部署',
    network: 'sepolia',
    hash: '0xc71469aa178b08ec7e9e9165c5bce48095e9a10b7a4497484f2802487c61597f',
    description: 'Sepolia 上产生合约地址的部署类交易。',
  },
  {
    id: 'contractCall',
    title: '合约调用',
    network: 'baseSepolia',
    hash: '0xf0df01a88d8c27ef32ece8d6eb705a89a3c0537a13c3ad7b0267d799128daa7f',
    description: 'Base Sepolia 上的合约交互示例，可用于观察 input data。',
  },
  {
    id: 'transfer',
    title: '普通交易',
    network: 'baseSepolia',
    hash: '0x1e1a83af61ece8cc5ab999767f2eab7f29b23f3815cf76acc0ed494348ceca66',
    description: 'Base Sepolia 上的普通交易示例，适合快速验证基础查询流程。',
  },
];
