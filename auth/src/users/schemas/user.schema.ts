import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../../../libs/common/enums/role.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  nickName: string;

  @Prop({ required: true })
  password: string;

  // 🔥 여기 명확하게 `type: String`, `enum` 명시
  @Prop({
    type: String,
    enum: Object.values(Role),
    default: Role.USER,
  })
  role: Role;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ type: Date })
  lastLoginAt: Date;

  @Prop({ default: 0 })
  loginCount: number;

  @Prop()
  invitedBy?: string;

  @Prop({ default: 0 })
  loginDays: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
