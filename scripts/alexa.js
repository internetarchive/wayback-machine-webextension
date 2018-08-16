function getUrlByParameter(name){
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}

function url_getter(url) {
    var alexa_url = 'http://xml.alexa.com/data?cli=10&dat=n&url=';
    var url=getUrlByParameter('url');
    var host_url = url.replace(/^https{0,1}:\/\//, '').replace(/^www\./, '').replace(/\/.*/, '');
    var http = new XMLHttpRequest();
    http.open("GET", alexa_url + host_url, true);
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("here");
            var html = "<b>"+"<span class='color_code'>"+ host_url +'</span>'+"</b><br/><b>Alexa Rank: </b>";
            var xmldata = http.responseXML.documentElement;
            if (xmldata.getElementsByTagName("POPULARITY")) 
            {
                html +="<span class='color_code'>"+xmldata.getElementsByTagName("POPULARITY")[0].getAttribute('TEXT')+"</span>";
            } 
            else {
                html += "N/A";
            }
            if(xmldata.getElementsByTagName("COUNTRY"))
            {
                html += '<br/>'+'<b>Country:</b>' +"<span class='color_code'>"+
                        xmldata.getElementsByTagName('COUNTRY')[0].getAttribute('NAME');
            }
            else{
                html+="N/A";
            }
            var rl = xmldata.getElementsByTagName('RL');
            if (rl.length > 0) {
                html += '<br><br><span class="glyphicon glyphicon-globe red" aria-hidden="true"></span> ' +
                '<b>Related sites:</b><br/><ul class="rl-list rl-link">';
                for(var i = 0, len = rl.length; i < len && i < 5; i++) {
                    var rl_title = rl[i].getAttribute('TITLE');
                    html += '<li><a href="http://' + rl[i].getAttribute('HREF') + '" target="_blank" class="rl-a">' +
                    (rl_title.length > 18 ? rl_title.substring(0, 15) + '...' : rl_title) +
                    '</a></li>';
                }
                html += '</ul>';
            }
            document.getElementById("show_alexa_data").innerHTML = html;
        }
    };
    http.send(null);
}

window.onloadFuncs = [url_getter];
window.onload = function(){
 for(var i in this.onloadFuncs){
  this.onloadFuncs[i]();
 }
}