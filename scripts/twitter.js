function getUrlByParameter(name){
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}

function get_tweets(){
    var url=getUrlByParameter('url');
    console.log(url);
    var xhr=new XMLHttpRequest();
    var new_url="http://gext-api.archive.org/services/context/twitter?url="+url;
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        data=JSON.parse(xhr.response);
        console.log(data);
        if(data.length>0){
            for(var i=0;i<data.length;i++){
                dataRow=data[i];
                var row=document.getElementById('box-twitter');
                var item=row.cloneNode(true);
                var tweet_text=dataRow.text;
                var name=dataRow.user.name;
                if(dataRow.entities.urls.length>0){
                    var url="https://twitter.com/"+dataRow.user.screen_name+'/status/'+dataRow.id_str;
                }
                var tweet_div=item.querySelectorAll('[id="tweets"]')[0].appendChild(document.createTextNode(tweet_text));
                var profile_name=item.querySelectorAll('[id="profile-name"]')[0].appendChild(document.createTextNode(name));
                var profile_url=item.querySelectorAll('[id="profile-url"]')[0];
                profile_url.setAttribute('href',"www.twitter.com/"+dataRow.user.screen_name);
                var img=item.querySelectorAll('[id="profile-image"]')[0];
                img.setAttribute('src',dataRow.user.profile_image_url);
                item.id = "box-twitter"+i;
                var link=item.querySelectorAll('[id="links"]')[0];
                link.setAttribute('href',url);
                document.getElementById("half").appendChild(item);
            }
            document.getElementById("box-twitter").style.display="none";
        }else{
            document.getElementById("half").innerHTML="There are no Tweets for the current URL";
            document.getElementById("box-twitter").style.display="none";
        }
    }
    xhr.send(null);
}

window.onloadFuncs = [get_tweets];
window.onload = function(){
 for(var i in this.onloadFuncs){
  this.onloadFuncs[i]();
 }
}