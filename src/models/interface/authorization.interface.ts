import { Document } from "mongoose";

export interface IAuthorization extends Document {
  chainId: string; 
  chainName: string;
  amount: string;
  address: string;
  contractAddress: string;
  createdAt: Date; 
  updatedAt: Date;
}