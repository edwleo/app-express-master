//Gestiona la lógica del lado del frontend
//Variables globales (CRUD - VALIDACIÓN)
let personas = []
let usuarios = []
let idPersonaEditando = null
let idUsuarioEditando = null

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

async function iniciar(){
  const yo = await llamarApi('/api/auth/me')
  document.getElementById('who').textContent = `${yo.nombres} ${yo.apellidos} (${yo.nivel_acceso})`

  //Si eres un ADMIN deberías poder ver otras funciones...
}

iniciar()