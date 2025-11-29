import mongoose from 'mongoose';

const JewellerySchema = new mongoose.Schema({
	name: { type: String, required: true },
	store: { type: String },
	price: { type: Number },
	discountedPrice: { type: Number },
	status: { type: String, enum: ['Available', 'Out of Stock', 'Coming Soon'], default: 'Available' },
	mainImage: { type: String },
	description: { type: String },
	otherImages: { type: [String], default: [] },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

JewellerySchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

export default mongoose.models.Jewellery || mongoose.model('Jewellery', JewellerySchema);
