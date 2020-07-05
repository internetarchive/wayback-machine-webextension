window.onload = () => {
  var url = new URL(window.location.href)
  var url_name = url.searchParams.get('url')
  show_resource_data(url_name)
}

function show_resource_data(url_name) {
  const status_list = {
    pending:'Processing !',
    success: 'Successfully archived the URL !',
    error: 'Error occcured, please try again later !'
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
          $('.loader').hide()
          for (let item of Array.from([...resource_list_data]).slice(old_resource_length,new_resource_length)) {
            $('#resource-list-container').append(
              $('<p>').append(item)
            )
          }
          old_resource_length = new_resource_length
        }
        if (status === 'success') {
          $('#counter-container').show()
          new_resource_length = vdata.resources.length
          $('#spn-elements-counter').text(new_resource_length)
        } else if (!status || (status === 'error')) {
          $('.loader').hide()
          $('#resource-list-container').hide()
        }
      }
    }
  )
}