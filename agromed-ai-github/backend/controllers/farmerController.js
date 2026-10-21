import { db } from '../utils/db.js';

export async function getFarmerProfile(req, res) {
  try {
    let profile = await db.farmerProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: true,
        workProfile: true
      }
    });

    // If profile doesn't exist yet, auto-create
    if (!profile) {
      profile = await db.farmerProfile.create({
        data: {
          userId: req.user.id,
          profileCompleted: false
        }
      });
      profile.user = req.user;
    }

    // Calculate profile completion percentage
    let completedSteps = 0;
    const totalSteps = 6;
    if (profile.age) completedSteps++;
    if (profile.gender) completedSteps++;
    if (profile.village) completedSteps++;
    if (profile.district) completedSteps++;
    if (profile.state) completedSteps++;
    if (profile.yearsOfFarming !== null && profile.yearsOfFarming !== undefined) completedSteps++;

    const personalPercent = Math.round((completedSteps / totalSteps) * 100);

    const hasWorkProfile = Boolean(profile.workProfile && profile.workProfile.cropName);
    const overallCompletionPercent = Math.round((personalPercent * 0.5) + (hasWorkProfile ? 50 : 0));

    res.json({
      success: true,
      profile: {
        ...profile,
        personalPercent,
        overallCompletionPercent,
        hasWorkProfile
      }
    });
  } catch (err) {
    console.error('Get farmer profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve farmer profile.' });
  }
}

export async function updateFarmerProfile(req, res) {
  try {
    const { name, phone, age, gender, village, district, state, yearsOfFarming } = req.body;

    // Update user table for name and phone if provided
    if (name || phone) {
      await db.user.update({
        where: { id: req.user.id },
        data: {
          name: name ? name.trim() : req.user.name,
          phone: phone ? phone.trim() : req.user.phone
        }
      });
    }

    const ageNum = age ? parseInt(age, 10) : null;
    const expNum = yearsOfFarming !== undefined && yearsOfFarming !== '' ? parseInt(yearsOfFarming, 10) : null;

    const isCompleted = Boolean(ageNum && gender && village && district && state && expNum !== null);

    const updatedProfile = await db.farmerProfile.upsert({
      where: { userId: req.user.id },
      update: {
        age: ageNum,
        gender: gender || null,
        village: village ? village.trim() : null,
        district: district ? district.trim() : null,
        state: state ? state.trim() : null,
        yearsOfFarming: expNum,
        profileCompleted: isCompleted
      },
      create: {
        userId: req.user.id,
        age: ageNum,
        gender: gender || null,
        village: village ? village.trim() : null,
        district: district ? district.trim() : null,
        state: state ? state.trim() : null,
        yearsOfFarming: expNum,
        profileCompleted: isCompleted
      }
    });

    res.json({
      success: true,
      message: 'Farmer profile updated successfully.',
      profile: updatedProfile
    });
  } catch (err) {
    console.error('Update farmer profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to update farmer profile.' });
  }
}
