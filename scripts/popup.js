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


    document.getElementById('save_now').onclick = save_now_function;
    document.getElementById('recent_capture').onclick = recent_capture_function;
    document.getElementById('first_capture').onclick = first_capture_function;

    window.onload=function(){

        chrome.runtime.sendMessage({message: "sendurl"}, function(response) {


            set_share(response.sent_url);
        });

    };


    function set_share(url){
        var btn=document.getElementsByClassName('share_btn');
        for(i=0;i<btn.length;i++){
            btn[i].page_url=url;
            btn[i].addEventListener('click',share_url);
        }

    }


    function share_url(event){                         




        var btn_clicked=event.target;
        var to_share_url;
        var url;
        if(btn_clicked.id.indexOf('fb')>=0){
            var fb_url="https://www.facebook.com/sharer/sharer.php?u=";
            if(btn_clicked.id.indexOf('recent')>=0){
                url="https://web.archive.org/web/2/"+btn_clicked.page_url;
            }else if(btn_clicked.id.indexOf('first')>=0){
                url="https://web.archive.org/web/0/"+btn_clicked.page_url;
            }else{
                url="https://web.archive.org/web/*/"+btn_clicked.page_url;
            }

            to_share_url=fb_url+url;                                                             
        }else{
            var tw_url="http://twitter.com/share?url=";
            if(btn_clicked.id.indexOf('recent')>=0){
                url="https://web.archive.org/web/2/"+btn_clicked.page_url;
            }else if(btn_clicked.id.indexOf('first')>=0){
                url="https://web.archive.org/web/0/"+btn_clicked.page_url;
            }else{
                url="https://web.archive.org/web/*/"+btn_clicked.page_url;
            }

            to_share_url=tw_url+url;                                                             
        }
            chrome.tabs.create({url:to_share_url});



    }




