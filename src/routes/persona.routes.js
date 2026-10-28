const router = require('express').Router()
const c = require('../controllers/persona.controller')

//RECUERDA:
//Las rutas requieren las funcionalidades en los controladores

//router.verbo('/ruta', controlador.accion)

router.get('/', c.list) //listar
router.get('/:id', c.get) //buscar
router.post('/', c.create) //registrar
router.put('/:id', c.update) //modificar
router.delete('/:id', c.remove) //eliminar

module.exports = router