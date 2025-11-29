import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address.',
    ],
  },
  phone: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
