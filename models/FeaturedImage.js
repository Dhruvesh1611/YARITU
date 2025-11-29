import mongoose from 'mongoose';

const FeaturedImageSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.FeaturedImage || mongoose.model('FeaturedImage', FeaturedImageSchema);
