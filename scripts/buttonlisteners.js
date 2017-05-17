function breakDownURL(url) {
    var domain = "",
        page = "";
    //remove "http://"
    if (url.indexOf("http://") == 0) {
        url = url.substr(7);
    }
    //remove "www."
    if (url.indexOf("www.") == 0) {
        url = url.substr(4);
    }
    domain = url.split('/')[0].split('.')[0]
    if (url.split('/').length > 1) {
        page = url.split('/')[1].split('.')[0];
    }
    var link = 'https://twitter.com/search?l=&q=';
    var apos = "\"";
    var str1 = document.getElementById('date1').value;
    var str2 = document.getElementById('date2').value;
    var arr = [link,apos,domain,apos,"since:",str1,"until:",str2];
    window.open(arr.join(""));
    //console.log(arr.join(""));
    //window.open(res);
    /*console.log("domain : " + domain + 
      (page == "" ? "" : " page : " + page) + page + "<br/>");*/
}

/*function search(){
      var input_field = document.getElementById('input_field'); 
      var str = input_field.value;
      var link = 'https://archive.org/search.php?query=';
      var res = link.concat(str);
      window.open(res);

    }*/




function get_summary(){
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      var url = tabs[0].url;
      //document.getElementById("facebook").href = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
      //document.getElementById("google-plus").href = 'https://plus.google.com/share?url=' + url;
      //document.getElementById("twitter").href = 'https://twitter.com/home?status=' + url;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://web.archive.org/web/*/'+url, true);
      xhr.responseType = 'document';
      xhr.send();
      xhr.onload = function(e) {  

          var doc = e.target.responseXML;
          try{
            document.getElementById("message").appendChild(doc.getElementById('wbMeta').children[1]);
            document.getElementById("times").style.display = "none";
            document.getElementById("times_tag").appendChild(document.getElementById('message').children[0].children[0]);
            document.getElementById("from").innerHTML = document.getElementById('message').children[0].children[0].text; 
            document.getElementById("to").innerHTML = document.getElementById('message').children[0].children[1].text;
            //document.body.style.background = "#00E676";
          }
          catch(e){
            document.getElementById("times").innerHTML = "0 times";
            document.getElementById("from_tag").style.display = "none";
            document.getElementById("to_tag").style.display = "none";
            document.getElementById("save_now").style.background = "#00E676";
            document.getElementById("recent_button").disabled = true;
            document.getElementById("first_button").disabled = true;

            
          }
          /*var line = document.createElement("p");
          line.innerHTML =  document.getElementById('message').children[0].children[0].text;
          document.getElementById("from").appendChild(line);
          var line2 = document.createElement("p");
          line2.innerHTML =  document.getElementById('message').children[0].children[1].text;
          document.getElementById("to").appendChild(line2);*/
          //document.getElementById("overview").appendChild(document.getElementById('message').children[0].children[0].text);
          //console.log(document.getElementById('message').children[0].children[1].text);
                    
      }
  });
} 

window.onload = get_summary();


  document.addEventListener('DOMContentLoaded', function() {
    articles = document.getElementsByClassName('icon-button');
    for (var i = 0; i < articles.length; i++) {
        articles[i].addEventListener('click',redirect,false);
    }
    function redirect(){
      var url_text;
      if(this.id=="facebook"){
        url_text = 'https://www.facebook.com/sharer/sharer.php?u=';
      }
      else if(this.id=="twitter")
      {
        url_text = 'https://twitter.com/home?status=';
      }
      else if(this.id=="google-plus"){
        url_text = 'https://plus.google.com/share?url=';
      }
      else{
        console.log("Ghost");
      }
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        url_text += url;
        window.open(url_text,'newwindow', 'width=600, height=400');
      });

    }
    /*document.getElementById("facebook").onclick = function() {
      
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        var fb_url = 'https://www.facebook.com/sharer/sharer.php?u='+url;
        window.open(fb_url,'newwindow', 'width=600, height=400');
      });     
    }

  document.getElementById("twitter").onclick = function() {
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        var tw_url = 'https://twitter.com/home?status='+url;
        window.open(tw_url,'newwindow', 'width=600, height=400');
      });
    }

  document.getElementById("google-plus").onclick = function() {
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        var gp_url = 'https://plus.google.com/share?url='+url;
        window.open(gp_url,'newwindow', 'width=600, height=400');
      });
      
    }*/
  //var ourRequest = new XMLHttpRequest();
  //ourRequest.open('GET','http://web.archive.org/web/*/https://www.youtube.com/');
  /*ourRequest.onload = function(){
    //var str = ourRequest.responseText;
    var n = str.indexOf("<p>Saved <strong>");
    var i = n;
    var empty = "";
    for (i=n+17;i<n+27;i++){
      empty = empty + str[i];
    }
    console.log(ourRequest.responseTe
  };
  ourRequest.send();
  */

  /*var twitter_search = document.getElementById('twitter_search');
  twitter_search.addEventListener('click', function() {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      var url = tabs[0].url;
      breakDownURL(url);
    }); 
  }, false);*/
  

  var save_now = document.getElementById('save_now');
  save_now.addEventListener('click', function() {
    chrome.tabs.executeScript(null, {code: "var save_now=1;"}, function() {
      chrome.tabs.executeScript(null, {file: "scripts/functions.js"}, function() {
      });
    });
  }, false);

  var recent_capture = document.getElementById('recent_capture');
  recent_capture.addEventListener('click', function() {
    chrome.tabs.executeScript(null, {code: "var recent_capture=1;"}, function() {
      chrome.tabs.executeScript(null, {file: "scripts/functions.js"}, function() {
      });
    });
  }, false);

  /*var search_button = document.getElementById('search_button');
  search_button.addEventListener('click', function() {
    search();
  }, false);*/

  /*var input_field = document.getElementById('input_field');
  input_field.addEventListener('keydown', function(e) {

    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
      if(key == 13) {
          search();
      }
  }, false);*/

  

  var first_capture = document.getElementById('first_capture');
  first_capture.addEventListener('click', function() {
    chrome.tabs.executeScript(null, {code: "var first_capture=1;"}, function() {
      chrome.tabs.executeScript(null, {file: "scripts/functions.js"}, function() {
      });
    });
  }, false);

  /*var view_all = document.getElementById('view_all');
  view_all.addEventListener('click', function() {
    chrome.tabs.executeScript(null, {code: "var view_all=1;"}, function() {
      chrome.tabs.executeScript(null, {file: "scripts/functions.js"}, function() {
      });
    });
  }, false);*/
}, false);
