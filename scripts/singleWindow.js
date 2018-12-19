function get_alexa() {
    var alexa_url = 'http://xml.alexa.com/data?cli=10&dat=n&url=';
    var url = getUrlByParameter('url');
    url = url.replace(/^https?:\/\//, '');
    $.get(alexa_url + url, function (xml) {
        var name = xml.getElementsByTagName("ALEXA")[0].getAttribute('URL');
        $("#alexa_name").text(name);
        if (xml.getElementsByTagName("POPULARITY")) {
            var rank = xml.getElementsByTagName("POPULARITY")[0].getAttribute('TEXT');
            $("#alexa_rank").text(rank);
        }
        if (xml.getElementsByTagName("COUNTRY")[0]) {
            var country = xml.getElementsByTagName('COUNTRY')[0].getAttribute('NAME');
            $("#alexa_country").text(country);
        }
        var rl = xml.getElementsByTagName('RL');
        if (rl.length > 0) {
            for (var i = 0, len = rl.length; i < len && i < 5; i++) {
                var title = rl[i].getAttribute('TITLE');
                var href = rl[i].getAttribute('HREF');
                var list_item = $("<li>");
                var link = $("<a>").attr('href', "http://" + href).attr('target', '_blank').attr('class', 'rl-a').text(title.length > 18 ? title.substring(0, 15) + '...' : title);
                list_item.append(link);
                $("#alexa_list").append(list_item);
            }

        }
    });
}
function get_whois(url) {
    var url = getUrlByParameter('url');
    var host_url = url.replace(/^https{0,1}:\/\//, '').replace(/^www\./, '').replace(/\/.*/, '');
    var whois_url = "https://www.whoisxmlapi.com/whoisserver/WhoisService?domainName=" + host_url + "&username=anishkumarsarangi&password=archiveit";
    $.get(whois_url, function (xml) {
        $("#whois_name").text(host_url);
        if (xml.getElementsByTagName("domainName")) {
            $("#whois_domain").text(xml.getElementsByTagName("domainName")[0].innerHTML);
        }
        if (xml.getElementsByTagName("registrarName")[0]) {
            $("#whois_registrar").append(xml.getElementsByTagName('registrarName')[0].innerHTML);
        }
        if (xml.getElementsByTagName("rawText")[0]) {
            $("#whois_raw_text").append(xml.getElementsByTagName('rawText')[0].innerHTML);
        }
        if (xml.getElementsByTagName("createdDateNormalized")[0]) {
            $("#whois_registration_date").append(xml.getElementsByTagName('createdDateNormalized')[0].innerHTML);
        }
        if (xml.getElementsByTagName("updatedDateNormalized")[0]) {
            $("#whois_updated_date").append(xml.getElementsByTagName('updatedDateNormalized')[0].innerHTML);
        }
    });
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

function show_annotations(){
    $('#row_contain-url').show();
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
function createList(mainContainer,listEl){
    var mainRow=document.createElement('div');
    mainRow.className='row row_main';
    mainContainer.appendChild(mainRow);
    var half = document.createElement('div');
    half.className='col-xs-6 half';
    mainRow.appendChild(half);
    var subRow=document.createElement('div');
    subRow.className = 'row box';
    half.appendChild(subRow);
    var title = document.createElement('div');
    var link = document.createElement('div');
    title.className = 'col-xs-9';
    link.className = 'col-xs-3';
    subRow.appendChild(title);
    subRow.appendChild(link);
    title.innerHTML = listEl.title;
    if(listEl.url == null){
        link.innerHTML = "Not available";
        link.style.color = "red";
    }else{
        var btn = document.createElement('button');
        btn.setAttribute('type','button');
        btn.className = "btn btn-lg btn-success";
        link.appendChild(btn);
        btn.innerHTML = "Read";
        btn.addEventListener('click',function(event){
            window.open(listEl.url);
        });
    }
}
window.onloadFuncs = [get_alexa,get_whois,get_details,first_archive_details,recent_archive_details,get_thumbnail,get_tweets,get_annotations,show_annotations,get_tags,createPage];
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
    var new_url="https://archive.org/services/context/tagcloud?url="+toBeUsedAsURL;
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        var data=JSON.parse(xhr.response);
        for(var i=0;i<data.length;i++){
            var b=new Object();
            if(dontarray.indexOf(decodeURIComponent(data[i][0]))<=0){
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
