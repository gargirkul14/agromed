import { db } from '../utils/db.js';
import { generatePersonalizedRecommendations } from '../services/recommendationEngine.js';

export async function getRecommendations(req, res) {
  try {
    const farmerProfile = await db.farmerProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!farmerProfile) {
      // Fallback default general recommendations
      const defaultRecs = generatePersonalizedRecommendations({}, null);
      return res.json({ success: true, recommendations: defaultRecs });
    }

    const workProfile = await db.workProfile.findUnique({
      where: { farmerId: farmerProfile.id }
    });

    const latestAssessment = await db.healthAssessment.findFirst({
      where: { farmerId: farmerProfile.id },
      orderBy: { createdAt: 'desc' }
    });

    const recommendations = generatePersonalizedRecommendations(workProfile, latestAssessment);

    res.json({
      success: true,
      recommendations,
      hasWorkProfile: Boolean(workProfile),
      hasRecentAssessment: Boolean(latestAssessment),
      latestRiskLevel: latestAssessment?.riskLevel || null
    });
  } catch (err) {
    console.error('Get recommendations error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate recommendations.' });
  }
}
