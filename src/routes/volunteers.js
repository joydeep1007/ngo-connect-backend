import express from 'express';
import {
  createVolunteer,
  getVolunteers,
  getVolunteerById,
  updateVolunteerStatus
} from '../controllers/volunteerController.js';

const router = express.Router();

// POST /api/volunteers - Create new volunteer application
router.post('/', createVolunteer);

// GET /api/volunteers - Get all volunteers (with pagination)
router.get('/', getVolunteers);

// GET /api/volunteers/:id - Get volunteer by ID
router.get('/:id', getVolunteerById);

// PATCH /api/volunteers/:id/status - Update volunteer status
router.patch('/:id/status', updateVolunteerStatus);

export default router;