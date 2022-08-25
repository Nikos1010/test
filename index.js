require('dotenv').config()
require('./utils/mongo')

const express = require('express')
const cors = require('cors')

const notesRouter = require('./routes/notes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>')
})

app.use('/api/notes', notesRouter)

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})

module.exports = { app, server }