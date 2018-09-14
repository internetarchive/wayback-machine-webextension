function getUrlByParameter(name){
    console.log(window.location.href)
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}
function createList(mainContainer,listEl){
    var mainRow=document.createElement('div');
    mainRow.className='row row_main';
    mainContainer.appendChild(mainRow);
    var half = document.createElement('div');
    half.className='col-xs-6 half';
    mainRow.appendChild(half);
    var subRow=document.createElement('div');
    subRow.className = 'row box';
    half.appendChild(subRow);
    var title = document.createElement('div');
    var link = document.createElement('div');
    title.className = 'col-xs-9';
    link.className = 'col-xs-3';
    subRow.appendChild(title);
    subRow.appendChild(link);
    title.innerHTML = listEl.title;
    if(listEl.url == null){
        link.innerHTML = "Not available";
        link.style.color = "red";
    }else{
        var btn = document.createElement('button');
        btn.setAttribute('type','button');
        btn.className = "btn btn-lg btn-success";
        link.appendChild(btn);
        btn.innerHTML = "Read";
        btn.addEventListener('click',function(event){
            window.open(listEl.url);
        });
    }
}
function createPage(){
    var url=getUrlByParameter('url');
    console.log(url);
    var xhr=new XMLHttpRequest();
    xhr.open('GET','https://archive.org/services/context/papers?url='+url,true);
    xhr.onload=function(){
        var responseArray = JSON.parse(xhr.responseText);
        console.log(responseArray);
        var result = [];
        for(var i=0;i<responseArray.length;i++){
            if(responseArray[i].count_files==0 && responseArray[i].paper && responseArray[i].paper.title){
                result.push({url:null,title:responseArray[i].paper.title});
            }else if(responseArray[i].count_files>0 && responseArray[i].files.length>0 && responseArray[i].files[0].links.length>0 && responseArray[i].files[0].links[0].url && responseArray[i].paper && responseArray[i].paper.title){
                result.push({url:responseArray[i].files[0].links[0].url,title:responseArray[i].paper.title});
            }
        }
        var mainContainer = document.getElementById('container-whole');
        mainContainer.innerHTML = "";
        console.log(result);
        for(var i=0;i<result.length;i++){
            createList(mainContainer,result[i]);
        }
        if(result.length==0){
            document.getElementById('doi-heading').innerHTML="No papers found";
        }
    };
    xhr.send();
}
window.onload = createPage;