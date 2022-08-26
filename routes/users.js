const userRouter = require('express').Router()
const { getAllUsers, postAddUser } = require('../controllers/users')

userRouter.get('/', getAllUsers)

userRouter.post('/', postAddUser)

module.exports = userRouter
