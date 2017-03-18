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


function archive_exist(url)
{
	wb_url = 'http://archive.org/wayback/available?url=';
	
	$.ajax({  
			type: "GET",  
			contentType: "application/json; charset=utf-8",  
			url: wb_url+url,
			dataType: "json",  
			
			success: function(response) { 
				
				$('#result').css('display',"block");
				var avail,timestamp; //Tells whether any entry for this particular url is available or not
				try {
    					avail = response['archived_snapshots']['closest']['available'];
						date = response['archived_snapshots']['closest']['timestamp'];
						var year = date.substring(0,4);
						var month = parseInt(date.substring(4,6), 10);
						var day = date.substring(6,8);
					}
				catch(err) {
					    avail = false;
				    }	
				 
				if(avail)
				{
					$('#notify').removeClass("btn-danger");
					$('#notifyText').removeClass("glyphicon-remove");
					$('#notify').addClass("btn-success");
					$('#notifyText').addClass("glyphicon-calendar");
					$('#notifyText').text(" Latests: "+year+"-"+month+"-"+day);
				
				}
				else{
					$('#notify').removeClass("btn-success");
					$('#notifyText').removeClass("glyphicon-calendar");
					$('#notify').addClass("btn-danger");
					$('#notifyText').addClass("glyphicon glyphicon-remove");
					$('#notifyText').text(" 404 Not Found ");
					//If Page was not archived then : save page
					$('#mini-clndr').css("display", "none");
					var wb_url = "https://web.archive.org/save/";
					chrome.tabs.create({ url: wb_url+url });

				}


			},  
			
			error: function(xhr, ajaxOptions, thrownError) {
				 alert(xhr.responseText); 
			}
		});

}

function archive_inRange_Year(url,from,to,filter,collapse)
{

		if(filter)
		{ filter = '&fl='+filter; }
		if(collapse)
		{ collapse = '&collapse='+collapse; }

		wb_url = 'http://web.archive.org/cdx/search/cdx?url='+url+collapse+filter+'&output=json&from='+from+'&to='+to;
		$.ajax({  
			type: "GET",  
			contentType: "application/json; charset=utf-8",  
			url: wb_url,    
			dataType: "json",  
			
			success: function(data) { 
				var events = [];
				for(var i = 1; i < data.length; i++) {
								var obj = data[i];
								var a = moment(obj[0],"YYYYMMDDHHmmss");
								var json_object = {'date'		:	a.format('YYYY-MMM-DD'),
																	 'time'	:	a.format('HH:mm:ss'),
																		'url'		:	obj[1] };
								events[i-1] = json_object;
							}
				// alert(events);
				showCalender(events);
			},  
			
			error: function(xhr, ajaxOptions, thrownError) {
				 alert(xhr.responseText); 
			}

		});
}


function showCalender(events)
{
					var clndr = {};
					
						$('#mini-clndr').clndr({
							template: $('#mini-clndr-template').html(),
							events: events,
							clickEvents: {
								click: function(target) {
									if(target.events.length) {
										var daysContainer = $('#mini-clndr').find('.days-container');
										daysContainer.toggleClass('show-events', true);
										$('#mini-clndr').find('.x-button').click( function() {
											daysContainer.toggleClass('show-events', false);
										});
									}
								}
							},
							// onMonthChange: 
							adjacentDaysChangeMonth: true,
							forceSixRows: true
						});
}


$(document).ready(function(){

			$('#search').keypress(function (e) {
			var key = e.which;
			if(key == 13)  
			{
					archive_exist(this.value);
					return false;  
			}
			});

			
			$('#notify').click(function (e) {
				
					$('#mini-clndr').css("display", "block");
					archive_inRange_Year('www.example.com','2017','2017','timestamp,original','timestamp:10');
					
			});   
});


document.getElementById('save_now').onclick = save_now_function;
document.getElementById('recent_capture').onclick = recent_capture_function;
document.getElementById('first_capture').onclick = first_capture_function;