const db = require('../config/db')
const { httpError, requireFields, isEmail } = require('../utils')

//Lista de campos obligatorios
//Omitir los campos que son NULL
const camposRequeridos = ['apellidos', 'nombres', 'telefono', 'email', 'direccion']

//Evaluamos que el contenido de cada campo sea de tipo cadena
//(1) arreglo > (2)filter > (3)map > (4) operador ternario 
//filter()  : retorna un arreglo que cumpla una condición
//map()     : recorre TODA la estructura / objeto
const pick = (body) => {
  Object.fromEntries(
    camposRequeridos.filter((key) => key in body).map(
      (key) => [key, typeof body[key] === 'string' ? body[key].trim() : body[key]]
    )
  )
}

//Lista completa de personas
exports.list = async (req, res) => {
  res.json(
    await db("personas")
      .select("id", ...camposRequeridos)
      .orderBy("apellidos")
  )
}

//Buscar
exports.get = async (req, res) => {
  const row = await db("personas").where({ id: req.params.id }).first()
  if (!row) throw httpError(404, 'Persona no encontrada')
  res.json(row)
}

//Registrar
exports.create = async (req, res) => {

  //Campos obligatorios
  requireFields(req.body, ["apellidos", "nombres", "email"])

  //Nota: solo es posible validar el email si es OBLIGATORIO
  if (!isEmail(req.body.email)){
    throw httpError(400, "Email incorrecto")
  }

  //Insertar (validando que solo envíes cadenas (string))
  const [id] = await db("personas").insert(pick(req.body))

  //Server code 201 - save OK
  res.status(201).json({ id, message: 'personas registrada' })
}

//Actualizar
exports.update = async (req, res) => {
  //Campos obligatorios
  requireFields(req.body, ["apellidos", "nombres", "email"])
  
  //Email escritor correctamente
  if (!isEmail(req.body.email)){
    throw httpError(400, "Email incorrecto")
  }

  //Actualizando...
  const num = await db("personas")
    .where({ id: req.params.id })
    .update(pick(req.body))

  if (!num) throw httpError(404, "Persona no encontrada")

  res.json({ message: "Persona actualizada" })
}

//Eliminar
exports.remove = async (req, res) => {
  const num = await db("personas")
    .where({ id: req.params.id })
    .del()
  
  if (!num) throw httpError(404, "Persona no encontrada")
  res.json({ message: "Persona eliminada" })
}