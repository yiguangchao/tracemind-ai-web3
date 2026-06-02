import type { RiskResult } from '@/types/transaction';

const approveSelector = '0x095ea7b3';
const transferSelector = '0xa9059cbb';
const transferFromSelector = '0x23b872dd';

export function calculateRisk(transaction: any, receipt: any): RiskResult {
  const hasValueTransfer = transaction.value && transaction.value !== 0n;
  const isContractCall = transaction.input && transaction.input !== '0x';
  const isContractDeployment = transaction.to == null && receipt?.contractAddress != null;
  const isFailed = receipt?.status === 0;
  const hasLogs = Array.isArray(receipt?.logs) && receipt.logs.length > 0;
  const functionSelector = transaction.input?.slice(0, 10) ?? null;
  const isApprove = functionSelector === approveSelector;
  const isTransfer = functionSelector === transferSelector;
  const isTransferFrom = functionSelector === transferFromSelector;

  const reasons: string[] = [];
  const humanChecklist: string[] = [];

  if (isContractDeployment) {
    reasons.push('交易是合约部署。');
    humanChecklist.push('确认是否为可信合约部署，并检查部署地址是否正确。');
  }

  if (isApprove) {
    reasons.push('疑似 ERC-20 approve 授权操作。');
    humanChecklist.push('确认授权合约地址、授权额度和当前是否需要授权。');
  }

  if (isTransferFrom) {
    reasons.push('疑似 ERC-20 transferFrom 授权资产转移。');
    humanChecklist.push('确认授权来源、接收目标和转移金额。');
  }

  if (isTransfer) {
    reasons.push('疑似 ERC-20 transfer 转账操作。');
    humanChecklist.push('确认转账目标地址和转账金额。');
  }

  if (hasValueTransfer && !isTransfer) {
    reasons.push('交易包含原生资产转账。');
    humanChecklist.push('确认接收地址是否正确，并确认转账金额。');
  }

  if (isContractCall && !isContractDeployment) {
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

  if (!isContractDeployment && !isApprove && !isTransfer && !isTransferFrom && !hasValueTransfer && !isFailed && !isContractCall) {
    reasons.push('当前交易无明显风险特征，但仍需人工确认。');
    humanChecklist.push('确认交易目的和目标地址。');
  }

  let level: RiskResult['level'] = 'low';
  let title = '交易风险较低。';

  if (isContractDeployment) {
    level = 'medium';
    title = '存在合约部署风险，请确认合约来源。';
  }

  if (isTransfer) {
    level = 'medium';
    title = '交易包含资产转账，请确认接收地址和金额。';
  }

  if (hasValueTransfer && !isTransfer) {
    level = 'medium';
    title = '交易包含原生资产转账，请确认金额与目标。';
  }

  if (isContractCall && !isApprove && !isTransfer && !isTransferFrom && !isContractDeployment) {
    level = 'medium';
    title = '交易包含未知合约调用，需确认函数用途。';
  }

  if (isApprove || isTransferFrom) {
    level = 'high';
    title = '高风险交易，可能包含授权或资产转移。';
  }

  if (isFailed && level !== 'high') {
    level = 'medium';
    title = '交易执行失败，请检查失败原因。';
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
      possibleApprove: isApprove,
      possibleTransfer: isTransfer,
      possibleTransferFrom: isTransferFrom,
    },
    humanChecklist,
  };
}
