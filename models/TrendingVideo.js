import mongoose from 'mongoose';

const TrendingVideoSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    videoUrl: { type: String, required: true },
    position: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.models.TrendingVideo || mongoose.model('TrendingVideo', TrendingVideoSchema);
