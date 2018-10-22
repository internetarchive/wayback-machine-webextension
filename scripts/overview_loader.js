window.onloadFuncs = [get_details,first_archive_details,recent_archive_details,get_thumbnail];
window.onload = function(){
 for(var i in this.onloadFuncs){
  this.onloadFuncs[i]();
 }
}