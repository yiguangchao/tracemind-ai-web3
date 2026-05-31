import type { RiskResult } from '@/types/transaction';

const approveSelector = '0x095ea7b3';
const transferSelector = '0xa9059cbb';
const transferFromSelector = '0x23b872dd';

export function calculateRisk(transaction: any, receipt: any): RiskResult {
  const hasValueTransfer = transaction.value && transaction.value !== 0n;
  const isContractCall = transaction.input && transaction.input !== '0x';
  const isContractDeployment = !transaction.to && receipt?.contractAddress != null;
  const isFailed = receipt?.status === 0;
  const hasLogs = Array.isArray(receipt?.logs) && receipt.logs.length > 0;
  const functionSelector = transaction.input?.slice(0, 10) ?? null;

  const reasons: string[] = [];
  const humanChecklist: string[] = [];

  if (hasValueTransfer) {
    reasons.push('交易包含原生资产转账。');
    humanChecklist.push('确认接收地址是否正确，并确认转账金额。');
  }

  if (isContractDeployment) {
    reasons.push('交易可能是合约部署。');
    humanChecklist.push('确认这是否为可信合约部署。');
  }

  if (isContractCall) {
    reasons.push('交易包含合约调用数据。');
    humanChecklist.push('确认调用的目标合约地址及函数用途。');
  }

  if (isFailed) {
    reasons.push('交易执行失败（reverted）。');
    humanChecklist.push('检查失败原因并避免重复执行未经确认的交易。');
  }

  if (hasLogs) {
    reasons.push('交易产生事件日志。');
  }

  if (functionSelector === approveSelector) {
    reasons.push('疑似 ERC-20 approve 授权操作。');
    humanChecklist.push('确认授权额度、授权合约地址和风险。');
  }

  if (functionSelector === transferSelector) {
    reasons.push('疑似 ERC-20 transfer 转账操作。');
    humanChecklist.push('确认转账对象和金额。');
  }

  if (functionSelector === transferFromSelector) {
    reasons.push('疑似 ERC-20 transferFrom 转移授权资产。');
    humanChecklist.push('确认转移来源、目标和授权来源地址。');
  }

  let level: RiskResult['level'] = 'low';
  let title = '交易风险较低';

  if (isFailed || isContractDeployment || isContractCall || hasValueTransfer) {
    level = 'medium';
    title = '交易存在中等风险，请确认细节。';
  }

  if (functionSelector === approveSelector || functionSelector === transferFromSelector) {
    level = 'high';
    title = '高风险交易，可能包含授权或资产转移。';
  }

  if (!reasons.length) {
    reasons.push('当前交易无明显风险特征，但仍需人工确认。');
    humanChecklist.push('确认交易目的和目标地址。');
  }

  return {
    level,
    title,
    reasons,
    flags: {
      hasValueTransfer,
      isContractCall,
      isContractDeployment,
      isFailed,
      hasLogs,
      possibleApprove: functionSelector === approveSelector,
      possibleTransfer: functionSelector === transferSelector,
      possibleTransferFrom: functionSelector === transferFromSelector,
    },
    humanChecklist,
  };
}
