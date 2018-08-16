function getUrlByParameter(name){
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}

function get_alexa() {
    var alexa_url = 'http://xml.alexa.com/data?cli=10&dat=n&url=';
    var url=getUrlByParameter('url');
    url=url.replace(/^https?:\/\//,'')
    var http = new XMLHttpRequest();
    console.log(url);
    http.open("GET", alexa_url + url, true);
    console.log(alexa_url+url);
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var html = "<b>"+"<span class='color_code'>"+ url +'</span>'+"</b><br/><b>Alexa Rank: </b>";
            var xmldata = http.responseXML.documentElement;
            console.log(xmldata);
            if (xmldata.getElementsByTagName("POPULARITY")) 
            {
                html +="<span class='color_code'>"+xmldata.getElementsByTagName("POPULARITY")[0].getAttribute('TEXT')+"</span>";
            } 
            else {
                html += "N/A";
            }
            if(xmldata.getElementsByTagName("COUNTRY")[0])
            {
                html += '<br/>'+'<b>Country:</b>' +"<span class='color_code'>"+
                        xmldata.getElementsByTagName('COUNTRY')[0].getAttribute('NAME');
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

function get_whois(url){
    var url=getUrlByParameter('url');
    var host_url = url.replace(/^https{0,1}:\/\//, '').replace(/^www\./, '').replace(/\/.*/, '');
    var whois_url="https://www.whoisxmlapi.com/whoisserver/WhoisService?domainName="+host_url+"&username=anishkumarsarangi&password=archiveit";
    var http = new XMLHttpRequest();
    http.open("GET", whois_url, true);
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var html = "<b>"+"<span class='color_code_whois'>"+ host_url +'</span>'+"</b><br/><b>Domain-Name: </b>";
            var xmldata = http.responseXML.documentElement;
            if (xmldata.getElementsByTagName("domainName")){
                html +="<span class='color_code_whois'>"+xmldata.getElementsByTagName("domainName")[0].innerHTML+"</span>";
            } 
            else {
                html += "N/A";
            }
            if(xmldata.getElementsByTagName("registrarName")[0]){
                html += '<br/>'+'<b>Registrar: </b>' +"<span class='color_code_whois'>"+
                    xmldata.getElementsByTagName('registrarName')[0].innerHTML;
            }
            if(xmldata.getElementsByTagName("rawText")){
                html += '<br/><br/>'+"<span style='color:black'>"+
                    xmldata.getElementsByTagName('rawText')[0].innerHTML;
            }
            if(xmldata.getElementsByTagName("createdDateNormalized")){
                html += '<br/><b>Registration Date: </b><br/>'+"<span style='color:black'>"+
                    xmldata.getElementsByTagName('createdDateNormalized')[0].innerHTML;
                html += '<br/><b>Updated Date: </b>'+"<span style='color:black'>"+
                    xmldata.getElementsByTagName('updatedDateNormalized')[0].innerHTML;
            }
            document.getElementById("show_whois_data").innerHTML = html;
        }
    };
    http.send(null);
}

function get_details(){
    var url=getUrlByParameter('url');
    var xhr=new XMLHttpRequest();
    var new_url="http://web.archive.org/__wb/search/metadata?q="+url;
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        var type=JSON.parse(xhr.response).type;
        document.getElementById("details").innerHTML=type;
        var captures=JSON.parse(xhr.response).captures;
        var total="";
        for (var key in captures) {
            if (captures.hasOwnProperty(key)) {
                data=captures[key];
                total=parseInt(total+(data['text/html']));
            }
        }
        total=total.toLocaleString();
        document.getElementById("total_archives").innerHTML=total;
        document.getElementById("save_now").href="https://web.archive.org/save/"+url;
    }
    xhr.send(null);
}

function first_archive_details(){
    var url=getUrlByParameter('url');
    var xhr=new XMLHttpRequest();
    var new_url="http://web.archive.org/cdx/search?url="+url+"&limit=1&output=json";
    xhr.open("GET",new_url,true);
    xhr.send(null);
    xhr.onload=function(){
        var data=JSON.parse(xhr.response);
        if(data.length==0){
            document.getElementById("first_archive_date").innerHTML="( Data is not available -Not archived before )";
            document.getElementById("first_archive_date_2").innerHTML="( Data is not available -Not archived before )";
            document.getElementById("first_archive_time").innerHTML="( Data is not available-Not archived before )";
            document.getElementById("link_first").href="https://web.archive.org/web/0/"+url;
        }else {
            var timestamp=data[1][1];
            var date=timestamp.substring(4,6)+'/'+timestamp.substring(6,8)+'/'+timestamp.substring(0,4);
            var time=timestamp.substring(8,10)+'.'+timestamp.substring(10,12)+'.'+timestamp.substring(12,14)
            document.getElementById("first_archive_date").innerHTML="( "+date+" )";
            document.getElementById("first_archive_date_2").innerHTML="( "+date+" )";
            document.getElementById("first_archive_time").innerHTML="( "+time+" ) according to Universal Time Coordinated (UTC)";
            document.getElementById("link_first").href="https://web.archive.org/web/0/"+url;
        }
    }
}

function recent_archive_details(){
    var url=getUrlByParameter('url');
    var xhr=new XMLHttpRequest();
    var new_url="http://web.archive.org/cdx/search?url="+url+"&limit=-1&output=json";
    xhr.open("GET",new_url,true);
    xhr.send(null);
    xhr.onload=function(){
        var data=JSON.parse(xhr.response);
        if(data.length==0){
            document.getElementById("recent_archive_date").innerHTML="( Data is not available -Not archived before )";
            document.getElementById("recent_archive_time").innerHTML="( Data is not available-Not archived before )";
            document.getElementById("link_recent").href="https://web.archive.org/web/2/"+url;
        }else {
            var timestamp=data[1][1];
            var date=timestamp.substring(4,6)+'/'+timestamp.substring(6,8)+'/'+timestamp.substring(0,4);
            var time=timestamp.substring(8,10)+'.'+timestamp.substring(10,12)+'.'+timestamp.substring(12,14)
            document.getElementById("recent_archive_date").innerHTML="( "+date+" )";
            document.getElementById("recent_archive_time").innerHTML="( "+time+") according to Universal Time Coordinated (UTC)";
            document.getElementById("link_recent").href="https://web.archive.org/web/2/"+url;
        }
    }
}

function get_thumbnail(){
    var url=getUrlByParameter('url');
    url = url.replace(/^https?:\/\//,'');
    var index=url.indexOf('/');
    url=url.substring(0,index);
    var xhr=new XMLHttpRequest();
    var new_url="https://web.archive.org/thumb/"+url;
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        if(this.response.size!=233){
            var img = document.createElement('img');
            var url = window.URL || window.webkitURL;
            img.src = url.createObjectURL(this.response);
            var show_thumbnail=document.getElementById("show_thumbnail");
            show_thumbnail.appendChild(img);
        }
        else{
            document.getElementById("show_thumbnail").innerHTML="Thumbnail not found";
        }
    }
    xhr.onerror=function(){
        document.getElementById("show_thumbnail").innerHTML="Thumbnail not found";
    };
    xhr.ontimeout = function() {
        document.getElementById("show_thumbnail").innerHTML="Please refresh the page...Time out!!";
    }
    xhr.responseType = 'blob';
    xhr.send(null);
}

function get_tweets(){
    var url=getUrlByParameter('url');
    url = url.replace(/^https?:\/\//,'');
    url=url.replace(/^www./, "");
    var index_new=url.indexOf('/');
    url=url.slice(0,index_new-1);
    var xhr=new XMLHttpRequest();
    var new_url="https://api.twitter.com/1.1/search/tweets.json?q="+url+"&result_type=popular";
    var res= new Object();
    res.q=url;
    res.result_type="popular"
    console.log(new_url);
    var author=getAuthorization('GET','https://api.twitter.com/1.1/search/tweets.json',res);
    console.log(author);
    xhr.open("GET",new_url,true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization',author)
    xhr.onload=function(){
        console.log(JSON.parse(xhr.response));
        data=JSON.parse(xhr.response);
        var length=(data.statuses.length);
        if(length>0){
            for(var i=0;i<length;i++){
                dataRow=data.statuses[i];
                var row=document.getElementById('row-twitter');
                var item=row.cloneNode(true);
                var tweet_text=dataRow.text;
                var name=dataRow.user.name;
                var url=dataRow.entities.urls[0].expanded_url;
                var tweet_div=item.querySelectorAll('[id="tweets"]')[0].appendChild(document.createTextNode(tweet_text));
                var profile_name=item.querySelectorAll('[id="profile-name"]')[0].appendChild(document.createTextNode(name));
                var img=item.querySelectorAll('[id="profile-image"]')[0];
                img.setAttribute('src',dataRow.user.profile_image_url);
                item.id = "row-tweets"+i;
                var link=item.querySelectorAll('[id="link"]')[0];
                link.setAttribute('href',url);
                document.getElementById("box-twitter").appendChild(item);
            }
            document.getElementById("row-twitter").style.display="none";
        }else{
            document.getElementById("box-twitter").innerHTML="There are no Tweets for the current URL";
            document.getElementById("row-twitter").style.display="none";
        }
        
    }
    xhr.send(null);
}

function get_annotaions_url(){
    var url1=getUrlByParameter('url');
    url1=decodeURI(url1);
    var xhr= new XMLHttpRequest();
    var test_url="";    
    if(url1.includes('iskme.org')){
        test_url=url1.replace(/^www\./,'');
    }
    if(test_url){
        url1=test_url;
    }
    length=url1.length;
    url1=(url1.slice(0,length-1));
    console.log(url1);
    var new_url="https://hypothes.is/api/search?uri="+url1;
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        var data=JSON.parse(xhr.response);
        console.log(data);
        var length=data.rows.length;
        if(length>0){
            for(var i=0;i<length;i++){
                var rowData=data.rows[i];
                var date=rowData.created.substring(0,10);
                var source=rowData.target[0].source;
                var exactData=rowData.text;
                var user=rowData.user.substring(5,rowData.user.indexOf('@'));
                var row=document.getElementById('row-contain');
                var item=row.cloneNode(true);
                var topDivDate=item.querySelectorAll('[id="date-"]')[0].appendChild(document.createTextNode("Dated on :"+date));
                var topDivUserInfo=item.querySelectorAll('[id="userinfo"]')[0].appendChild(document.createTextNode(user));
                var targetSelectorExact=item.querySelectorAll('[id="source-contain"]')[0].appendChild(document.createTextNode("("+source+")"));
                var text=item.querySelectorAll('[id="text-contain"]')[0].appendChild(document.createTextNode(exactData));
                var title=item.querySelectorAll('[id="title-contain"]')[0].appendChild(document.createTextNode(rowData.document.title[0]));
                var createA = document.createElement('a');
                var createAText = document.createTextNode("Click to see the in-context");
                createA.setAttribute('href', rowData.links.incontext);
                createA.setAttribute('id',"link-incontext");
                createA.appendChild(createAText);
                var date=item.querySelectorAll('[id="links"]')[0].appendChild(createA);
                var createB = document.createElement('a');
                var createBText = document.createTextNode("Click to see the HTML");
                createB.setAttribute('href', rowData.links.html);
                createB.setAttribute('id',"link-html");
                createB.appendChild(createBText);
                var linked1=item.querySelectorAll('[id="links"]')[0].appendChild(createA);
                var linked2=item.querySelectorAll('[id="links"]')[0].appendChild(createB);
                if(rowData.target[0].hasOwnProperty('selector')){
                    var lengthOfSelctor=rowData.target[0].selector.length;
                    var selector=rowData.target[0].selector[lengthOfSelctor-1].exact;
                    var selectorDiv=item.querySelectorAll('[id="target-selector-exact-contain"]')[0].appendChild(document.createTextNode(selector));
                }
                else{
                    item.querySelectorAll('[id="target-selector-exact-contain"]')[0].style.display="none";
                }
                item.id = "row-"+i;
                document.getElementById("box-annotation").appendChild(item);
            }
            document.getElementById("row-contain").style.display="none";
        }else{
            document.getElementById("box-annotation").innerHTML="There are no Annotations for the current URL";
            document.getElementById("row-contain").style.display="none";
        }
    }
    xhr.send(null);
}


function getAuthorization(httpMethod, baseUrl, reqParams) {
    // Get acces keys
    const consumerKey       = "JYIqN1CLQOTO9OjbpEaNsjhhH",
        consumerSecret      = "dBsYOqFDEllj24qyfdBMo7jvIgWQ4SoH1Q3KdtWOKaz63UCfpH",
        accessToken         = "3229028316-85M78pR27WbKUHRym9Z2LZKfSErXRUeaehU1Cd8",
        accessTokenSecret   = "6PY70PgLzUu6aE7DE1eouGDKw8EwmDfiDBmgIowpxUTrf";
    // timestamp as unix epoch
    let timestamp  = Math.round(Date.now() / 1000);
    // nonce as base64 encoded unique random string
    let nonce      = btoa(consumerKey + ':' + timestamp);
    // generate signature from base string & signing key
    let baseString = oAuthBaseString(httpMethod, baseUrl, reqParams, consumerKey, accessToken, timestamp, nonce);
    let signingKey = oAuthSigningKey(consumerSecret, accessTokenSecret);
    let signature  = oAuthSignature(baseString, signingKey);
    // return interpolated string
    return 'OAuth '                                         +
        'oauth_consumer_key="'  + consumerKey       + '", ' +
        'oauth_nonce="'         + nonce             + '", ' +
        'oauth_signature="'     + signature         + '", ' +
        'oauth_signature_method="HMAC-SHA1", '              +
        'oauth_timestamp="'     + timestamp         + '", ' +
        'oauth_token="'         + accessToken       + '", ' +
        'oauth_version="1.0"'                               ;
}

function oAuthBaseString(method, url, params, key, token, timestamp, nonce) {
    return method
            + '&' + percentEncode(url)
            + '&' + percentEncode(genSortedParamStr(params, key, token, timestamp, nonce));
};

function oAuthSigningKey(consumer_secret, token_secret) {
    return consumer_secret + '&' + token_secret;
};

function oAuthSignature(base_string, signing_key) {
    var signature = hmac_sha1(base_string, signing_key);
    return percentEncode(signature);
};
function hmac_sha1(string, secret) {
    let shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.setHMACKey(secret, "TEXT");
    shaObj.update(string);
    let hmac = shaObj.getHMAC("B64");
    return hmac;
};
function mergeObjs(obj1, obj2) {
    for (var attr in obj2) {
        obj1[attr] = obj2[attr];
    }
    return obj1;
};
function genSortedParamStr(params, key, token, timestamp, nonce)  {
    // Merge oauth params & request params to single object
    let paramObj = mergeObjs(
        {
            oauth_consumer_key : key,
            oauth_nonce : nonce,
            oauth_signature_method : 'HMAC-SHA1',
            oauth_timestamp : timestamp,
            oauth_token : token,
            oauth_version : '1.0'
        },
        params
    );
    // Sort alphabetically
    let paramObjKeys = Object.keys(paramObj);
    let len = paramObjKeys.length;
    paramObjKeys.sort();
    // Interpolate to string with format as key1=val1&key2=val2&...
    let paramStr = paramObjKeys[0] + '=' + paramObj[paramObjKeys[0]];
    for (var i = 1; i < len; i++) {
        paramStr += '&' + paramObjKeys[i] + '=' + percentEncode(decodeURIComponent(paramObj[paramObjKeys[i]]));
    }
    return paramStr;
};
function percentEncode(str) {
    return encodeURIComponent(str).replace(/[!*()']/g, function (character) {
      return '%' + character.charCodeAt(0).toString(16);
    });
};

window.onloadFuncs = [get_alexa,get_whois,get_details,first_archive_details,recent_archive_details,get_thumbnail,get_tweets,get_annotaions_url,get_tags];
window.onload = function(){
 for(var i in this.onloadFuncs){
  this.onloadFuncs[i]();
 }
}

var mynewTags=new Array();
function get_tags(){
    var url=getUrlByParameter('url');
    var hostname=new URL(url).hostname;
    toBeUsedAsURL=hostname.replace(/^www./, "");
    console.log(url);
    var y=hostname.split('.');
    var not_display4=y.join(' ');
    var not_display1=y.join(' ');
    if(url.includes("https")){
        not_display1="https "+not_display1;
    }else{
        not_display1="http "+not_display1;
    }
    var not_display2=not_display1+" extension";
    var not_display3=not_display4+" extension"
    var dontarray=["view page","open","read more",not_display1,not_display2,not_display3,not_display4]
    var xhr=new XMLHttpRequest();
    var new_url="http://web.archive.org/__wb/search/tagcloud?n="+toBeUsedAsURL+"&counters=1";
    console.log(new_url);
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        console.log(JSON.parse(xhr.response));
        var data=JSON.parse(xhr.response);
        for(var i=0;i<data.length;i++){
            var b=new Object();
            if(dontarray.indexOf(decodeURIComponent(data[i][0]))<=0){
                console.log
                mynewTags[i]=decodeURIComponent(data[i][0]);
                b.text=decodeURIComponent(data[i][0]);
                b.weight=(data[i][1]);
                mynewTags.push(b);
            }
        }
        if(data.length<500){
            var coefOfDistance = 1/ 40;
        }else{
            var coefOfDistance = 3 / 4;
        }
        var arr=mynewTags.reduce(function (acc, newTag) {
            var minDistance = void 0;
            if (acc.length > 0) {
                minDistance = Math.min.apply(Math, _toConsumableArray(acc.map(function (oldTag) {
                return Levenshtein.get(oldTag, newTag);
            })));
            } else {
            minDistance = newTag.length;
            }
            if (minDistance > coefOfDistance * newTag.length) {
                acc.push(newTag);
            }
            return acc;
        }, []).sort();
        var result=new Array();
        for(var i=0;i<arr.length;i++){
            findWeightOf(arr[i],result,data);
        }
        console.log(result);
        for(var i=0;i<result.length;i++){
            var span=document.createElement("span");
            span.setAttribute("data-weight",result[i].weight);
            span.appendChild(document.createTextNode(result[i].text));
            document.getElementById("hey").appendChild(span);
        }
        // $("#hey").jQCloud(result,{
        //     classPattern: null,
        //     width: 600,
        //     height: 600,
        //     colors: ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976", "#ffeda0", "#ffffcc"],
        //     removeOverflowing:true,autoResize: true,
        //     fontSize: {
        //         from: 0.1,
        //         to: 0.02
        //       }
        //   });
        $("#hey").awesomeCloud({
            "size" : {
                "grid" : 1,
                "factor" : 4
            },
            "color" : {
                "background" : "#036"
            },
            "options" : {
                "color" : "random-light",
                "rotationRatio" : 0.5,
                "printMultiplier" : 3
            },
            "font" : "'Times New Roman', Times, serif",
            "shape" : "square"
        });
        
    }
    xhr.send(null);
}
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function findWeightOf(x,result,data){
    for(var i=0;i<data.length;i++){
        if(x==data[i][0]){
            var obj = {};
            obj["text"] = data[i][0];
            if(data[i][1]==1){
                obj["weight"] = data[i][1]*10;
            }else if(data[i][1]==2){
                obj["weight"] = data[i][1]*50;
            }else if(data[i][1]==3){
                obj["weight"] = data[i][1]*70;
            }else{
                obj["weight"] = data[i][1]*100;
            }
            result.push(obj);
        }
    }
}