function getUrlByParameter(name){
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}

window.onloadFuncs = [get_global_rank,get_total_traffic,get_social_ref,find_similar_websites,average_page_views,average_visit_duration,get_bounce_rate];
window.onload = function(){
 for(var i in this.onloadFuncs){
  this.onloadFuncs[i]();
 }
}

function get_global_rank(){
    var url=getUrlByParameter('url');
    url=url.replace(/^www./, "");
    var xhr=new XMLHttpRequest();
    var new_url="https://api.similarweb.com/v1/website/"+url+"/global-rank/global-rank?api_key=7202ad3e669d4eff804e11e82cf16bbb&start_date=2018-03&end_date=2018-05&main_domain_only=false";
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        console.log(JSON.parse(xhr.response));
        var data=JSON.parse(xhr.response);
        if(data.meta.status=="Success"){
            document.getElementById("date-1").innerHTML=data.global_rank[0].date;
            document.getElementById("rank-1").innerHTML=data.global_rank[0].global_rank;
            document.getElementById("date-2").innerHTML=data.global_rank[1].date;
            document.getElementById("rank-2").innerHTML=data.global_rank[1].global_rank;
            document.getElementById("date-3").innerHTML=data.global_rank[2].date;
            document.getElementById("rank-3").innerHTML=data.global_rank[2].global_rank;
        }

    }
    xhr.send(null);
}

function get_total_traffic(){
    var url=getUrlByParameter('url');
    url=url.replace(/^www./, "");
    var xhr=new XMLHttpRequest();
    var new_url="https://api.similarweb.com/v1/website/"+url+"/total-traffic-and-engagement/visits?api_key=7202ad3e669d4eff804e11e82cf16bbb&start_date=2018-03&end_date=2018-05&main_domain_only=false&granularity=monthly";
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        data=JSON.parse(xhr.response);
        console.log(data);
        document.getElementById("date-1-1").innerHTML=data.visits[0].date;
        document.getElementById("traffic-1").innerHTML=data.visits[0].visits.toLocaleString(undefined, {maximumFractionDigits:2});
        document.getElementById("date-1-2").innerHTML=data.visits[1].date;
        document.getElementById("traffic-2").innerHTML=data.visits[1].visits.toLocaleString(undefined, {maximumFractionDigits:2});
        document.getElementById("date-1-3").innerHTML=data.visits[2].date;
        document.getElementById("traffic-3").innerHTML=data.visits[2].visits.toLocaleString(undefined, {maximumFractionDigits:2});
    }
    xhr.send(null);
}

function get_social_ref(){
    var url=getUrlByParameter('url');
    url=url.replace(/^www./, "");
    var xhr=new XMLHttpRequest();
    var new_url="https://api.similarweb.com/v1/website/"+url+"/traffic-sources/social?api_key=7202ad3e669d4eff804e11e82cf16bbb&start_date=2018-03&end_date=2018-05&main_domain_only=false&granularity=monthly";
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        data=JSON.parse(xhr.response);
        console.log(data);
        if(data.meta.status=="Success"){
            social_1=data.social[0].page;
            social_share_1=Math.floor(data.social[0].share*100);
            social_2=data.social[1].page;
            social_share_2=Math.floor(data.social[1].share*100);
            social_3=data.social[2].page;
            social_share_3=Math.floor(data.social[2].share*100);
            document.getElementById("social-1").innerHTML=social_1;
            document.getElementById("social-2").innerHTML=social_2;
            document.getElementById("social-3").innerHTML=social_3;
            document.getElementById("progress-1").setAttribute("aria-valuenow", social_share_1);
            document.getElementById("progress-1").setAttribute("style","width:"+social_share_1+"%");
            document.getElementById("progress-2").setAttribute("aria-valuenow", social_share_2);
            document.getElementById("progress-2").setAttribute("style","width:"+social_share_2+"%");
            document.getElementById("progress-3").setAttribute("aria-valuenow", social_share_3);
            document.getElementById("progress-3").setAttribute("style","width:"+social_share_3+"%");
        }else{
            document.getElementById("hide").innerHTML="Data not found for Social Network Sources"
        }
    }
    xhr.send(null);
}

function find_similar_websites(){
    var url=getUrlByParameter('url');
    url=url.replace(/^www./, "");
    var xhr=new XMLHttpRequest();
    var new_url="https://api.similarweb.com/v1/website/"+url+"/similar-sites/similarsites?api_key=7202ad3e669d4eff804e11e82cf16bbb&start_date=2018-03&end_date=2018-05";
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        data=JSON.parse(xhr.response);
        console.log(data);
        var site_1=data.similar_sites[0].url;
        var site_2=data.similar_sites[1].url;
        var site_3=data.similar_sites[2].url;
        var site_4=data.similar_sites[3].url;
        var site_5=data.similar_sites[4].url;
        document.getElementById("a-1").innerHTML=site_1;
        document.getElementById("a-1").setAttribute("href",site_1)
        document.getElementById("a-2").innerHTML=site_2;
        document.getElementById("a-2").setAttribute("href",site_2);
        document.getElementById("a-3").innerHTML=site_3;
        document.getElementById("a-3").setAttribute("href",site_3)
        document.getElementById("a-4").innerHTML=site_4;
        document.getElementById("a-4").setAttribute("href",site_4)
        document.getElementById("a-5").innerHTML=site_5;
        document.getElementById("a-5").setAttribute("href",site_5)
    }
    xhr.send(null);
}
function average_page_views(){
    var url=getUrlByParameter('url');
    url=url.replace(/^www./, "");
    var xhr=new XMLHttpRequest();
    var new_url="https://api.similarweb.com/v1/website/"+url+"/total-traffic-and-engagement/pages-per-visit?api_key=7202ad3e669d4eff804e11e82cf16bbb&start_date=2018-03&end_date=2018-05&main_domain_only=false&granularity=monthly";
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        data=JSON.parse(xhr.response);
        console.log(data);
        var page_views=data.pages_per_visit[2].pages_per_visit;
        document.getElementById("page-views").innerHTML=page_views.toLocaleString(undefined, {maximumFractionDigits:2});
    }
    xhr.send(null);
}

function average_visit_duration(){
    var url=getUrlByParameter('url');
    url=url.replace(/^www./, "");
    var xhr=new XMLHttpRequest();
    var new_url="https://api.similarweb.com/v1/website/"+url+"/total-traffic-and-engagement/average-visit-duration?api_key=7202ad3e669d4eff804e11e82cf16bbb&start_date=2018-03&end_date=2018-05&main_domain_only=false&granularity=monthly";
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        data=JSON.parse(xhr.response);
        console.log(data);
        var time_on_site=data.average_visit_duration[2].average_visit_duration;
        var convert_time=secondsToHms(time_on_site);
        document.getElementById("time_on_site").innerHTML=convert_time;
    }
    xhr.send(null);
}
function get_bounce_rate(){
    var url=getUrlByParameter('url');
    url=url.replace(/^www./, "");
    var xhr=new XMLHttpRequest();
    var new_url="https://api.similarweb.com/v1/website/"+url+"/total-traffic-and-engagement/bounce-rate?api_key=7202ad3e669d4eff804e11e82cf16bbb&start_date=2018-03&end_date=2018-05&main_domain_only=false&granularity=monthly";
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        data=JSON.parse(xhr.response);
        console.log(data);
        var bounce_rate=Math.floor(data.bounce_rate[2].bounce_rate*100);
        document.getElementById("bounce-rate").innerHTML=bounce_rate;
    }
    xhr.send(null);
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
}