
function save_now_function(){
	var wb_url = "https://web.archive.org/save/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'save' }, function(response) {
	});
}


function recent_capture_function(){
	var wb_url = "https://web.archive.org/web/2/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'recent' }, function(response) {
			  
			  if(!response.status){
			  	notify("URL not found in wayback archives!");
			  }
		  
});
}

function notify(msg)
{
	chrome.notifications.create(
								'wayback-notification',{   
								type: 'basic', 
								iconUrl: '/images/icon@2x.png', 
								title: "Message", 
								message: msg
								},
								function(){} 
							);
}

function first_capture_function(){
	var wb_url = "https://web.archive.org/web/0/";
	chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'first' }, function(response) {
	if(!response.status){
			notify("URL not found in wayback archives!");
		}	
	});
}
function view_all_function(){
	var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
	url = document.location.href.replace(pattern, "");
	open_url = "https://web.archive.org/web/*/"+encodeURI(url);
	document.location.href = open_url;
}

function search_tweet_function(){
	var twitter_url = "https://twitter.com/search?q=";
	var url_toSearch = document.getElementById('search').value;
	var from_date = document.getElementById('from-date').value;
	var to_date = document.getElementById('to-date').value;

	if(!from_date) {
		from_date = "2006-03-21";	
	}
	
	if (!to_date) {
		var today = new Date();
		to_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	}

	chrome.tabs.create({ url: twitter_url+"\""+url_toSearch+"\"%20since%3A"+from_date+"%20until%3A"+to_date });
}

//Sharing on Social Media 
function shareon_facebook()
{
	var srch_url = document.getElementById('search').value;
	var fbshr_url = "https://www.facebook.com/sharer/sharer.php?u="
	window.open(fbshr_url+ 'https://web.archive.org/web/*/' + srch_url , 'newwindow', 'width=500, height=400');
}

function shareon_twitter()
{
	var srch_url = document.getElementById('search').value;
	var twitshr_url = "https://twitter.com/home?status=";
	window.open(twitshr_url+ 'https://web.archive.org/web/*/' + srch_url , 'newwindow', 'width=500, height=400');
}

function shareon_googleplus()
{
	var srch_url = document.getElementById('search').value;
	var gplusshr_url = "https://plus.google.com/share?url="; 
	window.open(gplusshr_url+ 'https://web.archive.org/web/*/' + srch_url , 'newwindow', 'width=500, height=400');
}

document.getElementById('twit_share').onclick = shareon_twitter;
document.getElementById('fb_share').onclick = shareon_facebook;
document.getElementById('gplus_share').onclick = shareon_googleplus;
document.getElementById('save_now').onclick = save_now_function;
document.getElementById('recent_capture').onclick = recent_capture_function;
document.getElementById('first_capture').onclick = first_capture_function;
document.getElementById('search_tweet').onclick = search_tweet_function;
window.onload =get_alexa_info();

function get_alexa_info(){
 	chrome.runtime.sendMessage({message: "geturl" }, function(response) {
		url_getter(response.url);
	});
	function url_getter(url) {
			var alexa_url = 'http://xml.alexa.com/data?cli=10&dat=n&url=';
			var host_url = url.replace(/^https{0,1}:\/\//, '').replace(/^www\./, '').replace(/\/.*/, '');
			var http = new XMLHttpRequest();
			http.open("GET", alexa_url + host_url, true);
			http.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var html = "<b>"+"<span class='color_code'>"+ host_url +'</span>'+"</b><br/><b>Alexa Rank: </b>";
	 				var xmldata = http.responseXML.documentElement;
					if (xmldata.getElementsByTagName("POPULARITY")) 
					{
	 					html +="<span class='color_code'>"+xmldata.getElementsByTagName("POPULARITY")[0].getAttribute('TEXT')+"</span>";
	 				} 
	 				else {
	 					html += "N/A";
					}
					if(xmldata.getElementsByTagName("COUNTRY"))
					{
						html += '<br/>'+'<b>Country:</b>' +"<span class='color_code'>"+
					            xmldata.getElementsByTagName('COUNTRY')[0].getAttribute('NAME');
					}
					else{
						html+="N/A";
					}
				document.getElementById("show_alexa_data").innerHTML = html;
				document.getElementById("show_nothing").style.display="block";
				}
			};
		http.send(null);
	}
}

document.getElementById('over_btn').addEventListener('click',get_archive);
function get_archive(){
    chrome.runtime.sendMessage({message: "geturl"}, function(response) {
	var url=response.url;
    

    search_url(url);
    });
    
}

function search_url(key_word){
  document.getElementById('disp_search').innerHTML="Searching...";
  document.getElementById('disp_months').setAttribute('class','shown');
  document.getElementById('disp_days').setAttribute('class','shown');
  document.getElementById('disp_time').setAttribute('class','shown');
  document.getElementById('disp_months').innerHTML="";
  document.getElementById('disp_days').innerHTML="";
  document.getElementById('disp_time').innerHTML="";
  //document.getElementById('suggestion-box').innerHTML="";
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "https://web-beta.archive.org/__wb/explore?url="+key_word, true);
  xhr.onload = function(e) {
    
    document.getElementById('disp_search').innerHTML="";
    var data=JSON.parse(xhr.response);
    
    
    var year_arr=new Array();
    var j=0;
    for(var i=0;i<data.captures.length;i++){
      
      var cap=data.captures[i].date;
      
      if(i==0){
        
        year_arr[0]=new Array();
        year_arr[0].push(cap);
        
      }else if(data.captures[i-1].date.substring(0,4)== data.captures[i].date.substring(0,4)){
        year_arr[j].push(cap);
      }else{
        j++;
        
        year_arr[j]=new Array();
        year_arr[j].push(cap);
        
        
      }
      
    }
    
    for(var i=0;i<year_arr.length;i++){
      var elem=document.getElementById('disp_search');
      var el=document.createElement('button');
      elem.appendChild(el);
      
      var index_of_arr;
      if(i<10){index_of_arr="0"+i;}else{index_of_arr=i;}
      
      el.setAttribute('id',index_of_arr+year_arr[i][0].substring(0,4));
      el.setAttribute('class','btn btn-sm btn-default btn-halfwidth');
      el.addEventListener('click',function(event){
        var id=event.target.id;
        
        displaymonths(id);
      });
      var year=year_arr[i][0].substring(0,4);
      var s="s";
            if(year_arr[i].length==1){
                s="";
            }
      
          el.innerHTML=year_arr[i].length+" time"+s+" in "+year;
        
    }
    
    function displaymonths(id){
      document.getElementById('disp_months').innerHTML="";
      document.getElementById('disp_days').innerHTML="";
      document.getElementById('disp_time').innerHTML="";
      
      var month_arr=[];
      var j=0;
      
      var new_id=parseInt(id.substring(0,2));
      
      for(var i=0;i<year_arr[new_id].length;i++){
        var date=year_arr[new_id][i];
        if(i==0){
          
          month_arr[0]=new Array();
          month_arr[0].push(date);
          
        }else if(year_arr[new_id][i-1].substring(4,6)==year_arr[new_id][i].substring(4,6)){
          month_arr[j].push(date);
        }else{
          j++;
          month_arr[j]=new Array();
          month_arr[j].push(date);
          
          
        }
      }
      for(var i=0;i<month_arr.length;i++){
        var elem=document.getElementById('disp_months');
        var el=document.createElement('button');
        elem.appendChild(el);
        var index_of_arr;
        if(i<10){index_of_arr="0"+i;}else{index_of_arr=i;}
        el.setAttribute('id',index_of_arr+""+id+""+month_arr[i][0].substring(4,6));
        el.setAttribute('class','btn btn-sm btn-primary btn-halfwidth');
        el.addEventListener('click',function(event){
          var id=event.target.id;
          displaydays(id);
        });
        var month=month_arr[i][0].substring(4,6);
       var s="s";
            if(month_arr[i].length==1){
                s="";
            }
        
          el.innerHTML=month_arr[i].length+" time"+s+" in "+month;

      }
      
      function displaydays(id){
        
        document.getElementById('disp_days').innerHTML="";
        document.getElementById('disp_time').innerHTML="";
        var day_arr=[];
        var j=0;
        
        var new_id=parseInt(id.substring(0,2));
        for(var i=0;i<month_arr[new_id].length;i++){
          var date=month_arr[new_id][i];
          if(i==0){
            
            day_arr[0]=new Array();
            day_arr[0].push(date);
            
          }else if(month_arr[new_id][i-1].substring(6,8)==month_arr[new_id][i].substring(6,8)){
            day_arr[j].push(date);
          }else{
            j++;
            day_arr[j]=new Array();
            day_arr[j].push(date);
            
            
          }
        }
        for(var i=0;i<day_arr.length;i++){
          var elem=document.getElementById('disp_days');
          var el=document.createElement('button');
          elem.appendChild(el);
          var index_of_arr;
          if(i<10){index_of_arr="0"+i;}else{index_of_arr=i;}
          el.setAttribute('id',index_of_arr+""+id+""+day_arr[i][0].substring(6,8));
          el.setAttribute('class','btn btn-sm btn-info btn-halfwidth');
          el.addEventListener('click',function(event){
            var id=event.target.id;
            displaytime(id);
          });
          var day=day_arr[i][0].substring(6,8);
          var s="s";
            if(day_arr[i].length==1){
                s="";
            }
          
          el.innerHTML=day_arr[i].length+" time"+s+" on "+day;

      
        }
        
        function displaytime(id){
          document.getElementById('disp_time').innerHTML="";
          
          var time_arr=[];
          var j=0;
          
          var new_id=parseInt(id.substring(0,2));
          
          for(var i=0;i<day_arr[new_id].length;i++){
            var date=day_arr[new_id][i];
            time_arr.push(date);
            
          }
          for(var i=0;i<time_arr.length;i++){
            var elem=document.getElementById('disp_time');
            var el=document.createElement('button');
            elem.appendChild(el);
            var index_of_arr;
            if(i<10){index_of_arr="0"+i;}else{index_of_arr=i;}
            el.setAttribute('id',id+""+time_arr[i].substring(8,14));
            el.setAttribute('class','btn btn-sm btn-success btn-halfwidth');
            el.addEventListener('click',function(event){
              var id=event.target.id;
              
              chrome.tabs.query({active: true,currentWindow:true},function(tabs){
                var tab=tabs[0];
                
                var new_url="https://web.archive.org/web/"+id.slice(6)+"/"+key_word;
                chrome.tabs.create({url:new_url});
              });
            });
            var time=time_arr[i].substring(8,14);
            
            el.innerHTML=time.substring(0,2)+":"+time.substring(2,4)+":"+time.substring(4,6);
            
            
          }
          
          
        }
        
      }
      
      
    } 
    
    
    
  };
  
  xhr.send();
  
}