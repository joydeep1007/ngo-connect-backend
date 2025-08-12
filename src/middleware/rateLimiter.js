import rateLimit from 'express-rate-limit';

// Rate limiter for volunteer applications
export const volunteerRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes (reduced from 15)
  max: process.env.NODE_ENV === 'development' ? 50 : 5, // 50 for dev, 5 for production
  message: {
    success: false,
    message: 'Too many volunteer applications from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for localhost in development
    if (process.env.NODE_ENV === 'development' &&
      (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip?.includes('localhost'))) {
      return true;
    }
    return false;
  }
});

// General API rate limiter
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // 1000 for dev, 100 for production
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for localhost in development
    if (process.env.NODE_ENV === 'development' &&
      (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip?.includes('localhost'))) {
      return true;
    }
    return false;
  }
});