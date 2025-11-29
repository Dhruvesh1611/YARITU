import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quote: { type: String, required: true },
  rating: { type: Number, default: 5 },
  avatarUrl: { type: String, default: '' },
  // location: 'home' | 'reviews' - used to separate testimonials shown on different pages
  location: { type: String, default: 'home' },
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
