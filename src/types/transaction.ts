export type TxStatus = 'success' | 'reverted' | 'pending' | 'unknown';
export type RiskLevel = 'low' | 'medium' | 'high' | 'unknown';

export interface TransactionSummary {
  network: string;
  chainId: number;
  hash: string;
  explorerUrl: string;
  from: string;
  to: string | null;
  valueEth: string;
  input: string;
  functionSelector: string | null;
  blockNumber: string | null;
  gas: string | null;
  gasUsed: string | null;
  effectiveGasPrice: string | null;
  status: TxStatus;
  contractAddress: string | null;
  logsCount: number;
  transactionIndex: number | null;
}

export interface RiskResult {
  level: RiskLevel;
  title: string;
  reasons: string[];
  flags: {
    hasValueTransfer: boolean;
    isContractCall: boolean;
    isContractDeployment: boolean;
    isFailed: boolean;
    hasLogs: boolean;
    possibleApprove: boolean;
    possibleTransfer: boolean;
    possibleTransferFrom: boolean;
  };
  humanChecklist: string[];
}

export interface AiExplanationResult {
  summary: string;
  riskTip: string;
  confirmationChecklist: string[];
  learningNotes: string;
}
