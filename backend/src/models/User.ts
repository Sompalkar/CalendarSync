import mongoose, { type Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash?: string; // for local users
  name: string;
  picture?: string;
  isGoogleConnected: boolean;
  googleId?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  syncToken?: string;
  webhookChannelId?: string;
  webhookResourceId?: string;
  webhookExpiration?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    isGoogleConnected: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      required: false,
      unique: false,
    },
    accessToken: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    tokenExpiry: {
      type: Date,
      required: false,
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
