import { News } from '../models/News.js';
import { newsArticlesData } from '../data/seedData.js';
import { isMongoConnected } from '../config/db.js';

export const getNews = async (req, res, next) => {
  try {
    const { category } = req.query;

    if (isMongoConnected) {
      let query = {};
      if (category && category !== 'all') {
        query.category = new RegExp(category, 'i');
      }

      const dbNews = await News.find(query).sort({ createdAt: -1 });
      if (dbNews && dbNews.length > 0) {
        return res.status(200).json({
          success: true,
          count: dbNews.length,
          source: 'mongodb',
          data: dbNews
        });
      }
    }

    let filtered = [...newsArticlesData];
    if (category && category !== 'all') {
      filtered = filtered.filter((n) =>
        n.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      source: 'verified_dataset',
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};
