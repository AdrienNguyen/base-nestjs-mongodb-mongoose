import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

const {
  Types: { ObjectId },
} = mongoose.Schema;

export type UserOtpDocument = UserOtp & Document;

@Schema({
  timestamps: true,
})
export class UserOtp {
  @Prop({
    type: ObjectId,
    ref: 'User',
    required: false,
    unique: true,
    sparse: true,
  })
  userId?: string;

  @Prop({ required: false })
  email?: string;

  @Prop({ required: true, length: 6 })
  otp: string;

  @Prop({ required: true })
  expiredTime: Date;
}

export const UserOtpSchema = SchemaFactory.createForClass(UserOtp);
