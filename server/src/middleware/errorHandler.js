export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, error: 'Not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status ?? 500;
  res.status(status).json({
    success: false,
    error: status === 500 ? 'Internal server error' : err.message,
  });
}
