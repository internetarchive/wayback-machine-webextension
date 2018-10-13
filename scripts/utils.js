function getUrlByParameter(name){
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}

if(typeof module !=="undefined") {module.exports = {getUrlByParameter:getUrlByParameter};}