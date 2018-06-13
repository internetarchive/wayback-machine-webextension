/*
 * LICENSE: AGPL-3
 * Copyright 2016, Internet Archive
 */
(function() {
  console.log("Client injected");
  var enforceBannerInterval;
  var archiveLinkWasClicked = false;
  var bannerWasShown = false;
  var bannerWasClosed = false;
  var el = document.createElement('link');
  el.rel = 'stylesheet';
  el.type = 'text/css';
  el.href = chrome.extension.getURL("css/client.css");
  document.head.appendChild(el);
  /**
   * Brute force inline css style reset
   */
  function resetStyesInline(el) {
    el.className="all-first-css";
  }

  /**
   * Communicates with background.js
   * @param action {string}
   * @param complete {function}
   */

  /**
   * @param {string} type
   * @param {function} handler(el)
   * @param remaining args are children
   * @returns {object} DOM element
   */
  function createEl(type, handler) {
    var el = document.createElement(type);
    resetStyesInline(el);
    if (handler !== undefined) {
      handler(el);
    }
    // Append *args to created el
    for (var i = 2; i < arguments.length; i++) {
      el.appendChild(arguments[i]);
    }
    return el;
  }

  function createBanner(wayback_url,page_url,status_code) {
    if (document.getElementById("no-more-404s-message") !== null) {
      return;
    }
    document.body.appendChild(
    createEl("div",
        function(el) {
          el.className="no-more-404s-messages";
          el.id = "no-more-404s-message";
          },
          createEl("div",
            function(el) {
              el.className="no-more-404s-messages-inner"
              el.id = "no-more-404s-message-inner";
            },
            createEl("div",
              function(el) {
                el.className="no-more-404s-header-content"
                el.id = "no-more-404s-header";
              },
              createEl("div",
                function(el){
                  el.className="status-code-content"
                },
                createEl("span",
                  function(el){
                    el.className="status-show"
                    el.innerHTML="Status Code:";
                  }
                ),
                createEl("span",
                  function(el){
                    el.className="status-code-show"
                    el.appendChild(document.createTextNode(status_code));
                  }
                )
              ),
              createEl("div",
                function(el){
                  el.className="url-show-content";
                },
                createEl("span",
                  function(el){
                    el.className="url-show"
                    el.appendChild(document.createTextNode(page_url));
                  }
                ),
              ),
              createEl("button",
                function(el) {
                  el.className="button-cross";
                  el.onclick = function() {
                    clearInterval(enforceBannerInterval);
                    document.getElementById("no-more-404s-message").style.display = "none";
                    bannerWasClosed = true;
                  };
                },
                createEl("img",
                  function(el) {
                    el.className="imgae-button";
                    el.src = chrome.extension.getURL("images/close.svg");
                    el.alt = "close";
                  }
                )
              )
            ),
            createEl("p", function(el) {
              el.className="paragraph";
              el.appendChild(document.createTextNode("View a saved version courtesy of the"));
            }),
            createEl("img", function(el) {
              el.className = "no-more-404s-image"
              el.src = chrome.extension.getURL("images/logo.gif");
            }),
            createEl("a", function(el) {
              el.className="no-more-404s-messages-link";
              el.id = "no-more-404s-message-link";
              el.href = wayback_url;
              el.appendChild(document.createTextNode("Click here to see archived version"));
              el.onclick = function(e) {
                archiveLinkWasClicked = true;

                // Work-around for myspace which hijacks the link
                if (window.location.hostname.indexOf("myspace.com") >= 0) {
                  e.preventDefault();
                  return false;
                } else {
                }
              };
            })
          )
        )
      );
    // Focus the link for accessibility
    document.getElementById("no-more-404s-message-link").focus();

    // Transition element in from top of page
    setTimeout(function() {
      document.getElementById("no-more-404s-message").style.transform = "translate(0, 0%)";
    }, 100);

    bannerWasShown = true;
  }
  function checkIt(wayback_url,page_url,status_code) {
    // Some pages use javascript to update the dom so poll to ensure
    // the banner gets recreated if it is deleted.
    enforceBannerInterval = setInterval(function() {
      createBanner(wayback_url,page_url,status_code);
    }, 500);

  }
// Listen to message from background.js
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.type === "SHOW_BANNER") {
        if (request.wayback_url) {
          checkIt(request.wayback_url,request.page_url,request.status_code);
        }
      }
  });


})();
