//Gestiona la lógica del lado del frontend
//Variables globales (CRUD - VALIDACIÓN)
let personas = []
let usuarios = []
let idPersonaEditando = null
let idUsuarioEditando = null

// *** FUNCIONES UTILS ***
//Función que permita ejecutar peticiones asíncronas (FETCH)
async function llamarApi(url, metodo, datos){
  const opciones = {
    method: metodo || 'GET',
    headers: { 'Content-Type':'application/json' }
  }

  //No siempre se enviarán datos...
  if (datos) { opciones.body = JSON.stringify(datos) }

  //Ejecutamos la petición (PROMISE)
  const respuesta = await fetch(url, opciones)

  //Es posible que la pertición no se resuelva
  //Evaluamos todos los escenarios donde falla => 4XX, 5XX
  if (respuesta.status == 401){
    window.location.href =  '/login.html'
    throw new Error('Sesión expirada')
  }

  const resultado = await respuesta.json() //JSON

  //Si el estado es diferente a 2XX
  if (!respuesta.ok){
    throw new Error(resultado.message) //Stop
  }

  return resultado
}

//Función renderiza una fila vacía 
function crearFilaVacia(columnas){
  const fila = document.createElement('tr')
  const celda = document.createElement('td')
  celda.colSpan = columnas
  celda.textContent = 'Aún no hay registros'
  fila.appendChild(celda)
  return fila //Agregar al cuerpo de tu tabla
}

function crearBoton(texto, clases){
  const boton = document.createElement('button')
  boton.textContent = texto
  boton.className = clases
  return boton  //Agregar en cualquier parte del DOM
}

function crearCelda(texto){
  const celda = document.createElement('td')
  celda.textContent = texto || ''
  return celda
}

// *** ACCESO AL SISTEMA ***
//Función de identificación
async function iniciar(){
  const yo = await llamarApi('/api/auth/me')
  document.getElementById('who').textContent = `${yo.nombres} ${yo.apellidos} (${yo.nivel_acceso})`

  //Si eres un ADMIN deberías poder ver otras funciones...

  //Rutina que se ejecuta una vez iniciemos sesión...
  cargarPersonas()
}

async function cerrarSesion(){
  await llamarApi('/api/auth/logout', 'POST')
  window.location.href = '/login.html'
}

//*** FUNCIONES PARA GESTIÓN DE PERSONAS ***
async function cargarPersonas(){
  personas = await llamarApi('/api/personas')
  const cuerpo = document.getElementById('cuerpoPersonas') //<tbody></tbody>
  cuerpo.innerHTML = ''

  if (personas.length === 0){
    cuerpo.appendChild(crearFilaVacia(6))
    return //Retorno anticipado
  }

  personas.forEach(persona => {
    //Por cada object debemos crear una fila
    const fila = document.createElement('tr')
    
    fila.appendChild(crearCelda(persona.apellidos))
    fila.appendChild(crearCelda(persona.nombres))
    fila.appendChild(crearCelda(persona.telefono))
    fila.appendChild(crearCelda(persona.email))
    fila.appendChild(crearCelda(persona.direccion))
    //fila.appendChild(crearCelda()) //Solo permite agregar TEXTOS

    //Crear 2 botones
    const celdaBotones = document.createElement('td')   //<td></td>
    const botonEditar = crearBoton('Editar', 'btn')     //<button></button>
    const botonEliminar = crearBoton('Eliminar', 'btn') //<button></button>

    //No solo debemos renderizar el botón, también agregarle eventos...
    botonEditar.onclick = function () { abrirFormularioPersonas(persona) }
    botonEliminar.onclick = function () { eliminarPersona(persona.id) } 

    celdaBotones.appendChild(botonEditar)
    celdaBotones.appendChild(botonEliminar)

    fila.appendChild(celdaBotones)
    cuerpo.appendChild(fila)
  })
}

function abrirFormularioPersonas(persona){
  if (persona){
    //Editar
    idPersonaEditando = persona.id
    document.querySelector('.dialog-title').textContent = 'Editar persona'

    //Mostrar los datos del objeto en los controles del formulario
    document.getElementById('apellidos').value = persona.apellidos
    document.getElementById('nombres').value = persona.nombres
    document.getElementById('telefono').value = persona.telefono
    document.getElementById('email').value = persona.email
    document.getElementById('direccion').value = persona.direccion
  }else{
    //Agregar nueva persona (persona = null)
    idPersonaEditando = null
    document.querySelector('.dialog-title').textContent = 'Nueva persona'
    document.getElementById('formPersona').reset()
  }

  //Abrimos el Dialog
  document.getElementById("dialogPersona").showModal()
}

//Se ejecutará desde el submit, requerimos el event para detenerlo
async function guardarPersona(event){
  event.preventDefault()

  //NUEVO - EDITAR: Empaquetar todos los datos que enviaremos...
  const datos = {
    apellidos: document.getElementById('apellidos').value,
    nombres: document.getElementById('nombres').value,
    telefono: document.getElementById('telefono').value,
    email: document.getElementById('email').value,
    direccion: document.getElementById('direccion').value
  }

  try{
    //¿Editar o registrar nuevo?
    if (idPersonaEditando){
      await llamarApi(`/api/personas/${idPersonaEditando}`, 'PUT', datos)
    }else{
      await llamarApi('/api/personas', 'POST', datos)
    }

    document.getElementById('dialogPersona').close() //Cerrar dialogo
    await cargarPersonas() //Se renderiza la el cuerpo de la TABLA
  }catch(e){
    //Notificar el error en el mismo formulario (evitar alertas)
    document.getElementById('errorPersona').textContent = e.message
  }
}

async function eliminarPersona(id){
  if (!confirm("¿Eliminamos esta persona?")){
    return;
  }

  try{
    await llamarApi(`/api/personas/${id}`, 'DELETE')
    await cargarPersonas()
  }catch(e){
    alert(e.message)
  }
}

//Manejadores de evento
document.getElementById("logout").addEventListener("click", cerrarSesion)
document.getElementById("nuevaPersona").addEventListener("click", function () { abrirFormularioPersonas(null) })
document.getElementById("formPersona").addEventListener("submit", guardarPersona)

iniciar()