/**
 * AgroMed AI - Personalized Recommendation Engine
 * Synthesizes farmer work profile hazards and health assessment history
 * into actionable, prioritized safety cards across 8 key categories.
 */

export function generatePersonalizedRecommendations(workProfile = {}, latestAssessment = null) {
  const recommendations = [];

  const workingHours = workProfile?.averageWorkingHours || 6;
  const daysWorked = workProfile?.daysWorkedPerWeek || 6;
  const usesPesticides = Boolean(workProfile?.usesPesticides);
  const usesFertilizers = Boolean(workProfile?.usesFertilizers);
  
  // Parse ppeUsed from work profile
  let ppeList = [];
  if (Array.isArray(workProfile?.ppeUsed)) {
    ppeList = workProfile.ppeUsed;
  } else if (typeof workProfile?.ppeUsed === 'string') {
    try {
      ppeList = JSON.parse(workProfile.ppeUsed);
    } catch {
      ppeList = workProfile.ppeUsed.split(',').map(s => s.trim());
    }
  }

  // Parse symptoms from latest assessment
  let symptoms = [];
  if (latestAssessment) {
    if (Array.isArray(latestAssessment.symptoms)) {
      symptoms = latestAssessment.symptoms;
    } else if (typeof latestAssessment.symptoms === 'string') {
      try {
        symptoms = JSON.parse(latestAssessment.symptoms);
      } catch {
        symptoms = latestAssessment.symptoms.split(',').map(s => s.trim());
      }
    }
  }

  // --- 1. Working Hours & Rest Breaks ---
  if (workingHours > 8) {
    recommendations.push({
      id: 'rec-work-hours',
      category: 'Work Duration',
      priority: 'High',
      icon: 'Clock',
      title: 'Limit Continuous Field Labor to Under 8 Hours',
      description: `Your average workday is ${workingHours} hours. Extended shifts significantly increase heat exhaustion and cognitive mistakes during chemical handling. Implement mandatory 15-minute breaks every 90 minutes.`,
      actionableTip: 'Schedule heavy manual spraying during early morning (6:00 AM - 9:00 AM) or late afternoon.'
    });
  } else {
    recommendations.push({
      id: 'rec-rest-general',
      category: 'Rest Breaks',
      priority: 'General',
      icon: 'Coffee',
      title: 'Structured 10-Minute Shade Intervals',
      description: 'Take short periodic rests under trees or covered farm shelters to allow body core temperature to cool down.',
      actionableTip: 'Never skip shade breaks when ambient temperature exceeds 32°C (90°F).'
    });
  }

  if (daysWorked >= 7) {
    recommendations.push({
      id: 'rec-fatigue-7days',
      category: 'Rest Breaks',
      priority: 'High',
      icon: 'Moon',
      title: 'Mandatory Weekly Rest Day',
      description: 'Working 7 days a week causes chronic occupational fatigue, reducing reaction times and increasing exposure vulnerability.',
      actionableTip: 'Dedicate at least one full day weekly away from pesticide handling.'
    });
  }

  // --- 2. Chemical Safety & Spraying Practices ---
  if (usesPesticides) {
    recommendations.push({
      id: 'rec-pesticide-drift',
      category: 'Safe Spraying Practices',
      priority: 'High',
      icon: 'Wind',
      title: 'Monitor Wind Direction Before Spraying',
      description: 'Never spray pesticides against the wind. Always spray walking downwind so the chemical mist drifts away from your body and breathing zone.',
      actionableTip: 'Do not spray during gusty winds (>15 km/h) or extreme mid-day heat.'
    });

    recommendations.push({
      id: 'rec-storage',
      category: 'Safe Chemical Storage',
      priority: 'Medium',
      icon: 'Lock',
      title: 'Secure Chemical Storage Lockbox',
      description: 'Store all concentrated pesticides, herbicides, and empty cans in a locked, ventilated storage box away from children, livestock, and food grains.',
      actionableTip: 'Never store pesticide solutions in discarded drinking water bottles.'
    });
  }

  if (usesFertilizers) {
    recommendations.push({
      id: 'rec-fertilizer-skin',
      category: 'Chemical Safety',
      priority: 'Medium',
      icon: 'Sparkles',
      title: 'Prevent Chemical Skin Burns from Nitrogen Fertilizers',
      description: 'Urea and chemical fertilizers absorb skin moisture and cause painful chemical cracking or contact dermatitis.',
      actionableTip: 'Wash hands with clean water immediately after broadcasting granular fertilizer.'
    });
  }

  // --- 3. PPE Safety Check & Gaps ---
  const hasGloves = ppeList.includes('Gloves') || ppeList.includes('Protective Gloves');
  const hasMask = ppeList.includes('Mask') || ppeList.includes('Respirator');
  const hasGoggles = ppeList.includes('Safety Goggles') || ppeList.includes('Goggles');
  const hasBoots = ppeList.includes('Boots') || ppeList.includes('Safety Boots');

  if (usesPesticides && !hasGloves) {
    recommendations.push({
      id: 'rec-ppe-gloves',
      category: 'PPE Safety',
      priority: 'High',
      icon: 'ShieldAlert',
      title: 'Adopt Nitrile or Neoprene Chemical Gloves',
      description: 'Your work profile indicates pesticide handling without protective gloves. Skin absorption accounts for up to 90% of systemic pesticide poisoning.',
      actionableTip: 'Do not use cloth or leather gloves, as they soak up toxic liquids.'
    });
  }

  if (usesPesticides && !hasMask) {
    recommendations.push({
      id: 'rec-ppe-mask',
      category: 'PPE Safety',
      priority: 'High',
      icon: 'Shield',
      title: 'Wear Certified Vapor & Particulate Respiratory Mask',
      description: 'Fine aerosolized chemical droplets travel directly into alveolar lung tissue without a respirator mask.',
      actionableTip: 'Replace disposable mask cartridges when breathing resistance increases.'
    });
  }

  if (!hasGoggles) {
    recommendations.push({
      id: 'rec-ppe-goggles',
      category: 'PPE Safety',
      priority: 'Medium',
      icon: 'Eye',
      title: 'Use Splash-Proof Safety Goggles',
      description: 'Eye tissue is highly permeable to liquid chemical concentrate during pouring, mixing, and overhead spraying.',
      actionableTip: 'Keep clean flushing water within 10 meters of chemical mixing sites.'
    });
  }

  if (!hasBoots) {
    recommendations.push({
      id: 'rec-ppe-boots',
      category: 'PPE Safety',
      priority: 'Medium',
      icon: 'Footprints',
      title: 'Wear Knee-High Rubber or PVC Boots',
      description: 'Wet chemical spray accumulates on crop foliage and brushes against farmer legs and footwear, causing fungal and chemical absorption.',
      actionableTip: 'Tuck trousers outside boots to prevent runoff into the footwear.'
    });
  }

  // --- 4. Hydration & Heat Protection ---
  recommendations.push({
    id: 'rec-hydration',
    category: 'Hydration',
    priority: 'High',
    icon: 'Droplets',
    title: 'Proactive Hydration Protocol (1 Glass Every 20 Mins)',
    description: 'Dehydration accelerates pesticide toxicity by concentrating circulating toxins in kidney and liver filtration systems.',
    actionableTip: 'Carry at least 3-4 liters of clean potable drinking water to the farm daily.'
  });

  recommendations.push({
    id: 'rec-heat',
    category: 'Heat Protection',
    priority: 'Medium',
    icon: 'Sun',
    title: 'Wide-Brimmed Hat & Light Cotton Garments',
    description: 'Protect neck and scalp from solar radiation. Heat exhaustion impairs judgment, leading to accidental pesticide spills.',
    actionableTip: 'Wear a wide-brimmed straw or canvas hat with neck flaps while working outdoors.'
  });

  // --- 5. Dynamic Feedback from Recent Symptoms ---
  if (symptoms.includes('Dizziness')) {
    recommendations.unshift({
      id: 'rec-symptom-dizziness',
      category: 'Chemical Safety',
      priority: 'High',
      icon: 'AlertTriangle',
      title: 'Immediate Action for Reported Dizziness',
      description: 'Dizziness post-activity is a primary indicator of organophosphate or synthetic pyrethroid aerosol inhalation.',
      actionableTip: 'Discontinue chemical work for at least 48 hours. Consult a clinic if lightheadedness persists.'
    });
  }

  if (symptoms.includes('Eye Irritation')) {
    recommendations.unshift({
      id: 'rec-symptom-eye',
      category: 'Chemical Safety',
      priority: 'High',
      icon: 'EyeOff',
      title: 'Eye Care Post-Irritation',
      description: 'Chemical splashes can cause corneal ulceration or temporary chemical conjunctivitis.',
      actionableTip: 'Do not rub itchy or burning eyes. Wash repeatedly with sterile or clean cold water.'
    });
  }

  if (symptoms.includes('Breathing Difficulty')) {
    recommendations.unshift({
      id: 'rec-symptom-breathing',
      category: 'PPE Safety',
      priority: 'High',
      icon: 'HeartPulse',
      title: 'Emergency: Severe Respiratory Alert',
      description: 'Breathing difficulty from agricultural fumes requires immediate medical assessment. Do not return to the field.',
      actionableTip: 'Seek physician evaluation immediately. Inform doctors of the exact pesticide name used.'
    });
  }

  return recommendations;
}
