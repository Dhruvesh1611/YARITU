import mongoose from 'mongoose';

const StayClassyImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  category: { type: String, default: '' },
  collectionName: { type: String, default: '' },
  // slot corresponds to the position in the static grid (0-based index)
  slot: { type: Number, default: null },
}, { timestamps: true });

export default mongoose.models.StayClassyImage || mongoose.model('StayClassyImage', StayClassyImageSchema);
