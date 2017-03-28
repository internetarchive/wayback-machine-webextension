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
function fb_share(search_url){    
    var fburl="https://www.facebook.com/sharer/sharer.php?u=";
    chrome.tabs.create({url:fburl+search_url});
}
function twitter_share(search_url){    
    var tweeturl="https://twitter.com/intent/tweet?text=";
    chrome.tabs.create({url:tweeturl+search_url});
}
function google_share(search_url){    
    var googleurl="https://plus.google.com/share?url=";
    chrome.tabs.create({url:googleurl+search_url});
}
window.onload=function start()
{
    document.getElementById("form").addEventListener("keydown",function(e)
    {
        if(e.keyCode===13)
        {
            var http=new XMLHttpRequest();                                          
            var take_url=document.getElementById("form").value;
            var new_url="http://archive.org/wayback/available?url="+take_url;
            http.open("GET",new_url,true);
            http.send(null);
            http.onload=function()
            {
                var data=JSON.parse(http.response);
                if(typeof data.archived_snapshots.closest !=="undefined")
                {
                    var timestamp_date=data.archived_snapshots.closest.timestamp;
                    var search_url=data.archived_snapshots.closest.url;
                    var formatted_date=timestamp_date.substring(0,4)+'/'+timestamp_date.substring(4,6)+'/'+timestamp_date.substring(6,8);
                    var time=timestamp_date.substring(8,10)+'/'+timestamp_date.substring(10,12)+'/'+timestamp_date.substring(12,14);
                    var target_td = document.getElementById('search_td')
                    target_td.innerHTML = "";
                    var new_button = document.createElement("BUTTON");
                    new_button.setAttribute("class","btn btn-success button");
                    new_button.appendChild(document.createTextNode("See page On:"+formatted_date));
                    target_td.appendChild(new_button);

                    new_button.addEventListener("click",function()
                    {
                        chrome.tabs.create({url:search_url});
                    });
                    document.getElementById('facebook_btn').addEventListener("click",function()
                    {
                        fb_share(search_url);
                    });                    
                    document.getElementById('twitter_btn').addEventListener("click",function()
                    {
                        twitter_share(search_url);
                    });              
                    document.getElementById('googleplus_btn').addEventListener("click",function()
                    {
                        google_share(search_url);
                    });
                }
                else
                {
                    var target_td = document.getElementById('search_td')
                    target_td.innerHTML = "";
                    var new_button = document.createElement("BUTTON");
                    new_button.setAttribute("class","btn btn-danger button");
                    new_button.appendChild(document.createTextNode("Page Not Found"));
                    target_td.appendChild(new_button);
                }
            };
        }
    });
    document.getElementById('save_now').onclick = save_now_function;
    document.getElementById('recent_capture').onclick = recent_capture_function;
    document.getElementById('first_capture').onclick = first_capture_function;
}