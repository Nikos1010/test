const User = require('../models/User')
const bcrypt = require('bcrypt')

exports.getAllUsers = async (req, res) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1
  })
  if (users.length < 1) return res.status(404).json({ message: 'No file found' })
  res.json(users)
}

exports.getUser = async (req, res) => {
  const { userId } = req.params
  const user = await User.findById(userId).populate('notes', {
    content: 1,
    date: 1
  })

  res.json(user)
}

exports.updateUser = async (req, res) => {
  const { userId } = req.params

  const { password, name, username } = req.body
  let passwordHash

  if (password) {
    if (password.length < 6) return res.status(411).json({ error: 'Password cannot be less than 6 characters' })
    passwordHash = await bcrypt.hash(password, 10)
  }

  const user = await User.findById(userId)

  const newInfo = {
    name: name || user.name,
    username: username || user.username,
    passwordHash: passwordHash || user.passwordHash
  }

  const result = await User.findByIdAndUpdate(userId, newInfo, { new: true })

  res.status(200).json(result)
}

exports.postAddUser = async (req, res) => {
  const { username, name, password } = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
}
