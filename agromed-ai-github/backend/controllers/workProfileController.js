import { db } from '../utils/db.js';

export async function getWorkProfile(req, res) {
  try {
    const farmerProfile = await db.farmerProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!farmerProfile) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    const workProfile = await db.workProfile.findUnique({
      where: { farmerId: farmerProfile.id }
    });

    res.json({
      success: true,
      workProfile: workProfile || null
    });
  } catch (err) {
    console.error('Get work profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve work profile.' });
  }
}

export async function saveWorkProfile(req, res) {
  try {
    const {
      cropName,
      farmingType,
      farmSize,
      averageWorkingHours,
      daysWorkedPerWeek,
      usesPesticides,
      usesFertilizers,
      commonPesticides,
      commonFertilizers,
      ppeUsed
    } = req.body;

    let farmerProfile = await db.farmerProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!farmerProfile) {
      farmerProfile = await db.farmerProfile.create({
        data: {
          userId: req.user.id,
          profileCompleted: false
        }
      });
    }

    const workData = {
      cropName: cropName ? cropName.trim() : null,
      farmingType: farmingType ? farmingType.trim() : null,
      farmSize: farmSize ? farmSize.trim() : null,
      averageWorkingHours: averageWorkingHours ? parseFloat(averageWorkingHours) : null,
      daysWorkedPerWeek: daysWorkedPerWeek ? parseInt(daysWorkedPerWeek, 10) : null,
      usesPesticides: Boolean(usesPesticides),
      usesFertilizers: Boolean(usesFertilizers),
      commonPesticides: Array.isArray(commonPesticides) ? JSON.stringify(commonPesticides) : (commonPesticides || '[]'),
      commonFertilizers: Array.isArray(commonFertilizers) ? JSON.stringify(commonFertilizers) : (commonFertilizers || '[]'),
      ppeUsed: Array.isArray(ppeUsed) ? JSON.stringify(ppeUsed) : (ppeUsed || '[]')
    };

    const savedWorkProfile = await db.workProfile.upsert({
      where: { farmerId: farmerProfile.id },
      update: workData,
      create: {
        farmerId: farmerProfile.id,
        ...workData
      }
    });

    res.json({
      success: true,
      message: 'Work profile saved successfully.',
      workProfile: savedWorkProfile
    });
  } catch (err) {
    console.error('Save work profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to save work profile.' });
  }
}
