import mongoose, { type Document, Schema } from "mongoose"

export interface IEvent extends Document {
  googleEventId: string
  userId: string
  title: string
  description?: string
  start: Date
  end: Date
  location?: string
  attendees?: string[]
  calendarId: string
  status: "confirmed" | "tentative" | "cancelled"
  isDeleted: boolean
  lastModified: Date
  createdAt: Date
  updatedAt: Date
}

const eventSchema = new Schema<IEvent>(
  {
    googleEventId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
    },
    attendees: [
      {
        type: String,
      },
    ],
    calendarId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "tentative", "cancelled"],
      default: "confirmed",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    lastModified: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index for efficient queries
eventSchema.index({ userId: 1, googleEventId: 1 }, { unique: true })
eventSchema.index({ userId: 1, start: 1 })

export default mongoose.model<IEvent>("Event", eventSchema)
