import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

import { UserEntity, UserRole } from '@/core/user/entity/user';

export type UserDocument = Document & UserEntity;

@Schema({
  collection: 'user-collection',
  autoIndex: true,
  timestamps: true
})
export class User {
  @Prop({ type: String })
  _id: string;

  @Prop({ type: String, min: 0, max: 200, required: true })
  login: string;

  @Prop({ type: String, min: 0, max: 200, required: true })
  password: string;

  @Prop({ type: Array, enum: UserRole, required: true })
  roles: UserRole[];

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: Boolean, default: null })
  deleted: boolean;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  createdBy: string;

  @Prop({ type: String, default: null })
  updatedBy: string;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  @Prop({ type: String, default: null })
  deletedBy: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ login: 1 }, { unique: true, partialFilterExpression: { deletedAt: { $eq: null } } });

UserSchema.plugin(paginate);

UserSchema.virtual('id').get(function () {
  return this._id;
});

export { UserSchema };
