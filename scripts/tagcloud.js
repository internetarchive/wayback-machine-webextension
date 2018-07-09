function getUrlByParameter(name){
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}
var mynewTags=new Array();
function get_details(){
    var url=getUrlByParameter('url');
    url = url.replace(/^https?:\/\//,'');
    url=url.replace(/^www./, "");
    console.log(url);
    if(url.indexOf('/')!=-1){
        var index=url.indexOf('/');
        console.log(index);
        url=url.slice(0,index);
    }
    console.log(url);
    var host=url.slice(0,url.indexOf('.'));
    var xhr=new XMLHttpRequest();
    var new_url="http://vbanos-dev.us.archive.org:8092/__wb/search/tagcloud?n="+url+"&counters=1";
    console.log(new_url)
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        console.log(JSON.parse(xhr.response));
        var data=JSON.parse(xhr.response);
        for(var i=0;i<data.length;i++){
            var b=new Object();
            if(!decodeURIComponent(data[i][0]).includes(host||"view page"||"open"||"read more")){
                mynewTags[i]=decodeURIComponent(data[i][0]);
                b.text=decodeURIComponent(data[i][0]);
                b.weight=(data[i][1]*400);
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
        console.log(arr);
        var result=new Array();
        for(var i=0;i<arr.length;i++){
            findWeightOf(arr[i],result,data);
        }
        console.log(result);
        for(var i=0;i<result.length;i++){
            var span=document.createElement("span");
            span.setAttribute("data-weight",result[i].weight*4);
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
                "factor" : 3
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
            "shape" : "star"
        });
        
    }
    xhr.send(null);
}

window.onloadFuncs = [get_details];
window.onload = function(){
 for(var i in this.onloadFuncs){
  this.onloadFuncs[i]();
 }
}
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function findWeightOf(x,result,data){
    for(var i=0;i<data.length;i++){
        if(x==data[i][0]){
            var obj = {};
            obj["text"] = data[i][0];
            obj["weight"] = data[i][1]*4;
            result.push(obj);
        }
    }
}