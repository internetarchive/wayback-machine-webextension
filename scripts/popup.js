global_url="";

function remove_port(url){
    if(url.substr(-4)==':80/'){
        url=url.substring(0,url.length-4);
    }
    return url;
}

function remove_wbm(url){
    var pos=url.indexOf('/http');
    if(pos!=-1){
        var new_url=url.substring(pos+1);
    }else{
        var pos=url.indexOf('/www');
        var new_url=url.substring(pos+1);
    }
    return remove_port(new_url);
}

function remove_alexa(url){
    var pos=url.indexOf('/siteinfo/');
    var new_url=url.substring(pos+10);
    return remove_port(new_url);
}

function remove_whois(url){
    var pos=url.indexOf('/whois/');
    var new_url=url.substring(pos+7);
    return remove_port(new_url);
}
/* Common method used everywhere to retrieve cleaned up URL */
function get_clean_url() {
    var search_term = document.getElementById('search_input').value;
    if(search_term == ""){
        var url=global_url;
    }else{
        var url=search_term;
    }
    if (url.includes('web.archive.org')) {
        url=remove_wbm(url);
    } else if (url.includes('www.alexa.com')) {
        url=remove_alexa(url);
    } else if (url.includes('www.whois.com')) {
        url=remove_whois(url);
    }
    return url;
}

function save_now(){
	  chrome.runtime.sendMessage({message: "openurl",
                                wayback_url: "https://web.archive.org/save/",
                                page_url: get_clean_url(),
                                method:'save' }).then(handleResponse, handleError);
}

function recent_capture(){
	  chrome.runtime.sendMessage({message: "openurl",
                                wayback_url: "https://web.archive.org/web/2/",
                                page_url: get_clean_url(),
                                method:'recent'});
}

function first_capture(){
	  chrome.runtime.sendMessage({message: "openurl",
                                wayback_url: "https://web.archive.org/web/0/",
                                page_url: get_clean_url(),
                                method:'first'});
}

function view_all(){
	  chrome.runtime.sendMessage({message: "openurl",
                                wayback_url: "https://web.archive.org/web/*/",
                                page_url: get_clean_url(),
                                method:'viewall'});
}

function get_url(){
    chrome.tabs.query({active: true,currentWindow:true},function(tabs){
        global_url=tabs[0].url;
    });
}

function social_share(eventObj){
    var parent=eventObj.target.parentNode;
    var id=parent.getAttribute('id');
    var url = get_clean_url();
    var open_url="";
    if(id.includes('fb')){
        open_url="https://www.facebook.com/sharer/sharer.php?u="+url;
    }else if(id.includes('twit')){
        open_url="https://twitter.com/home?status="+url;
    }else if(id.includes('gplus')){
        open_url="https://plus.google.com/share?url="+url;
    }else if(id.includes('linkedin')){
        open_url="https://www.linkedin.com/shareArticle?url="+url;
    }
    window.open(open_url, 'newwindow', 'width=800, height=280,left=0');
}

function alexa_statistics(eventObj){
    var open_url="http://www.alexa.com/siteinfo/" + get_clean_url();
    window.open(open_url, 'newwindow', 'width=1000, height=1000,left=0');
}
function alexa_data(eventObj){
    $('#progress_gif').show();$('#main_page_under').hide();
    var open_url="https://rohitcoder.cf/research/whois_api/alexa.php";
    $.get(open_url,
    {
        site: get_clean_url()
    },
    function(data, status){
       $('#progress_gif').hide();
	   var alexa_header = "<br><div class='col-md-12 col-xs-12 col-sm-12 btn-primary'><div class='col-sm-1 col-xs-1 col-md-1 btn-primary' id='gomain' style='cursor:pointer;'><b><</b></div><div class='col-sm-9 col-xs-9 col-md-9 btn-primary'><center><b>Metrics</b></center></div></div>";
       $('#main_page').hide();
	   var global_rank = '<font color=blue><b>Global Rank: </b></font><br><img src="https://www.alexa.com/images/icons/globe-sm.jpg"></img>'+data.global_rank+"<br>";
	   var global_graph = '<font color=blue><b>Global Graph: </b></font><br><img src="'+data.global_graph+'" width="100%"></img>';
	   var global_data = global_graph+global_rank;
	   var country_rank = "<font color=blue><b>Rank In "+data.country.name+": </b></font><br><img src="+data.country.flag+"> "+data.country.rank;
	   var search_graph = '<font color=blue><b>Search Graph:</b></font></font><Br><img src="'+data.search_graph+'" width="100%"></img><Br>'+data.search_data;
	   var top_keywords = '<br><font color=blue><b>Best keywords:</b></font></font><Br>'+data.top_search_keywords;
	   var demographics_country_table = "<br><font color=blue><b>Top 5 traffic origin countries: </b></font><br>"+data.demographics_country_table;
	   var engage_data = data.engage_content;
	   var upstream_sites = "<br>Which sites did people visit immediately before this site?<br>"+data.upstream_sites;
	   var count_linkin_sites = "<br>"+data.count_linkin_sites;
	   var linkin_sites = "<br>"+data.linkin_sites;
	   var similar_sites = "<Br>"+data.similar_sites;
	   var sub_domains = "<font color=blue><b>Subdomains</b></font><br>"+data.subdomains;
	   var load_speed = data.load_speed;
	   var copyright_to = "<center>Data by <b>Alexa</b></center>";
	   $('#alexa_html_data').html(alexa_header+global_data+country_rank+demographics_country_table+search_graph+top_keywords+engage_data+upstream_sites+count_linkin_sites+linkin_sites+similar_sites+sub_domains+load_speed+copyright_to);
	   $('#alexa_html_data').show(); 
       document.getElementById('gomain').onclick =gomain;
    });
}
function whois_statistics(eventObj){
    var open_url="https://www.whois.com/whois/" + get_clean_url();
    window.open(open_url, 'newwindow', 'width=1000, height=1000,left=0');
}
function whois_data(eventObj){
    $('#progress_gif').show();$('#main_page_under').hide();
    var open_url="https://rohitcoder.cf/research/whois_api/";
    $.get(open_url,
    {
        site: get_clean_url()
    },
    function(data, status){
       $('#progress_gif').hide();
	   var whois_header = "<br><div class='col-md-12 col-xs-12 col-sm-12 btn-primary'><div class='col-sm-1 col-xs-1 col-md-1 btn-primary' id='gomain' style='cursor:pointer;'><b><</b></div><div class='col-sm-9 col-xs-9 col-md-9 btn-primary'><center><b>Whois</b></center></div></div>";
       $('#main_page').hide();$('#whois_html_data').html(whois_header+data.domain_info+data.registrant_contact+data.admin_contact+data.technical_contact);$('#whois_html_data').show(); 
       document.getElementById('gomain').onclick =gomain;
    });
}
function gomain(){ 
$('#main_page_under').show();
$('#main_page').show();
$('#whois_html_data').hide();
$('#alexa_html_data').hide();
}
function search_tweet(eventObj){
    var url = get_clean_url();
    if(url.includes('http://')){
        url=url.substring(7);
    }else if(url.includes('https://')){
        url=url.substring(8);
    }
    if(url.slice(-1)=='/') url=url.substring(0,url.length-1);
    var open_url="https://twitter.com/search?q="+url;
    window.open(open_url, 'newwindow', 'width=1000, height=1000,left=0');
}

function display_list(key_word){
    $sbox = document.getElementById('suggestion-box');
    $sbox.style.display='none';
    $sbox.innerHTML="";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://web.archive.org/__wb/search/host?q="+key_word, true);
    xhr.onload=function(){
        $sbox.style.display='none';
        $sbox.innerHTML="";
        var data=JSON.parse(xhr.response);
        var n=data.hosts.length;
        if(n>0 && document.getElementById('search_input').value!=''){
            $sbox.style.display='block';
            for(var i=0;i<n;i++){
                var a=document.createElement('a');
                a.onclick=function(event){
                    document.getElementById('search_input').value=event.target.innerHTML;
                    $sbox.style.display='none';
                    $sbox.innerHTML="";
                };
                a.setAttribute('role','button');
                a.innerHTML=data.hosts[i].display_name;
                var li=document.createElement('li');
                li.appendChild(a);
                $sbox.appendChild(li);
            }
        }
    };
    xhr.send(null);
}

function display_suggestions(e){
    document.getElementById('suggestion-box').style.display='none';
    document.getElementById('suggestion-box').innerHTML="";
    //setTimeout is used to get the text in the text field after key has been pressed
    window.setTimeout(function(){
        var len=document.getElementById('search_input').value.length;
        if((len)>=3){
            display_list(document.getElementById('search_input').value);
        }else{
            document.getElementById('suggestion-box').style.display='none';
            document.getElementById('suggestion-box').innerHTML="";
        }
    },0.1);
}

function about_support(){
    window.open("about.html", "", "width=1000, height=1000").focus();
}

function makeModal(){
    var url = get_clean_url();
    console.log("Making RT for "+url);
    chrome.runtime.sendMessage({message: "makemodal",rturl:url});
}

/** Disabled code for the autosave feature **/
//function restoreSettings() {
//  chrome.storage.sync.get({
//    as:false
//  }, function(items) {
//    document.getElementById('as').checked = items.as;  
//      if(items.as){
//          chrome.runtime.sendMessage({message: "start_as"}, function(response) {});
//      }
//     });
//}
//
//function saveSettings(){
//    var as = document.getElementById('as').checked;
//      chrome.storage.sync.set({
//      as: as
//  });
//}
//function showSettings(eventObj){
//    var target=eventObj.target;
//    if(target.getAttribute('toggle')=='off'){
//        document.getElementById('settings_btn').setAttribute('toggle','on');
//    document.getElementById('settings_div').style.display="block";
//    }else{
//        document.getElementById('settings_btn').setAttribute('toggle','off');
//        document.getElementById('settings_div').style.display="none";
//    }
//}
//restoreSettings();
//document.getElementById('settings_div').style.display="none";

window.onload=get_url;

document.getElementById('save_now').onclick = save_now;
document.getElementById('recent_capture').onclick = recent_capture;
document.getElementById('first_capture').onclick = first_capture;
document.getElementById('fb_share').onclick =social_share;
document.getElementById('twit_share').onclick =social_share;
document.getElementById('gplus_share').onclick =social_share;
document.getElementById('linkedin_share').onclick =social_share;
document.getElementById('alexa_data').onclick =alexa_data;
document.getElementById('whois_data').onclick =whois_data;
document.getElementById('search_tweet').onclick =search_tweet;
document.getElementById('gomain').onclick =gomain;
document.getElementById('about_support_button').onclick = about_support;

document.getElementById('overview').onclick = view_all;
//document.getElementById('settings_btn').onclick=showSettings;
//document.getElementById('settings_save_btn').onclick=saveSettings;
document.getElementById('make_modal').onclick=makeModal;
document.getElementById('search_input').addEventListener('keydown',display_suggestions);
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.message=='urlnotfound'){
  	alert("URL not found in wayback archives!");
  }
});
