import mongoose from 'mongoose';

const ReviewVideoSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.ReviewVideo || mongoose.model('ReviewVideo', ReviewVideoSchema);
