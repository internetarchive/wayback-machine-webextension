window.onload = () => {
  var url = new URL(window.location.href)
  var url_name = url.searchParams.get('url')
  show_resource_data(url_name)
}

function show_resource_data(url_name) {
  let vdata = {}
  let status = 'start'
  let resource_list_data = new Set()
  let old_resource_length = 0
  let new_resource_length
  $('#current-url').text(url_name + '.....')
  chrome.runtime.onMessage.addListener(
    (message) => {
      $('.error').hide()
      if (message.message === 'resource_list_show') {
        vdata = message.data
        status = message.data.status
        $('#current-status').text(status.charAt(0).toUpperCase() + status.slice(1))
        if (status === 'pending' || status === 'start') {
          if ('resources' in vdata) {
            new_resource_length = vdata.resources.length
            vdata.resources.forEach((element) => {
              resource_list_data.add(element)
            })
          }
          if (new_resource_length > old_resource_length) {
            old_resource_length = new_resource_length
            for (let item of resource_list_data) {
              $('#resource-list-container').append(
                $('<p>').append(item)
              )
            }
          }
        } else if (status === 'success') {
          $('.text-right').show()
          new_resource_length = vdata.resources.length
          $('#spn-elements-counter').text(new_resource_length)
          vdata.resources.forEach((element) => {
            resource_list_data.add(element)
          })
          if (new_resource_length > old_resource_length) {
            old_resource_length = new_resource_length
            for (let item of resource_list_data) {
              $('#resource-list-container').append(
                $('<p>').append(item)
              )
            }
          }
        } else if (!status || (status === 'error')) {
          $('#resource-list-container').hide()
        }
      }
    }
  )
}