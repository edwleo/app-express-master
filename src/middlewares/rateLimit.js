const rateLimit = require('express-rate-limit')

//Estas funciones controlarán la cantidad de intentos y el tráfico en nuestra app
//"en localhost siempre funciona"
//"con 1 usuario nunca hubo problemas"

//Flujo de login (intentos)
//windowMS    : tiempo en milisegundos
//limit       : intentos por IP
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos, verifique en unos minutos' }
})

//Flujo de solicitudes (usuarios que se conectan a la app)
exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas solicitudes, intente en un momento' }
})