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

function alexa_statistics_function(){
	var alexa_url = "http://www.alexa.com/siteinfo/";
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
		var tab_url = tabs[0].url;
		chrome.tabs.create({ url: alexa_url+tab_url });
	});
}

function whois_statistics_function(){
	var whois_url = "http://www.whois.com/whois/";
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
		var tab_url = tabs[0].url;
		chrome.tabs.create({ url: whois_url+tab_url });
	});
}

function view_all_function(){
	var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
	url = document.location.href.replace(pattern, "");
	open_url = "https://web.archive.org/web/*/"+encodeURI(url);
	document.location.href = open_url;
}

document.getElementById('save_now').onclick = save_now_function;
document.getElementById('recent_capture').onclick = recent_capture_function;
document.getElementById('first_capture').onclick = first_capture_function;
document.getElementById('alexa_statistics').onclick = alexa_statistics_function;
document.getElementById('whois_statistics').onclick = whois_statistics_function;