import { db } from '../utils/db.js';

export async function getAllChemicals(req, res) {
  try {
    const chemicals = await db.chemicalSafety.findMany({
      orderBy: { chemicalName: 'asc' }
    });

    const parsed = chemicals.map(c => ({
      ...c,
      recommendedPPE: typeof c.recommendedPPE === 'string' ? JSON.parse(c.recommendedPPE || '[]') : c.recommendedPPE
    }));

    res.json({
      success: true,
      chemicals: parsed
    });
  } catch (err) {
    console.error('Get chemicals error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve chemicals.' });
  }
}

export async function getChemicalById(req, res) {
  try {
    const { id } = req.params;
    const chemical = await db.chemicalSafety.findUnique({
      where: { id }
    });

    if (!chemical) {
      return res.status(404).json({ success: false, message: 'Chemical not found.' });
    }

    res.json({
      success: true,
      chemical: {
        ...chemical,
        recommendedPPE: typeof chemical.recommendedPPE === 'string' ? JSON.parse(chemical.recommendedPPE || '[]') : chemical.recommendedPPE
      }
    });
  } catch (err) {
    console.error('Get chemical by id error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve chemical details.' });
  }
}
