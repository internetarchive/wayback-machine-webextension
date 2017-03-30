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

function get_alexa_info() {
  chrome.runtime.sendMessage({ message: "geturl" }, function(response) {
    ask_for(response.url);
  });
  
  function ask_for(url) {
    var alexa_url = 'http://xml.alexa.com/data?cli=10&dat=n&url=';
    var host = url.replace(/^https{0,1}:\/\//, '').replace(/^www\./, '').replace(/\/.*/, '');
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var html = '<span class="red"><b>' + host + '</b></span><br/>';
        var xml = req.responseXML.documentElement;

        // Get rank
        if (xml.getElementsByTagName('POPULARITY').length > 0) {
          html += '<span class="glyphicon glyphicon-signal red" aria-hidden="true"></span> ' +
            '<b>Alexa rank:</b> ' +
            xml.getElementsByTagName('POPULARITY')[0].getAttribute('TEXT') +
            '<br/>';
        }

        // Get country
        if (xml.getElementsByTagName('COUNTRY').length > 0) {
          html += '<span class="glyphicon glyphicon-flag red" aria-hidden="true"></span> ' +
            '<b>Country:</b> ' +
            xml.getElementsByTagName('COUNTRY')[0].getAttribute('NAME') +
            '<br/>';
        }

        // Get a list of related sites
        var rl = xml.getElementsByTagName('RL');
        var rl_links = [];
        if (rl.length > 0) {
          html += '<span class="glyphicon glyphicon-globe red" aria-hidden="true"></span> ' +
            '<b>Related sites:</b><br/><ul class="rl-list rl-link">';
          for (var i = 0, len = rl.length; i < len && i < 5; i++) {
            var rl_title = rl[i].getAttribute('TITLE');
            rl_links.push('http://' + rl[i].getAttribute('HREF'));
            html += '<li><a href="" class="rl-a" id="rl' + i + '">' +
              (rl_title.length > 18 ? rl_title.substring(0, 15) + '...' : rl_title) +
              '</a></li>';
          }
          html += '</ul>';
        }

        // Inject results in pop-up if there are any
        document.getElementById('alexa').innerHTML = html;

        // Add event listeners for opening links
        for (var i = 0, len = rl_links.length; i < len; i++) {
          addLink("rl" + i, rl_links[i]);
        }
      }
    };
    req.open('GET', alexa_url + host, true);
    req.send();
  }
}

function addLink(id, link) {
  document.getElementById(id).addEventListener("click", function() {
    chrome.runtime.sendMessage({ message: "openlink", link: link }, function(response) {});
  }, false);
}

window.onload = get_alexa_info();

document.getElementById('save_now').onclick = save_now_function;
document.getElementById('recent_capture').onclick = recent_capture_function;
document.getElementById('first_capture').onclick = first_capture_function;
