// login.js

// from 'utils.js'
/*   global openByWindowSetting */

// from 'popup.js'
/*   global loginSuccess, loginError */

$('#sign-up').click(signUp)
$('#forgot-password').click(forgotPassword)
$('#log-in').click(doLogin)
$('#logout-button').click(doLogout)

function signUp() {
  openByWindowSetting('https://archive.org/account/signup')
}

function forgotPassword() {
  openByWindowSetting('https://archive.org/account/forgot-password')
}

function doLogin(e) {
  e.preventDefault()
  $('#login-message').hide()
  let email = $('#email-address').val()
  let password = $('#password').val()
  if (email.length === 0) {
    $('#login-message').show().text('Please type an email')
    return
  }
  if (password.length === 0) {
    $('#login-message').show().text('Please type a password')
    return
  }
  $('#log-in').val('Please Wait...')
  // need to set test-cookie for login API to return json instead of html
  chrome.cookies.set({ url: 'https://archive.org', name: 'test-cookie', value: '1' })
  const data = new URLSearchParams()
  data.append('username', email)
  data.append('password', password)
  data.append('action', 'login')
  const loginPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('timeout'))
    }, 5000)
    fetch('https://archive.org/account/login',
      {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(resolve, reject)
  })
  loginPromise
    .then(response => response.json())
    .then((res) => {
      $('#log-in').val('Login')
      if (res.status === 'bad_login') {
        $('#login-message').show().text('Incorrect Email or Password')
      } else {
        $('#login-message').show().css('color', 'green').text('Success')
        loginSuccess()
        setTimeout(() => {
          $('#login-page').hide()
          $('#setting-page').hide()
          $('#popup-page').show()
          $('#login-message').hide()
        }, 500)
        $('#email-address').val('')
        $('#password').val('')
      }
    })
    .catch((e) => {
      console.log(e)
      $('#login-message').show().text('Login Error')
      $('#log-in').val('Login')
    })
}

function doLogout() {
  chrome.cookies.getAll({domain: '.archive.org'}, (cookies) => {
    for (var i = 0; i < cookies.length; i++) {
      if (cookies[i].name !== 'test-cookie') {
        chrome.cookies.remove({url: 'https://archive.org', name: cookies[i].name})
      }
    }
    $('#logout-button').hide()
    $('.tab-item').css('width', '22%')
    loginError()
  })
}
