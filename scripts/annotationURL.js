//Used to extact the current URL
function getUrlByParameter(name){
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}

function get_annotations(){
    var url=getUrlByParameter('url');
    var xhr= new XMLHttpRequest();
    var test_url="";
    console.log(url);
    if(url.includes('iskme.org')){
        test_url=url.replace(/^https?:\/\//,'');
        test_url=url.replace(/^www\./,'');
    }
    if(test_url){
        url=test_url;
    }
    var new_url="https://hypothes.is/api/search?uri="+url;
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        var data=JSON.parse(xhr.response);
        console.log(data);
        var length=data.rows.length;
        if(length>0){
            for(var i=0;i<length;i++){
                var rowData=data.rows[i];
                var date=rowData.created.substring(0,10);
                var source=rowData.target[0].source;
                var exactData=rowData.text;
                var user=rowData.user.substring(5,rowData.user.indexOf('@'));
                var row=document.getElementById('row-contain');
                var item=row.cloneNode(true);
                var topDivDate=item.querySelectorAll('[id="date"]')[0].appendChild(document.createTextNode("Dated on :"+date));
                var topDivUserInfo=item.querySelectorAll('[id="userinfo"]')[0].appendChild(document.createTextNode(user));
                var targetSelectorExact=item.querySelectorAll('[id="source-contain"]')[0].appendChild(document.createTextNode("("+source+")"));
                var text=item.querySelectorAll('[id="text-contain"]')[0].appendChild(document.createTextNode(exactData));
                var title=item.querySelectorAll('[id="title-contain"]')[0].appendChild(document.createTextNode(rowData.document.title[0]));
                var createA = document.createElement('a');
                var createAText = document.createTextNode("Click to see the in-context");
                createA.setAttribute('href', rowData.links.incontext);
                createA.setAttribute('id',"link-incontext");
                createA.appendChild(createAText);
                var date=item.querySelectorAll('[id="links"]')[0].appendChild(createA);
                var createB = document.createElement('a');
                var createBText = document.createTextNode("Click to see the HTML");
                createB.setAttribute('href', rowData.links.html);
                createB.setAttribute('id',"link-html");
                createB.appendChild(createBText);
                var linked1=item.querySelectorAll('[id="links"]')[0].appendChild(createA);
                var linked2=item.querySelectorAll('[id="links"]')[0].appendChild(createB);
                if(rowData.target[0].hasOwnProperty('selector')){
                    var lengthOfSelctor=rowData.target[0].selector.length;
                    var selector=rowData.target[0].selector[lengthOfSelctor-1].exact;
                    var selectorDiv=item.querySelectorAll('[id="target-selector-exact-contain"]')[0].appendChild(document.createTextNode(selector));
                }
                else{
                    item.querySelectorAll('[id="target-selector-exact-contain"]')[0].style.display="none";
                }
                item.id = "row-"+i;
                document.getElementById("container-whole").appendChild(item);
            }
            document.getElementById("row-contain").style.display="none";
        }else{
            document.getElementById("row-contain").innerHTML="There are no Annotations for the current URL";
        }
    }
    xhr.send(null);
}

window.onloadFuncs = [get_annotations];
window.onload = function(){
 for(var i in this.onloadFuncs){
  this.onloadFuncs[i]();
 }
}