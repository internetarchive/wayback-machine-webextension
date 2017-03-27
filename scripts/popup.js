$(function()
{
    var $url=$(".form-control");
    $(".form-control").keypress(function(e) {
        var key=e.which;
        if(key==13)
        {
            var ajaxOptions =
            {
              type:"GET",
              url:"http://archive.org/wayback/available?url="+$url.val(),
              dataType: 'json',
              success:function(response)
               {
                if(typeof response.archived_snapshots.closest !='undefined')
                {
                    var date=response.archived_snapshots.closest.timestamp;
                    var tosearch=response.archived_snapshots.closest.url;
                    var exact=date.substring(0,4)+'/'+date.substring(4,6)+'/'+date.substring(6,8);
                    var time=date.substring(8,10)+'/'+date.substring(10,12)+'/'+date.substring(12,14);
                    $(".latest").append(
                        '<div class="new-div"><button type="button" class="btn btn-success recent-version new-button">Date:</button></div>');
                    $(".new-button").html("See page on:"+exact);
                    $(".new-div").append("<div class=share-div>Share this page on</div>");
                    $(".share-div").append("<div><img src='images/facebook.png' class=btn-fb style=padding-right:20px;padding-left:10px;><img src='images/twitter.png' class=btn-tweet></div>");
                    $(".new-button").click(function()
                    {
                        chrome.tabs.create({url:tosearch});
                    });
                    $(".btn-fb").click(function()
                    {
                        var fburl="https://www.facebook.com/sharer/sharer.php?u=";
                        var msg="Hey,look.How this page was looking on"+exact;
                        chrome.tabs.create({url:fburl+tosearch});
                    });
                    $(".btn-tweet").click(function()
                    {
                        var tweeturl="https://twitter.com/intent/tweet?text=";
                        chrome.tabs.create({url:tweeturl+tosearch});
                    });
                }
                else
                    {
                    $(".latest").append(
                    '<div class="newdiv"><button type="button" class="btn btn-danger newbutton">Not Found</button></div>');
                    }
                }
            }
          $.ajax(ajaxOptions);
        }
     });
    $("#save_now").click(function()
    {
        var wb_url = "https://web.archive.org/save/";
        chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'save' }, function(response) {
        });
    });
    $("#recent_capture").click(function()
    {
        var wb_url = "https://web.archive.org/web/2/";
        chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'recent' }, function(response) {
        });
    });
    $("#first_capture").click(function()
    {
        var wb_url = "https://web.archive.org/web/0/";
        chrome.runtime.sendMessage({message: "openurl", wayback_url: wb_url, method:'first' }, function(response) {
        });
    });
    $(function()
    {
        var view_all_function=function(){
            var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
            url = document.location.href.replace(pattern, "");       
            open_url = "https://web.archive.org/web/*/"+encodeURI(url);
            document.location.href = open_url;
        }
    });
});