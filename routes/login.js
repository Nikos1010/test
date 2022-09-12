const { loginPost } = require('../controllers/login')
const loginRouter = require('express').Router()

loginRouter.post('/', loginPost)

module.exports = loginRouter
