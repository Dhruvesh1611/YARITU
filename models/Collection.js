import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  productId: { type: String, unique: true, required: true },
  category: { type: String, enum: ['Men','Women','Children'], required: true },
  // Allow multiple occasions (array of strings). Previously this was a String
  // which caused errors when the frontend sent multiple selections.
  occasion: { type: [String] },
  collectionType: { type: String },
  childCategory: { type: String },
  mainImage: { type: String, required: true },
  mainImage2: { type: String },
  otherImages: { type: [String], default: [] },
  price: { type: Number },
  mrp: { type: Number },
  discountedPrice: { type: Number },
  status: { type: String, enum: ['Available','Out of Stock','Available for Rent'], default: 'Available' },
  isFeatured: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Normalize certain fields before validation so incoming uppercase values
// (e.g. 'CHILDREN') match the enum values ('Children'). This keeps the
// frontend free to send UPPERCASE constants while keeping the DB schema tidy.
function toTitleCase(val) {
  if (!val || typeof val !== 'string') return val;
  return val
    .toLowerCase()
    .split(' ')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

CollectionSchema.pre('validate', function (next) {
  if (this.category) this.category = toTitleCase(this.category.trim());
  // Normalize occasion: support both string and array inputs. Convert all values
  // to title case and trim whitespace.
  if (this.occasion) {
    if (Array.isArray(this.occasion)) {
      this.occasion = this.occasion
        .map(v => (v && typeof v === 'string' ? toTitleCase(v.trim()) : v))
        .filter(Boolean);
    } else if (typeof this.occasion === 'string') {
      this.occasion = toTitleCase(this.occasion.trim());
    }
  }
  if (this.collectionType) this.collectionType = toTitleCase(this.collectionType.trim());
  if (this.childCategory) this.childCategory = toTitleCase(this.childCategory.trim());
  if (this.productId && typeof this.productId === 'string') this.productId = this.productId.trim();
  next();
});

export default mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);
