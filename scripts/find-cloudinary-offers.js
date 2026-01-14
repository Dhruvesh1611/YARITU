// scripts/find-cloudinary-offers.js
// Usage: MONGODB_URI="..." node scripts/find-cloudinary-offers.js

const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Missing MONGODB_URI environment variable.');
  process.exit(1);
}

const OfferContentSchema = new mongoose.Schema({ image: String }, { collection: 'offercontents', strict: false });
const OfferContent = mongoose.model('OfferContent', OfferContentSchema);

(async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const docs = await OfferContent.find({ image: /res\.cloudinary\.com/i }).lean();
    if (!docs || docs.length === 0) {
      console.log('No offer documents with Cloudinary URLs found.');
      process.exit(0);
    }

    console.log(`Found ${docs.length} document(s) with Cloudinary URLs:`);
    docs.forEach((d) => {
      console.log('- id:', d._id || d.id, 'image:', d.image);
    });

    console.log('\nIf you want to replace these URLs, export the list and re-upload images to S3, then update the documents via your admin UI or a script.');
    process.exit(0);
  } catch (err) {
    console.error('Error scanning DB:', err);
    process.exit(2);
  }
})();
