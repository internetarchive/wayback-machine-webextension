var ele = document.getElementById('theme');
ele.addEventListener('change', function() {
    chrome.storage.sync.set({
        favoriteColor: this.value
    }, function() {
        // Update status to let user know options were saved.
       /* var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750); */
    });
});

function handleResponse() {
    console.log("Success");
}

function handleError() {
    console.log("error occured");
}