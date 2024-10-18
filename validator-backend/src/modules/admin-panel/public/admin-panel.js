document.addEventListener('DOMContentLoaded', async function () {
  let token = localStorage.getItem('authToken')

  const element = await fetch('/admin/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (element.status === 200) {
    const htmlContent = await element.text()
    console.log('token valido, pulando login, carregando dashboard')
    document.getElementById('mainContainer').outerHTML = htmlContent
    htmx.process(document.getElementById('dashboard'))
  } else {
    document
      .getElementById('loginForm')
      .addEventListener('htmx:afterRequest', async function (event) {
        if (event.detail.xhr.status === 401) return

        const response = event.detail.xhr.responseText
        console.log('response', response)
        try {
          const jsonResponse = JSON.parse(response)
          if (jsonResponse.access_token) {
            localStorage.setItem('authToken', jsonResponse.access_token)
          }
        } catch (error) {
          console.error('Error parsing response or saving token:', error)
        }

        token = localStorage.getItem('authToken')
        const element = await fetch('/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const htmlContent = await element.text()
        document.getElementById('mainContainer').outerHTML = htmlContent
        htmx.process(document.getElementById('dashboard'))
      })
  }
})

document.addEventListener('htmx:configRequest', function (event) {
  console.log('entering htmx:configRequest', event)
  if (event.target.id === 'loginForm') return
  const token = localStorage.getItem('authToken')
  event.detail.headers['Authorization'] = `Bearer ${token}`
})

document.addEventListener('htmx:responseError', function (event) {
  console.log('entering htmx:responseError', event)
  if (event.detail.xhr.status === 401) {
    if (event.target.id === 'loginForm') {
      console.log('login falhou (401)')
      document.getElementById('loginInfo').innerText = 'Usuário ou senha inválidos'
      return
    }
    console.log('unauthorized, removendo token, recarregando página')
    localStorage.removeItem('authToken')
    window.location.reload()
  }
})

document.addEventListener('click', function (event) {
  if (event.target.id === 'logout') {
    console.log('logout')
    localStorage.removeItem('authToken')
    window.location.reload()
  }
})

document.addEventListener('htmx:beforeRequest', function (event) {
  console.log('entering htmx:beforeRequest', event)
  if (event.target.id === 'loginForm') return
  if (event.target.id === 'update-institution') {
    if (!confirm('A instituição será atualizada. Deseja continuar?')) {
      event.preventDefault()
    }
  }
  if (event.target.id === 'delete-institution') {
    if (!confirm('A instituição será deletada. Deseja continuar?')) {
      event.preventDefault()
    }
  }
})

htmx.defineExtension('path-params', {
  onEvent: function (name, evt) {
    if (name === 'htmx:configRequest') {
      evt.detail.path = evt.detail.path.replace(
        /{{([A-Za-z0-9_]+)}}/g,
        function (_, param) {
          let val = evt.detail.parameters[param]
          delete evt.detail.parameters[param] // don't pass in query string since already in path
          return val
        },
      )
    }
  },
})
