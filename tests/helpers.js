const supertest = require('supertest')
const bcrypt = require('bcrypt')

const { app } = require('../index')
const User = require('../models/User')
const api = supertest(app)

const initialNotes = [
  {
    content: 'Desarrollando en Express',
    important: true,
    date: new Date()
  },
  {
    content: 'Aprendiendo sobre testing',
    important: true,
    date: new Date()
  },
  {
    content: 'Aplicar map en las consultas es mejor que hacer los filtros sobre la base de datos',
    important: true,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    user: response.body.user,
    contents: response.body.map(note => note.content),
    response
  }
}

const createUser = async () => {
  const passwordHash = await bcrypt.hash('pwsd', 10)
  const user = new User({ username: 'Noithroot', passwordHash })

  await user.save()
}

const getUsers = async () => {
  const userDB = await User.find({})
  return userDB.map(user => user.toJSON())
}

module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes,
  getUsers,
  createUser
}
