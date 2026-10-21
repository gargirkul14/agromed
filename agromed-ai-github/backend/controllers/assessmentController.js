import { db } from '../utils/db.js';
import { calculateRiskAssessment } from '../services/riskEngine.js';

export async function submitAssessment(req, res) {
  try {
    const {
      chemicalUsed,
      exposureDuration,
      activityType,
      symptoms = [],
      ppeUsed = []
    } = req.body;

    // Validation
    if (!exposureDuration) {
      return res.status(400).json({ success: false, message: 'Exposure duration is required.' });
    }

    if (!activityType) {
      return res.status(400).json({ success: false, message: 'Farming activity type is required.' });
    }

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one symptom (or select "No Symptoms").' });
    }

    if (!Array.isArray(ppeUsed) || ppeUsed.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select your PPE usage (or select "None").' });
    }

    // Get farmer profile
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

    // Run Rule-Based Risk Engine
    const riskResult = calculateRiskAssessment({
      chemicalUsed,
      exposureDuration,
      activityType,
      symptoms,
      ppeUsed
    });

    // Save to Database
    const assessment = await db.healthAssessment.create({
      data: {
        farmerId: farmerProfile.id,
        chemicalUsed: chemicalUsed ? chemicalUsed.trim() : null,
        exposureDuration,
        activityType,
        symptoms: JSON.stringify(symptoms),
        ppeUsed: JSON.stringify(ppeUsed),
        riskLevel: riskResult.riskLevel,
        safetyScore: riskResult.safetyScore,
        recommendations: JSON.stringify(riskResult.recommendations)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Health & safety assessment submitted successfully.',
      assessment: {
        ...assessment,
        symptoms,
        ppeUsed,
        identifiedRiskFactors: riskResult.identifiedRiskFactors,
        immediatePrecautions: riskResult.immediatePrecautions,
        recommendations: riskResult.recommendations,
        warningMessage: riskResult.warningMessage,
        disclaimer: riskResult.disclaimer
      }
    });
  } catch (err) {
    console.error('Submit assessment error:', err);
    res.status(500).json({ success: false, message: 'Failed to process health assessment.' });
  }
}

export async function getFarmerAssessments(req, res) {
  try {
    const farmerProfile = await db.farmerProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!farmerProfile) {
      return res.json({ success: true, assessments: [] });
    }

    const assessments = await db.healthAssessment.findMany({
      where: { farmerId: farmerProfile.id },
      orderBy: { createdAt: 'desc' }
    });

    // Parse JSON fields
    const parsedAssessments = assessments.map(a => ({
      ...a,
      symptoms: typeof a.symptoms === 'string' ? JSON.parse(a.symptoms || '[]') : a.symptoms,
      ppeUsed: typeof a.ppeUsed === 'string' ? JSON.parse(a.ppeUsed || '[]') : a.ppeUsed,
      recommendations: typeof a.recommendations === 'string' ? JSON.parse(a.recommendations || '[]') : a.recommendations
    }));

    res.json({
      success: true,
      assessments: parsedAssessments
    });
  } catch (err) {
    console.error('Get farmer assessments error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve assessment history.' });
  }
}

export async function getAssessmentById(req, res) {
  try {
    const { id } = req.params;
    const assessment = await db.healthAssessment.findUnique({
      where: { id }
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment record not found.' });
    }

    const symptoms = typeof assessment.symptoms === 'string' ? JSON.parse(assessment.symptoms || '[]') : assessment.symptoms;
    const ppeUsed = typeof assessment.ppeUsed === 'string' ? JSON.parse(assessment.ppeUsed || '[]') : assessment.ppeUsed;

    // Recalculate full engine result for detailed view
    const riskEngineDetails = calculateRiskAssessment({
      chemicalUsed: assessment.chemicalUsed,
      exposureDuration: assessment.exposureDuration,
      activityType: assessment.activityType,
      symptoms,
      ppeUsed
    });

    res.json({
      success: true,
      assessment: {
        ...assessment,
        symptoms,
        ppeUsed,
        identifiedRiskFactors: riskEngineDetails.identifiedRiskFactors,
        immediatePrecautions: riskEngineDetails.immediatePrecautions,
        recommendations: riskEngineDetails.recommendations,
        warningMessage: riskEngineDetails.warningMessage,
        disclaimer: riskEngineDetails.disclaimer
      }
    });
  } catch (err) {
    console.error('Get assessment by id error:', err);
    res.status(500).json({ success: false, message: 'Failed to load assessment record.' });
  }
}
