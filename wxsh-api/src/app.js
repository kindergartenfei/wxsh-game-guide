import express from 'express'
import cors from 'cors'
import routes from './routes/index.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({
    code: 0,
    message: 'wxsh API 运行中',
    data: {
      docs: '/api/health',
      pets: '/api/pets',
    },
  })
})

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

export default app
