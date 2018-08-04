/*----New way of getParameterByName-----*/
function getParameterByName(name){
    var url=window.location.href;
    var index=url.indexOf(name);
    var length=name.length;
    var indexOfEnd;
    for(var i=index;i<url.length;i++){
        if(url[i]=='?'){
            indexOfEnd=i;
            break;
        }
    }
    return url.slice(index+length+1,indexOfEnd);
}

document.getElementById('no-more-404s-dnserror-link').href = getParameterByName('wayback_url');
document.getElementById('status-code-show').innerHTML=getParameterByName('status_code');
document.getElementById('url-show').innerHTML=getParameterByName('page_url');