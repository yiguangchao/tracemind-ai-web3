'use server';

import type { SupportedNetwork } from './chains';

export function isValidTransactionHash(hash: string): hash is `0x${string}` {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

export function isSupportedNetwork(network: string): network is SupportedNetwork {
  return network === 'sepolia' || network === 'baseSepolia';
}
