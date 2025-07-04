import { JsonRpcProvider, Wallet, Contract, parseEther } from 'ethers';
import { Router, Request, Response, NextFunction } from 'express';
import token from '../abi/abi.json';

const abi = token.abi;
const router = Router();

router.post('/sendTx', (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    const { network, amount, recipient } = req.body;

    let missingParam = '';
    switch (true) {
      case !network:
        missingParam = 'network';
        break;
      case amount === undefined:
        missingParam = 'amount';
        break;
      case !recipient:
        missingParam = 'recipient';
        break;
    }
    if (missingParam) {
      return res.status(400).json({ success: false, error: `缺少参数: ${missingParam}` });
    }

    // 根据 network 选择 rpc
    const rpcMap: Record<string, string> = {
      ethereum: 'https://eth-sepolia.g.alchemy.com/v2/NqV4OiKFv5guVW6t0Gd-HUyKurubau5L',
    //   goerli: 'https://goerli.infura.io/v3/你的key',
    //   polygon: 'https://polygon-rpc.com',
      
    };
    const rpc = rpcMap[network];
    if (!rpc) {
      return res.status(400).json({ success: false, error: `不支持的网络: ${network}` });
    }

    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      return res.status(500).json({ success: false, error: '合约地址未配置' });
    }

    const provider = new JsonRpcProvider(rpc);
    const wallet = new Wallet(process.env.PRIVATE_KEY!, provider);
    const contract = new Contract(contractAddress, abi, wallet);

   
    const amountParsed = parseEther(amount.toString());
    const tx = await contract.transfer(recipient, amountParsed);
    const receipt = await tx.wait();

    res.json({ success: true, txHash: tx.hash, receipt });
  })().catch((error: any) => {
    res.status(500).json({ success: false, error: error.message });
  });
});

export default router;