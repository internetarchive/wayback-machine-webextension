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

function recent_capture_FB_function(){
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    	var taburl = tabs[0].url;
    	var fbShareTab = "https://www.facebook.com/sharer/sharer.php?u=https://web.archive.org/web/2/" + taburl;
	 	chrome.tabs.create({ url: fbShareTab });
	});
}

function recent_capture_twitter_function(){
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    	var taburl = tabs[0].url;
    	var twitterShareTab = "https://twitter.com/intent/tweet?url=https://web.archive.org/web/2/" + taburl;
	 	chrome.tabs.create({ url: twitterShareTab });
	});
}

function first_capture_function(){
	var wb_url = "https://web.archive.org/web/0/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'first' }, function(response) {
	});
}

function first_capture_FB_function(){
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    	var taburl = tabs[0].url;
    	var fbShareTab = "https://www.facebook.com/sharer/sharer.php?u=https://web.archive.org/web/0/" + taburl;
	 	chrome.tabs.create({ url: fbShareTab });
	});
}

function first_capture_twitter_function(){
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    	var taburl = tabs[0].url;
    	var twitterShareTab = "https://twitter.com/intent/tweet?url=https://web.archive.org/web/0/" + taburl;
	 	chrome.tabs.create({ url: twitterShareTab });
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
document.getElementById('recent_capture_fb').onclick = recent_capture_FB_function;
document.getElementById('recent_capture_twitter').onclick = recent_capture_twitter_function;
document.getElementById('first_capture').onclick = first_capture_function;
document.getElementById('first_capture_fb').onclick = first_capture_FB_function;
document.getElementById('first_capture_twitter').onclick = first_capture_twitter_function;

