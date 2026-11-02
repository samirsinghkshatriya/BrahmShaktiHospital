import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    readTime: { type: String },
    author: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);

export const News = mongoose.model('News', newsSchema);
