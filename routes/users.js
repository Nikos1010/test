const userRouter = require('express').Router()
const { getAllUsers, postAddUser, getUser, updateUser } = require('../controllers/users')

userRouter.get('/', getAllUsers)

userRouter.get('/:userId', getUser)

userRouter.put('/:userId', updateUser)

userRouter.post('/', postAddUser)

module.exports = userRouter
