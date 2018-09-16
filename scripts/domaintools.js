function getUrlByParameter(name){
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}

function url_getter(url) {
    var url=getUrlByParameter('url');
    var domaintools_api = 'https://archive.org/services/context/domaintools?url='+url;
    var http = new XMLHttpRequest();
    http.open("GET", domaintools_api, true);
    http.onload = function() {
        var data=JSON.parse(http.response);
        console.log(data);
        console.log(data.response.results_count);
        if(data.response.results_count!=0){
            document.getElementById("domain").innerHTML="Domain: "+data.response.results[0].domain;
            document.getElementById("alexa").innerHTML="Alexa Rank: "+data.response.results[0].alexa;
            document.getElementById("whois").href=data.response.results[0].whois_url;
            document.getElementById("whois").innerHTML="Click to see the Whois URL";
            document.getElementById("website_response").innerHTML="Website Response: "+data.response.results[0].website_response;
            document.getElementById("create_date").innerHTML="Created Date: "+data.response.results[0].create_date.value;
            document.getElementById("expiration_date").innerHTML="Expire Date: "+data.response.results[0].expiration_date.value;
            document.getElementById("registrant_org").innerHTML="Registrant Org: "+data.response.results[0].registrant_org.value;   
        }else{
            document.getElementById("show_domaintools_data").innerHTML="No data found!!";
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