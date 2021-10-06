// login.js

// from 'utils.js'
/*   global openByWindowSetting */

// from 'popup.js'
/*   global loginSuccess, loginError */

// onload
$(function() {
  $('#signup-btn').click(signUp)
  $('#forgot-pw-btn').click(forgotPassword)
  $('#login-btn').click(doLogin)
  $('#logout-tab-btn').click(doLogout)
})

function signUp() {
  openByWindowSetting('https://archive.org/account/signup')
}

function forgotPassword() {
  openByWindowSetting('https://archive.org/account/forgot-password')
}

function doLogin(e) {
  e.preventDefault()
  $('#login-message').hide()
  let email = $('#email-input').val()
  let password = $('#password-input').val()
  if (email.length === 0) {
    $('#login-message').show().text('Please type an email')
    return
  }
  if (password.length === 0) {
    $('#login-message').show().text('Please type a password')
    return
  }
  $('#login-btn').val('Please Wait...')
  // need to set test-cookie for login API to return json instead of html
  chrome.cookies.set({ url: 'https://archive.org', name: 'test-cookie', value: '1' })
  var data = JSON.stringify({
    "email": email,
    "password": password
  });
  const loginPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('timeout'))
    }, 5000)
    fetch('https://archive.org/services/xauthn?op=login',
      {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(resolve, reject)
  })
  loginPromise
    .then(response => {console.log(response);return response.json();})
    .then((res) => {
      $('#login-btn').val('Login')
      if (res.success === false) {
        $('#login-message').show().text('Incorrect Email or Password')
      } else {
        $('#login-message').show().css('color', 'green').text('Success')
        loginSuccess()
        setTimeout(() => {
          $('#login-page').hide()
          $('#setting-page').hide()
          $('#popup-page').show()
          $('#login-message').removeAttr("style").hide()
        }, 500)
        $('#email-input').val('')
        $('#password-input').val('')
      }
    })
    .catch((e) => {
      console.log(e)
      $('#login-message').show().text('Login Error')
      $('#login-btn').val('Login')
    })
}

function doLogout() {
  chrome.cookies.getAll({ domain: '.archive.org' }, (cookies) => {
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].name !== 'test-cookie') {
        chrome.cookies.remove({ url: 'https://archive.org', name: cookies[i].name })
      }
    }
    $('#logout-tab-btn').hide()
    $('.tab-item').css('width', '22%')
    loginError()
  })
}
