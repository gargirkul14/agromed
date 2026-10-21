/**
 * AgroMed AI - Rule-Based Health & Safety Risk Engine
 * 
 * Simple, transparent formula:
 * Safety Score = 100 - DurationPenalty - ActivityPenalty - SymptomPenalty - PPEPenalty
 * Cap: 0 to 100
 */

export function calculateRiskAssessment({
  chemicalUsed = '',
  exposureDuration = '1–3 hours',
  activityType = 'General Farm Work',
  symptoms = [],
  ppeUsed = []
}) {
  const symptomList = Array.isArray(symptoms) ? symptoms : [];
  const ppeList = Array.isArray(ppeUsed) ? ppeUsed : [];

  let score = 100;
  const identifiedRiskFactors = [];
  const immediatePrecautions = [];
  const recommendations = [];

  // 1. Exposure Duration Penalty
  if (exposureDuration === 'More than 5 hours') {
    score -= 25;
    identifiedRiskFactors.push('Prolonged exposure duration (>5 continuous hours).');
    immediatePrecautions.push('Stop farming activity immediately and step away from the field.');
  } else if (exposureDuration === '3–5 hours') {
    score -= 15;
    identifiedRiskFactors.push('Elevated exposure duration (3 to 5 hours).');
  } else if (exposureDuration === '1–3 hours') {
    score -= 8;
  } else {
    score -= 2;
  }

  // 2. Activity Type Penalty
  const highHazardActivities = ['Pesticide Spraying', 'Chemical Mixing'];
  if (highHazardActivities.includes(activityType)) {
    score -= 15;
    identifiedRiskFactors.push(`High hazard operation: ${activityType} carries elevated aerosol and dermal absorption risk.`);
  } else if (activityType === 'Fertilizer Application') {
    score -= 8;
    identifiedRiskFactors.push('Chemical handling: Granular fertilizer contact risk.');
  }

  // 3. Symptoms Deduction
  let hasCriticalRespiratorySymptom = false;
  if (!symptomList.includes('No Symptoms') && symptomList.length > 0) {
    symptomList.forEach((sym) => {
      if (sym === 'Breathing Difficulty') {
        hasCriticalRespiratorySymptom = true;
        score -= 40;
        identifiedRiskFactors.push('CRITICAL: Acute respiratory distress / difficulty breathing.');
        immediatePrecautions.push('Sit upright in fresh air, loosen tight clothing, and call emergency medical care.');
      } else if (sym === 'Dizziness') {
        score -= 20;
        identifiedRiskFactors.push('Neurological symptom: Dizziness indicates potential chemical fume inhalation.');
        immediatePrecautions.push('Rest in shaded ventilation; avoid operating machinery or driving.');
      } else if (sym === 'Nausea') {
        score -= 18;
        identifiedRiskFactors.push('Systemic exposure: Nausea / gastrointestinal irritation.');
        immediatePrecautions.push('Rinse mouth with clean water. Do NOT force vomiting.');
      } else if (sym === 'Eye Irritation') {
        score -= 18;
        identifiedRiskFactors.push('Ocular exposure: Eye redness or burning.');
        immediatePrecautions.push('Flush open eyes with clean, cool running water for 15 minutes.');
      } else if (sym === 'Skin Irritation') {
        score -= 15;
        identifiedRiskFactors.push('Dermal exposure: Skin itching, rash, or irritation.');
        immediatePrecautions.push('Remove contaminated clothes and wash skin with mild soap and water.');
      } else {
        score -= 10;
        identifiedRiskFactors.push(`Reported discomfort: ${sym}.`);
      }
    });
  }

  // 4. PPE Usage Factor
  const hasNoPPE = ppeList.includes('None') || ppeList.length === 0;
  if (hasNoPPE) {
    score -= 30;
    identifiedRiskFactors.push('No Personal Protective Equipment (PPE) was used.');
    immediatePrecautions.push('Thoroughly wash exposed hands, face, and arms with soap immediately.');
    recommendations.push('Never handle agricultural chemicals without certified PPE.');
  } else {
    if (highHazardActivities.includes(activityType)) {
      if (!ppeList.includes('Mask')) {
        score -= 15;
        identifiedRiskFactors.push('Missing protective respirator mask during spraying/mixing.');
        recommendations.push('Wear an organic vapor/particulate mask to protect lungs.');
      } else {
        score += 5;
      }

      if (!ppeList.includes('Gloves')) {
        score -= 15;
        identifiedRiskFactors.push('Missing chemical-resistant gloves.');
        recommendations.push('Use nitrile or chemical-resistant gloves to prevent skin absorption.');
      } else {
        score += 5;
      }

      if (!ppeList.includes('Safety Goggles') && !ppeList.includes('Goggles')) {
        score -= 10;
        identifiedRiskFactors.push('Missing eye protection goggles.');
      }
    }
  }

  // Cap Score 0 - 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Risk Level Category
  let riskLevel = 'LOW';
  if (hasCriticalRespiratorySymptom || score <= 39) {
    riskLevel = 'HIGH';
    if (score > 39) score = 39;
  } else if (score <= 74 || symptomList.length > 0 || hasNoPPE) {
    riskLevel = 'MEDIUM';
  }

  // Default precautions & recommendations
  if (immediatePrecautions.length === 0) {
    immediatePrecautions.push('Wash hands and face with clean water and mild soap.');
    immediatePrecautions.push('Take a 15-minute rest break in a shaded, well-ventilated area.');
  }

  if (chemicalUsed) {
    recommendations.push(`Keep the product container of "${chemicalUsed}" handy for medical reference if needed.`);
  }
  recommendations.push('Wash work clothes separately from family laundry in warm soapy water.');
  recommendations.push('Drink clean water or electrolyte fluids to maintain hydration.');

  const warningMessage = riskLevel === 'HIGH'
    ? 'CRITICAL ALERT: Your reported symptoms indicate a significant occupational health or chemical exposure risk. Cease activity immediately and consult a doctor or emergency medical service.'
    : null;

  return {
    riskLevel,
    safetyScore: score,
    identifiedRiskFactors,
    immediatePrecautions,
    recommendations,
    warningMessage,
    disclaimer: 'AgroMed AI provides educational health and safety awareness information and is not a medical diagnosis system.'
  };
}
