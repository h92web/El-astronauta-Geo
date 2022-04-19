$(document).ready(function(){

    var height_page = $(window).height();
    $("body").height(height_page);

    $("section").height(height_page - $("header").height() - $("footer").height());

    $("#nivel_actual").css("opacity", "0");

    /* $("#Astronauta_Geo").css("opacity", "0"); */

});