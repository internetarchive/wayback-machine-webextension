window.onloadFuncs = [url_getter];
window.onload = function(){
 for(var i in this.onloadFuncs){
  this.onloadFuncs[i]();
 }
}