import { baseSepolia, sepolia } from 'viem/chains';

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
