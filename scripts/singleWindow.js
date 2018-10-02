function getUrlByParameter(name){
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}

function get_alexa() {
    var alexa_url = 'http://xml.alexa.com/data?cli=10&dat=n&url=';
    var url=getUrlByParameter('url');
    url=url.replace(/^https?:\/\//,'')
    var http = new XMLHttpRequest();
    http.open("GET", alexa_url + url, true);
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var html = "<b>"+"<span class='color_code'>"+ url +'</span>'+"</b><br/><b>Alexa Rank: </b>";
            var xmldata = http.responseXML.documentElement;
            if (xmldata.getElementsByTagName("POPULARITY")) 
            {
                html +="<span class='color_code'>"+xmldata.getElementsByTagName("POPULARITY")[0].getAttribute('TEXT')+"</span>";
            } 
            else {
                html += "N/A";
            }
            if(xmldata.getElementsByTagName("COUNTRY")[0])
            {
                html += '<br/>'+'<b>Country:</b>' +"<span class='color_code'>"+
                        xmldata.getElementsByTagName('COUNTRY')[0].getAttribute('NAME');
            }
            var rl = xmldata.getElementsByTagName('RL');
            if (rl.length > 0) {
                html += '<br><br><span class="glyphicon glyphicon-globe red" aria-hidden="true"></span> ' +
                '<b>Related sites:</b><br/><ul class="rl-list rl-link">';
                for(var i = 0, len = rl.length; i < len && i < 5; i++) {
                    var rl_title = rl[i].getAttribute('TITLE');
                    html += '<li><a href="http://' + rl[i].getAttribute('HREF') + '" target="_blank" class="rl-a">' +
                    (rl_title.length > 18 ? rl_title.substring(0, 15) + '...' : rl_title) +
                    '</a></li>';
                }
                html += '</ul>';
            }
            document.getElementById("show_alexa_data").innerHTML = html;
        }
    };
    http.send(null);
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
function get_doi(){
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
        var mainContainer = document.getElementById('doi');
        mainContainer.innerHTML = "";
        console.log(result);
        for(var i=0;i<result.length;i++){
            document.getElementById('doi-heading').style.display="block";
            createList(mainContainer,result[i]);
        }
    };
    xhr.send();
}
window.onloadFuncs = [get_alexa,get_doi];
window.onload = function(){
 for(var i in this.onloadFuncs){
  this.onloadFuncs[i]();
 }
}