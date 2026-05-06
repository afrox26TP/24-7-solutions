function getExample(req, res) {
  res.status(200).json({
    data: [],
    note: 'Example endpoint ready for future DB integration',
  })
}

module.exports = {
  getExample,
}
