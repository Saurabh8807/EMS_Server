import mongoose from 'mongoose'
const { Schema } = mongoose

const wishSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
    maxLength: 255,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const birthDaySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  month: {
    type: Number,
    min: 1,
    max: 12,
    required: true,
  },
  day: {
    type: Number,
    min: 1,
    max: 31,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  wishes: [wishSchema],
});

const Birthday = mongoose.model("Birthday", birthDaySchema);

export default Birthday;