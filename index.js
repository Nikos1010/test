require('dotenv').config()
require('./utils/mongo')

const express = require('express')
const cors = require('cors')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const notesRouter = require('./routes/notes')
const userRouter = require('./routes/users')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const loginRouter = require('./routes/login')

const app = express()

Sentry.init({
  dsn: 'https://44950dcf6cc94b4da68a7c5ccc25a057@o1377803.ingest.sentry.io/6688922',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
})

app.use('/api/notes', notesRouter)

app.use('/api/users', userRouter)

app.use('/api/login', loginRouter)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())
app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
