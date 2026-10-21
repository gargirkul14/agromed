import { db } from '../utils/db.js';
import { getPPEComparison, ACTIVITY_PPE_MATRIX } from '../services/ppeService.js';

export async function getPPERecommendations(req, res) {
  try {
    const activity = req.query.activity || 'Pesticide Spraying';

    let currentPPE = [];

    // If authenticated farmer, look up their registered PPE
    if (req.user && req.user.role === 'FARMER') {
      const farmerProfile = await db.farmerProfile.findUnique({
        where: { userId: req.user.id }
      });

      if (farmerProfile) {
        const workProfile = await db.workProfile.findUnique({
          where: { farmerId: farmerProfile.id }
        });

        if (workProfile?.ppeUsed) {
          if (Array.isArray(workProfile.ppeUsed)) {
            currentPPE = workProfile.ppeUsed;
          } else if (typeof workProfile.ppeUsed === 'string') {
            try {
              currentPPE = JSON.parse(workProfile.ppeUsed);
            } catch {
              currentPPE = workProfile.ppeUsed.split(',').map(s => s.trim());
            }
          }
        }
      }
    }

    const comparisonData = getPPEComparison(activity, currentPPE);

    res.json({
      success: true,
      data: {
        ...comparisonData,
        userRegisteredPPE: currentPPE,
        availableActivities: Object.keys(ACTIVITY_PPE_MATRIX)
      }
    });
  } catch (err) {
    console.error('PPE recommendations error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve PPE recommendations.' });
  }
}
