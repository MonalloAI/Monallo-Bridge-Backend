import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fromAddress: string;
  toAddress: string;
  amount: string;
  txHash: string;
  status: string;
  timestamp: Date;
}

const lockSchema: Schema = new Schema({
  fromAddress: { type: String, required: true },
  toAddress : { type: String, required: true },
  amount: { type: String, required: true },
  txHash: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processed'], default: 'pending'}, 
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('lock', lockSchema);
