import mongoose, { Schema } from 'mongoose';
import { ICrossBridgeRecord } from './interface/CrossBridgeRecord.interface';

const CrossBridgeRecordSchema = new Schema<ICrossBridgeRecord>(
  {
    sourceChainId: { type: Number, required: true },
    sourceChain: { type: String, required: true },
    sourceRpc: { type: String, required: true },
    sourceFromAddress: { type: String, required: true },
    sourceFromTokenName: { type: String, required: true },
    sourceFromTokenContractAddress: { type: String, required: true },
    sourceFromAmount: { type: String, required: true },
    sourceFromHandingFee: { type: String, required: false },
    sourceFromRealAmount: { type: String, required: true },
    sourceFromTxHash: { type: String, required: true },
    sourceFromTxStatus: {
      type: String,
      enum: ['pending', 'failed', 'success'],
      default: 'pending',
    },

    targetChainId: { type: Number, required: true },
    targetChain: { type: String, required: true },
    targetRpc: { type: String, required: true },
    targetToAddress: { type: String, required: true },
    targetToTokenName: { type: String, required: true },
    targetToTokenContractAddress: { type: String, required: false },
    targetToReceiveAmount: { type: String, required: true },
    targetToCallContractAddress: { type: String, required: false },
    targetToGasStatus: { type: String, required: false},
    targetToTxHash: { type: String, required: false },
    targetToTxStatus: {
      type: String,
      enum: ['pending', 'failed', 'success'],
      default: 'pending',
    },

    crossBridgeStatus: {
      type: String,
      enum: ['pending', 'failed', 'minted'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICrossBridgeRecord>(
  'CrossBridgeRecord',
  CrossBridgeRecordSchema
);
