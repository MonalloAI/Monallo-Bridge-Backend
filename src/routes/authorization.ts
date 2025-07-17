import { Request, Response, NextFunction, Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import CrossBridgeRecord from "../models/Authorization.model";


const router = Router();

router.post(
    '/getAmount',
    asyncHandler(async (req: Request, res: Response) => {
        const { address, contractAddress } = req.body;

        if (!address || !contractAddress) {
            return res.status(400).json({ success: false, error: '缺少必要参数' });
        }

        const record = await CrossBridgeRecord.findOne({ address, contractAddress });

        if (!record) {
            return res.status(404).json({ success: false, error: '记录不存在' });
        }

        res.status(200).json({
            success: true,
            data: {
                address: record.address,
                contractAddress: record.contractAddress,
                amount: record.amount,
            },
        });
    })
);


router.post(
    '/addAuthorization',
    asyncHandler(async (req: Request, res: Response) => {
        const { chainId,chainName,address, contractAddress, amount } = req.body;

        if (!address || !contractAddress || !amount || !chainId || !chainName) {
            return res.status(400).json({ success: false, error: '缺少必要参数' });
        }

        const newRecord = new CrossBridgeRecord({
            chainId,
            chainName,
            address,
            contractAddress,
            amount,
        });

        await newRecord.save();

        res.status(201).json({
            success: true,
            data: newRecord,
        });
    })
);

export default router;