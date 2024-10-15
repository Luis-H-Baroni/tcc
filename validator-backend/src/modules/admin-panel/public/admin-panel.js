document.addEventListener('DOMContentLoaded', async function () {
  let token = localStorage.getItem('authToken')

  const element = await fetch('/admin/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (element.status === 200) {
    const htmlContent = await element.text()
    document.getElementById('mainContainer').outerHTML = htmlContent
    htmx.process(document.getElementById('dashboard'))
  } else {
    document
      .getElementById('loginForm')
      .addEventListener('htmx:afterRequest', async function (event) {
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
