
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


function view_all_function(){
	var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
	url = document.location.href.replace(pattern, "");
	open_url = "https://web.archive.org/web/*/"+encodeURI(url);
	document.location.href = open_url;
}



function search_tweet_function(){
	var twitter_url = "https://twitter.com/search?l=&q=";
	var url_toSearch = document.getElementById('tweet_URL_input').value;
	var commonWords = ['i','a','about','an','and','are','as','at','be','by','com','de','en','for','from','how','in','is','it','la','of','on','or','that','the','this','to','was','what','when','where','who','will','with','und','the','www','','in','to','the','all','and','by','of','for','on','is','this','or','with','are','an','home','be','that','you','from','it','about','at','not','have','was','if','new','also','en','will','your','more','one','site','so','any','can','time','top','may','has','do','only','see','view','use','web','our','these','but','terms','my','we','me','out','been','when','information','la','they','there','email','free','like','next','online','date','name','index','links','over','their','first','am','id','policy','last','service','here','add','back'];
    var text = url_toSearch;
    var text = text.replace(/^https?\:\/\//i, ""); //removing https
    var link = (' ' + text).slice(1);
    text = text.toLowerCase();
	var parts = /[/.?_=-]/g;

    var result = text.split(parts);
	text = text.replace(/[^\w\d ]/g, ''); // removing the useless characters
	result = result.filter(function (word) {
	    return commonWords.indexOf(word) === -1;
	});
	
	result = result.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
    });


	var final_term = link;
	/*for (var i = 1; i < result.length ; i++) {
		final_term += "%20";
		final_term += result[i];
	}*/
	


	var final_url = twitter_url + final_term ; //smarter search

	window.open(final_url, "", "width=750,height=1000");
}


function get_URL(){
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        document.getElementById('tweet_URL_input').value = url;
      });
}

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

function shareon_linkedin()
 {
   var srch_url = document.getElementById('search').value;
   var linkedishr_url = "https://www.linkedin.com/shareArticle?url="; 
   window.open(linkedishr_url+ 'https://web.archive.org/web/*/' + srch_url , 'newwindow', 'width=500, height=400');
 }




window.onload = get_URL();
document.getElementById('twit_share').onclick = shareon_twitter;
document.getElementById('fb_share').onclick = shareon_facebook;
document.getElementById('gplus_share').onclick = shareon_googleplus;
document.getElementById('linkedin_share').onclick = shareon_linkedin;
document.getElementById('save_now').onclick = save_now_function;
document.getElementById('recent_capture').onclick = recent_capture_function;
document.getElementById('first_capture').onclick = first_capture_function;
document.getElementById('search_tweet').onclick = search_tweet_function;
