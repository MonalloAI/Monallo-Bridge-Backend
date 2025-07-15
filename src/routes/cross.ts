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


export default router;