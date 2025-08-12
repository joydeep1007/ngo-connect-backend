import Volunteer from '../models/Volunteer.js';
import { validateVolunteer } from '../validators/volunteerValidator.js';

export const createVolunteer = async (req, res) => {
  try {
    // Validate request data
    const { error, value } = validateVolunteer(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      });
    }

    // Check if email already exists
    const existingVolunteerByEmail = await Volunteer.findByEmail(value.email);
    if (existingVolunteerByEmail) {
      return res.status(409).json({
        success: false,
        message: 'A volunteer with this email already exists'
      });
    }

    // Check if phone number already exists
    const existingVolunteerByPhone = await Volunteer.findByPhone(value.phone);
    if (existingVolunteerByPhone) {
      return res.status(409).json({
        success: false,
        message: 'A volunteer with this phone number already exists'
      });
    }

    // Create new volunteer
    const volunteer = await Volunteer.create(value);
    
    res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully',
      data: {
        id: volunteer.id,
        name: volunteer.name,
        email: volunteer.email,
        interest: volunteer.interest,
        status: volunteer.status,
        created_at: volunteer.created_at
      }
    });

  } catch (error) {
    console.error('Error creating volunteer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getVolunteers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const volunteers = await Volunteer.findAll(limit, offset);
    const total = await Volunteer.getCount();

    res.json({
      success: true,
      data: volunteers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getVolunteerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid volunteer ID'
      });
    }

    const volunteer = await Volunteer.findById(id);
    
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.json({
      success: true,
      data: volunteer
    });

  } catch (error) {
    console.error('Error fetching volunteer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateVolunteerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid volunteer ID'
      });
    }

    if (!status || !['pending', 'approved', 'rejected', 'contacted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, rejected, contacted'
      });
    }

    const volunteer = await Volunteer.updateStatus(id, status);
    
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.json({
      success: true,
      message: 'Volunteer status updated successfully',
      data: volunteer
    });

  } catch (error) {
    console.error('Error updating volunteer status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};