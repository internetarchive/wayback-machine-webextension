$(document).ready(function(){
    $("#option").click(function(){
        $("#search_panel").hide("fast");
        $("#option_panel").slideToggle("slow");
    });

    $("#search").click(function(){
        $("#option_panel").hide("fast");
        $("#search_panel").slideToggle("slow");
    });
});
