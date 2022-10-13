const Note = require('../models/Note')
const User = require('../models/User')

exports.getAllNotes = async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  if (notes.length < 1) return res.status(404).json({ message: 'No file found' })
  res.json(notes)
}

exports.getNote = (req, res, next) => {
  const { id } = req.params

  Note.findById(id)
    .then(note => {
      if (note) return res.json(note)
      res.status(404).end()
    }).catch(next)
}

exports.updatedNote = (req, res, next) => {
  const { id } = req.params
  const { content, important } = req.body

  const newNoteInfo = {
    content,
    important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => res.json(result))
    .catch(next)
}

exports.deletedNote = async (req, res) => {
  const { id } = req.params
  const result = await Note.findByIdAndRemove(id)
  if (result === null) return res.sendStatus(404)

  res.status(204).end()
}

exports.postAddNote = async (req, res, next) => {
  const {
    content,
    important = false
  } = req.body

  const { userId } = req
  const user = await User.findById(userId)

  if (!content) {
    return res.status(404).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    res.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
}
