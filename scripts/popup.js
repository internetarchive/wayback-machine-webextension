function save_now_function(){
	var wb_url = "https://web.archive.org/save/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'save' }, function(response) {
	});
}

function recent_capture_function(){
	var wb_url = "https://web.archive.org/web/2/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'recent' }, function(response) {
	});
}

function first_capture_function(){
	var wb_url = "https://web.archive.org/web/0/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'first' }, function(response) {
	});
}

function view_all_function(){
	var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
	url = document.location.href.replace(pattern, "");
	open_url = "https://web.archive.org/web/*/"+encodeURI(url);
	document.location.href = open_url;
}

function pasteSelection() {
    //Select current tab to send message
    chrome.tabs.query({active: true,currentWindow: true}, function (tabs) {
        //It returns array so looping over tabs result
    

            //Send Message to a tab
            chrome.tabs.sendMessage(tabs[0].id,{method: "getSelection"});
        
    });
}
//Adding a handler when message is recieved from content scripts
chrome.runtime.onMessage.addListener(function (response, sender) {
      var xhr = new XMLHttpRequest();
  
  xhr.open("GET","http://openlibrary.org/search.json?q="+response.text, true);
  
  xhr.onload = function() {
      var dispArea=document.getElementById('disp');
      dispArea.innerHTML="Searching...";
    var response = JSON.parse(xhr.responseText);
    if(response.num_found!=0){
        var titleArr=[];
        var authorArr=[];
        var idArr=[];
        var keyArr=[];
        var resultArr=response.docs;
        var len=10;
        if(resultArr.length<10){
            len=resultArr.length;
        }
        
        for(var i=0;i<len;i++){
            titleArr[i]=resultArr[i].title_suggest;
            if(resultArr[i].author_name==undefined){
                authorArr[i]="Unknown author";
            }else{
                authorArr[i]=resultArr[i].author_name;
            }
            
            idArr[i]=resultArr[i].ia;
            keyArr[i]=resultArr[i].key.slice(7);
        }
        var list=document.createElement('ul');
        for(var i=0;i<len;i++){
            var listElem=document.createElement('li');
            var url="https://openlibrary.org/works/"+keyArr[i]+"/"+titleArr[i];
            listElem.innerHTML="<a href='#' id="+url+">"+ titleArr[i]+" by "+authorArr[i]+"</a>";
            listElem.addEventListener('click',function(event){
                    var id=event.target.id;
                    chrome.tabs.create({url:id});
                })
            list.appendChild(listElem);
            
        }
        console.log(list);
        dispArea.innerHTML="";
        dispArea.appendChild(list);
    }else{
        dispArea.innerHTML="Not found !";
    }
  };
  xhr.send(null);
    
    
});

function getBooks(){
    chrome.runtime.sendMessage({message: "injectol" }, function(response) {
	});
}

document.getElementById('save_now').onclick = save_now_function;
document.getElementById('recent_capture').onclick = recent_capture_function;
document.getElementById('first_capture').onclick = first_capture_function;
document.getElementById('get_book').onclick = getBooks;
window.onload=pasteSelection;