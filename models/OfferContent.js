import mongoose from 'mongoose';

const OfferContentSchema = new mongoose.Schema({
  heading: { type: String, default: '' },
  subheading: { type: String, default: '' },
  discount: { type: String, default: '' },
  validity: { type: String, default: '' },
  image: { type: String, default: '' },
  store: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.OfferContent || mongoose.model('OfferContent', OfferContentSchema);
