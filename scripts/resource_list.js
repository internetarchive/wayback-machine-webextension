window.onload = function () {
    var url = new URL(window.location.href)
    var tab_id = url.searchParams.get('job_id')
    var url_name = url.searchParams.get('url')
    show_resource_data(tab_id,url_name)
  }

  async function show_resource_data(job_id,url_name) {
    let vdata
    let status = 'start'
    const val_data = new URLSearchParams()
    val_data.append('job_id', job_id)
    var current_url = document.getElementById('current_url')
    current_url.innerHTML = url_name + '....'
    while ((status === 'start') || (status === 'pending')) {
      var dom_status = document.getElementById('current_status');
      dom_status.innerHTML = 'Pending'
      // update UI

      await sleep(1000)
      const timeoutPromise = new Promise(function (resolve, reject) {
        setTimeout(() => {
          reject(new Error('timeout'))
        }, 30000)
        if ((status === 'start') || (status === 'pending')) {
          fetch('https://web.archive.org/save/status', {
            credentials: 'include',
            method: 'POST',
            body: val_data,
            headers: {
              'Accept': 'application/json'
            }
          }).then(resolve, reject)
        }
      })
      timeoutPromise
        .then(response => response.json())
        .then(function(data) {
          status = data.status
          vdata = data
        })
        .catch((err)=>{
        })
    }
  
    if (vdata.status === 'success') {
      dom_status.innerHTML = 'Success'
      // update UI
    } else if (!vdata.status || (status === 'error')) {
      dom_status.innerHTML = 'Failed'
      // update UI
    }
  }
  