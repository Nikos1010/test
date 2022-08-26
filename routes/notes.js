const notesRouter = require('express').Router()
const { getAllNotes, getNote, updatedNote, postAddNote, deletedNote } = require('../controllers/notes')

notesRouter.get('/', getAllNotes)

notesRouter.get('/:id', getNote)

notesRouter.put('/:id', updatedNote)

notesRouter.delete('/:id', deletedNote)

notesRouter.post('/', postAddNote)

module.exports = notesRouter
