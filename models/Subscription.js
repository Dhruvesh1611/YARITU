import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
