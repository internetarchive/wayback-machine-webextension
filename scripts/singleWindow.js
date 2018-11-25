function getTotal(captures) {
    var total = 0
    for (var key in captures) {
        total += captures[key]['text/html']
    }
    return total
}
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
function get_details() {
    var url = getUrlByParameter('url')
    var new_url = 'https://archive.org/services/context/metadata?url=' + url
    $.getJSON(new_url, function (response) {
        var type = response.type
        $('#details').text(type)
        var captures = response.captures
        var total = 0
        total = getTotal(captures)
        $('#total_archives').text(total)
        $('#save_now').attr('href', 'https://web.archive.org/save/' + url)
    })
}
function first_archive_details() {
    var url = getUrlByParameter('url')
    var new_url = 'http://web.archive.org/cdx/search?url=' + url + '&limit=1&output=json'
    $.getJSON(new_url, function (data) {
        if (data.length == 0) {
            $('#first_archive_date, #first_archive_date_2, #first_archive_time').text('( Data is not available -Not archived before )')
        } else {
            var timestamp = data[1][1]
            var date = timestamp.substring(4, 6) + '/' + timestamp.substring(6, 8) + '/' + timestamp.substring(0, 4)
            var time = timestamp.substring(8, 10) + '.' + timestamp.substring(10, 12) + '.' + timestamp.substring(12, 14)
            $('#first_archive_date').text('( ' + date + ' )')
            $('#first_archive_date_2').text('( ' + date + ' )')
            $('#first_archive_time').text('( ' + time + ' ) according to Universal Time Coordinated (UTC)')
        }
        $('#link_first').attr('href', 'https://web.archive.org/web/0/' + url)
    })
}
function recent_archive_details() {
    var url = getUrlByParameter('url')
    var new_url = 'http://web.archive.org/cdx/search?url=' + url + '&limit=-1&output=json'
    $.getJSON(new_url, function (data) {
        if (data.length == 0) {
            $('#recent_archive_date, #recent_archive_date_2, #recent_archive_time').text('( Data is not available -Not archived before )')
        } else {
            var timestamp = data[1][1]
            var date = timestamp.substring(4, 6) + '/' + timestamp.substring(6, 8) + '/' + timestamp.substring(0, 4)
            var time = timestamp.substring(8, 10) + '.' + timestamp.substring(10, 12) + '.' + timestamp.substring(12, 14)
            $('#recent_archive_date').text('( ' + date + ' )')
            $('#recent_archive_time').text('( ' + time + ' ) according to Universal Time Coordinated (UTC)')
        }
        $('#link_recent').attr('href', 'https://web.archive.org/web/2/' + url)
    })
}

function get_thumbnail() {
    var url = getUrlByParameter('url')
    url = url.replace(/^https?:\/\//, '')
    var index = url.indexOf('/')
    url = url.substring(0, index)
    var new_url = 'https://web.archive.org/thumb/' + url
    $.ajax({
        url: new_url,
        success: function (response) {
            if (response.size != 233) {
                $('#show_thumbnail').append($('<img>').attr('src', new_url))
            } else {
                $('#show_thumbnail').text('Thumbnail not found')
            }
        },
        error: function (jqXHR, exception) {
            if (exception === 'timeout') {
                $('#show_thumbnail').text('Please refresh the page...Time out!!')
            } else {
                $('#show_thumbnail').text('Thumbnail not found')
            }
        }
    })
}

function get_tweets() {
    var url = getUrlByParameter('url');
    url = url.replace(/^https?:\/\//, '');
    url = url.replace(/^www./, "");
    var index_new = url.indexOf('/');
    url = url.slice(0, index_new - 1);
    var new_url = "https://api.twitter.com/1.1/search/tweets.json?q=" + url + "&result_type=popular";
    var res = new Object();
    res.q = url;
    res.result_type = "popular"
    var author = getAuthorization('GET', 'https://api.twitter.com/1.1/search/tweets.json', res);
    console.log(author);
    $.ajax({
        url: new_url,
        type: 'GET',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': author
        },
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            var length = (data.statuses.length);
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    dataRow = data.statuses[i];
                    var row = $('<div>').attr('class', 'row-twitter');
                    var image = $('<img>');
                    var name = $('<span>');
                    var linkDiv = $('<div>');
                    var link = $('<a>');
                    var tweet = $('<span>');
                    tweet.text(dataRow.text);
                    name.text(dataRow.user.name);
                    image.attr('src', dataRow.user.profile_image_url);
                    link.attr('href', dataRow.entities.urls[0].expanded_url);
                    row.attr('id', 'row-tweets' + i);
                    link.append(tweet);
                    linkDiv.append(link);
                    row.append(image);
                    row.append(name);
                    row.append(linkDiv);
                    $("#box-twitter").append(row);
                }
            } else {
                $("#box-twitter").html("There are no Tweets for the current URL");
            }
        },
        error: function (error) {

        }
    });
}

function get_annotaions_url() {
    var url1 = getUrlByParameter('url');
    url1 = decodeURI(url1);
    var test_url = "";
    if (url1.includes('iskme.org')) {
        test_url = url1.replace(/^www\./, '');
    }
    if (test_url) {
        url1 = test_url;
    }
    length = url1.length;
    url1 = (url1.slice(0, length - 1));
    console.log(url1);
    var new_url = "https://hypothes.is/api/search?uri=" + url1;
    $.getJSON(new_url, function (data) {
        var length = data.rows.length;
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                var rowData = data.rows[i];
                var date = rowData.created.substring(0, 10);
                var source = rowData.target[0].source;
                var exactData = rowData.text;
                var user = rowData.user.substring(5, rowData.user.indexOf('@'));
                var row = $('#row-contain')[0];
                var item = row.cloneNode(true);
                var topDivDate = $(item).find("#date-").text("Dated on :" + date);
                var topDivUserInfo = $(item).find("#userinfo").text(user);
                var targetSelectorExact = $(item).find("#source-contain").text("(" + source + ")");
                var text = $(item).find("#text-contain").text(exactData);
                var title = $(item).find("#title-contain").text(rowData.document.title[0]);
                var createA = $('<a>');
                createA.attr('href', rowData.links.incontext);
                createA.text("Click to see the in-context");
                createA.attr('id', 'link-incontext');
                var linkElement = $(item).find("#links");
                var date = linkElement.append(createA);
                var createB = $('<a>');
                createB.attr('href', rowData.links.html);
                createB.text("Click to see the HTML");
                createB.attr('id', 'link-html')
                var linked1 = linkElement.append(createA);
                var linked2 = linkElement.append(createB);
                if (rowData.target[0].hasOwnProperty('selector')) {
                    var lengthOfSelctor = rowData.target[0].selector.length;
                    var selector = rowData.target[0].selector[lengthOfSelctor - 1].exact;
                    var selectorDiv = $(item).find("#target-selector-exact-contain").text(selector);
                }
                else {
                    $(item).find("#target-selector-exact-contain").css("display", "none");
                }
                item.id = "row-" + i;
                $("#box-annotation").append(item);
            }
            $("#row-contain").css("display", "none");
        } else {
            $("#box-annotation").html("There are no Annotations for the current URL");
            $("#row-contain").css("display", "none");
        }
    });
}


function getAuthorization(httpMethod, baseUrl, reqParams) {
    // Get acces keys
    const consumerKey = "JYIqN1CLQOTO9OjbpEaNsjhhH",
        consumerSecret = "dBsYOqFDEllj24qyfdBMo7jvIgWQ4SoH1Q3KdtWOKaz63UCfpH",
        accessToken = "3229028316-85M78pR27WbKUHRym9Z2LZKfSErXRUeaehU1Cd8",
        accessTokenSecret = "6PY70PgLzUu6aE7DE1eouGDKw8EwmDfiDBmgIowpxUTrf";
    // timestamp as unix epoch
    let timestamp = Math.round(Date.now() / 1000);
    // nonce as base64 encoded unique random string
    let nonce = btoa(consumerKey + ':' + timestamp);
    // generate signature from base string & signing key
    let baseString = oAuthBaseString(httpMethod, baseUrl, reqParams, consumerKey, accessToken, timestamp, nonce);
    let signingKey = oAuthSigningKey(consumerSecret, accessTokenSecret);
    let signature = oAuthSignature(baseString, signingKey);
    // return interpolated string
    return 'OAuth ' +
        'oauth_consumer_key="' + consumerKey + '", ' +
        'oauth_nonce="' + nonce + '", ' +
        'oauth_signature="' + signature + '", ' +
        'oauth_signature_method="HMAC-SHA1", ' +
        'oauth_timestamp="' + timestamp + '", ' +
        'oauth_token="' + accessToken + '", ' +
        'oauth_version="1.0"';
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
function genSortedParamStr(params, key, token, timestamp, nonce) {
    // Merge oauth params & request params to single object
    let paramObj = mergeObjs(
        {
            oauth_consumer_key: key,
            oauth_nonce: nonce,
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: timestamp,
            oauth_token: token,
            oauth_version: '1.0'
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
function createList(mainContainer, listEl) {
    var mainRow = $('<div>');
    mainRow.attr('class', 'row row_main');
    mainContainer.append(mainRow);
    var half = $('<div>');
    half.attr('class', 'col-xs-6 half');
    mainRow.append(half);
    var subRow = $('<div>');
    subRow.attr('class', 'row box');
    half.append(subRow);
    var title = $('<div>');
    var link = $('<div>');
    title.attr('class', 'col-xs-9');
    link.attr('class', 'col-xs-3');
    subRow.append(title);
    subRow.append(link);
    title.html(listEl.title);
    if (listEl.url == null) {
        link.html("Not available");
        link.css("color", "red");
    } else {
        var btn = $('<button>');
        btn.attr('type', 'button');
        btn.attr('class', "btn btn-lg btn-success");
        link.append(btn);
        btn.html("Read");
        btn.click(function (event) {
            window.open(listEl.url);
        });
    }
}
function get_doi() {
    var url = getUrlByParameter('url');
    $.getJSON('https://archive.org/services/context/papers?url=' + url, function (responseArray) {
        var result = [];
        for (var i = 0; i < responseArray.length; i++) {
            if (responseArray[i].url == undefined && responseArray[i].title) {
                result.push({ url: null, title: responseArray[i].title });
            } else if (responseArray[i].url && responseArray[i].title) {
                result.push({ url: responseArray[i].url, title: responseArray[i].title });
            }
        }
        var mainContainer = $('#doi');
        mainContainer.html("");
        console.log(result);
        for (var i = 0; i < result.length; i++) {
            $('#doi-heading').css("display", "block");
            createList(mainContainer, result[i]);
        }
    });
}
window.onloadFuncs = [get_alexa, get_whois, get_details, first_archive_details, recent_archive_details, get_thumbnail, get_tweets, get_annotaions_url, get_tags, get_doi];
window.onload = function () {
    for (var i in this.onloadFuncs) {
        this.onloadFuncs[i]();
    }
}
var mynewTags = new Array();
function get_tags() {
    var url = getUrlByParameter('url');
    var hostname = new URL(url).hostname;
    toBeUsedAsURL = hostname.replace(/^www./, "");
    var y = hostname.split('.');
    var not_display4 = y.join(' ');
    var not_display1 = y.join(' ');
    if (url.includes("https")) {
        not_display1 = "https " + not_display1;
    } else {
        not_display1 = "http " + not_display1;
    }
    var not_display2 = not_display1 + " extension";
    var not_display3 = not_display4 + " extension"
    var dontarray = ["view page", "open", "read more", not_display1, not_display2, not_display3, not_display4]
    var new_url = "https://archive.org/services/context/tagcloud?url=" + toBeUsedAsURL;
    $.getJSON(new_url, function (data) {
        for (var i = 0; i < data.length; i++) {
            var b = new Object();
            if (dontarray.indexOf(decodeURIComponent(data[i][0])) <= 0) {
                mynewTags[i] = decodeURIComponent(data[i][0]);
                b.text = decodeURIComponent(data[i][0]);
                b.weight = (data[i][1]);
                mynewTags.push(b);
            }
        }
        if (data.length < 500) {
            var coefOfDistance = 1 / 40;
        } else {
            var coefOfDistance = 3 / 4;
        }
        var arr = mynewTags.reduce(function (acc, newTag) {
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
        var result = new Array();
        for (var i = 0; i < arr.length; i++) {
            findWeightOf(arr[i], result, data);
        }
        for (var i = 0; i < result.length; i++) {
            var span = $("<span>");
            span.attr("data-weight", result[i].weight);
            span.text(result[i].text);
            $("#hey").append(span);
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
            "size": {
                "grid": 1,
                "factor": 4
            },
            "color": {
                "background": "#036"
            },
            "options": {
                "color": "random-light",
                "rotationRatio": 0.5,
                "printMultiplier": 3
            },
            "font": "'Times New Roman', Times, serif",
            "shape": "square"
        });

    });
}
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function findWeightOf(x, result, data) {
    for (var i = 0; i < data.length; i++) {
        if (x == data[i][0]) {
            var obj = {};
            obj["text"] = data[i][0];
            if (data[i][1] == 1) {
                obj["weight"] = data[i][1] * 10;
            } else if (data[i][1] == 2) {
                obj["weight"] = data[i][1] * 50;
            } else if (data[i][1] == 3) {
                obj["weight"] = data[i][1] * 70;
            } else {
                obj["weight"] = data[i][1] * 100;
            }
            result.push(obj);
        }
    }
}
