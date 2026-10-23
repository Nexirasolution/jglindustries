import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Tiles', 'Interlock'], default: 'Tiles' },
  size: String,          // e.g. "600 x 600 mm" or "2x2 ft, 2x4 ft"
  color: String,         // e.g. "Ivory, Grey, Beige"
  description: String,
  images: [{ url: String, publicId: String }],
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);