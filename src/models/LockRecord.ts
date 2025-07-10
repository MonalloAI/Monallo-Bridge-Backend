import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fromAddress: string;
  toAddress: string;
  amount: string;
  sourceFromTxHash: string;
  fee?: string;
  status: 'pending' | 'processed';
  timestamp: Date;
}

const lockSchema: Schema = new Schema({
  fromAddress: { type: String, required: true },
  toAddress: { type: String, required: true },
  amount: { type: String, required: true },
  sourceFromTxHash: { type: String, required: true },
  fee: { type: String, required: false }, 
  status: { type: String, enum: ['pending', 'processed'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('lock', lockSchema);
