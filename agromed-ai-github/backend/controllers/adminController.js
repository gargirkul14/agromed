import { db } from '../utils/db.js';

export async function getAdminDashboardStats(req, res) {
  try {
    const totalFarmers = await db.user.count({ where: { role: 'FARMER' } });
    const totalAssessments = await db.healthAssessment.count();
    const highRiskAssessments = await db.healthAssessment.count({ where: { riskLevel: 'HIGH' } });
    const totalArticles = await db.safetyArticle.count();
    const totalChemicals = await db.chemicalSafety.count();

    const allAssessments = await db.healthAssessment.findMany({
      select: { safetyScore: true }
    });

    const averageSafetyScore = allAssessments.length > 0
      ? Math.round(allAssessments.reduce((acc, curr) => acc + curr.safetyScore, 0) / allAssessments.length)
      : 80;

    const recentAssessments = await db.healthAssessment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        farmer: {
          include: {
            user: {
              select: { name: true, email: true, phone: true }
            }
          }
        }
      }
    });

    const parsedRecent = recentAssessments.map(a => ({
      ...a,
      symptoms: typeof a.symptoms === 'string' ? JSON.parse(a.symptoms || '[]') : a.symptoms,
      ppeUsed: typeof a.ppeUsed === 'string' ? JSON.parse(a.ppeUsed || '[]') : a.ppeUsed
    }));

    res.json({
      success: true,
      stats: {
        totalFarmers,
        totalAssessments,
        highRiskAssessments,
        averageSafetyScore,
        totalArticles,
        totalChemicals
      },
      recentAssessments: parsedRecent
    });
  } catch (err) {
    console.error('Admin dashboard stats error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve admin stats.' });
  }
}

export async function getAllFarmers(req, res) {
  try {
    const { search } = req.query;

    const farmers = await db.user.findMany({
      where: { role: 'FARMER' },
      include: {
        farmerProfile: {
          include: {
            workProfile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    let safeFarmers = farmers.map(({ password, ...farmer }) => {
      const work = farmer.farmerProfile?.workProfile;
      return {
        ...farmer,
        farmerProfile: farmer.farmerProfile ? {
          ...farmer.farmerProfile,
          workProfile: work ? {
            ...work,
            commonPesticides: typeof work.commonPesticides === 'string' ? JSON.parse(work.commonPesticides || '[]') : work.commonPesticides,
            commonFertilizers: typeof work.commonFertilizers === 'string' ? JSON.parse(work.commonFertilizers || '[]') : work.commonFertilizers,
            ppeUsed: typeof work.ppeUsed === 'string' ? JSON.parse(work.ppeUsed || '[]') : work.ppeUsed
          } : null
        } : null
      };
    });

    if (search && search.trim().length > 0) {
      const q = search.toLowerCase().trim();
      safeFarmers = safeFarmers.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        (f.phone && f.phone.includes(q)) ||
        (f.farmerProfile?.village && f.farmerProfile.village.toLowerCase().includes(q)) ||
        (f.farmerProfile?.district && f.farmerProfile.district.toLowerCase().includes(q)) ||
        (f.farmerProfile?.state && f.farmerProfile.state.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      farmers: safeFarmers
    });
  } catch (err) {
    console.error('Get all farmers error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve farmers.' });
  }
}

export async function getAllAssessments(req, res) {
  try {
    const { riskLevel } = req.query;

    let whereClause = {};
    if (riskLevel && riskLevel !== 'ALL') {
      whereClause.riskLevel = riskLevel.toUpperCase();
    }

    const assessments = await db.healthAssessment.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        farmer: {
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true }
            }
          }
        }
      }
    });

    const parsed = assessments.map(a => ({
      ...a,
      symptoms: typeof a.symptoms === 'string' ? JSON.parse(a.symptoms || '[]') : a.symptoms,
      ppeUsed: typeof a.ppeUsed === 'string' ? JSON.parse(a.ppeUsed || '[]') : a.ppeUsed,
      recommendations: typeof a.recommendations === 'string' ? JSON.parse(a.recommendations || '[]') : a.recommendations
    }));

    res.json({
      success: true,
      assessments: parsed
    });
  } catch (err) {
    console.error('Get all assessments error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve assessments.' });
  }
}

// Article Management
export async function createArticle(req, res) {
  try {
    const { title, category, content } = req.body;
    if (!title || !category || !content) {
      return res.status(400).json({ success: false, message: 'Title, category, and content are required.' });
    }

    const newArticle = await db.safetyArticle.create({
      data: {
        title: title.trim(),
        category: category.trim(),
        content: content.trim()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Article published successfully.',
      article: newArticle
    });
  } catch (err) {
    console.error('Create article error:', err);
    res.status(500).json({ success: false, message: 'Failed to create article.' });
  }
}

export async function updateArticle(req, res) {
  try {
    const { id } = req.params;
    const { title, category, content } = req.body;

    const updated = await db.safetyArticle.update({
      where: { id },
      data: {
        title: title ? title.trim() : undefined,
        category: category ? category.trim() : undefined,
        content: content ? content.trim() : undefined
      }
    });

    res.json({
      success: true,
      message: 'Article updated successfully.',
      article: updated
    });
  } catch (err) {
    console.error('Update article error:', err);
    res.status(500).json({ success: false, message: 'Failed to update article.' });
  }
}

export async function deleteArticle(req, res) {
  try {
    const { id } = req.params;
    await db.safetyArticle.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Article deleted successfully.'
    });
  } catch (err) {
    console.error('Delete article error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete article.' });
  }
}

// Chemical Safety Management
export async function createChemical(req, res) {
  try {
    const { chemicalName, precautions, recommendedPPE } = req.body;
    if (!chemicalName || !precautions) {
      return res.status(400).json({ success: false, message: 'Chemical name and precautions are required.' });
    }

    const ppeString = Array.isArray(recommendedPPE)
      ? JSON.stringify(recommendedPPE)
      : (typeof recommendedPPE === 'string' ? recommendedPPE : '[]');

    const chemical = await db.chemicalSafety.create({
      data: {
        chemicalName: chemicalName.trim(),
        precautions: precautions.trim(),
        recommendedPPE: ppeString
      }
    });

    res.status(201).json({
      success: true,
      message: 'Chemical safety record added successfully.',
      chemical
    });
  } catch (err) {
    console.error('Create chemical error:', err);
    res.status(500).json({ success: false, message: 'Failed to add chemical record.' });
  }
}

export async function updateChemical(req, res) {
  try {
    const { id } = req.params;
    const { chemicalName, precautions, recommendedPPE } = req.body;

    const ppeString = recommendedPPE
      ? (Array.isArray(recommendedPPE) ? JSON.stringify(recommendedPPE) : recommendedPPE)
      : undefined;

    const updated = await db.chemicalSafety.update({
      where: { id },
      data: {
        chemicalName: chemicalName ? chemicalName.trim() : undefined,
        precautions: precautions ? precautions.trim() : undefined,
        recommendedPPE: ppeString
      }
    });

    res.json({
      success: true,
      message: 'Chemical safety record updated successfully.',
      chemical: updated
    });
  } catch (err) {
    console.error('Update chemical error:', err);
    res.status(500).json({ success: false, message: 'Failed to update chemical record.' });
  }
}

export async function deleteChemical(req, res) {
  try {
    const { id } = req.params;
    await db.chemicalSafety.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Chemical safety record removed.'
    });
  } catch (err) {
    console.error('Delete chemical error:', err);
    res.status(500).json({ success: false, message: 'Failed to remove chemical.' });
  }
}
