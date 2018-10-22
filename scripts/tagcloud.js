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
            if(data[i][1]==1){
                obj["weight"] = data[i][1]*10;
            }else if(data[i][1]==2){
                obj["weight"] = data[i][1]*40;
            }else if(data[i][1]==3){
                obj["weight"] = data[i][1]*60;
            }else{
                obj["weight"] = data[i][1]*90;
            }
            result.push(obj);
        }
    }
}
