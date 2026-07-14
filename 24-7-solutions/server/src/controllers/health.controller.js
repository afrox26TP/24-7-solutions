// Jednoducha odpoved slouzi pro monitoring dostupnosti serveru.
function getHealth(req, res) {
  res.status(200).json({
    ok: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  })
}

module.exports = {
  getHealth,
}
