import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const SEED_DATA = {
  admin: {
    name: 'AgroMed Administrator',
    email: 'admin@agromed.ai',
    password: 'Admin@123',
    phone: '+91 98765 43210',
    role: 'ADMIN'
  },
  demoFarmer: {
    user: {
      name: 'Ramesh Patel',
      email: 'farmer@agromed.ai',
      password: 'Farmer@123',
      phone: '+91 98765 12345',
      role: 'FARMER'
    },
    profile: {
      age: 42,
      gender: 'Male',
      village: 'Kisanpur',
      district: 'Salem',
      state: 'Tamil Nadu',
      yearsOfFarming: 18,
      profileCompleted: true
    },
    workProfile: {
      cropName: 'Paddy & Cotton',
      farmingType: 'Conventional & Mixed',
      farmSize: '4.5 Acres',
      averageWorkingHours: 9.0,
      daysWorkedPerWeek: 6,
      usesPesticides: true,
      usesFertilizers: true,
      commonPesticides: JSON.stringify(['Chlorpyrifos', 'Monocrotophos', 'Imidacloprid']),
      commonFertilizers: JSON.stringify(['Urea', 'DAP (Diammonium Phosphate)', 'Potash']),
      ppeUsed: JSON.stringify(['Gloves', 'Boots']) // Missing mask and goggles
    },
    assessments: [
      {
        chemicalUsed: 'Chlorpyrifos 20% EC',
        exposureDuration: '3–5 hours',
        activityType: 'Pesticide Spraying',
        symptoms: JSON.stringify(['Headache', 'Dizziness', 'Eye Irritation']),
        ppeUsed: JSON.stringify(['Gloves', 'Boots']),
        riskLevel: 'HIGH',
        safetyScore: 38,
        recommendations: JSON.stringify([
          'Stop pesticide spraying immediately and stay in a shaded, well-ventilated area.',
          'Wash eyes thoroughly with sterile running water for 15 minutes.',
          'Wear an organic vapor respirator mask and safety goggles for any future spraying.',
          'Seek medical attention if dizziness does not clear up within 1 hour.'
        ]),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        chemicalUsed: 'Urea & DAP Fertilizer',
        exposureDuration: '1–3 hours',
        activityType: 'Fertilizer Application',
        symptoms: JSON.stringify(['Skin Irritation']),
        ppeUsed: JSON.stringify(['Gloves', 'Boots']),
        riskLevel: 'MEDIUM',
        safetyScore: 68,
        recommendations: JSON.stringify([
          'Wash exposed forearms with mild soap and clean cool water.',
          'Apply moisturizer or protective barrier cream before granular fertilizer broadcasting.'
        ]),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        chemicalUsed: 'Imidacloprid 17.8% SL',
        exposureDuration: 'Less than 1 hour',
        activityType: 'Pesticide Spraying',
        symptoms: JSON.stringify(['No Symptoms']),
        ppeUsed: JSON.stringify(['Gloves', 'Mask', 'Safety Goggles', 'Boots']),
        riskLevel: 'LOW',
        safetyScore: 92,
        recommendations: JSON.stringify([
          'Excellent safety protocol observed. Continue full PPE discipline.',
          'Wash work garments separately from family clothes.'
        ]),
        createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  articles: [
    {
      title: 'Safe Agrochemical Mixing & Dilution Protocols',
      category: 'Chemical Safety',
      content: `### Proper Chemical Handling
Handling raw, concentrated pesticides during mixing and pouring presents the highest occupational hazard in farming. Concentrates can penetrate skin within seconds and release volatile organic fumes.

#### Essential Rules:
1. **Never Mix Indoors**: Always mix chemicals outdoors in a dedicated, well-ventilated area away from family dwellings and livestock.
2. **Use Dedicated Measuring Tools**: Never use kitchen utensils, drinking cups, or soda bottles to measure chemicals. Clearly label farm measuring jugs.
3. **Stand Upwind**: Position yourself so the natural breeze blows away from your face and body.
4. **Pour Close to Water Level**: When adding concentrate to the sprayer tank, hold the container low to prevent splashes.
5. **Triple Rinse Empty Containers**: Immediately rinse empty pesticide containers three times, pouring the rinse water directly back into the sprayer tank. Puncture empty containers so they can never be reused for domestic water.`
    },
    {
      title: 'Recognizing Early Symptoms of Pesticide Intoxication',
      category: 'Pesticide Handling',
      content: `### Understanding Agrochemical Poisoning
Pesticides, particularly organophosphates and carbamates, act as cholinesterase inhibitors. Early symptoms are frequently mistaken for normal fatigue or flu, delaying life-saving care.

#### Mild Symptoms:
- Persistent headache, lightheadedness, and heavy sweating.
- Excessive salivation and runny nose.
- Mild nausea and stomach cramps.

#### Moderate to Severe Symptoms:
- Constricted (pinpoint) pupils and blurred vision.
- Muscle twitches, tremors, and loss of coordination.
- Difficulty breathing, tightness in the chest, and wheezing.
- Uncontrollable vomiting and diarrhea.

#### Immediate Action:
Cease spraying immediately, move to fresh open air, and rush to the nearest clinic with the chemical label. Do not allow the affected person to drive themselves.`
    },
    {
      title: 'Emergency First Aid for Chemical Eye and Skin Splashes',
      category: 'First Aid Basics',
      content: `### Rapid Action Can Save Sight and Health
Accidental pesticide splashes into eyes or onto skin require rapid emergency decontamination within seconds.

#### Eye Decontamination:
1. Immediately hold the eyelids open using clean fingers.
2. Flush eyes gently with clean, cool running water continuously for at least 15 minutes.
3. Tilt head so water flows from the inner corner outwards, preventing contamination of the other eye.
4. Do NOT use eye drops, milk, or remedies unless directed by a physician.

#### Dermal (Skin) Decontamination:
1. Strip off contaminated clothes, boots, and gloves immediately.
2. Wash the skin thoroughly with copious amounts of water and mild soap.
3. Avoid vigorous scrubbing, which can abrade the skin and increase pesticide absorption.
4. Dress in loose, clean cotton clothing and seek medical evaluation.`
    },
    {
      title: 'Detecting Heat Exhaustion vs Dangerous Heatstroke',
      category: 'Heatstroke Prevention',
      content: `### Working in Extreme Agricultural Heat
Farmers frequently work during peak solar irradiance. It is vital to differentiate between heat exhaustion and life-threatening heatstroke.

#### Heat Exhaustion:
- Heavy sweating with cool, pale, or clammy skin.
- Fast, weak pulse.
- Dizziness, fatigue, and muscle cramps.
*Management: Rest in shade, loosen clothing, sip cool water or oral rehydration salts (ORS).*

#### Heatstroke (Medical Emergency!):
- High body temperature (above 39.5°C / 103°F).
- Red, hot, and DRY skin (sweating mechanism fails).
- Rapid, strong pulse.
- Confusion, disorientation, slurred speech, or fainting.
*Management: Call emergency services immediately. Douse the person with cold water, place ice packs under armpits and neck, and fan vigorously.*`
    },
    {
      title: 'Agricultural Hydration Schedules & Electrolyte Balance',
      category: 'Hydration',
      content: `### Staying Hydrated in the Fields
Waiting until you feel thirsty means mild dehydration has already begun. In hot farm conditions, workers can lose up to 1 liter of sweat per hour.

#### Recommended Hydration Schedule:
- **Before Work**: Drink 500 ml of water 30 minutes before stepping into the field.
- **During Work**: Drink 1 cup (200–250 ml) of clean water every 20 minutes.
- **Avoid Dehydrating Drinks**: Steer clear of high-sugar sodas, excessive black tea, or alcohol, which increase fluid loss.

#### Homemade Electrolyte Drink (Kisan ORS):
In 1 liter of clean drinking water, mix:
- 2 tablespoons of sugar or jaggery
- Half a teaspoon of salt
- Juice of half a fresh lime
Drink throughout your morning shift to prevent cramping and fatigue.`
    },
    {
      title: 'Selecting the Right Chemical Respirator and Gloves',
      category: 'Personal Protective Equipment',
      content: `### PPE: Your First Line of Defense
Not all masks and gloves provide chemical protection. Using improper gear creates false security while chemicals leak through.

#### Gloves Selection:
- **Cloth/Leather Gloves**: NEVER use for chemicals. They soak up pesticide solutions and hold them against skin.
- **Nitrile or Neoprene**: Ideal for chemical mixing and spraying. Check for holes before every use by rolling and trapping air.

#### Respirator Masks:
- **Simple Cloth/Surgical Masks**: Protect only against large dust particles; they do NOT block chemical vapors.
- **N95 or FFP2 Masks**: Suitable for fertilizer and pesticide dust aerosols.
- **Organic Vapor (OV) Cartridge Respirators**: Required when spraying volatile pesticides, emulsifiable concentrates (EC), or spraying in confined greenhouses.`
    },
    {
      title: 'Wind Drift Management & Calibrating Knapsack Sprayers',
      category: 'Safe Spraying Practices',
      content: `### Precision Spraying & Drift Reduction
Up to 40% of agricultural spray can drift off-target under poor application conditions, wasting money and exposing farmers and neighbors to toxic mist.

#### Best Practices:
1. **Spray Timing**: Spray between 6:00 AM – 9:00 AM or 4:00 PM – 6:30 PM when wind velocity is low and air temperatures are cooler.
2. **Maintain Boom Height**: Keep the spray nozzle approximately 50 cm above the crop canopy. Higher nozzles increase wind drift exponentially.
3. **Nozzle Maintenance**: Inspect and replace worn brass or plastic nozzles. Worn nozzles produce uneven droplets and increase worker exposure.
4. **Walk Downwind**: Always walk with the wind at your back so droplets travel away from your direction of travel.`
    },
    {
      title: 'Secure Agrochemical Storage & Container Disposal',
      category: 'Chemical Safety',
      content: `### Safe Storage and Environmental Stewardship
Careless pesticide storage in residential premises is a leading cause of accidental child and livestock poisoning in rural areas.

#### Storage Requirements:
1. Store all chemicals in a dedicated, locked steel or wooden cabinet.
2. Ensure the storage box is well-ventilated and kept away from direct sunlight, animal feed, food grains, and water wells.
3. Always keep agrochemicals in their original manufacturer containers with readable labels intact.

#### Responsible Container Disposal:
1. Triple-rinse empty containers into the spray tank.
2. Puncture holes into the bottom of empty plastic cans so they cannot be utilized for food or water storage.
3. Dispose of containers through certified agricultural waste collection channels or bury them in approved farm landfill pits far from groundwater tables.`
    },
    {
      title: 'Preventing Secondary Chemical Exposure in Farm Families',
      category: 'Pesticide Handling',
      content: `### Protecting Children and Families from Farm Contaminants
Farmers can unwittingly bring hazardous chemical residues into the home on clothing, skin, and footwear.

#### Family Safety Precautions:
1. **Remove Boots Outside**: Never enter living quarters or kitchens with field boots or muddy shoes.
2. **Wash Work Clothes Separately**: Launder pesticide-exposed clothes in a separate bucket or wash cycle away from children’s clothes.
3. **Immediate Post-Work Shower**: Bathe with soap before holding children or sitting on living room furniture.
4. **Restricted Field Re-entry**: Enforce the re-entry interval (REI) indicated on pesticide labels before allowing family members or grazing cattle onto sprayed fields.`
    },
    {
      title: 'Grain Dust Inhalation & Safe Silo Aeration',
      category: 'First Aid Basics',
      content: `### Managing Agricultural Dust Hazards
Threshing, harvesting, and storing grain releases high concentrations of organic dust, mold spores, and endotoxins into the air, leading to "Farmer's Lung" (hypersensitivity pneumonitis).

#### Key Precautions:
1. Always wear an N95 dust mask during mechanical threshing, sorting, and bagging.
2. Ensure proper ventilation in grain storage rooms and silos before entering.
3. Never enter an unventilated sealed silo alone; toxic nitrogen dioxide (silo gas) can accumulate within hours of grain fermentation.
4. If you experience persistent dry cough, night fever, or wheezing after harvest, see a physician for lung evaluation.`
    }
  ],
  chemicals: [
    {
      chemicalName: 'Chlorpyrifos 20% EC',
      precautions: 'Highly toxic organophosphate insecticide. Rapidly absorbed through skin and inhalation. Causes cholinesterase inhibition. Never spray without full PPE. Keep atropine antidote protocols accessible.',
      recommendedPPE: JSON.stringify(['Chemical Gloves', 'Organic Vapor Mask', 'Safety Goggles', 'Protective Clothing', 'Rubber Boots'])
    },
    {
      chemicalName: 'Glyphosate 41% SL',
      precautions: 'Systemic non-selective broad-spectrum herbicide. Irritating to eyes, mucous membranes, and respiratory tract. Avoid inhaling mist or prolonged dermal contact. Wash skin immediately after handling.',
      recommendedPPE: JSON.stringify(['Nitrile Gloves', 'Particulate Mask', 'Safety Goggles', 'Rubber Boots'])
    },
    {
      chemicalName: 'Paraquat Dichloride 24% SL',
      precautions: 'Extremely hazardous bipyridylium herbicide. Highly toxic by ingestion, inhalation, and broken skin. Can cause irreversible pulmonary fibrosis. Strict handling protocol required. Do not use defective sprayers.',
      recommendedPPE: JSON.stringify(['Heavy Nitrile Gloves', 'Vapor Respirator', 'Chemical Face Shield', 'Full Waterproof Suit', 'Rubber Boots'])
    },
    {
      chemicalName: 'Imidacloprid 17.8% SL',
      precautions: 'Systemic neonicotinoid insecticide. Toxic if swallowed or inhaled. Moderate skin and eye irritation. Harmful to pollinator bees; do not spray during active crop flowering periods.',
      recommendedPPE: JSON.stringify(['Chemical Gloves', 'Dust / Mist Mask', 'Safety Goggles', 'Long Sleeve Clothes'])
    },
    {
      chemicalName: 'Mancozeb 75% WP',
      precautions: 'Dithiocarbamate broad-spectrum protective fungicide. Generates fine airborne powder dust during measurement. Chronic exposure may affect thyroid function. Always wear a dust respirator when mixing.',
      recommendedPPE: JSON.stringify(['Rubber Gloves', 'N95 Respirator Mask', 'Safety Goggles', 'Overalls'])
    },
    {
      chemicalName: 'Monocrotophos 36% SL',
      precautions: 'Organophosphorus insecticide and acaricide with high acute toxicity. Cholinesterase inhibitor. Banned or severely restricted in many jurisdictions. Requires stringent precautions and complete chemical barrier PPE.',
      recommendedPPE: JSON.stringify(['Heavy Duty Chemical Gloves', 'Dual Cartridge Respirator', 'Splash Goggles', 'Full Body Chemical Suit', 'Knee Boots'])
    },
    {
      chemicalName: 'Atrazine 50% WP',
      precautions: 'Selective triazine herbicide. Persists in soil and can leach into groundwater. Mild skin and eye irritant. Ensure washing facilities are nearby during application.',
      recommendedPPE: JSON.stringify(['Waterproof Gloves', 'Protective Mask', 'Eye Goggles', 'Rubber Boots'])
    },
    {
      chemicalName: 'Urea & DAP (Granular Fertilizers)',
      precautions: 'Hygroscopic nitrogen and phosphorus fertilizers. Absorb skin moisture, leading to dry skin, painful cracking, and chemical dermatitis. Decomposes to ammonia gas in hot, humid environments.',
      recommendedPPE: JSON.stringify(['Waterproof Gloves', 'Dust Mask', 'Safety Boots', 'Cotton Long Sleeves'])
    }
  ]
};

export async function seedDatabase() {
  console.log('--- Starting AgroMed AI Database Seeding ---');

  // 1. Hash passwords
  const adminPasswordHash = await bcrypt.hash(SEED_DATA.admin.password, 10);
  const farmerPasswordHash = await bcrypt.hash(SEED_DATA.demoFarmer.user.password, 10);

  // 2. Upsert Admin
  const adminUser = await prisma.user.upsert({
    where: { email: SEED_DATA.admin.email },
    update: {
      name: SEED_DATA.admin.name,
      password: adminPasswordHash,
      phone: SEED_DATA.admin.phone,
      role: 'ADMIN'
    },
    create: {
      name: SEED_DATA.admin.name,
      email: SEED_DATA.admin.email,
      password: adminPasswordHash,
      phone: SEED_DATA.admin.phone,
      role: 'ADMIN'
    }
  });
  console.log(`✓ Admin seeded: ${adminUser.email}`);

  // 3. Upsert Demo Farmer
  const farmerUser = await prisma.user.upsert({
    where: { email: SEED_DATA.demoFarmer.user.email },
    update: {
      name: SEED_DATA.demoFarmer.user.name,
      password: farmerPasswordHash,
      phone: SEED_DATA.demoFarmer.user.phone,
      role: 'FARMER'
    },
    create: {
      name: SEED_DATA.demoFarmer.user.name,
      email: SEED_DATA.demoFarmer.user.email,
      password: farmerPasswordHash,
      phone: SEED_DATA.demoFarmer.user.phone,
      role: 'FARMER'
    }
  });
  console.log(`✓ Farmer seeded: ${farmerUser.email}`);

  // 4. Upsert Farmer Profile
  const farmerProfile = await prisma.farmerProfile.upsert({
    where: { userId: farmerUser.id },
    update: SEED_DATA.demoFarmer.profile,
    create: {
      userId: farmerUser.id,
      ...SEED_DATA.demoFarmer.profile
    }
  });

  // 5. Upsert Work Profile
  await prisma.workProfile.upsert({
    where: { farmerId: farmerProfile.id },
    update: SEED_DATA.demoFarmer.workProfile,
    create: {
      farmerId: farmerProfile.id,
      ...SEED_DATA.demoFarmer.workProfile
    }
  });
  console.log('✓ Farmer profile & work profile seeded');

  // 6. Seed Assessments
  for (const assessment of SEED_DATA.demoFarmer.assessments) {
    const existing = await prisma.healthAssessment.findFirst({
      where: {
        farmerId: farmerProfile.id,
        chemicalUsed: assessment.chemicalUsed
      }
    });
    if (!existing) {
      await prisma.healthAssessment.create({
        data: {
          farmerId: farmerProfile.id,
          ...assessment
        }
      });
    }
  }
  console.log('✓ Sample health assessments seeded');

  // 7. Seed Safety Articles
  for (const article of SEED_DATA.articles) {
    const existing = await prisma.safetyArticle.findFirst({
      where: { title: article.title }
    });
    if (!existing) {
      await prisma.safetyArticle.create({
        data: article
      });
    }
  }
  console.log(`✓ ${SEED_DATA.articles.length} safety articles seeded`);

  // 8. Seed Chemical Safeties
  for (const chemical of SEED_DATA.chemicals) {
    await prisma.chemicalSafety.upsert({
      where: { chemicalName: chemical.chemicalName },
      update: chemical,
      create: chemical
    });
  }
  console.log(`✓ ${SEED_DATA.chemicals.length} chemicals seeded in safety database`);

  console.log('--- Database Seeding Complete ---');
}

// Allow direct CLI execution: node prisma/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .catch((e) => {
      console.error('Seeding failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
