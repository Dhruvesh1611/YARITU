import mongoose from 'mongoose';

const HeroImageSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  link: { type: String, default: '' },
  order: { type: Number, default: 0 },
  visibility: { type: String, enum: ['both', 'desktop', 'mobile'], default: 'both' },
}, { timestamps: true });

export default mongoose.models.HeroImage || mongoose.model('HeroImage', HeroImageSchema);
