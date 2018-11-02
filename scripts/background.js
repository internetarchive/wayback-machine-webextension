/*
* License: AGPL-3
* Copyright 2016, Internet Archive
*/
var manifest=chrome.runtime.getManifest();
//Load version from Manifest.json file
var VERSION = manifest.version;
//Used to store the statuscode of the if it is a httpFailCodes
var globalStatusCode = "";
//List of exluded URLs
var excluded_urls = [
  "localhost",
  "0.0.0.0",
  "127.0.0.1"
];
var previous_RTurl="";
//Window ID of the Context-Windows
var windowId1 =0;
var windowId2 =0;
var windowId3 =0;
var windowId4 =0;
var windowId5=0;
var windowId6=0;
var windowId7=0;
var windowId8=0;
var windowId9=0;
var windowId10=0;
var windowIdtest=0;
var tabId1=0;
//Tab Id of the Context-tabs
var tabId2=0;
var tabId3=0;
var tabId4=0;
var tabId5=0;
var tabId6=0;
var tabId7=0;
var tabId8=0;
var tabId9=0;
var tabId10=0;
var windowIdSingle=0;
var WB_API_URL = "https://archive.org/wayback/available";

// Function to check whether it is a valid URL or not
function isValidUrl(url) {
  for (var i = 0; i < excluded_urls.length; i++) {
    if (url.startsWith("http://" + excluded_urls[i]) || url.startsWith("https://" + excluded_urls[i])) {
      return false;
    }
  }
  return true;
}

function rewriteUserAgentHeader(e) {
  for (var header of e.requestHeaders) {
    if (header.name.toLowerCase() === "user-agent") {
      header.value = header.value  + " Wayback_Machine_Chrome/" + VERSION + " Status-code/" + globalStatusCode;
    }
  }
  return {requestHeaders: e.requestHeaders};
}

function URLopener(open_url,url,wmAvailabilitycheck){
  if(wmAvailabilitycheck==true){
    wmAvailabilityCheck(url,function(){
      chrome.tabs.create({ url:  open_url});
    },function(){
      alert("URL not found");
    });
  }else{
    chrome.tabs.create({ url:  open_url});
  }
}

myNotID=null;

/**
 * Close window callback
 */
chrome.windows.onRemoved.addListener(function (id) {
  if (id === windowIdSingle) {
    windowIdSingle = 0;
  } else if (id === windowId1) {
    windowId1 = 0;
  } else if (id === windowId2) {
    windowId2 = 0;
  } else if (id === windowId3) {
    windowId3 = 0;
  } else if (id === windowId4) {
    windowId4 = 0;
  } else if (id === windowId5) {
    windowId5 = 0;
  } else if (id === windowId6) {
    windowId6 = 0;
  } else if (id === windowId7) {
    windowId7 = 0;
  } else if (id === windowId8) {
    windowId8 = 0;
  } else if (id === windowId9) {
    windowId9 = 0;
  } else if (id === windowId10) {
    windowId10 = 0;
  } else if (id === windowIdtest) {
    windowIdtest = 0;
  }
});

/**
 * Close tab callback
 */
chrome.tabs.onRemoved.addListener(function (id) {
  if (id === tabId1) {
    tabId1 = 0;
  } else if (id === tabId2) {
    tabId2 = 0;
  } else if (id === tabId3) {
    tabId3 = 0;
  } else if (id === tabId4) {
    tabId4 = 0;
  } else if (id === tabId5) {
    tabId5 = 0;
  } else if (id === tabId6) {
    tabId6 = 0;
  } else if (id === tabId7) {
    tabId7 = 0;
  } else if (id === tabId8) {
    tabId8 = 0;
  } else if (id === tabId9) {
    tabId9 = 0;
  } else if (id === tabId10) {
    tabId10 = 0;
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  rewriteUserAgentHeader,
  {urls: [WB_API_URL]},
  ["blocking", "requestHeaders"]
);

chrome.webRequest.onErrorOccurred.addListener(function(details) {
  if(['net::ERR_NAME_NOT_RESOLVED', 'net::ERR_NAME_RESOLUTION_FAILED',
      'net::ERR_CONNECTION_TIMED_OUT', 'net::ERR_NAME_NOT_RESOLVED'].indexOf(details.error) >= 0 &&
      details.tabId >0 ) {
    wmAvailabilityCheck(details.url, function(wayback_url, url) {
      chrome.tabs.update(details.tabId, {url: chrome.extension.getURL('dnserror.html')+"?wayback_url="+wayback_url+"&page_url="+url+"&status_code="+details.statusCode});
    }, function() { });
  }
}, {urls: ["<all_urls>"], types: ["main_frame"]});

/**
* Header callback
*/
RTurl="";
chrome.webRequest.onCompleted.addListener(function(details) {
  function tabIsReady(isIncognito) {
    var httpFailCodes = [404, 408, 410, 451, 500, 502, 503, 504, 509, 520, 521,
                         523, 524, 525, 526];
    if (isIncognito === false && details.frameId === 0 &&
        httpFailCodes.indexOf(details.statusCode) >= 0 && isValidUrl(details.url)) {
      globalStatusCode = details.statusCode;
      wmAvailabilityCheck(details.url, function(wayback_url, url) {
        chrome.tabs.executeScript(details.tabId, {
          file: "scripts/client.js"
        },function() {
          if(chrome.runtime.lastError && chrome.runtime.lastError.message.startsWith('Cannot access contents of url "chrome-error://chromewebdata/')){
            chrome.tabs.update(details.tabId, {url: chrome.extension.getURL('dnserror.html')+"?wayback_url="+wayback_url+"&page_url="+url+"&status_code="+details.statusCode});
          }else{
            chrome.tabs.sendMessage(details.tabId, {
              type: "SHOW_BANNER",
              wayback_url: wayback_url,
              page_url: details.url,
              status_code: details.statusCode
            });
          }
        });
      }, function() {});
    }
  }
  if(details.tabId >0 ){
    chrome.tabs.query({currentWindow:true},function(tabs){
      var tabsArr=tabs.map(tab => tab.id);
      if(tabsArr.indexOf(details.tabId)>=0){
        chrome.tabs.get(details.tabId, function(tab) {
          tabIsReady(tab.incognito);
        });
      }
    })
  }
}, {urls: ["<all_urls>"], types: ["main_frame"]});

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
  if(message.message=='openurl'){
    var page_url = message.page_url;
    var wayback_url = message.wayback_url;
    var url = page_url.replace(/https:\/\/web\.archive\.org\/web\/(.+?)\//g, '');
    var open_url = wayback_url + encodeURI(url);
    if(!page_url.includes('chrome://')){
      if (message.method!='save') {
        URLopener(open_url,url,true);
      } else {
        chrome.tabs.create({ url:  open_url});
      }
    }
  } else if (message.message === 'makemodal'){
    RTurl = message.rturl;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      var url = RTurl;
      // utility function to run Radial Tree JS
      function _run_modalbox_scripts() {
        chrome.tabs.executeScript(tab.id, {
          file:"scripts/build.js"
        });
        chrome.tabs.executeScript(tab.id, {
          file:"scripts/radial-tree.umd.js"
        });
        chrome.tabs.executeScript(tab.id, {
          file:"scripts/RTcontent.js"
        });
        previous_RTurl = url;
      }
      //chrome debugger API  isn’t allowed to attach to any page in the Chrome Web Store
      if(url.includes('web.archive.org') || url.includes('web-beta.archive.org') || url.includes('chrome.google.com/webstore')){
        alert("Structure as radial tree not available on this page");
      }else if((previous_RTurl!=url && url==tab.url) || (previous_RTurl!=url && url!=tab.url)){
        //Checking the condition for no recreation of the SiteMap and sending a message to RTContent.js
        chrome.tabs.sendMessage(tab.id,{message:"deletenode"});
        _run_modalbox_scripts();
      }else if(previous_RTurl==url){
        _run_modalbox_scripts();
      }
    });
  }else if(message.message=='sendurl'){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {url:tabs[0].url});
    });
  }else if(message.message=='sendurlforrt'){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {RTurl:RTurl});
    });
  }else if(message.message=='changeBadge'){
    //Used to change bage for auto-archive feature
    chrome.browserAction.setBadgeText({tabId: message.tabId, text:"\u2713"});
  }else if(message.message=='showall'){
    chrome.storage.sync.get(['show_context'],function(event){
      if(!event.show_context){
        //By-default the context-window open in tabs
        event.show_context="tab";
      }
      var received_url=message.url;
      received_url = received_url.replace(/^https?:\/\//,'');
      var last_index=received_url.indexOf('/');
      //URL which will be using for alexa
      var url=received_url.slice(0,last_index);
      var alexa_url="https://archive.org/services/context/alexa?url="+url;
      //URL which will be needed for finding tweets
      var open_url=received_url;
      if(open_url.slice(-1)=='/') open_url=received_url.substring(0,open_url.length-1);
      var hoaxy_url="http://hoaxy.iuni.iu.edu/#query="+open_url+"&sort=mixed&type=Twitter";
      chrome.storage.sync.get(['auto_update_context'],function(event1){
        if(event1.auto_update_context==undefined){
          //By default auto-update context is off
          event1.auto_update_context=false;
        }
        //If the Context is to be showed in tabs
        if(event.show_context=="tab"){
          if(tabId2==0 || tabId3==0 || tabId4==0 || tabId5==0 || tabId6==0 || tabId7==0 || tabId8==0 || tabId9 ==0){  //Checking if Tabs are not open already
            //If not selected show-all option ,then check and open indivisually
            chrome.storage.sync.get(function(event4){
              if(event4.alexa==true){
                openThatContext("alexa",url,event.show_context);
              }
              chrome.storage.sync.get(function(event5){
                if(event5.domaintools==true){
                  openThatContext("domaintools",message.url,event.show_context);
                }
                chrome.storage.sync.get(function(event6){
                  if(event6.tweets==true){
                    openThatContext("tweets",open_url,event.show_context);
                  }
                  chrome.storage.sync.get(function(event7){
                    if(event7.wbmsummary==true){
                      openThatContext("wbmsummary",message.url,event.show_context);
                    }
                    chrome.storage.sync.get(function(event8){
                      if(event8.annotations==true){
                        openThatContext("annotations",message.url,event.show_context);
                      }
                      chrome.storage.sync.get(function(event9){
                        if(event9.similarweb==true){
                          openThatContext("similarweb",url,event.show_context);
                        }
                        chrome.storage.sync.get(function(event10){
                          if(event10.tagcloud==true){
                            openThatContext("tagcloud",message.url,event.show_context);
                          }
                          chrome.storage.sync.get(function(event11){
                            if(event11.annotationsurl==true){
                              openThatContext("annotationsurl",url,event.show_context);
                            }
                            chrome.storage.sync.get(function(event12){
                              if(event12.hoaxy==true){
                                openThatContext("hoaxy",open_url,event.show_context);
                              }
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          }else{
            //If context screens(tabs) are already opened and user again click on the Context button then update them
            chrome.tabs.query({
              windowId: windowIdtest
            }, function(tabs) {
              var tab=tabs[0];
              chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("doi.html")+"?url="+message.url});
            });
            chrome.tabs.update(parseInt(tabId1), {url:alexa_url});
            chrome.tabs.update(parseInt(tabId2), {url:chrome.runtime.getURL("domaintools.html")+"?url="+message.url});
            chrome.tabs.update(parseInt(tabId3), {url:'https://twitter.com/search?q=' + open_url});
            chrome.tabs.update(parseInt(tabId4), {url:chrome.runtime.getURL("overview.html")+"?url="+message.url});
            chrome.tabs.update(parseInt(tabId5), {url:chrome.runtime.getURL("annotation.html")+"?url="+message.url});
            chrome.tabs.update(parseInt(tabId8), {url:chrome.runtime.getURL("annotationURL.html")+"?url="+message.url});
            chrome.tabs.update(parseInt(tabId6), {url:chrome.runtime.getURL("similarweb.html")+"?url="+url});
            chrome.tabs.update(parseInt(tabId7), {url:chrome.runtime.getURL("tagcloud.html")+"?url="+message.url});
            chrome.tabs.update(parseInt(tabId9), {url:hoaxy_url});
          }
        }else if(event.show_context=="window"){
          //If the Context is to be showed in Windows
          if(windowId1==0 ||windowId2==0||windowId3==0||windowId4==0||windowId5==0||windowId6==0 ||windowId7==0 ||windowId8 ==0 ||windowId9==0 || windowId10==0){
            //Checking if Windows are not open already
            chrome.storage.sync.get(function(event13){
              if(event13.doi==true){
                openThatContext("doi",message.url,event.show_context);
              }
              chrome.storage.sync.get(function(event4){
                if(event4.alexa==true){
                  openThatContext("alexa",url,event.show_context);
                }
                chrome.storage.sync.get(function(event5){
                  if(event5.domaintools==true){
                    openThatContext("domaintools",message.url,event.show_context);
                  }
                  chrome.storage.sync.get(function(event6){
                    if(event6.tweets==true){
                      openThatContext("tweets",open_url,event.show_context);
                    }
                    chrome.storage.sync.get(function(event7){
                      if(event7.wbmsummary==true){
                        openThatContext("wbmsummary",message.url,event.show_context);
                      }
                      chrome.storage.sync.get(function(event8){
                        if(event8.annotations==true){
                          openThatContext("annotations",message.url,event.show_context);
                        }
                        chrome.storage.sync.get(function(event9){
                          if(event9.similarweb==true){
                            openThatContext("similarweb",url,event.show_context);
                          }
                          chrome.storage.sync.get(function(event10){
                            if(event10.tagcloud==true){
                              openThatContext("tagcloud",message.url,event.show_context);
                            }
                            chrome.storage.sync.get(function(event11){
                              if(event11.annotationsurl==true){
                                openThatContext("annotationsurl",url,event.show_context);
                              }
                              chrome.storage.sync.get(function(event12){
                                if(event12.hoaxy==true){
                                  openThatContext("hoaxy",open_url,event.show_context);
                                }
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          }else{
            //If context screens(windows) are already opened and user again click on the Context button then update them
            chrome.tabs.query({
              windowId: windowId1
            }, function(tabs) {
              var tab=tabs[0];
              chrome.tabs.update(tab.id, {url:alexa_url});
            });
            chrome.tabs.query({
              windowId: windowId2
            }, function(tabs) {
              var tab=tabs[0];
              chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("domaintools.html")+"?url="+message.url});
            });
            chrome.tabs.query({
              windowId: windowId3
            }, function(tabs) {
              var tab=tabs[0];
              chrome.tabs.update(tab.id, {url:'https://twitter.com/search?q=' + open_url});
            });
            chrome.tabs.query({
              windowId: windowId4
            }, function(tabs) {
              var tab=tabs[0];
              chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("overview.html")+"?url="+message.url});
            });
            chrome.tabs.query({
              windowId: windowId5
            }, function(tabs) {
              var tab=tabs[0];
              chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("annotation.html")+"?url="+message.url});
            });
            chrome.tabs.query({
              windowId: windowId8
            }, function(tabs) {
              var tab=tabs[0];
              chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("annotationURL.html")+"?url="+message.url});
            });
            chrome.tabs.query({
              windowId: windowId6
            }, function(tabs) {
              var tab=tabs[0];
              chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("similarweb.html")+"?url="+url});
            });
            chrome.tabs.query({
              windowId: windowId7
            }, function(tabs) {
              var tab=tabs[0];
              chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("tagcloud.html")+"?url="+message.url});
            });
            chrome.tabs.query({
              windowId: windowId9
            }, function(tabs) {
              var tab=tabs[0];
              chrome.tabs.update(tab.id, {url:hoaxy_url});
            });
            chrome.tabs.query({
              windowId: windowId10
            }, function(tabs) {
              var tab=tabs[0];
              chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("doi.html")+"?url="+message.url});
            });
          }
        } else if(event.show_context=="singlewindow"){
          //If the Context is to be showed in singleWindow
          if(windowIdSingle!=0){
            //Checking if SingleWindow context is not open already
            chrome.tabs.query({
              windowId: windowIdSingle
            }, function(tabs) {
              var tab=tabs[0];
              chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("singleWindow.html")+"?url="+message.url});
            });
          }else{
            chrome.windows.create({url: chrome.runtime.getURL('singleWindow.html') + '?url=' + message.url,
                                    width:1000, height:1000, top:0, left:0, focused:false}, function (win) {
              windowIdSingle = win.id;
            });
          }
        }
      });
    });
  }
});

var tabIdAlexa,tabIdDomaintools,tabIdtwit,tabIdoverview,tabIdannotation,tabIdtest,tabIdsimilarweb,tabIdtagcloud,tabIdannotationurl,tabIdhoaxy,tabIddoi;
chrome.tabs.onUpdated.addListener(function(tabId, info) {
  if (info.status == "complete") {
    chrome.tabs.get(tabId, function(tab) {
      chrome.storage.sync.get(['auto_archive'],function(event){
        if (event.auto_archive === true) {
          auto_save(tab.id);
        }
      });
    });
  }else if(info.status == "loading"){
    chrome.tabs.get(tabId, function(tab) {
      var received_url = tab.url;
      if(!(received_url.includes("chrome://newtab/") || received_url.includes("chrome-extension://")||received_url.includes("alexa.com")||received_url.includes("whois.com")||received_url.includes("twitter.com")||received_url.includes("oauth")||received_url.includes("hoaxy"))){
        singlewindowurl=received_url;
        tagcloudurl=new URL(singlewindowurl);
        received_url = received_url.replace(/^https?:\/\//,'');
        var length =received_url.length;
        var last_index=received_url.indexOf('/');
        var url=received_url.slice(0,last_index);
        var open_url=received_url;
        if(open_url.slice(-1)=='/') open_url=received_url.substring(0,open_url.length-1);
        chrome.storage.sync.get(['auto_update_context'],function(event){
          if(event.auto_update_context==true){
            chrome.storage.sync.get(['show_context'],function(event1){
              if(event1.show_context=="tab"){
                if((tabId5!=0)||(tabId2!=0)||(tabId3!=0)||(tabId4!=0)||(windowIdtest!=0)){
                  chrome.tabs.query({
                    windowId: windowIdtest
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdtest=tab1.id;
                    if((tab.id!=tabIdtest)&&(tab.id!=tabId2)&&(tab.id!=tabId3)&&(tab.id!=tabId4)&&(tab.id!=tabId5)&&(tab.id!=tabId6)&&(tab.id!=tabId7)&&(tab.id!=tabId8)&&(tab.id!=tabId9)&&(tab.id!=tabId10)){
                      if((tab1.url).includes("alexa")){
                        var alexa_url="https://archive.org/services/context/alexa?url="+url;
                        chrome.tabs.update(parseInt(tabIdtest), {url:alexa_url});
                      }else if ((tab1.url).includes("domaintools")){
                        chrome.tabs.update(parseInt(tabIdtest), {url:chrome.runtime.getURL("domaintools.html")+"?url="+tab.url});
                      }else if((tab1.url).includes("twitter.com")){
                        chrome.tabs.update(parseInt(tabIdtest), {url:'https://twitter.com/search?q=' + open_url});
                      }else if((tab1.url).includes("overview")){
                        chrome.tabs.update(parseInt(tabIdtest), {url:chrome.runtime.getURL("overview.html")+"?url="+tab.url});
                      }else if((tab1.url).includes("annotation")){
                        chrome.tabs.update(parseInt(tabIdtest), {url:chrome.runtime.getURL("annotation.html")+"?url="+tab.url});
                      }else if((tab1.url).includes("annotationURL")){
                        chrome.tabs.update(parseInt(tabIdtest), {url:chrome.runtime.getURL("annotationURL.html")+"?url="+tab.url});
                      }else if((tab1.url).includes("similarweb")){
                        chrome.tabs.update(parseInt(tabIdtest), {url:chrome.runtime.getURL("similarweb.html")+"?url="+url});
                      }else if((tab1.url).includes("tagcloud")){
                        chrome.tabs.update(parseInt(tabIdtest), {url:chrome.runtime.getURL("tagcloud.html")+"?url="+tagcloudurl});
                      }else if((tab1.url).includes("hoaxy")){
                        var hoaxy_url="http://hoaxy.iuni.iu.edu/#query="+open_url+"&sort=mixed&type=Twitter";
                        chrome.tabs.update(parseInt(tabIdtest), {url:hoaxy_url});
                      }else if((tab1.url).includes("doi")){
                        chrome.tabs.update(parseInt(tabIdtest), {url:chrome.runtime.getURL("doi.html")+"?url="+tab.url});
                      }
                      var alexa_url="https://archive.org/services/context/alexa?url="+url;
                      chrome.tabs.update(parseInt(tabId1), {url:alexa_url});
                      chrome.tabs.update(parseInt(tabId2), {url:chrome.runtime.getURL("domaintools.html")+"?url="+tab.url});
                      chrome.tabs.update(parseInt(tabId3), {url:'https://twitter.com/search?q=' + open_url});
                      chrome.tabs.update(parseInt(tabId4), {url:chrome.runtime.getURL("overview.html")+"?url="+tab.url});
                      chrome.tabs.update(parseInt(tabId5), {url:chrome.runtime.getURL("annotation.html")+"?url="+tab.url});
                      chrome.tabs.update(parseInt(tabId8), {url:chrome.runtime.getURL("annotationURL.html")+"?url="+tab.url});
                      chrome.tabs.update(parseInt(tabId6), {url:chrome.runtime.getURL("similarweb.html")+"?url="+url});
                      chrome.tabs.update(parseInt(tabId7), {url:chrome.runtime.getURL("tagcloud.html")+"?url="+tagcloudurl});
                      var hoaxy_url="http://hoaxy.iuni.iu.edu/#query="+open_url+"&sort=mixed&type=Twitter";
                      chrome.tabs.update(parseInt(tabId9), {url:hoaxy_url});
                    }
                  });
                }
              }else if(event1.show_context=="singlewindow"){
                chrome.tabs.query({
                  windowId: windowIdSingle
                }, function(tabs) {
                  var tab=tabs[0];
                  chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("singleWindow.html")+"?url="+singlewindowurl});
                });
              }else{
                if((windowId1!=0)||(windowId2!=0)||(windowId3!=0)||(windowId4!=0)||(windowId5!=0)||(windowId6!=0)||(windowId7!=0)){
                  chrome.tabs.query({
                    windowId: windowId10
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIddoi=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId2
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdDomaintools=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId3
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdtwit=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId4
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdoverview=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId5
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdannotation=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId6
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdsimilarweb=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId7
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdtagcloud=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId8
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdannotationurl=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId9
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdhoaxy=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId1
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdalexa=tab1.id;
                  });
                  if((tab.id!=tabIdAlexa)&&(tab.id!=tabIdDomaintools)&&(tab.id!=tabIdtwit)&&(tab.id!=tabIdoverview)&&(tab.id!=tabIdannotation)&&(tab.id!=tabIdsimilarweb)&&(tab.id!=tabIdtagcloud)&&(tab.id!=tabIdannotationurl)&&(tab.id!=tabIdhoaxy)&&(tab.id!=tabIddoi)){
                    chrome.tabs.query({
                      windowId: windowId1
                    }, function(tabs) {
                      var tab1=tabs[0];
                      var alexa_url="https://archive.org/services/context/alexa?url="+url;
                      chrome.tabs.update(tab1.id, {url:alexa_url});
                    });
                    chrome.tabs.query({
                      windowId: windowId2
                    }, function(tabs) {
                      var tab1=tabs[0];
                      chrome.tabs.update(tab1.id, {url:chrome.runtime.getURL("domaintools.html")+"?url="+tab.url});
                    });
                    chrome.tabs.query({
                      windowId: windowId3
                    }, function(tabs) {
                      var tab1=tabs[0];
                      chrome.tabs.update(tab1.id, {url:'https://twitter.com/search?q=' + open_url});
                    });
                    chrome.tabs.query({
                      windowId: windowId4
                    }, function(tabs) {
                      var tab1=tabs[0];
                      chrome.tabs.update(tab1.id, {url:chrome.runtime.getURL("overview.html")+"?url="+tab.url});
                    });
                    chrome.tabs.query({
                      windowId: windowId5
                    }, function(tabs) {
                      var tab1=tabs[0];
                      chrome.tabs.update(tab1.id, {url:chrome.runtime.getURL("annotation.html")+"?url="+tab.url});
                    });
                    chrome.tabs.query({
                      windowId: windowId8
                    }, function(tabs) {
                      var tab1=tabs[0];
                      chrome.tabs.update(tab1.id, {url:chrome.runtime.getURL("annotationURL.html")+"?url="+tab.url});
                    });
                    chrome.tabs.query({
                      windowId: windowId6
                    }, function(tabs) {
                      var tab1=tabs[0];
                      chrome.tabs.update(tab1.id, {url:chrome.runtime.getURL("similarweb.html")+"?url="+url});
                    });
                    chrome.tabs.query({
                      windowId: windowId7
                    }, function(tabs) {
                      var tab1=tabs[0];
                      chrome.tabs.update(tab1.id, {url:chrome.runtime.getURL("tagcloud.html")+"?url="+tagcloudurl});
                    });
                    chrome.tabs.query({
                      windowId: windowId9
                    }, function(tabs) {
                      var tab1=tabs[0];
                      var hoaxy_url="http://hoaxy.iuni.iu.edu/#query="+open_url+"&sort=mixed&type=Twitter";
                      chrome.tabs.update(tab1.id, {url:hoaxy_url});
                    });
                    chrome.tabs.query({
                      windowId: windowId10
                    }, function(tabs) {
                      var tab1=tabs[0];
                      chrome.tabs.update(tab1.id, {url:chrome.runtime.getURL("doi.html")+"?url="+tab.url});
                    });
                  }
                }
              }
            });
          }
        });
      }
      chrome.storage.sync.get(['books'],function(event){
        if (event.books === true) {
          chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
            url = tabs[0].url;
            tabId = tabs[0].id;
            if(url.includes("www.amazon")){
              var xhr = new XMLHttpRequest();
              xhr.open('GET', 'https://archive.org/services/context/amazonbooks?url=' + url, true);
              xhr.send(null);
              xhr.onload = function () {
                const resp = JSON.parse(xhr.response);
                if (('metadata' in resp && 'identifier' in resp['metadata']) ||
                    'ocaid' in resp) {
                  chrome.browserAction.setBadgeText({tabId: tabId, text: 'B'});
                }
              }
            }
          });
        }
      });
    });
  }
});

function auto_save(tabId){
  chrome.tabs.get(tabId, function(tab) {
    var page_url = tab.url;
    chrome.browserAction.setBadgeText({tabId: tabId, text:""});
    if(isValidUrl(page_url) && isValidSnapshotUrl(page_url)){
      if(!((page_url.includes("https://web.archive.org/web/")) || (page_url.includes("chrome://newtab")))){
        wmAvailabilityCheck(page_url,
          function() {
            console.log("Available already");
          },
          function() {
            chrome.browserAction.setBadgeText({tabId: tabId, text:"S"});
          });
      }
    }
  });
}

//function for opeing a particular context
function openThatContext(temp,url,methodOfShowing){
  var alexa_url="https://archive.org/services/context/alexa?url="+url;
  var hoaxy_url="http://hoaxy.iuni.iu.edu/#query="+url+"&sort=mixed&type=Twitter";
  var twitter_search_url = 'https://twitter.com/search?q=' + url;
  if(methodOfShowing==='tab'){
    if(windowIdtest===0){
      if(temp==='doi'){
        chrome.windows.create({url:chrome.runtime.getURL("doi.html")+"?url="+url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
          //to add onremoved event listener
        });
      }else if(temp==='domaintools'){
        chrome.windows.create({url:chrome.runtime.getURL("domaintools.html")+"?url="+url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
        });
      }else if(temp==='tweets'){
        chrome.windows.create({url:'https://twitter.com/search?q=' + url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
        });
      }else if(temp==='wbmsummary'){
        chrome.windows.create({url: twitter_search_url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
        });
      }else if(temp==='annotations'){
        chrome.windows.create({url:chrome.runtime.getURL("annotation.html")+"?url="+url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
        });
      }else if(temp==='annotationsurl'){
        chrome.windows.create({url:chrome.runtime.getURL("annotationURL.html")+"?url="+url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
        });
      }else if(temp==='similarweb'){
        chrome.windows.create({url:chrome.runtime.getURL("similarweb.html")+"?url="+url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
        });
      }else if(temp==='tagcloud'){
        chrome.windows.create({url:chrome.runtime.getURL("tagcloud.html")+"?url="+url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
        });
      }else if(temp==='hoaxy'){
        chrome.windows.create({url:hoaxy_url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
        });
      }else if(temp==='alexa'){
        chrome.windows.create({url:alexa_url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
        });
      }
    }else{
      chrome.tabs.query({
        windowId: windowIdtest
      }, function(tabs) {
        if(temp==='alexa'){
          chrome.tabs.create({'url': alexa_url,'active':false},function(tab){
            tabId1=tab.id;
          });
        }else if(temp==='domaintools'){
          chrome.tabs.create({'url': chrome.runtime.getURL("domaintools.html")+"?url="+url,'active':false},function(tab){
            tabId2=tab.id;
          });
        }else if(temp==='tweets'){
          chrome.tabs.create({'url': twitter_search_url,'active':false},function(tab){
            tabId3=tab.id;
          });
        }else if(temp==='wbmsummary'){
          chrome.tabs.create({url:chrome.runtime.getURL("overview.html")+"?url="+url,'active':false},function(tab){
            tabId4=tab.id;
          });
        }else if(temp==='annotations'){
          chrome.tabs.create({url:chrome.runtime.getURL("annotation.html")+"?url="+url,'active':false},function(tab){
            tabId5=tab.id;
          });
        }else if(temp==='annotationsurl'){
          chrome.tabs.create({url:chrome.runtime.getURL("annotationURL.html")+"?url="+url,'active':false},function(tab){
            tabId8=tab.id;
          });
        }else if(temp==='similarweb'){
          chrome.tabs.create({url:chrome.runtime.getURL("similarweb.html")+"?url="+url,'active':false},function(tab){
            tabId6=tab.id;
          });
        }else if(temp==='tagcloud'){
          chrome.tabs.create({url:chrome.runtime.getURL("tagcloud.html")+"?url="+url,'active':false},function(tab){
            tabId7=tab.id;
          });
        }else if(temp==='hoaxy'){
          chrome.tabs.create({url:hoaxy_url,'active':false},function(tab){
            tabId9=tab.id;
          });
        }
      });
    }
  }else if(methodOfShowing==='window'){
    //If context is to be shown in window
    if(temp==='alexa'){
      chrome.windows.create({url:alexa_url, width:500, height:500, top:0, left:0, focused:false},function (win) {
        windowId1 = win.id;
      });
    }else if(temp==='domaintools'){
      chrome.windows.create({url:chrome.runtime.getURL("domaintools.html")+"?url="+url, width:500, height:500, top:500, left:0, focused:false},function (win) {
        windowId2 = win.id;
      });
    }else if(temp==='tweets'){
      chrome.windows.create({url:twitter_search_url, width:500, height:500, top:0, left:500, focused:false},function (win) {
        windowId3 = win.id;
      });
    }else if(temp==='wbmsummary'){
      chrome.windows.create({url:chrome.runtime.getURL("overview.html")+"?url="+url,width:500, height:500, top:500, left:500, focused:false},function (win) {
        windowId4 = win.id;
      });
    }else if(temp==='annotations'){
      chrome.windows.create({url:chrome.runtime.getURL("annotation.html")+"?url="+url,width:600, height:500, top:0, left:1000, focused:false},function (win) {
        windowId5 = win.id;
      });
    }else if(temp==='annotationsurl'){
      chrome.windows.create({url:chrome.runtime.getURL("annotationURL.html")+"?url="+url,width:600, height:500, top:0, left:1000, focused:false},function (win) {
        windowId8 = win.id;
      });
    }else if (temp==='similarweb'){
      chrome.windows.create({url:chrome.runtime.getURL("similarweb.html")+"?url="+url,width:600, height:500, top:0, left:1200, focused:false},function (win) {
        windowId6 = win.id;
      });
    }else if (temp==='tagcloud'){
      chrome.windows.create({url:chrome.runtime.getURL("tagcloud.html")+"?url="+url,width:600, height:500, top:500, left:1200, focused:false},function (win) {
        windowId7 = win.id;
      });
    }else if (temp==='hoaxy'){
      chrome.windows.create({url:hoaxy_url,width:600, height:500, top:500, left:1200, focused:false},function (win) {
        windowId9 = win.id;
      });
    }else if (temp==='doi'){
      chrome.windows.create({url:chrome.runtime.getURL("doi.html")+"?url="+url,width:600, height:500, top:0, left:1200, focused:false},function (win) {
          windowId10 = win.id;
        });
    }
  }
}

// Right-click context menu "Wayback Machine" inside the page.
chrome.contextMenus.create({'id': 'first',
                            'title': 'First Version',
                            'contexts': ['all'],
                            'documentUrlPatterns': ['*://*/*', 'ftp://*/*']});
chrome.contextMenus.create({'id': 'recent',
                            'title': 'Recent Version',
                            'contexts': ['all'],
                            'documentUrlPatterns': ['*://*/*', 'ftp://*/*']});
chrome.contextMenus.create({'id': 'all',
                            'title': 'All Versions',
                            'contexts': ['all'],
                            'documentUrlPatterns': ['*://*/*', 'ftp://*/*']});
chrome.contextMenus.create({'id': 'save',
                            'title': 'Save Page Now',
                            'contexts': ['all'],
                            'documentUrlPatterns': ['*://*/*', 'ftp://*/*']});
chrome.contextMenus.onClicked.addListener(function(click){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (['first', 'recent', 'save', 'all'].indexOf(click.menuItemId) >= 0) {
      const pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
      const page_url = tabs[0].url.replace(pattern, '');
      let wayback_url;
      let wmAvailabilitycheck = true;
      if (click.menuItemId === 'first') {
        wayback_url = 'https://web.archive.org/web/0/' + encodeURI(page_url);
      } else if (click.menuItemId === 'recent'){
        wayback_url = 'https://web.archive.org/web/2/' + encodeURI(page_url);
      } else if (click.menuItemId === 'save') {
        wmAvailabilitycheck = false;
        wayback_url = 'https://web.archive.org/save/' + encodeURI(page_url);
      } else if (click.menuItemId === 'all') {
        wmAvailabilitycheck = false;
        wayback_url = 'https://web.archive.org/web/*/' + encodeURI(page_url);
      }
      URLopener(wayback_url, page_url, wmAvailabilitycheck);
    }
  });
});
