const { Router } = require('express')
const { getExample } = require('../controllers/example.controller')

const router = Router()

// Ukazkovy koncovy bod slouzi jako zaklad pro budouci moduly API.
router.get('/example', getExample)

module.exports = router
