document.getElementById('formLogin').addEventListener('submit', async (event) => {
  event.preventDefault()

  //Verificar los datos
  const resultLogin = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(new FormData(event.target)))
  })

  //Atributo OK = 2XX (true)
  if (resultLogin.ok) { location.href = '/index.html' }
  else { document.getElementById("mensaje").textContent = (await resultLogin.json()).message }
})