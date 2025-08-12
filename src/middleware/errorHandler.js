export const errorHandler = (err, _req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    message: 'Internal server error'
  };

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = 'Validation failed';
    error.errors = Object.values(err.errors).map(val => val.message);
    return res.status(400).json(error);
  }

  // Database errors
  if (err.code === '23505') {
    if (err.message.includes('email')) {
      error.message = 'Email already exists';
    } else if (err.message.includes('phone')) {
      error.message = 'Phone number already exists';
    } else {
      error.message = 'Duplicate entry';
    }
    return res.status(409).json(error);
  }

  if (err.code === '23503') {
    error.message = 'Referenced record not found';
    return res.status(400).json(error);
  }

  // Custom errors
  if (err.statusCode) {
    error.message = err.message;
    return res.status(err.statusCode).json(error);
  }

  // Default 500 error
  res.status(500).json(error);
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
};