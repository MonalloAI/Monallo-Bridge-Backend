/**
 * 锁币路由：执行合约交互并存储记录
 */
import { Router, Request, Response, NextFunction } from 'express';
import { JsonRpcProvider, Wallet, Contract, parseEther } from 'ethers';
import dotenv from 'dotenv';
import token from '../abi/abi.json';
import LockRecord from '../models/LockRecord'; 
import { asyncHandler } from '../utils/asyncHandler';

dotenv.config();

const router = Router();
const abi = token.abi;


router.post(
  '/',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { fromAddress, toAddress, amount } = req.body;

  
    if (!fromAddress || !toAddress || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: '缺少参数: fromAddress, toAddress 或 amount',
      });
    }

  
    const RPC_URL = process.env.IMUA_RPC_URL!;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
    const PRIVATE_KEY = process.env.PRIVATE_KEY!;

    if (!RPC_URL || !CONTRACT_ADDRESS || !PRIVATE_KEY) {
      return res.status(500).json({
        success: false,
        error: '环境变量配置缺失（IMUA_RPC_URL / CONTRACT_ADDRESS / PRIVATE_KEY）',
      });
    }

    try {

      const provider = new JsonRpcProvider(RPC_URL);
      const wallet = new Wallet(PRIVATE_KEY, provider);
      const contract = new Contract(CONTRACT_ADDRESS, abi, wallet);


      const amountParsed = parseEther(amount.toString());

      const tx = await contract.lockImaAndRequestMint(toAddress, amountParsed);
      const receipt = await tx.wait();
      const sourceFromTxHash = tx.hash;
      console.log('锁币成功，交易Hash:', sourceFromTxHash);

      // 存入数据库Hash
      const record = new LockRecord({
        fromAddress,
        toAddress,
        amount,
        sourceFromTxHash,
        timestamp: new Date(),
      });
      await record.save();

      res.json({
        success: true,
        txHash: sourceFromTxHash,
        receipt,
      });
    } catch (error: any) {
      console.error('[锁币交互失败]', error);
      res.status(500).json({
        success: false,
        error: error.message || '合约交互失败',
      });
    }
  })
);

export default router;
