function save_now_function(){
	var wb_url = "https://web.archive.org/save/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'save' }, function(response) {
	});
}

function recent_capture_function(){
	var wb_url = "https://web.archive.org/web/2/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'recent' }, function(response) {
	});
}

function first_capture_function(){
	var wb_url = "https://web.archive.org/web/0/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'first' }, function(response) {
	});
}

function view_all_function(){
	var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
	url = document.location.href.replace(pattern, "");
	open_url = "https://web.archive.org/web/*/"+encodeURI(url);
	document.location.href = open_url;
}

function get_alexa_info(){
	chrome.runtime.sendMessage({message: "geturl" }, function(response) {
		ask_for(response.url);
	});
	function ask_for(url) {
		var alexa_url = 'http://xml.alexa.com/data?cli=10&dat=n&url=';
		var host = url.replace(/^https{0,1}:\/\//, '');
		host = host.replace(/^www\./, '');
		host = host.replace(/\/.*/, '');
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", alexa_url + host, true);
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var html = "<b>" + host + "</b><br/>Rank: ";
				var xmlDoc = xhttp.responseXML.documentElement;
				if (xmlDoc.getElementsByTagName("POPULARITY")) {
					html += xmlDoc.getElementsByTagName("POPULARITY")[0].getAttribute('TEXT');
				} else {
					html += "N/A";
				}
				var rl = xmlDoc.getElementsByTagName("RL");
				if (rl) {
					html += "<br/>Related sites:<br/><ul>"
					for (i = 0; i < rl.length; i++) {
						html += "<li><a href='"
						+ rl[i].getAttribute("HREF")
						+ "'>"
						+ rl[i].getAttribute("TITLE")
						+ "</a></li>";
					}
					html += "</ul>";
				}
				document.getElementById("alexa_cont").innerHTML = html;
			}
		};
		xhttp.send(null);
	}
}

document.getElementById('save_now').onclick = save_now_function;
document.getElementById('recent_capture').onclick = recent_capture_function;
document.getElementById('first_capture').onclick = first_capture_function;
document.getElementById('alexa').onclick = get_alexa_info;
