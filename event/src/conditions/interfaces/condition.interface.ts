import { Document } from 'mongoose';

export interface ICondition extends Document {
  readonly _id: any;
  readonly category: string;
  readonly subType: string;
  readonly target: number | string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
