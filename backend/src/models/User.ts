import mongoose, { type Document, Schema } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiry: Date;
  syncToken?: string;
  webhookChannelId?: string;
  webhookResourceId?: string;
  webhookExpiration?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    tokenExpiry: {
      type: Date,
      required: true,
    },
    syncToken: {
      type: String,
    },
    webhookChannelId: {
      type: String,
    },
    webhookResourceId: {
      type: String,
    },
    webhookExpiration: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);
