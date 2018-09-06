window.onload=function(){
  console.log("Hi");
  setTimeout(
    function() {
      let ids = ["dashboard","form", "secondary_form", "timeline", "zoom_buttons"];
      for(let id of ids){
        document.getElementById(id).setAttribute("style","display:none;");
      }
      let layout = document.getElementsByClassName("col-md-1 col-12 text-center")[0];
      layout.setAttribute("style","display:none;");
      let graph = document.getElementById("sigmagraph");
      graph.setAttribute("style", "display: block; margin-left: auto; margin-right: auto;");
    },
    9000);
  }
