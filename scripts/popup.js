
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
 
function shareon_linkedin()
{
	var srch_url = document.getElementById('search').value;
	var linkedishr_url = "https://www.linkedin.com/shareArticle?url="; 
	window.open(linkedishr_url+ 'https://web.archive.org/web/*/' + srch_url , 'newwindow', 'width=500, height=400');
}
 

document.getElementById('twit_share').onclick = shareon_twitter;
document.getElementById('fb_share').onclick = shareon_facebook;
document.getElementById('gplus_share').onclick = shareon_googleplus;
document.getElementById('linkedin_share').onclick = shareon_linkedin;
document.getElementById('save_now').onclick = save_now_function;
document.getElementById('recent_capture').onclick = recent_capture_function;
document.getElementById('first_capture').onclick = first_capture_function;
document.getElementById('search_tweet').onclick = search_tweet_function;


window.onload=function(){

    chrome.runtime.sendMessage({message: "sendurl"}, function(response) {
        
        display_alexa_info(response.sent_url);
        display_whois_info(response.sent_url);
    });
    
};

function display_alexa_info(url){
    var alexa_url = 'http://data.alexa.com/data?cli=10&dat=snbamz&url=';
		
		var xhr = new XMLHttpRequest();
        
    
		xhr.open("GET", alexa_url+url, true);
		xhr.onload = function() {
        
			var data=xhr.responseXML.documentElement;
            
            var alexadisp=document.getElementById('div_for_alexa');
            if(data.getElementsByTagName('ALEXA')){
                alexadisp.innerHTML="<b>Alexa:</b>";
                var hostdisp=document.getElementById('host');
            if(data.getElementsByTagName('SD')[0].getAttribute('HOST')){
                var host=data.getElementsByTagName('SD')[0].getAttribute('HOST');
                hostdisp.innerHTML='<br><b>Hosted on: '+host+'</b>';
    
            }
            var countrydisp=document.getElementById('country');
            var rankdisp=document.getElementById('rank');
            if(data.getElementsByTagName('COUNTRY')[0]){
                var country=data.getElementsByTagName('COUNTRY')[0].getAttribute('NAME');
                var rank=data.getElementsByTagName('COUNTRY')[0].getAttribute('RANK');
                countrydisp.innerHTML='<br><b>Country of origin: '+country+'</b>';
                rankdisp.innerHTML='<br><b>Rank: '+rank+'</b>';
        
    
                
            }
            var relateddisp=document.getElementById('related');
           
            if(data.getElementsByTagName('RL')!=null){
                 var related="<br><b>Related sites :</b><ol> ";
                 for(var i=0;i<data.getElementsByTagName('RL').length;i++){
                     var link=data.getElementsByTagName('RL')[i].getAttribute('HREF');
                     related=related+"<li><a href="+link+">"+link+"</a></li>"
                 }
                related=related+"</ol>";
                relateddisp.innerHTML=related;
        
            }
            }
			
		};
		xhr.send(null);
    
}

function display_whois_info(url){
    var whois_url = 'http://api.bulkwhoisapi.com/whoisAPI.php?domain=';
		url = url.slice(0, -1);
		var xhr = new XMLHttpRequest();
        
        
		xhr.open("GET", whois_url + url+"&token=usemeforfree", true);
		xhr.onload = function() {

            var data = xhr.responseText;
            if(data.response_code=='success'){
                var whoisdisp=document.getElementById('div_for_whois');
                whoisdisp.innerHTML="<b>Whois:</b>";
            var creationdisp=document.getElementById('creation');
                if(data.formatted_data.CreationDate){
            creationdisp.innerHTML="<b>Creation date : "+data.formatted_data.CreationDate+"</b>";
                }
                if(data.formatted_data.RegistrarRegistrationExpirationDate){
            var expirationdisp=document.getElementById('expiration');
            expirationdisp.innerHTML="<b> Expiry date: "+data.formatted_data.RegistrarRegistrationExpirationDate+"</b>";
                }
            var sysemail=document.getElementById('adminemail');
                if(data.formatted_data.AdminEmail){
            sysemail.innerHTML="<b>System admin: "+data.formatted_data.AdminEmail+"</b>";
                }
            }
		};
		xhr.send(null);
    
}
