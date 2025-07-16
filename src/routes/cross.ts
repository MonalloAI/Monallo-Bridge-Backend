import { Request, Response, NextFunction, Router} from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import CrossBridgeRecord from "../models/CrossBridgeRecord.model";

const router = Router();

// 获取所有跨链记录
router.get('/allCrossRecords', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const allRecords = await CrossBridgeRecord.find({}).select({});
    res.json(allRecords);
  } catch (error) {
    next(error);
  }
});

// 根据 sourceFromTxHash 获取跨链记录
router.get(
  '/getCrossRecordByTxHash',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { sourceFromTxHash } = req.query;
    
        if (!sourceFromTxHash || typeof sourceFromTxHash !== 'string') {
        return res.status(400).json({ success: false, error: '缺少参数: sourceFromTxHash' });
        }
    
        const record = await CrossBridgeRecord.findOne({ sourceFromTxHash });
        if (!record) {
        return res.status(404).json({ success: false, error: '未找到跨链记录' });
        }
    
        res.json(record);
    })  
);

// 根据 sourceFromAddress 获取跨链记录
router.get(
    '/getCrossRecordByFromAddress',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { from } = req.query;
    
        if (!from || typeof from !== 'string') {
        return res.status(400).json({ success: false, error: '缺少参数: from' });
        }
    
        const record = await CrossBridgeRecord.findOne({ sourceFromAddress: from });
        if (!record) {
        return res.status(404).json({ success: false, error: '未找到跨链记录' });
        }
    
        res.json(record);
    })
);

// ========== 迁移自 lockRoutes.ts 的接口 ===========

// 获取所有锁定记录（跨链锁定）
router.get('/allCrossLock', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const allLocks = await CrossBridgeRecord.find({}).select({
      sourceFromAddress: 1,
      targetToAddress: 1,
      sourceFromAmount: 1,
      sourceFromTxHash: 1,
      sourceFromHandingFee: 1,
      sourceFromTxStatus: 1,
      crossBridgeStatus: 1,
      createdAt: 1,
      updatedAt: 1,
    });
    res.json(allLocks);
  } catch (error) {
    next(error);
  }
});

// 根据 sourceFromTxHash 获取锁定记录
router.get(
  '/getCrossLockByTxHash',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { sourceFromTxHash } = req.query;
    if (!sourceFromTxHash || typeof sourceFromTxHash !== 'string') {
      return res.status(400).json({ success: false, error: '缺少参数: sourceFromTxHash' });
    }
    const record = await CrossBridgeRecord.findOne({ sourceFromTxHash });
    if (!record) {
      return res.status(404).json({ success: false, error: '未找到锁定记录' });
    }
    res.json(record);
  })
);

// 根据 sourceFromAddress 获取锁定记录
router.get(
  '/getCrossLockByFrom',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { from } = req.query;
    if (!from || typeof from !== 'string') {
      return res.status(400).json({ success: false, error: '缺少参数: from' });
    }
    const record = await CrossBridgeRecord.findOne({ sourceFromAddress: from });
    if (!record) {
      return res.status(404).json({ success: false, error: '未找到锁定记录' });
    }
    res.json(record);
  })
);

// 新增锁定记录（跨链锁定）
// router.post(
//   '/crossLock',
//   asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const { from, to, amount, txHash } = req.body;
//     if (!from || !to || !amount || !txHash) {
//       return res.status(400).json({ success: false, error: '缺少必要参数' });
//     }
//     try {
//       const newLock = new CrossBridgeRecord({
//         sourceChainId: 0,
//         sourceChain: '',
//         sourceRpc: '',
//         sourceFromAddress: from,
//         sourceFromTokenName: '',
//         sourceFromTokenContractAddress: '',
//         sourceFromAmount: amount,
//         sourceFromHandingFee: '',
//         sourceFromRealAmount: amount,
//         sourceFromTxHash: txHash,
//         sourceFromTxStatus: 'pending',
//         targetChainId: 0,
//         targetChain: '',
//         targetRpc: '',
//         targetToAddress: to,
//         targetToTokenName: '',
//         targetToTokenContractAddress: '',
//         targetToReceiveAmount: amount,
//         targetToCallContractAddress: '',
//         targetToGasStatus: '',
//         targetToTxHash: '',
//         targetToTxStatus: 'pending',
//         crossBridgeStatus: 'pending',
//       });
//       await newLock.save();
//       res.json({ success: true, record: newLock });
//     } catch (error) {
//       next(error);
//     }
//   })
// );

// 用于接收前端传递锁定信息（跨链锁定）
router.post(
  '/crossLockInfo',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { fromAddress, toAddress, amount, sourceFromTxHash, fee } = req.body;
    if (!fromAddress || !toAddress || !amount || !sourceFromTxHash) {
      return res.status(400).json({
        success: false,
        error: '缺少参数: fromAddress, toAddress, amount 或 sourceFromTxHash',
      });
    }
    try {
      const newLock = new CrossBridgeRecord({
        sourceChainId: '',
        sourceChain: '',
        sourceRpc: '',
        sourceFromAddress: fromAddress,
        sourceFromTokenName: '',
        sourceFromTokenContractAddress: '',
        sourceFromAmount: amount,
        sourceFromHandingFee: fee || '',
        sourceFromRealAmount: amount,
        sourceFromTxHash: sourceFromTxHash,
        sourceFromTxStatus: 'pending',
        targetChainId: '',
        targetChain: '',
        targetRpc: '',
        targetToAddress: toAddress,
        targetToTokenName: '',
        targetToTokenContractAddress: '',
        targetToReceiveAmount: amount,
        targetToCallContractAddress: '',
        targetToGasStatus: '',
        targetToTxHash: '',
        targetToTxStatus: 'pending',
        crossBridgeStatus: 'pending',
      });
      await newLock.save();
      res.json({ success: true, record: newLock });
    } catch (error) {
      next(error);
    }
  })
);


export default router;