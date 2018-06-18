function makeReqforBookNames(xhr,text,range,linkElem,option){
    if(option=='wayback'){
        xhr.onload=function(){
        var response = JSON.parse(xhr.responseText);
        if(response.archived_snapshots.closest!=null){
            linkElem.setAttribute('href',response.archived_snapshots.closest.url);
            range.deleteContents();
            range.insertNode(linkElem);
            range.collapse();
        }else{
            alert('Archive not found');
        }
    };
    xhr.send();
    }else{
        if(text.startsWith('http://') || text.startsWith('https://')){
            linkElem.setAttribute('href',text);
            range.deleteContents();
            range.insertNode(linkElem);
            range.collapse();
        }else{
            range.collapse();
        }

        
    }
    
}



function getSelectedText(eventObj){

    
    if(window.getSelection) { 
      var text= window.getSelection().toString();
      if(text!=""){
          var elem=window.getSelection();
          var text=text.trim();
          //console.log(elem);
    
          var linkElem=document.createElement('a');
          //linkElem.setAttribute('class','bookLink');
          linkElem.style.cursor="alias";
          //var link="www.google.com";
          linkElem.style.color="#09FF0A";
          //linkElem.setAttribute('href',link);
          linkElem.setAttribute('target','_blank');
          linkElem.innerHTML=window.getSelection().toString();
          var range = elem.getRangeAt(0);
          //range.deleteContents();
          //range.insertNode(linkElem);
          var xhr=new XMLHttpRequest();
          xhr.open("GET","https://archive.org/wayback/available?url="+text, true);
//          //console.log(elem.toString());
          chrome.storage.sync.get(['show_links'],function(event){
            makeReqforBookNames(xhr,text,range,linkElem,event.show_links);    
          });
          
          
      }
  }
}
//console.log("Injected");
document.onmouseup=getSelectedText;