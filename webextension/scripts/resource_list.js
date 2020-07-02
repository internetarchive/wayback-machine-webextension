window.onload = () => {
  var url = new URL(window.location.href)
  var url_name = url.searchParams.get('url')
  show_resource_data(url_name)
}

function show_resource_data(url_name) {
  let vdata = {}
  let status = 'start'
  let resource_list_data = new Set()
  let new_resource_length
  $('#current-url').text(url_name)
  chrome.runtime.onMessage.addListener(
    (message) => {
      if (message.message === 'resource_list_show') {
        $('.error').hide()
        vdata = message.data
        status = message.data.status
        $('#current-status').text(status.charAt(0).toUpperCase() + status.slice(1))
        if ('resources' in vdata) {
          vdata.resources.forEach((element) => {
            resource_list_data.add(element)
          })
        }
        for (let item of resource_list_data) {
          $('#resource-list-container').append(
            $('<p>').append(item)
          )
        }
        if (status === 'success') {
          $('.text-right').show()
          new_resource_length = vdata.resources.length
          $('#spn-elements-counter').text(new_resource_length)
        } else if (!status || (status === 'error')) {
          $('#resource-list-container').hide()
        }
      }
    }
  )
}