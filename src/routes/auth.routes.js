const router = require('express').Router()
const c = require('../controllers/auth.controller') //Controlador gestiona PERMISO
const { verifyToken } = require('../middlewares/auth')
const { loginLimiter } = require('../middlewares/rateLimit')

//¿En un Login, qué verbo debemos utilizar?
//POST (enviamos un paquete, protección)
router.post('/login', loginLimiter, c)