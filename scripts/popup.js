global_url="";

function remove_port(url){
    if(url.substr(-4)==':80/'){
        url=url.substring(0,url.length-4);
    }
    return url;
}

function remove_wbm(url){
    var pos=url.indexOf('/http');
    if(pos!=-1){
        var new_url=url.substring(pos+1);
    }else{
        var pos=url.indexOf('/www');
        var new_url=url.substring(pos+1);
    }
    return remove_port(new_url);
}

function remove_alexa(url){
    var pos=url.indexOf('/siteinfo/');
    var new_url=url.substring(pos+10);
    return remove_port(new_url);
}

function remove_whois(url){
    var pos=url.indexOf('/whois/');
    var new_url=url.substring(pos+7);
    return remove_port(new_url);
}
/* Common method used everywhere to retrieve cleaned up URL */
function retrieve_url(){
    var search_term = document.getElementById('search_input').value;
    if(search_term == ""){
        var url=global_url;
    }else{
        var url=search_term;
    }
    return url;
}

function get_clean_url() {
    var url=retrieve_url();
    if (url.includes('web.archive.org')) {
        url=remove_wbm(url);
    } else if (url.includes('www.alexa.com')) {
        url=remove_alexa(url);
    } else if (url.includes('www.whois.com')) {
        url=remove_whois(url);
    }
    return url;
}

function save_now(){
	  chrome.runtime.sendMessage({message: "openurl",
                                wayback_url: "https://web.archive.org/save/",
                                page_url: get_clean_url(),
                                method:'save' }).then(handleResponse, handleError);
}

function recent_capture(){
	  chrome.runtime.sendMessage({message: "openurl",
                                wayback_url: "https://web.archive.org/web/2/",
                                page_url: get_clean_url(),
                                method:'recent'});
}

function first_capture(){
	  chrome.runtime.sendMessage({message: "openurl",
                                wayback_url: "https://web.archive.org/web/0/",
                                page_url: get_clean_url(),
                                method:'first'});
}

function view_all(){
	  chrome.runtime.sendMessage({message: "openurl",
                                wayback_url: "https://web.archive.org/web/*/",
                                page_url: get_clean_url(),
                                method:'viewall'});
}

function get_url(){
    chrome.tabs.query({active: true,currentWindow:true},function(tabs){
        global_url=tabs[0].url;
    });
}

function social_share(eventObj){
    var parent=eventObj.target.parentNode;
    var id=parent.getAttribute('id');
    var sharing_url="";
    var url=retrieve_url();
    var overview_url="https://web.archive.org/web/*/";
    if (url.includes('web.archive.org')){
        sharing_url=url; //If the user is already at a playback page,share that URL
    }
    else{
        sharing_url=overview_url+get_clean_url(); //When not on a playback page,share the overview version of that URL
    }
    var open_url="";
    if(!(url.includes('chrome://') || url.includes('chrome-extension://'))){ //Prevents sharing some unnecessary page
        if(id.includes('fb')){
            open_url="https://www.facebook.com/sharer/sharer.php?u="+sharing_url; //Share the wayback machine's overview of the URL
        }else if(id.includes('twit')){
            open_url="https://twitter.com/home?status="+sharing_url;
        }else if(id.includes('gplus')){
            open_url="https://plus.google.com/share?url="+sharing_url;
        }else if(id.includes('linkedin')){
            open_url="https://www.linkedin.com/shareArticle?url="+sharing_url;
        }
        window.open(open_url, 'newwindow', 'width=800, height=280,left=0');
    }
}

function search_tweet(eventObj){
    var url = get_clean_url();
    url = url.replace(/^https?:\/\//,'');
    if(url.slice(-1)=='/') url=url.substring(0,url.length-1);
    var open_url="https://twitter.com/search?q="+url;
    chrome.storage.sync.get(['show_context'],function(event1){
        if(event1.show_context==undefined){
            event1.show_context="tab";
        }
        if(event1.show_context=="tab"){
            chrome.tabs.create({url:open_url});
        }else{
          chrome.system.display.getInfo(function(displayInfo){
            let height = displayInfo[0].bounds.height;
            let width = displayInfo[0].bounds.width;
            chrome.windows.create({url:open_url,width:width/2, height:height, top:0, left:width/2, focused:true});
          });
        }
    });
}


function display_list(key_word){
    $sbox = document.getElementById('suggestion-box');
    $sbox.style.display='none';
    $sbox.innerHTML="";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://web.archive.org/__wb/search/host?q="+key_word, true);
    xhr.onload=function(){
        $sbox.style.display='none';
        $sbox.innerHTML="";
        var data=JSON.parse(xhr.response);
        var n=data.hosts.length;
        if(n>0 && document.getElementById('search_input').value!=''){
            $sbox.style.display='block';
            for(var i=0;i<n;i++){
                var a=document.createElement('a');
                a.onclick=function(event){
                    document.getElementById('search_input').value=event.target.innerHTML;
                    $sbox.style.display='none';
                    $sbox.innerHTML="";
                };
                a.setAttribute('role','button');
                a.innerHTML=data.hosts[i].display_name;
                var li=document.createElement('li');
                li.appendChild(a);
                $sbox.appendChild(li);
            }
        }
    };
    xhr.send(null);
}

function display_suggestions(e){
    document.getElementById('suggestion-box').style.display='none';
    document.getElementById('suggestion-box').innerHTML="";
    if(e.keyCode==13){
        e.preventDefault();
    }else {
        //setTimeout is used to get the text in the text field after key has been pressed
        window.setTimeout(function(){
            var len=document.getElementById('search_input').value.length;
            if((len)>=3){
                display_list(document.getElementById('search_input').value);
            }else{
                document.getElementById('suggestion-box').style.display='none';
                document.getElementById('suggestion-box').innerHTML="";
            }
        },0.1);
    }
}
function open_feedback_page(){
    var feedback_url="https://chrome.google.com/webstore/detail/wayback-machine/fpnmgdkabkmnadcjpehmlllkndpkmiak/reviews?hl=en";
    chrome.tabs.create({ url: feedback_url });
}

function about_support(){
    window.open('about.html', 'newwindow', 'width=1200, height=900,left=0').focus();
}

function makeModal(){
    var url = get_clean_url();
    console.log("Making RT for "+url);
    chrome.runtime.sendMessage({message: "makemodal",rturl:url});
}

function settings(){
    window.open('settings.html','newwindow', 'width=590, height=740,left=0');
}

function auto_archive_url(){
    var tab_url="";
    chrome.tabs.query({active: true,currentWindow:true},function(tabs){
        tab_url=tabs[0].url;
        tabId=tabs[0].id;
        console.log(tab_url);
        chrome.storage.sync.get(['auto_archive'],function(event){
            if(event.auto_archive==true){
                if(!((tab_url.includes("https://web.archive.org/web/")) || (tab_url.includes("chrome://newtab")))){
                    check_url(tab_url,function(){
                        var wayback_url = "https://web.archive.org/save/";
                        chrome.browserAction.getBadgeText({tabId:tabId}, function (result){
                            if((result=="S")){
                                tab_url = wayback_url+tab_url;
                                console.log(tab_url);
                                wm_save_URL(tab_url, function(){
                                    var tabId=tabs[0].id;
                                    console.log(tabId);
                                    chrome.runtime.sendMessage({message:"changeBadge",tabId:tabId});
                                });
                            }
                        });
                    });
                }
            }
        });
    });
}

function wm_save_URL(url, callback) {
    var http=new XMLHttpRequest();
    var new_url=url;
    http.open("GET",new_url,true);
    http.send(null);
    http.onreadystatechange = function() {
        if (this.readyState==4 && this.status==200) {
            console.log("Archived");
        }
    }
    callback();
}

function check_url(url,callback){
    var xhr=new XMLHttpRequest();
    var new_url="http://archive.org/wayback/available?url="+url;
    xhr.open("GET",new_url,true);
    xhr.send(null);
    xhr.onload = function() {
        var response = JSON.parse(xhr.response);
        console.log(response);
        if(response.archived_snapshots.closest){
            console.log("available");
            chrome.tabs.query({active: true,currentWindow:true},function(tabs){
                var tab_id=tabs[0].id;
                chrome.browserAction.getBadgeText({tabId:tab_id}, function (result){
                    if(result=="S"){
                        chrome.runtime.sendMessage({message:"changeBadge",tabId:tab_id});
                    }
                });
            });
        }else{
            console.log("not available");
            callback();
        }
    }
}

function show_all_screens(){
    var url=get_clean_url();
    chrome.runtime.sendMessage({message:"showall",url:url});
}

function borrow_books(){
    chrome.tabs.query({active: true,currentWindow:true},function(tabs){
        url=tabs[0].url;
        tabId=tabs[0].id;
        chrome.browserAction.getBadgeText({tabId:tabId}, function (result){
            if(result=="B"){
                if(url.includes("www.amazon") && url.includes('/dp/')){
                    var xhr=new XMLHttpRequest();
                    var new_url="https://archive.org/services/context/amazonbooks?url="+url;
                    console.log(new_url);
                    xhr.open("GET",new_url,true);
                    xhr.send(null);
                    xhr.onload=function(){
                        var response = JSON.parse(xhr.response);
                        if(response.success==true && response.error==undefined){
                          var responses=response.responses;
                          for(var propName in responses) {
                            if(responses.hasOwnProperty(propName)) {
                              var propValue = responses[propName];
                            }
                          }
                          var identifier=propValue.identifier;
                        }
                        if(identifier!=undefined||null){
                        document.getElementById('borrow_books_tr').style.display="block";
                        }
                        document.getElementById('borrow_books_tr').onclick=function(){
                            chrome.tabs.create({url:"https://archive.org/details/"+identifier});
                        }
                    }
                }
            }
        });

    });
}

function show_news(){
    chrome.tabs.query({active: true,currentWindow:true},function(tabs){
        url=tabs[0].url;
        var to_check_url=url.replace(/^https?:\/\/(www\.)?/,'');
        var news_host=to_check_url.split(".")[0];
        tabId=tabs[0].id;
        var set_of_sites = new Set([
          "apnews",
          "factcheck",
          "forbes",
          "huffingtonpost",
          "nytimes",
          "politifact",
          "snopes",
          "theverge",
          "usatoday",
          "vox",
          "washingtonpost",
        ]);
        chrome.storage.sync.get(['news'],function(event){
            if(event.news==true){
                if(set_of_sites.has(news_host)){
                    document.getElementById('news_recommend_tr').style.display="block";
                    document.getElementById('news_recommend_tr').onclick=function(){
                        chrome.storage.sync.get(['show_context'],function(event1){
                            if(event1.show_context==undefined){
                                event1.show_context="tab";
                            }
                            if(event1.show_context=="tab"){
                                chrome.tabs.create({url:chrome.runtime.getURL("recommendations.html")+"?url="+url});
                            }else{
                              chrome.system.display.getInfo(function(displayInfo){
                                let height = displayInfo[0].bounds.height;
                                let width = displayInfo[0].bounds.width;
                                chrome.windows.create({url:chrome.runtime.getURL("recommendations.html")+"?url="+url,width:width/2, height:height, top:0, left:width/2, focused:true});
                              });
                            }
                        });
                    }
                }
            }
        });
    });
}
function show_wikibooks(){
  chrome.tabs.query({active: true,currentWindow:true},function(tabs){
      let url=tabs[0].url;
      let found = url.match(/^https?:\/\/[\w\.]*wikipedia.org/);
      tabId=tabs[0].id;
      chrome.storage.sync.get(['wikibooks'],function(event){
          if(event.wikibooks==true){
              if(found){
                  document.getElementById('wikibooks_tr').style.display="block";
                  document.getElementById('wikibooks_tr').onclick=function(){
                      chrome.storage.sync.get(['show_context'],function(event1){
                          if(event1.show_context==undefined){
                              event1.show_context="tab";
                          }
                          if(event1.show_context=="tab"){
                              chrome.tabs.create({url:chrome.runtime.getURL("booklist.html")+"?url="+url});
                          }else{
                            chrome.system.display.getInfo(function(displayInfo){
                              let height = displayInfo[0].bounds.height;
                              let width = displayInfo[0].bounds.width;
                              chrome.windows.create({url:chrome.runtime.getURL("booklist.html")+"?url="+url,width:width/2, height:height, top:0, left:width/2, focused:true});
                            });
                          }
                      });
                  }
              }
          }
      });
      chrome.storage.sync.get(['doi'],function(event){
          if(event.doi==true){
              if(found){
                  document.getElementById('doi_tr').style.display="block";
                  document.getElementById('doi_tr').onclick=function(){
                      chrome.storage.sync.get(['show_context'],function(event1){
                          if(event1.show_context==undefined){
                              event1.show_context="tab";
                          }
                          if(event1.show_context=="tab"){
                              chrome.tabs.create({url:chrome.runtime.getURL("doi.html")+"?url="+url});
                          }else{
                            chrome.system.display.getInfo(function(displayInfo){
                              let height = displayInfo[0].bounds.height;
                              let width = displayInfo[0].bounds.width;
                              chrome.windows.create({url:chrome.runtime.getURL("doi.html")+"?url="+url,width:width/2, height:height, top:0, left:width/2, focused:true});
                            });
                          }
                      });
                  }
              }
          }
      });
  });
}

window.onloadFuncs = [get_url,auto_archive_url,borrow_books,show_news,show_wikibooks];
window.onload = function(){
 for(var i in this.onloadFuncs){
  this.onloadFuncs[i]();
 }
}
document.getElementById('save_now').onclick = save_now;
document.getElementById('recent_capture').onclick = recent_capture;
document.getElementById('first_capture').onclick = first_capture;
document.getElementById('fb_share').onclick =social_share;
document.getElementById('twit_share').onclick =social_share;
document.getElementById('gplus_share').onclick =social_share;
document.getElementById('linkedin_share').onclick =social_share;
document.getElementById('search_tweet').onclick =search_tweet;
document.getElementById('about_support_button').onclick = about_support;
document.getElementById('settings_button').onclick =settings;
document.getElementById('context-screen').onclick=show_all_screens;
document.getElementById('feedback').onclick=open_feedback_page;

document.getElementById('overview').onclick = view_all;
document.getElementById('make_modal').onclick=makeModal;
document.getElementById('search_input').addEventListener('keydown',display_suggestions);
