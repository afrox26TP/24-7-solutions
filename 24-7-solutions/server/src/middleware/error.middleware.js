function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`)
  error.status = 404
  next(error)
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500

  // Interni chyby se zapisuji do konzole, klient vsak obdrzi jednotnou JSON odpoved.
  if (status === 500) {
    console.error(err)
  }

  res.status(status).json({
    ok: false,
    message: err.message || 'Internal Server Error',
  })
}

module.exports = {
  notFoundHandler,
  errorHandler,
}
