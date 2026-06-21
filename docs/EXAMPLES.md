# 示例交易

可以用下面这些类型的测试网交易验证项目能力。项目已在 `src/lib/exampleTransactions.ts` 中内置一组示例，提交 GitHub 前也可以替换为你自己在 Sepolia 或 Base Sepolia 上完成的真实测试网交易哈希。

## 建议准备的示例

| 类型 | 用途 | 验证点 |
|---|---|---|
| 普通测试网 ETH 转账 | 展示 value 转账识别 | `value > 0`、中风险提示 |
| 合约写入交易 | 展示 input data 和合约调用识别 | `input != 0x`、合约调用提示 |
| 合约部署交易 | 展示 contractAddress | `to == null`、部署地址 |
| 失败交易 | 展示 reverted 状态 | 失败风险提示 |
| ERC-20 approve | 展示授权风险 | selector `0x095ea7b3`、高风险提示 |

## 当前内置示例

| 类型 | 网络 | 交易哈希 |
|---|---|---|
| Approve 授权 | Sepolia | `0xf578f20136b282c393c63e7735bd042a25ed916782fb83bad18678e5fe43287b` |
| 失败交易 | Sepolia | `0x7f6c5003243106116ec9524dd307e32abb74984ba531c93133dc399c3c3a028f` |
| 合约部署 | Sepolia | `0xc71469aa178b08ec7e9e9165c5bce48095e9a10b7a4497484f2802487c61597f` |
| 合约调用 | Base Sepolia | `0xf0df01a88d8c27ef32ece8d6eb705a89a3c0537a13c3ad7b0267d799128daa7f` |
| 普通交易 | Base Sepolia | `0x1e1a83af61ece8cc5ab999767f2eab7f29b23f3815cf76acc0ed494348ceca66` |

## README 截图建议

- 首页输入交易哈希截图。
- 交易概览截图。
- AI 中文解释截图。
- 风险评估和人工确认清单截图。
- Markdown 导出截图。
- 区块浏览器交易详情截图。
