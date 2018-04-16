var $container = document.getElementById('myModal');
if ($container.getAttribute('count') == 1) {
  var loading = document.createElement('div');
  loading.setAttribute('id', 'loading');
  $container.appendChild(loading);
  var animate = document.createElement('img');
  var fullURL = chrome.runtime.getURL('images/logo-animate.svg');
  animate.setAttribute('src', fullURL);
  animate.setAttribute('id', 'animated-logo');
  document.getElementById('loading').appendChild(animate);
}
chrome.runtime.sendMessage({ message: 'sendurlforrt' });
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.RTurl != "") {
		var url = message.RTurl;
		if (url.includes('https')) {
			url = url.replace('https://', '');
		} else {
			url = url.replace('http://', '');
		}
		var pos = url.indexOf('/');
		if (pos != -1) url = url.substring(0, pos);
		var base_url = url;
		var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://web.archive.org/web/timemap/json?url="+url+"/&fl=timestamp:4,urlkey&matchType=prefix&filter=statuscode:200&filter=mimetype:text/html&collapse=urlkey&collapse=timestamp:4&limit=100000", true);
		xhr.onerror = function() {
			var animateSvg = document.getElementById('animated-logo');
			document.getElementById('loading').removeChild(animateSvg);
			alert("An error occured. Please refresh the page and try again");
		};
		xhr.ontimeout = function() {
			var animateSvg = document.getElementById('animated-logo');
			document.getElementById('loading').removeChild(animateSvg);
			alert("Time out. Please refresh the page and try again");
		}
		xhr.onload = function() {
			var response = JSON.parse(xhr.responseText);
			var animateSvg = document.getElementById('animated-logo');
			document.getElementById('loading').removeChild(animateSvg);
      new wb.RadialTree(document.getElementById('loading'), response, {url: url});
		};
		xhr.send();
	}
});
