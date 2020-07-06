window.onload = () => {
  var url = new URL(window.location.href)
  var url_name = url.searchParams.get('url')
  console.log(document.location.hash)
  if(document.location.hash == '#not_refreshed'){
    show_resource_data(url_name)
    document.location.hash = '#refreshed'
  }else{
    show_error();
  }
}

function show_resource_data(url_name) {
  const status_list = {
    pending:'Processing...',
    success: 'Save Succeeded.',
    error: 'An Error Occurred. Please Try Again !'
  }
  let vdata = {}
  let status = 'start'
  let resource_list_data = new Set()
  let old_resource_length = 0
  let new_resource_length
  $('#current-url').text(url_name)
  chrome.runtime.onMessage.addListener(
    (message) => {
      if (message.message === 'resource_list_show' && message.url === url_name) {
        vdata = message.data
        status = message.data.status
        $('#current-status').text(status_list[status])
        if ('message' in vdata) {
          $('#message').text(vdata.message)
        }
        if ('resources' in vdata) {
          new_resource_length = vdata.resources.length
          vdata.resources.forEach((element) => {
            resource_list_data.add(element)
          })
        }
        if(new_resource_length>old_resource_length){
          for (let item of Array.from([...resource_list_data]).slice(old_resource_length,new_resource_length)) {
            $('#resource-list-container').append(
              $('<p>').append(item)
            )
          }
          old_resource_length = new_resource_length
        }
        if (status === 'success') {
          $('.loader').hide()
          $('#counter-container').show()
          new_resource_length = vdata.resources.length
          $('#spn-elements-counter').text(new_resource_length)
        } else if (status === 'error') {
          $('.loader').hide()
          $('#resource-list-container').hide()
        }
      }
    }
  )
}

function show_error() {
  $('.loader').hide()
  $('.error').show()
}