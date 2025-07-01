import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  person: {
    name: string;
    age: string;
  };
}

const testSchema: Schema = new Schema({
  person: {
    name: { type: Schema.Types.Mixed, required: true },
    age: { type: String, required: true },
  }
});

export default mongoose.model<IUser>('test', testSchema,'test');
