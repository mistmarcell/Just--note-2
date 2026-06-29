const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    error = new AppError(message, 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`Duplicate value for ${field}. Please use another.`, 400);
  }

  if (err.name === 'CastError') {
    error = new AppError('Resource not found.', 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error',
  });
};

module.exports = errorHandler;
