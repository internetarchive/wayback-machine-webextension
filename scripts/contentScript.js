window.onload=function(){
    console.log("Hi");
    setTimeout(
        function() {
            console.log("here");
            document.querySelector('.layout-button-graph').click();
        },
    9000);
} 
