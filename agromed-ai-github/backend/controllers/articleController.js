import { db } from '../utils/db.js';

export async function getArticles(req, res) {
  try {
    const { category, search } = req.query;

    let whereClause = {};
    if (category && category !== 'All') {
      whereClause.category = category;
    }

    if (search && search.trim().length > 0) {
      whereClause.OR = [
        { title: { contains: search.trim() } },
        { content: { contains: search.trim() } }
      ];
    }

    const articles = await db.safetyArticle.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      articles
    });
  } catch (err) {
    console.error('Get articles error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve articles.' });
  }
}

export async function getArticleById(req, res) {
  try {
    const { id } = req.params;
    const article = await db.safetyArticle.findUnique({
      where: { id }
    });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Safety article not found.' });
    }

    res.json({
      success: true,
      article
    });
  } catch (err) {
    console.error('Get article by id error:', err);
    res.status(500).json({ success: false, message: 'Failed to load safety article.' });
  }
}
