function getSelected() {
  if(window.getSelection) { 
      var text= window.getSelection().toString();
      if(text!=""){
          text=text.toLowerCase().split(' ').join('+');
          chrome.runtime.sendMessage({text:text});
      }
  }
  
}

chrome.runtime.onMessage.addListener(function(request,sender){
    if(request.method=="getSelection" && window.getSelection) { 
      var text= window.getSelection().toString();
      if(text!=""){
          text=text.toLowerCase().split(' ').join('+');
          chrome.runtime.sendMessage({text:text});
      }
  }
});
