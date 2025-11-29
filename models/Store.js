import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this store.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  address: {
    type: String,
    required: [true, 'Please provide an address for this store.'],
  },
  imageUrl: {
    type: String,
    required: false, // make optional; use images[] moving forward
  },
  images: {
    type: [String],
    default: [],
  },
  mapQuery: {
    type: String,
  },
  phone: {
    type: String,
    required: false,
  },
});

export default mongoose.models.Store || mongoose.model('Store', StoreSchema);