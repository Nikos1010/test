const mongoose = require('mongoose')

const { server } = require('../index')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, getUsers, getUser } = require('./helpers')

describe('Users ->', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({ username: 'NoithRoot', name: 'Nicolas', passwordHash })

    await user.save()
  })

  describe('Add new User', () => {
    test('works as expected creating a fresh username', async () => {
      const usersAtStart = await getUsers()

      const newUser = {
        username: 'Leosh',
        name: 'Leonardo',
        password: 'tw1tch'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await getUsers()

      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper status code and message if username is already taken', async () => {
      const usersAtStart = await getUsers()

      const newUser = {
        username: 'NoithRoot',
        name: 'Perraso',
        password: 'esteesuntest'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(409)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('expected `username` to be unique')

      const usersAtEnd = await getUsers()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })

  describe('Modified User', () => {
    test('when the user change the user or username', async () => {
      const usersAtStart = await getUsers()
      const { id } = usersAtStart[0]

      const userModified = {
        username: 'Leosh',
        name: 'Leonardo MB',
        password: 'Puropeladoraro'
      }

      await api
        .put(`/api/users/${id}`)
        .send(userModified)
        .expect(200) // 204
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await getUser(id)
      const { name, username, passwordHash } = usersAtEnd

      const boolean = await bcrypt.compare(userModified.password, passwordHash)

      expect(boolean).toBe(true)
      expect(userModified.name).toEqual(name)
      expect(userModified.username).toEqual(username)
    })

    test('When the password is less than 6 characters', async () => {
      const usersAtStart = await getUsers()
      const { id, name, username } = usersAtStart[0]

      const infoUser = {
        name,
        username,
        password: '12345'
      }

      const result = await api
        .put(`/api/users/${id}`)
        .send(infoUser)
        .expect(411)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('Password cannot be less than 6 characters')
    })
  })

  afterAll(async () => {
    await mongoose.connection.close()
    server.close()
  })
})
