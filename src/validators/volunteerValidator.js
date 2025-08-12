import Joi from 'joi';

const volunteerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 255 characters'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  
  phone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  
  interest: Joi.string()
    .valid('healthcare', 'education', 'environment', 'community', 'admin', 'events')
    .required()
    .messages({
      'string.empty': 'Area of interest is required',
      'any.only': 'Please select a valid area of interest'
    }),
  
  message: Joi.string()
    .max(1000)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Message cannot exceed 1000 characters'
    })
});

export const validateVolunteer = (data) => {
  return volunteerSchema.validate(data, { abortEarly: false });
};

export default volunteerSchema;