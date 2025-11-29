import mongoose from 'mongoose';

const CelebrityVideoSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  videoUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
  visibility: { type: String, enum: ['both', 'desktop', 'mobile'], default: 'both' },
}, { timestamps: true });

export default mongoose.models.CelebrityVideo || mongoose.model('CelebrityVideo', CelebrityVideoSchema);
