import { Router } from 'express';
import { getAllChemicals, getChemicalById } from '../controllers/chemicalController.js';

const router = Router();

router.get('/', getAllChemicals);
router.get('/:id', getChemicalById);

export default router;
