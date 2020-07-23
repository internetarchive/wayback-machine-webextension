$('#sign_up').click(signUp)
$('#forgot_password').click(forgotPassword)
$('#log_in').click(doLogin)
$('#logout').click(doLogout)

function signUp(){
    openByWindowSetting('https://archive.org/account/signup')
}

function forgotPassword(){
    openByWindowSetting('https://archive.org/account/forgot-password')
}

function doLogin(e){
    e.preventDefault()
    $('#error_message').hide()
    let email = $('#email-address').val()
    let password = $('#password').val()
    if(email.length === 0){
        $('#error_message').show().text('Please type an email')
        return
    }
    if(password.length === 0){
        $('#error_message').show().text('Please type a password')
        return
    }
    $('#log_in').val('Please Wait...')
    const data = new URLSearchParams()
    data.append('username', email)
    data.append('password',password)
    data.append('action',"login")
    const loginPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('timeout'))
        }, 30000)
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
      .then((res)=>{
          if(res.status=='bad_login'){
            $('#error_message').show().text('Incorrect Email or Password')
            $('#log_in').val('Login')
          }else{
            $('#logout').show()
          }
      })
      .catch(e=> console.log(e))
}

function doLogout(){
    chrome.cookies.remove({url:'https://archive.org',name:'logged-in-sig'},()=>{
        $('#logout').hide()
    })
}