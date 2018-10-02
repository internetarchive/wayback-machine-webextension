var url=getUrlByParameter('url');
var domaintools_api = 'https://archive.org/services/context/domaintools?url='+url;
var http = new XMLHttpRequest();
http.open("GET", domaintools_api, true);
http.onload = function() {
    var data=JSON.parse(http.response);
    var parent=document.getElementById("show_domaintools_data");
    if(data.response.results_count!=0){
        if(data.response.results[0].domain){
            var child= document.getElementById("domain");
            child.innerHTML="Domain: "+data.response.results[0].domain;
            parent.appendChild(child);
        }
        if(data.response.results[0].alexa){
            var child= document.getElementById("alexa");
            child.innerHTML="Alexa Rank: "+data.response.results[0].alexa;
            parent.appendChild(child);
        }
        if(data.response.results[0].admin_contact.country.value){
            var child=document.getElementById("admin_contact_country");
            child.innerHTML="Country: "+data.response.results[0].admin_contact.country.value;
            parent.appendChild(child);
        }
        if(data.response.results[0].create_date.value){
            var child=document.getElementById("create_date");
            child.innerHTML="Created Date: "+data.response.results[0].create_date.value;
            parent.appendChild(child);
        }
        if(data.response.results[0].email_domain[0].value){
            var child=document.getElementById("email_domain");
            child.innerHTML="Email Domain: "+data.response.results[0].email_domain[0].value;
            parent.appendChild(child);
        }
        if(data.response.results[0].expiration_date.value){
            var child=document.getElementById("expiration_date");
            child.innerHTML="Expire Date: "+data.response.results[0].expiration_date.value;
            parent.appendChild(child);
        }
        if(data.response.results[0].admin_contact.state.value){
            var child=document.getElementById("admin_contact_state");
            child.innerHTML="State: "+data.response.results[0].admin_contact.state.value;
            parent.appendChild(child);
        }
        if(data.response.results[0].registrant_org.value){
            var child=document.getElementById("registrant_org");
            child.innerHTML="Registrant Org: "+data.response.results[0].registrant_org.value;
            parent.appendChild(child);
        }
        if(data.response.results[0].website_response){
            var child=document.getElementById("website_response");
            if(data.response.results[0].website_response==200){
                child.innerHTML="Website Response Status Code: "+data.response.results[0].website_response+" OK";
            }else if(data.response.results[0].website_response==404){
                child.innerHTML="Website Response Status Code: "+data.response.results[0].website_response+" Not Found";
            }
            parent.appendChild(child);
        }
        if(data.response.results[0].whois_url){
            var child=document.getElementById("whois");
            child.href=data.response.results[0].whois_url;
            child.innerHTML="Click to see the Whois URL";
            parent.appendChild(child);
        }
    }else{
        document.getElementById("show_domaintools_data").innerHTML="No data found!!";
    }
};
http.send(null);

function getUrlByParameter(name){
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}