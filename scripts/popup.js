
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

function search_tweet_function(){
	var twitter_url = "https://twitter.com/search?q=";
	var url_toSearch = document.getElementById('tweet_URL_input').value;
	var from_date = document.getElementById('from-date').value;
	var to_date = document.getElementById('to-date').value;

	if(!from_date) {
		from_date = "2006-03-21";	
	}
	
	if (!to_date) {
		var today = new Date();
		to_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	}

	chrome.tabs.create({ url: twitter_url+"\""+url_toSearch+"\"%20since%3A"+from_date+"%20until%3A"+to_date });
}

document.getElementById('save_now').onclick = save_now_function;
document.getElementById('recent_capture').onclick = recent_capture_function;
document.getElementById('first_capture').onclick = first_capture_function;
document.getElementById('search_tweet').onclick = search_tweet_function;