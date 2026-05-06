const { Router } = require('express')
const { getExample } = require('../controllers/example.controller')

const router = Router()

// Placeholder endpoint for future feature modules.
router.get('/example', getExample)

module.exports = router
