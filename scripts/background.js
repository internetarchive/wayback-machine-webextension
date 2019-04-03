/*
* License: AGPL-3
* Copyright 2016, Internet Archive
*/
var manifest = chrome.runtime.getManifest();
//Load version from Manifest.json file
var VERSION = manifest.version;
//Used to store the statuscode of the if it is a httpFailCodes
var globalStatusCode = "";

var previous_RTurl = "";
var windowIdtest = 0;
var windowIdSingle = 0;
var WB_API_URL = "https://archive.org/wayback/available";
var newshosts = [
  'www.apnews.com',
  'www.factcheck.org',
  'www.forbes.com',
  'www.huffpost.com',
  'www.nytimes.com',
  'www.politico.com',
  'www.politifact.com',
  'www.snopes.com',
  'www.theverge.com',
  'www.usatoday.com',
  'www.vox.com',
  'www.washingtonpost.com'
];
var contexts = [
  {
    name: "alexa",
    htmlUrl: "https://archive.org/services/context/alexa?url=",
    tab: 0,
    window: 0,
    tabContextName: 0,
    top: 0,
    left: 0
  },
  {
    name: "domaintools",
    htmlUrl: chrome.runtime.getURL("domaintools.html") + "?url=",
    tab: 0,
    window: 0,
    tabContextName: 0,
    top: 500,
    left: 0
  },
  {
    name: "tweets",
    htmlUrl: 'https://twitter.com/search?q=',
    tab: 0,
    window: 0,
    tabContextName: 0,
    top: 0,
    left: 500
  },
  {
    name: "wbmsummary",
    htmlUrl: chrome.runtime.getURL("overview.html") + "?url=",
    tab: 0,
    window: 0,
    tabContextName: 0,
    top: 500,
    left: 500
  },
  {
    name: "annotations",
    htmlUrl: chrome.runtime.getURL("annotation.html") + "?url=",
    tab: 0,
    window: 0,
    tabContextName: 0,
    top: 0,
    left: 1000
  },
  {
    name: "tagcloud",
    htmlUrl: chrome.runtime.getURL("tagcloud.html") + "?url=",
    tab: 0,
    window: 0,
    tabContextName: 0,
    top: 500,
    left: 1200
  }
];

function rewriteUserAgentHeader(e) {
  for (var header of e.requestHeaders) {
    if (header.name.toLowerCase() === "user-agent") {
      header.value = header.value + " Wayback_Machine_Chrome/" + VERSION + " Status-code/" + globalStatusCode;
    }
  }
  return { requestHeaders: e.requestHeaders };
}

function URLopener(open_url, url, wmIsAvailable) {
  if (wmIsAvailable === true) {
    wmAvailabilityCheck(url, function () {
      chrome.tabs.create({ url: open_url });
    }, function () {
      alert("URL not found");
    });
  } else {
    chrome.tabs.create({ url: open_url });
  }
}
chrome.storage.sync.set({
  newshosts: newshosts
})
/**
 * Installed callback
 */
chrome.runtime.onStartup.addListener(function(details){
  chrome.storage.sync.get(['agreement'], function(result){
    if(result.agreement === true){
      chrome.browserAction.setPopup({popup: 'index.html'});
    }
  })
});

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.windows.create({url:chrome.runtime.getURL('welcome.html'), width: 750, height:500, top: 0})
});
/**
 * Close window callback
 */
chrome.windows.onRemoved.addListener(function (id) {
  var index = contexts.findIndex(e => e.window === id);
  if (index >= 0) {
    contexts[index].window = 0;
  } else if (windowIdtest === id) {
    windowIdtest = 0;
  } else if (windowIdSingle === id) {
    windowIdSingle = 0;
  }
});

/**
 * Close tab callback
 */
chrome.tabs.onRemoved.addListener(function (id) {
  var index = contexts.findIndex(e => e.tab === id);
  if (index >= 0) {
    contexts[index].tab = 0;
  }
});


chrome.webRequest.onBeforeSendHeaders.addListener(
  rewriteUserAgentHeader,
  { urls: [WB_API_URL] },
  ["blocking", "requestHeaders"]
);

chrome.webRequest.onErrorOccurred.addListener(function (details) {
  if (['net::ERR_NAME_NOT_RESOLVED', 'net::ERR_NAME_RESOLUTION_FAILED',
    'net::ERR_CONNECTION_TIMED_OUT', 'net::ERR_NAME_NOT_RESOLVED'].indexOf(details.error) >= 0 &&
    details.tabId > 0) {
    wmAvailabilityCheck(details.url, function (wayback_url, url) {
      chrome.tabs.update(details.tabId, { url: chrome.extension.getURL('dnserror.html') + "?wayback_url=" + wayback_url + "&page_url=" + url + "&status_code=" + details.statusCode });
    }, function () { });
  }
}, { urls: ["<all_urls>"], types: ["main_frame"] });

/**
* Header callback
*/
RTurl = "";
chrome.webRequest.onCompleted.addListener(function (details) {
  function tabIsReady(isIncognito) {
    if (isIncognito === false && details.frameId === 0 &&
      details.statusCode >= 400 && isNotExcludedUrl(details.url)) {
      globalStatusCode = details.statusCode;
      wmAvailabilityCheck(details.url, function (wayback_url, url) {
        chrome.tabs.executeScript(details.tabId, {
          file: "scripts/client.js"
        }, function () {
          if (chrome.runtime.lastError && chrome.runtime.lastError.message.startsWith('Cannot access contents of url "chrome-error://chromewebdata/')) {
            chrome.tabs.update(details.tabId, { url: chrome.extension.getURL('dnserror.html') + "?wayback_url=" + wayback_url + "&page_url=" + url + "&status_code=" + details.statusCode });
          } else {
            chrome.tabs.sendMessage(details.tabId, {
              type: "SHOW_BANNER",
              wayback_url: wayback_url,
              page_url: details.url,
              status_code: details.statusCode
            });
          }
        });
      }, function () { });
    }
  }
  if (details.tabId > 0) {
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      var tabsArr = tabs.map(tab => tab.id);
      if (tabsArr.indexOf(details.tabId) >= 0) {
        chrome.tabs.get(details.tabId, function (tab) {
          tabIsReady(tab.incognito);
        });
      }
    })
  }
}, { urls: ["<all_urls>"], types: ["main_frame"] });

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.message === 'openurl') {
    var page_url = message.page_url;
    var wayback_url = message.wayback_url;
    var url = page_url.replace(/https:\/\/web\.archive\.org\/web\/(.+?)\//g, '').replace(/\?.*/, '');
    var open_url = wayback_url + encodeURI(url);
    if (isNotExcludedUrl(page_url)) {
      if (message.method !== 'save') {
        URLopener(open_url, url, true);
      } else {
        chrome.tabs.create({ url: open_url });
      }
    }
  } else if (message.message === 'makemodal') {
    RTurl = message.rturl;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var tab = tabs[0];
      var url = RTurl;
      // utility function to run Radial Tree JS
      function _run_modalbox_scripts() {
        chrome.tabs.executeScript(tab.id, {
          file: "scripts/build.js"
        });
        chrome.tabs.executeScript(tab.id, {
          file: "scripts/RTcontent.js"
        });
        previous_RTurl = url;
      }
      //chrome debugger API  isn’t allowed to attach to any page in the Chrome Web Store
      if (!isNotExcludedUrl(url)) {
        alert("Structure as radial tree not available on this page");
      } else if ((previous_RTurl !== url && url === tab.url) || (previous_RTurl !== url && url !== tab.url)) {
        //Checking the condition for no recreation of the SiteMap and sending a message to RTContent.js
        chrome.tabs.sendMessage(tab.id, { message: "deletenode" });
        _run_modalbox_scripts();
      } else if (previous_RTurl === url) {
        _run_modalbox_scripts();
      }
    });
  } else if (message.message === 'getWikipediaBooks'){
    // wikipedia message listener
    let host = 'https://archive.org/services/context/books?url='
    let url = host + encodeURI(message.query)
    // Encapsulate fetch with a timeout promise object
    const timeoutPromise = new Promise(function(resolve, reject) {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, 30000);
      fetch(url).then(resolve, reject)
    })
    timeoutPromise
      .then(response => response.json())
      .then(function (data) {
        let books = null
        if (data && data.message != 'No ISBNs found in page' && data.status != 'error') {
          books = data
        }
        sendResponse(books)
      })
      .catch( function (err) {
        console.log(err)
      })
      return true
  } else if(message.message === 'citationadvancedsearch'){
    let host = 'https://archive.org/advancedsearch.php?q='
    let endsearch = '&fl%5B%5D=identifier&sort%5B%5D=&sort%5B%5D=&sort%5B%5D=&rows=50&page=1&output=json&save=yes'
    let url = host + encodeURI(message.query) + endsearch
    fetch(url)
      .then(response => response.json())
      .then(function (data) {
        let identifier = null
        if (data && data.response && data.response.docs && data.response.docs.length > 0) {
          identifier = data.response.docs[0].identifier
        }
        sendResponse(identifier)

      })
      .catch(function (err) {
        console.log(err)
      })
    return true
    // $.ajax({
    //   url: url,
    //   type: 'GET',
    //   dataType: 'json',
    //   crossDomain: true,
    //   jsonp: 'callback'
    // })
    // .done(function (data) {
    //   let identifier = null
    //   if (data.response.docs.length > 0) {
    //     let identifier = data.response.docs[0].identifier
    //   }
    //   console.log(identifier)
    //   sendResponse(identifier)
    //
    // })
    // .fail(function (err) {
    //   console.log(err)
    // })
  } else if (message.message === 'sendurl') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { url: tabs[0].url });
    });
  } else if (message.message === 'sendurlforrt') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { RTurl: RTurl });
    });
  } else if (message.message === 'changeBadge') {
    //Used to change bage for auto-archive feature
    chrome.browserAction.setBadgeText({ tabId: message.tabId, text: "\u2713" });
  } else if (message.message === 'showall') {
    chrome.storage.sync.get(['show_context', 'auto_update_context', 'alexa', 'domaintools', 'tweets', 'wbmsummary', 'annotations', 'tagcloud'], function (event) { //'similarweb',
      if (!event.show_context) {
        //By-default the context-window open in tabs
        event.show_context = "tab";
      }
      var received_url = message.url;
      received_url = received_url.replace(/^https?:\/\//, '');
      var last_index = received_url.indexOf('/');
      var url = received_url.slice(0, last_index);
      //URL which will be needed for finding tweets
      var open_url = received_url;
      if (open_url.slice(-1) === '/') {
        open_url = received_url.substring(0, open_url.length - 1);
      }
      if (event.auto_update_context === undefined) {
        //By default auto-update context is off
        event.auto_update_context = false;
      }
      //var urlsToAppend = [url, message.url, open_url, message.url, message.url, url, message.url];
      var urlsToAppend = [url, message.url, open_url, message.url, message.url, message.url];
      //If the Context is to be showed in tabs
      if (event.show_context === "tab") {
        var p = Promise.resolve();
        for (var i = 0; i < contexts.length; i++) {
          var e = contexts[i];
          if (event[e.name]) {
            p = p.then(openThatContext(e, urlsToAppend[i], event.show_context));
          }
        }
      } else if (event.show_context === "window") {
        //If the Context is to be showed in Windows
        if (contexts.findIndex(e => e.window === 0) >= 0) {
          //Checking if Windows are not open already
          var p = Promise.resolve();
          for (var i = 0; i < contexts.length; i++) {
            var e = contexts[i];
            if (event[e.name]) {
              p = p.then(openThatContext(e, urlsToAppend[i], event.show_context));
            }
          }
        } else {
          //If context screens(windows) are already opened and user again click on the Context button then update them
          for (var i = 0; i < contexts.length; i++) {
            var e = contexts[i];
            chrome.tabs.query({
              windowId: contexts[i].window
            }, function (tabs) {
              chrome.tabs.update(tabs[0].id, { url: e.htmlUrl + urlsToAppend[i] });
            });
          }
        }
      } else if (event.show_context === "singlewindow") {
        //If the Context is to be showed in singleWindow
        if (windowIdSingle !== 0) {
          //Checking if SingleWindow context is not open already
          chrome.tabs.query({
            windowId: windowIdSingle
          }, function (tabs) {
            chrome.tabs.update(tabs[0].id, { url: chrome.runtime.getURL("singleWindow.html") + "?url=" + message.url });
          });
        } else {
          chrome.windows.create({
            url: chrome.runtime.getURL('singleWindow.html') + '?url=' + message.url,
            width: 1000, height: 1000, top: 0, left: 0
          }, function (win) {
            windowIdSingle = win.id;
          });
        }
      }
    }); // closing chrome.storage.sync.get(['show_context', 'auto_update_context'],function(event){
  } // closing showall if
});

chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
  if (info.status === "complete") {
    chrome.storage.sync.get(['auto_archive'], function (event) {
      if (event.auto_archive === true) {
        auto_save(tab.id, tab.url);
      }
    });
  } else if (info.status === "loading") {
    var received_url = tab.url;
    if (isNotExcludedUrl(received_url) && !(received_url.includes("alexa.com") || received_url.includes("whois.com") || received_url.includes("twitter.com") || received_url.includes("oauth"))) {
      singlewindowurl = received_url;
      tagcloudurl = new URL(singlewindowurl);
      received_url = received_url.replace(/^https?:\/\//, '');
      var last_index = received_url.indexOf('/');
      var url = received_url.slice(0, last_index);
      var open_url = received_url;
      if (open_url.slice(-1) === '/') {
        open_url = received_url.substring(0, open_url.length - 1);
      }
      var urlsToAppend = [url, tab.url, open_url, tab.url, tab.url, tagcloudurl];
      chrome.storage.sync.get(['books', 'auto_update_context', 'show_context'], function (event1) {
        if (event1.books === true) {
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            url = tabs[0].url;
            tabId = tabs[0].id;
            if (url.includes('www.amazon')) {
              fetch('https://archive.org/services/context/amazonbooks?url=' + url)
                .then(resp => resp.json())
                .then(resp => {
                  if (('metadata' in resp && 'identifier' in resp['metadata']) ||
                    'ocaid' in resp) {
                    chrome.browserAction.setBadgeText({ tabId: tabId, text: 'B' })
                  }
                })
            }
          })
        }
        if (event1.auto_update_context === true) {
          if (event1.show_context === "tab" && (contexts.findIndex(e => e.tab !== 0) >= 0 || windowIdtest !== 0)) {
            chrome.tabs.query({
              windowId: windowIdtest
            }, function (tabs) {
              var tab1 = tabs[0];
              tabIdtest = tab1.id;
              if (tab.id !== tabIdtest && contexts.findIndex(e => e.tab !== tab.id) >= 0 && tabs.filter(e => e.id === tabId).length === 0 && contexts.filter(e => e.tab === tabId).length === 0 && contexts.filter(e => e.tab === tab.id).length === 0) {
                for (var i = 0; i < contexts.length; i++) {
                  var e = contexts[i];
                  chrome.tabs.update(parseInt(e.tab), { url: e.htmlUrl + urlsToAppend[i] });
                };
              }
            });
          } else if (event1.show_context === "singlewindow") {
            chrome.tabs.query({
              windowId: windowIdSingle
            }, function (tabs) {
              var tab1 = tabs[0];
              if (tabId !== tab1.id && tab.id !== tab1.id) {
                chrome.tabs.update(tab1.id, { url: chrome.runtime.getURL("singleWindow.html") + "?url=" + singlewindowurl });
              }
            });
          } else if (contexts.findIndex(e => e.window !== 0) >= 0) {
            var i = 0;
            contexts.map(e => {
              chrome.tabs.query({
                windowId: e.window
              }, function (tabs) {
                if (tabs.length > 0) {
                  e.tabContextName = tabs[0].id;
                  if (contexts.filter(e => e.tabContextName === tabId).length == 0 && contexts.filter(e => e.tabContextName === tab.id).length === 0) {
                    chrome.tabs.update(e.tabContextName, { url: e.htmlUrl + urlsToAppend[i++] }, function (tab) { });
                  }
                }
              });
            });
          }
        }
      }); // closing chrome.storage.sync.get(['books', 'auto_update_context', 'show_context'],function(event){
    }
  } // closing if info.status ==="loading"
});

function auto_save(tabId, url) {
  var page_url = url.replace(/\?.*/, '');
  if (isValidUrl(page_url) && ! isNotExcludedUrl(page_url)) {
    wmAvailabilityCheck(page_url,
      function () {
        chrome.browserAction.getBadgeText({ tabId: tabId }, function (result) {
          if (result.includes('S')) {
            chrome.browserAction.setBadgeText({ tabId: tabId, text: result.replace('S', '') });
          }
        })
      },
      function () {
        fetch('https://web-beta.archive.org/save/' + page_url)
        .then(function(){
          chrome.browserAction.getBadgeText({ tabId: tabId }, function (result) {
            if (!result.includes('S')) {
              chrome.browserAction.setBadgeText({ tabId: tabId, text: 'S' + result });
            }
          })
        })
      }
    );
  }
}

//function for opeing a particular context
function openThatContext(contextToOpen, url, methodOfShowing) {
  return function () {
    return new Promise(function (resolve, reject) {
      if (methodOfShowing === 'tab') {
        if (windowIdtest === 0) {
          chrome.windows.create({ url: contextToOpen.htmlUrl + url, width: 800, height: 800, top: 0, left: 0 }, function (win) {
            chrome.tabs.query({
              windowId: win.id
            }, function (tabs) {
              windowIdtest = win.id;
              contextToOpen.tab = tabs[0].id;
              resolve();
            });
          });
        } else {
          chrome.tabs.query({
            windowId: windowIdtest
          }, function (tabs) {
            chrome.tabs.create({ 'url': contextToOpen.htmlUrl + url, 'active': false }, function (tab) {
              contextToOpen.tab = tab.id;
              resolve();
            });
          });
        }
      } else if (methodOfShowing === 'window') {
        //If context is to be shown in window
        chrome.windows.create({ url: contextToOpen.htmlUrl + url, width: 500, height: 500, top: contextToOpen.top, left: contextToOpen.left }, function (win) {
          contextToOpen.window = win.id;
          resolve();
        });
      }
    });
  }
}

// Right-click context menu "Wayback Machine" inside the page.
chrome.contextMenus.create({
  'id': 'first',
  'title': 'First Version',
  'contexts': ['all'],
  'documentUrlPatterns': ['*://*/*', 'ftp://*/*']
});
chrome.contextMenus.create({
  'id': 'recent',
  'title': 'Recent Version',
  'contexts': ['all'],
  'documentUrlPatterns': ['*://*/*', 'ftp://*/*']
});
chrome.contextMenus.create({
  'id': 'all',
  'title': 'All Versions',
  'contexts': ['all'],
  'documentUrlPatterns': ['*://*/*', 'ftp://*/*']
});
chrome.contextMenus.create({
  'id': 'save',
  'title': 'Save Page Now',
  'contexts': ['all'],
  'documentUrlPatterns': ['*://*/*', 'ftp://*/*']
});
chrome.contextMenus.onClicked.addListener(function (click) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (['first', 'recent', 'save', 'all'].indexOf(click.menuItemId) >= 0) {
      const pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
      const page_url = tabs[0].url.replace(pattern, '');
      let wayback_url;
      let wmIsAvailable = true;
      if (click.menuItemId === 'first') {
        wayback_url = 'https://web.archive.org/web/0/' + encodeURI(page_url);
      } else if (click.menuItemId === 'recent') {
        wayback_url = 'https://web.archive.org/web/2/' + encodeURI(page_url);
      } else if (click.menuItemId === 'save') {
        wmIsAvailable = false;
        wayback_url = 'https://web-beta.archive.org/save/' + encodeURI(page_url);
      } else if (click.menuItemId === 'all') {
        wmIsAvailable = false;
        wayback_url = 'https://web.archive.org/web/*/' + encodeURI(page_url);
      }
      URLopener(wayback_url, page_url, wmIsAvailable);
    }
  });
});
