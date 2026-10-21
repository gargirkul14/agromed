/**
 * AgroMed AI - PPE Recommendation Service
 * Provides activity-specific personal protective equipment requirements
 * and compares them against the farmer's current work equipment.
 */

export const ACTIVITY_PPE_MATRIX = {
  'Pesticide Spraying': {
    activity: 'Pesticide Spraying',
    hazardLevel: 'High',
    description: 'Aerosolized pesticide mist drifts easily into the breathing zone and adheres to exposed skin and clothing.',
    recommendedPPE: [
      {
        id: 'gloves',
        name: 'Chemical-Resistant Gloves',
        importance: 'Protects the skin from direct liquid pesticide absorption, which is responsible for over 80% of occupational agrochemical poisonings.',
        whenToUse: 'Wear at all times while preparing tanks, touching nozzles, spraying, and cleaning equipment.',
        materialRecommendation: 'Nitrile, Neoprene, or Butyl rubber (minimum 0.4mm thickness). Avoid cloth or leather.'
      },
      {
        id: 'mask',
        name: 'Organic Vapor / Particulate Respirator Mask',
        importance: 'Prevents aerosol mist and airborne chemical vapors from entering bronchial and lung tissue.',
        whenToUse: 'Wear throughout spraying, especially when walking through dense vegetation or downwind zones.',
        materialRecommendation: 'N95 particulate mask or dual-cartridge organic vapor respirator (OV/P100).'
      },
      {
        id: 'goggles',
        name: 'Non-Vented Safety Goggles',
        importance: 'Protects eyes from pesticide mist and sudden pressure blowouts from sprayer hoses or nozzles.',
        whenToUse: 'Wear when spraying overhead crops, fruit trees, or when windy conditions create spray drift.',
        materialRecommendation: 'Impact-resistant polycarbonate with anti-fog coating and indirect ventilation.'
      },
      {
        id: 'clothing',
        name: 'Full-Body Protective Overalls / Apron',
        importance: 'Creates a barrier shielding regular clothes and torso from absorbing chemical spray drift.',
        whenToUse: 'Wear over long-sleeved shirts and trousers during all spraying operations.',
        materialRecommendation: 'Water-repellent synthetic coated coverall or Tyvek protective suit.'
      },
      {
        id: 'boots',
        name: 'Knee-High Rubber / PVC Safety Boots',
        importance: 'Protects feet and ankles from spray dripping off treated crops and pesticide puddle splashes.',
        whenToUse: 'Wear in treated fields, during mixing, and while washing sprayer backpacks.',
        materialRecommendation: 'Unlined PVC or heavy-duty chemical rubber boots. Never wear canvas sneakers or sandals.'
      }
    ]
  },
  'Chemical Mixing': {
    activity: 'Chemical Mixing',
    hazardLevel: 'Extreme',
    description: 'Handling raw, undiluted chemical concentrates carries the highest risk of chemical burns, splash injury, and acute intoxication.',
    recommendedPPE: [
      {
        id: 'gloves',
        name: 'Heavy-Duty Chemical Gloves',
        importance: 'Protects skin from direct contact with pure, undiluted chemical concentrates.',
        whenToUse: 'Mandatory before uncapping or measuring concentrated pesticide bottles.',
        materialRecommendation: 'Elbow-length heavy nitrile or butyl gloves.'
      },
      {
        id: 'goggles',
        name: 'Chemical Splash Face Shield / Goggles',
        importance: 'Prevents concentrated chemical splashes from reaching eyes or facial skin during pouring.',
        whenToUse: 'Whenever pouring liquids or scooping wettable powders into measuring containers.',
        materialRecommendation: 'Full-face transparent shield combined with chemical splash goggles.'
      },
      {
        id: 'mask',
        name: 'Chemical Vapor Mask',
        importance: 'Blocks concentrated toxic fumes and chemical powder dust released when opening sealed containers.',
        whenToUse: 'While opening, measuring, diluting, and stirring chemical solutions.',
        materialRecommendation: 'Half-mask respirator with activated charcoal cartridge filters.'
      },
      {
        id: 'clothing',
        name: 'Heavy Chemical Apron',
        importance: 'Prevents spills from soaking through clothing during pouring accidents.',
        whenToUse: 'While standing over the preparation bucket or sprayer tank.',
        materialRecommendation: 'Thick waterproof PVC or rubberized chemical apron.'
      },
      {
        id: 'boots',
        name: 'Safety Boots',
        importance: 'Guards against chemical concentrate spills pooling on the mixing area floor.',
        whenToUse: 'Throughout the chemical formulation process.',
        materialRecommendation: 'Chemical-resistant rubber boots with non-slip tread.'
      }
    ]
  },
  'Fertilizer Application': {
    activity: 'Fertilizer Application',
    hazardLevel: 'Moderate',
    description: 'Granular fertilizers (Urea, DAP, Potash) are hygroscopic, drawing moisture from skin and generating caustic dust.',
    recommendedPPE: [
      {
        id: 'gloves',
        name: 'Waterproof Work Gloves',
        importance: 'Prevents granular fertilizers from causing dermatitis, skin peeling, and chemical cracks.',
        whenToUse: 'During manual broadcasting, filling seeders, and handling fertilizer bags.',
        materialRecommendation: 'Rubber-coated or latex-dipped work gloves.'
      },
      {
        id: 'mask',
        name: 'Dust Filtration Mask',
        importance: 'Filters abrasive fertilizer dust and ammonia vapors released from moisture-activated urea.',
        whenToUse: 'While opening bulk bags, pouring into spreaders, and broadcasting.',
        materialRecommendation: 'Comfortable N95 or FFP2 dust respirator mask.'
      },
      {
        id: 'boots',
        name: 'Rubber / Work Boots',
        importance: 'Prevents caustic fertilizer granules from lodging inside shoes and causing friction blisters.',
        whenToUse: 'Whenever working in muddy fields or applying soil amendments.',
        materialRecommendation: 'Waterproof rubber farm boots.'
      },
      {
        id: 'clothing',
        name: 'Long-Sleeve Cotton Clothing',
        importance: 'Shields arms and legs from abrasive granular dust and sunlight.',
        whenToUse: 'Throughout field application.',
        materialRecommendation: 'Breathable, tightly woven cotton long sleeves and pants.'
      }
    ]
  },
  'Harvesting': {
    activity: 'Harvesting',
    hazardLevel: 'Moderate',
    description: 'Exposure to plant thorns, pesticide residues on foliage, pollen, dust, insects, and intense sunlight.',
    recommendedPPE: [
      {
        id: 'gloves',
        name: 'Puncture-Resistant Work Gloves',
        importance: 'Prevents sharp thorn cuts, insect bites, and contact with pesticide residues on leaves.',
        whenToUse: 'While cutting, plucking, and gathering harvested produce.',
        materialRecommendation: 'Leather-palmed or reinforced cut-resistant cotton gloves.'
      },
      {
        id: 'clothing',
        name: 'Sun-Protective Long Sleeves & Wide Hat',
        importance: 'Guards against prolonged ultraviolet radiation, heat exhaustion, and stinging foliage.',
        whenToUse: 'During all daytime harvesting hours.',
        materialRecommendation: 'Lightweight UPF 50+ cotton shirts and wide-brimmed sun hat.'
      },
      {
        id: 'boots',
        name: 'Sturdy Field Boots',
        importance: 'Guards against snake bites, sharp stubble, mud, and uneven terrain sprains.',
        whenToUse: 'While walking and transporting produce across uneven fields.',
        materialRecommendation: 'Ankle-high reinforced leather or rubber work boots.'
      },
      {
        id: 'mask',
        name: 'Grain / Dust Mask (Optional but recommended)',
        importance: 'Protects from inhaling dry threshing dust, fungal spores, and crop chaff.',
        whenToUse: 'During combine harvesting, threshing, or bagging grain.',
        materialRecommendation: 'Reusable cloth or disposable dust mask.'
      }
    ]
  },
  'General Farm Work': {
    activity: 'General Farm Work',
    hazardLevel: 'Low to Moderate',
    description: 'Tilling, weeding, irrigation, fence maintenance, and animal handling involving physical hazards and sun exposure.',
    recommendedPPE: [
      {
        id: 'clothing',
        name: 'Durable Workwear & Sun Protection',
        importance: 'Reduces heat stress, solar burns, and scrapes from farm equipment.',
        whenToUse: 'Daily farm routine.',
        materialRecommendation: 'Light-colored, breathable cotton clothing and sun hat.'
      },
      {
        id: 'boots',
        name: 'Steel-Toe or Reinforced Farm Boots',
        importance: 'Protects toes and feet from heavy tools, hoes, animal hooves, and sharp stones.',
        whenToUse: 'Whenever operating machinery, tilling, or walking fields.',
        materialRecommendation: 'Durable waterproof safety footwear.'
      },
      {
        id: 'gloves',
        name: 'General Purpose Farming Gloves',
        importance: 'Prevents blisters, splinters from wooden handles, and animal scratches.',
        whenToUse: 'While weeding, operating tools, and handling barbed wire.',
        materialRecommendation: 'Breathable canvas or leather-palmed utility gloves.'
      }
    ]
  }
};

/**
 * Compares the farmer's current PPE against recommended PPE for a given activity
 */
export function getPPEComparison(activity, currentPPE = []) {
  const activityData = ACTIVITY_PPE_MATRIX[activity] || ACTIVITY_PPE_MATRIX['Pesticide Spraying'];
  const recommendedList = activityData.recommendedPPE;

  // Normalize current PPE strings
  const normalizedCurrent = currentPPE.map(p => p.toLowerCase());

  const comparison = recommendedList.map(item => {
    // Check if the farmer wears something matching this PPE
    const isWorn = normalizedCurrent.some(p => {
      const lower = p.toLowerCase();
      if (item.id === 'gloves' && lower.includes('glove')) return true;
      if (item.id === 'mask' && (lower.includes('mask') || lower.includes('respirator'))) return true;
      if (item.id === 'goggles' && (lower.includes('goggle') || lower.includes('glasses') || lower.includes('shield'))) return true;
      if (item.id === 'clothing' && (lower.includes('cloth') || lower.includes('overall') || lower.includes('apron'))) return true;
      if (item.id === 'boots' && (lower.includes('boot') || lower.includes('shoe'))) return true;
      return false;
    });

    return {
      ...item,
      isProtected: isWorn,
      status: isWorn ? 'Equipped' : 'Missing',
      statusMessage: isWorn 
        ? 'Protected: You have this equipment registered in your profile.' 
        : 'Missing: Highly recommended to acquire this protection before commencing this task.'
    };
  });

  const equippedCount = comparison.filter(c => c.isProtected).length;
  const totalCount = comparison.length;
  const protectionPercentage = Math.round((equippedCount / totalCount) * 100);

  return {
    activity: activityData.activity,
    hazardLevel: activityData.hazardLevel,
    description: activityData.description,
    totalRecommended: totalCount,
    equippedCount,
    protectionPercentage,
    comparison
  };
}
