import { Request, Response, NextFunction, Router} from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import lock from '../models/LockRecord';
const router = Router();

// 获取所有锁定记录
router.get('/allLock', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const allLocks = await lock.find({}).select({});
    res.json(allLocks);
  } catch (error) {
    next(error);
  }
});

// 根据 txHash 获取锁定记录
router.get(
  '/getMintTxHash',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { sourceFromTxHash } = req.query;

    if (!sourceFromTxHash || typeof sourceFromTxHash !== 'string') {
      return res.status(400).json({ success: false, error: '缺少参数: sourceFromTxHash' });
    }

    const record = await lock.findOne({ sourceFromTxHash });
    if (!record) {
      return res.status(404).json({ success: false, error: '未找到锁定记录' });
    }

    res.json(record);
  })
);
// 根据 fromAddress 获取锁定记录
router.get(
  '/getlockbyfrom',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { from } = req.query;

    if (!from || typeof from !== 'string') {
      return res.status(400).json({ success: false, error: '缺少参数: from' });
    }

    const record = await lock.findOne({ from });
    if (!record) {
      return res.status(404).json({ success: false, error: '未找到锁定记录' });
    }

    res.json(record);
  })
);
// 根据 fromAddress , toAddress ,amount,txHash获取锁定记录
router.post(
  '/lock',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { from, to, amount, txHash } = req.body;

    if (!from || !to || !amount || !txHash) {
      return res.status(400).json({ success: false, error: '缺少必要参数' });
    }

    try {
      const newLock = new lock({
        from,
        to,
        amount,
        txHash,
        status: 'pending',
      });

      await newLock.save();
      res.json({ success: true, record: newLock });
    } catch (error) {
      next(error);
    }
  })
);

//用于接收前端传递锁定信息
router.post(
  '/lockInfo',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log('请求体:', req.body);
    const { fromAddress, toAddress, amount, sourceFromTxHash, fee } = req.body; 
    if (!fromAddress || !toAddress || !amount || !sourceFromTxHash) {
      return res.status(400).json({
        success: false,
        error: '缺少参数: fromAddress, toAddress, amount 或 sourceFromTxHash',
      });
    }
    try {
      const newLock = new lock({
        fromAddress,
        toAddress,
        amount,
        sourceFromTxHash,
        fee: fee || null, 
        status: 'pending',
      });

      await newLock.save();
      res.json({ success: true, record: newLock });
    } catch (error) {
      next(error);
    }
  })
);

export default router;