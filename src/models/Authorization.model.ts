import mongoose, { Schema }  from "mongoose";
import { IAuthorization } from './interface/authorization.interface';

const AuthorizationSchema = new Schema<IAuthorization>({
  chainId: { type: String, required: true },
  chainName: { type: String, required: true },
  amount: { type: String, required: true },
  address: { type: String, required: true },
  contractAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
export default mongoose.model<IAuthorization>('Authorization', AuthorizationSchema);