const mongoose = require('mongoose')

const { server } = require('../index')
const Note = require('../models/Note')
const { api, initialNotes, getAllContentFromNotes } = require('./helpers')

describe('test of notes', () => {
  beforeEach(async () => {
    await Note.deleteMany({})

    for (const note of initialNotes) {
      const notesObject = new Note(note)
      await notesObject.save()
    }
  })
  describe('GET response in the notes', () => {
    test('notes are returned as JSON', async () => {
      await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('there are two notes', async () => {
      const { response } = await getAllContentFromNotes()
      expect(response.body).toHaveLength(initialNotes.length)
    })

    test('the first note is about Express', async () => {
      const { contents } = await getAllContentFromNotes()
      expect(contents).toContain('Desarrollando en Express')
    })
  })

  afterAll(async () => {
    mongoose.connection.close()
    await server.close()
  })
})
