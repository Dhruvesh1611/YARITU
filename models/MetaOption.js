import mongoose from 'mongoose';

const MetaOptionSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g. 'occasion_men', 'collectionType_women'
  value: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

MetaOptionSchema.index({ key: 1, value: 1 }, { unique: true });

export default mongoose.models.MetaOption || mongoose.model('MetaOption', MetaOptionSchema);
