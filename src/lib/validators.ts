'use server';

export function isValidTransactionHash(hash: string) {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}
