/* Load CSS and create the markup necessary to render the Site Map */
if(document.getElementById('myModal') !== null) {
  document.getElementById('myModal').style.display="block";
  var count=document.getElementById('myModal').getAttribute('count');
  count++;
  document.getElementById('myModal').setAttribute('count',count);
} else {
  var styles = ['css/googlestyle.css', 'css/RTstyle.css', 'css/sequences.css',
                'css/radial-tree.css'];
  for (var i in styles) {
    var el = document.createElement('link');
    el.rel = 'stylesheet';
    el.type = 'text/css';
    el.href = chrome.extension.getURL(styles[i]);
    document.head.appendChild(el);
  }
  var modal=document.createElement('div');
  modal.setAttribute('id','myModal');
  modal.setAttribute('class','RTmodal');
  modal.setAttribute('count','1');
  /**
  var modalContent=document.createElement('div');
  modalContent.setAttribute('class','modal-content');
  var divBtn=document.createElement('div');
  divBtn.setAttribute('id','divBtn');
  var message=document.createElement('div');
  message.setAttribute('id','message');
  **/
  var span=document.createElement('button');
  span.innerHTML='&times;';
  span.setAttribute('class','RTclose');
  modal.appendChild(span);
  /**
   * var main=document.createElement('div');
  var sequence=document.createElement('p');
  var chart=document.createElement('div');
  sequence.setAttribute('id','sequence');
  chart.setAttribute('id','chart');
  main.setAttribute('id','main');

  modal.appendChild(divBtn);
  modal.appendChild(sequence);
  modal.appendChild(chart);
  modal.appendChild(message);
  **/
  document.body.appendChild(modal);
  modal.style.display = "block";

  span.onclick = function() {
    modal.style.display = "none";
    // var Modal=document.getElementById("myModal");
    // document.body.removeChild(Modal);
  };
}
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.message=="deletenode"){
    console.log("Message received for deleting node");
  	var Modal=document.getElementById("myModal");
    document.body.removeChild(Modal);
  }
});
