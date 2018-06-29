function getUrlByParameter(name){
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}

function get_details(){
    var url=getUrlByParameter('url');
    url=url.replace(/^www./, "");
    var xhr=new XMLHttpRequest();
    var new_url="http://vbanos-dev.us.archive.org:8092/__wb/search/tagcloud?n="+url+"&counters=1";
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        console.log(JSON.parse(xhr.response));
        data=JSON.parse(xhr.response);
        console.log(data.length);
        var mynewTags=new Array();
        for(var i=0;i<data.length;i++){
            var b=new Object();
            b.text=data[i][0];
            b.weight=(data[i][1]*4);
            mynewTags.push(b);
        }
        console.log(mynewTags);
        $("#hey").jQCloud(mynewTags);
    }
    xhr.send(null);
}

window.onloadFuncs = [get_details];
window.onload = function(){
 for(var i in this.onloadFuncs){
  this.onloadFuncs[i]();
 }
}
