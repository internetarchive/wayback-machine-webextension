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
window.onload=function start()
{
    document.getElementById("form").addEventListener("keydown",function(e)
    {
        if(e.keyCode===13)
        {
            var http=new XMLHttpRequest();                                          
            var takeurl=document.getElementById("form").value;
            var newurl="http://archive.org/wayback/available?url="+takeurl;
            http.open("GET",newurl,true);
            http.send(null);
            http.onload=function()
            {
                var data=JSON.parse(http.response);
                if(typeof data.archived_snapshots.closest !=="undefined")
                {
                    var date=data.archived_snapshots.closest.timestamp;
                    var tosearch=data.archived_snapshots.closest.url;
                    var exact=date.substring(0,4)+'/'+date.substring(4,6)+'/'+date.substring(6,8);
                    var time=date.substring(8,10)+'/'+date.substring(10,12)+'/'+date.substring(12,14);
                    var target = document.getElementById("search-option");
                    var newElement = document.createElement('tr');
                    newElement.setAttribute("class","spaceUnder");
                    var newtd=document.createElement('td');
                    newtd.setAttribute("id","new_td");
                    newtd.style.padding='10px';
                    var new_button = document.createElement("BUTTON");
                    new_button.setAttribute("class","btn btn-success button");
                    var t = document.createTextNode("See page On:"+exact);
                    new_button.appendChild(t);
                    target.parentNode.insertBefore(newElement,target.nextSibling);
                    newElement.appendChild(newtd);
                    newtd.appendChild(new_button);
                    document.getElementsByClassName("button")[0].addEventListener("click",function()
                    {
                        chrome.tabs.create({url:tosearch});
                    });
                    window.searchurl=tosearch;
                }
                else
                {
                    var target = document.getElementById("search-option");
                    var newElement = document.createElement('tr');
                    newElement.setAttribute("class","spaceUnder");
                    var newtd=document.createElement('td');
                    newtd.setAttribute("id","new_td");
                    newtd.style.padding='0px 0px 14px 33px';
                    var new_button = document.createElement("BUTTON");
                    new_button.setAttribute("class","btn btn-danger button");
                    var t = document.createTextNode("Page Not Found");
                    new_button.appendChild(t);
                    target.parentNode.insertBefore(newElement,target.nextSibling);
                    newElement.appendChild(newtd);
                    newtd.appendChild(new_button);
                }
            };
        }
    });
    document.getElementById('save_now').onclick = save_now_function;
    document.getElementById('recent_capture').onclick = recent_capture_function;
    document.getElementById('first_capture').onclick = first_capture_function;
    document.getElementById('fb-share-btn').onclick = fb_share;
    document.getElementById('tweet-btn').onclick = tweet;
    document.getElementById('googleplus-btn').onclick=googleshare;
}
var searchurl;
function fb_share(){    
    var fburl="https://www.facebook.com/sharer/sharer.php?u=";
    chrome.tabs.create({url:fburl+searchurl});
}
function tweet(){    
    var tweeturl="https://twitter.com/intent/tweet?text=";
    chrome.tabs.create({url:tweeturl+searchurl});
}
function googleshare(){    
    var googleurl="https://plus.google.com/share?url=";
    chrome.tabs.create({url:googleurl+searchurl});
}