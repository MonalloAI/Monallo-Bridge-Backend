import { Request, Response, NextFunction, Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import User from '../models/User.model';
const router = Router();

// 获取所有用户
router.get('/allUsers',
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const allUsers = await User.find({}).select({});
            res.json(allUsers);
        } catch (error) {
            next(error);
        }
});

//根据地址查询用户信息
router.get(
    '/getUserByAddress',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { address } = req.query;

        if (!address || typeof address !== 'string') {
            return res.status(400).json({ success: false, error: '缺少参数: address' });
        }

        const user = await User.findOne({ address });
        if (!user) {
            return res.status(404).json({ success: false, error: '未找到用户信息' });
        }

        res.json(user);
    })
);

export default router;