import { Request, Response, NextFunction, Router} from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import log from '../models/Log.model';
const router = Router();

// 获取所有日志记录
router.get('/allLogs', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const allLogs = await log.find({}).select({});
        res.json(allLogs);
    } catch (error) {
        next(error);
    }
    });

//根据地址查看相对应日志
router.get(
    '/getLogByAddress',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { address } = req.query;

        if (!address || typeof address !== 'string') {
            return res.status(400).json({ success: false, error: '缺少参数: address' });
        }

        const userLogs = await log.find({ address });
        if (!userLogs || userLogs.length === 0) {
            return res.status(404).json({ success: false, error: '未找到相关日志记录' });
        }

        res.json(userLogs);
    })
);

export default router;