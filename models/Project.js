import mongoose from 'mongoose';
const S = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Tiles', 'Marble', 'Granite', 'Other'], default: 'Tiles' },
  location: String,
  description: String,
  images: [{ url: String, publicId: String }],
}, { timestamps: true });
export default mongoose.models.Project || mongoose.model('Project', S);
