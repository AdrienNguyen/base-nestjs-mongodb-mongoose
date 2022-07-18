import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ActivationCode } from '@activation-codes/schemas';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  username: String;

  @Prop({ required: true })
  email: String;

  @Prop()
  password: String;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ActivationCode' })
  activationCode: ActivationCode;
}

export const UserSchema = SchemaFactory.createForClass(User);
