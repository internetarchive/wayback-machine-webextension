
function save_now_function(){
	var wb_url = "https://web.archive.org/save/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'save' }, function(response) {
	});
}


function recent_capture_function(){
	var wb_url = "https://web.archive.org/web/2/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'recent' }, function(response) {
			  
			  if(!response.status){
			  	notify("URL not found in wayback archives!");
			  }
		  
});
}

function notify(msg)
{
	chrome.notifications.create(
								'wayback-notification',{   
								type: 'basic', 
								iconUrl: '/images/icon@2x.png', 
								title: "Message", 
								message: msg
								},
								function(){} 
							);
}

function first_capture_function(){
	var wb_url = "https://web.archive.org/web/0/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'first' }, function(response) {
	if(!response.status){
			notify("URL not found in wayback archives!");
		}	
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
	var url_toSearch = document.getElementById('search').value;
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

//Sharing on Social Media 
function shareon_facebook()
{
	var srch_url = document.getElementById('search').value;
	var fbshr_url = "https://www.facebook.com/sharer/sharer.php?u="
	window.open(fbshr_url+ 'https://web.archive.org/web/*/' + srch_url , 'newwindow', 'width=500, height=400');
}

function shareon_twitter()
{
	var srch_url = document.getElementById('search').value;
	var twitshr_url = "https://twitter.com/home?status=";
	window.open(twitshr_url+ 'https://web.archive.org/web/*/' + srch_url , 'newwindow', 'width=500, height=400');
}

function shareon_googleplus()
{
	var srch_url = document.getElementById('search').value;
	var gplusshr_url = "https://plus.google.com/share?url="; 
	window.open(gplusshr_url+ 'https://web.archive.org/web/*/' + srch_url , 'newwindow', 'width=500, height=400');
}

document.getElementById('twit_share').onclick = shareon_twitter;
document.getElementById('fb_share').onclick = shareon_facebook;
document.getElementById('gplus_share').onclick = shareon_googleplus;
document.getElementById('save_now').onclick = save_now_function;
document.getElementById('recent_capture').onclick = recent_capture_function;
document.getElementById('first_capture').onclick = first_capture_function;
document.getElementById('search_tweet').onclick = search_tweet_function;
window.onload=automatic_archive();
function automatic_archive(){
    chrome.runtime.sendMessage({message:"checkurl"},function(response)
    {
        if(response.status==false){
            save_now_function();
        }
        
    });
window.onload =get_alexa_info();

function get_alexa_info(){
 	chrome.runtime.sendMessage({message: "geturl" }, function(response) {
		url_getter(response.url);
	});
	function url_getter(url) {
			var alexa_url = 'http://xml.alexa.com/data?cli=10&dat=n&url=';
			var host_url = url.replace(/^https{0,1}:\/\//, '').replace(/^www\./, '').replace(/\/.*/, '');
			var http = new XMLHttpRequest();
			http.open("GET", alexa_url + host_url, true);
			http.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var html = "<b>"+"<span class='color_code'>"+ host_url +'</span>'+"</b><br/><b>Alexa Rank: </b>";
	 				var xmldata = http.responseXML.documentElement;
					if (xmldata.getElementsByTagName("POPULARITY")) 
					{
	 					html +="<span class='color_code'>"+xmldata.getElementsByTagName("POPULARITY")[0].getAttribute('TEXT')+"</span>";
	 				} 
	 				else {
	 					html += "N/A";
					}
					if(xmldata.getElementsByTagName("COUNTRY"))
					{
						html += '<br/>'+'<b>Country:</b>' +"<span class='color_code'>"+
					            xmldata.getElementsByTagName('COUNTRY')[0].getAttribute('NAME');
					}
					else{
						html+="N/A";
					}
				document.getElementById("show_alexa_data").innerHTML = html;
				document.getElementById("show_nothing").style.display="block";
				}
			};
		http.send(null);
	}
}