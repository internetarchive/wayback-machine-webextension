function getSelected() {
  if(window.getSelection) { 
      var text= window.getSelection().toString();
      if(text!=""){
          text=text.toLowerCase().split(' ').join('+');
          chrome.runtime.sendMessage({text:text});
      }
  }
  
}

function check_OL(text){
    var xhr = new XMLHttpRequest();
    xhr.open("GET","https://openlibrary.org/search.json?q="+text, true);
    xhr.onload = function() {
        var response = JSON.parse(xhr.responseText);
        if(response.num_found==0){
            return null;
        }
        return response;
    };
    xhr.send(null);
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

var books=document.getElementsByTagName('i');

for(var i=0;i<books.length;i++){
    var book=books[i];
    var elem=books[i];
    while(book.childNodes[0].nodeType!=3){
        book=book.childNodes[0];
    }
    
    //var data=check_OL(book.innerHTML);
    var text=book.innerHTML;
//    var xhr = new XMLHttpRequest();
//    xhr.open("GET","https://openlibrary.org/search.json?q="+text, true);
//    xhr.onload = function() {
//        var response = JSON.parse(xhr.responseText);
//        if(response.num_found!=0){
//            var link="https://openlibrary.org/search.json?q="+text;
//            var linkElem=document.createElement('a');
//            linkElem.innerHTML="Chutiya";
//            linkElem.setAttribute('href',link);
//            linkElem.style.color="red";
//            console.log(linkElem);
//            var elem=books[i];
//
//            elem.replaceChild(linkElem,elem.childNodes[0]);
//        }
//        
//    };
//    xhr.send(null);
    var linkElem=document.createElement('a');
    var link="https://openlibrary.org/search?q="+text;
    linkElem.setAttribute('href',link);
    linkElem.setAttribute('target','_blank');
    linkElem.style.color="red";
    linkElem.innerHTML=book.innerHTML;
    elem.replaceChild(linkElem,elem.childNodes[0]);
    

    
}
