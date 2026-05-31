import { createPublicClient, http } from 'viem';
import type { SupportedNetwork } from './chains';
import { supportedChains } from './chains';

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
