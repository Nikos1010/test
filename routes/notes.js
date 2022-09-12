const notesRouter = require('express').Router()
const { getAllNotes, getNote, updatedNote, postAddNote, deletedNote } = require('../controllers/notes')
const userExtractor = require('../middleware/userExtractor')

notesRouter.get('/', getAllNotes)

notesRouter.get('/:id', getNote)

notesRouter.put('/:id', userExtractor, updatedNote)

notesRouter.delete('/:id', userExtractor, deletedNote)

notesRouter.post('/', userExtractor, postAddNote)

module.exports = notesRouter
