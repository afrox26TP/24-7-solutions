const express = require('express')
const cors = require('cors')

const healthRoutes = require('./routes/health.routes')
const apiRoutes = require('./routes/api.routes')
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: '24-7 Solutions API' })
})

app.use('/api/health', healthRoutes)
app.use('/api', apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
