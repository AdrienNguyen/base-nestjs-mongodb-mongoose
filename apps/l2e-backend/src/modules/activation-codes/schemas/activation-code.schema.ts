import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '@users/schemas';

export type ActivationCodeDocument = ActivationCode & Document;

@Schema()
export class ActivationCode {
  @Prop({ require: true, unique: true })
  code: String;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  owner: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  register: User;
}

export const ActivationCodeSchema =
  SchemaFactory.createForClass(ActivationCode);
