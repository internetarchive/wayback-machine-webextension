function url_getter(url) {
    var url=getUrlByParameter('url');
    var domaintools_api = 'https://archive.org/services/context/domaintools?url='+url;
    $.getJSON(domaintools_api,function(data){
        var parent=$('#show_domaintools_data');
        if(data.response.results_count!=0){
            if(data.response.results[0].domain){
                parent.append($("#domain").text("Domain: "+data.response.results[0].domain));
            }
            if(data.response.results[0].alexa){
                parent.append($("#alexa").text("Alexa Rank: "+data.response.results[0].alexa));
            }
            if(data.response.results[0].admin_contact.country.value){
                parent.append($("#admin_contact_country").text("Country: "+data.response.results[0].admin_contact.country.value));
            }
            if(data.response.results[0].create_date.value){
                parent.append($("#create_date").text("Created Date: "+data.response.results[0].create_date.value));
            }
            if(data.response.results[0].email_domain[0].value){
                parent.append($("#email_domain").text("Email Domain: "+data.response.results[0].email_domain[0].value));
            }
            if(data.response.results[0].expiration_date.value){
                parent.append($("#expiration_date").text("Expire Date: "+data.response.results[0].expiration_date.value));
            }
            if(data.response.results[0].admin_contact.state.value){
                parent.append($("#admin_contact_state").text("State: "+data.response.results[0].admin_contact.state.value));
            }
            if(data.response.results[0].registrant_org.value){
                parent.append($("#registrant_org").text("Registrant Org: "+data.response.results[0].registrant_org.value));
            }
            if(data.response.results[0].website_response){
                if(data.response.results[0].website_response==200){
                    parent.append($("#website_response").text("Website Response Status Code: "+data.response.results[0].website_response+" OK"));
                }else if(data.response.results[0].website_response==404){
                    parent.append($("#website_response").text("Website Response Status Code: "+data.response.results[0].website_response+" Not Found"));
                }
            }
            if(data.response.results[0].whois_url){
                parent.append($("#whois").attr('href',data.response.results[0].whois_url).text("Click to see the Whois URL"));
            }
        }else{
            parent.text("No data found!!");
        }
    });
}

