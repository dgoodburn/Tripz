/**
 * Created by dangoodburn on 11/5/15.
 */

$(document).ready(function() {

    $('#SubmitButton').click(button);

});

function button() {

    $('#flight').empty();
    $('#flight2').css('display','none');
    $('#SubmitButton').css('display','none');
    $('#loader').css('display','inline');

    $.getJSON($SCRIPT_ROOT + '/sites', { city: $('#location').val(), startdate: $('#startdate').val(), enddate: $('#enddate').val() }, function (data) {
        $('#flight2').css('display','inline');
        $('#loader').css('display','none');
        $('#SubmitButton').css('display','inline');

        $('#flight').append("<div class=flight1><span class=titleblue>Flight #1:</span>" + data.flight[0].trips.data.carrier[0].name + "</div>");
        $('#flight').append("<div class=flight1 title>" + data.flight[0].trips.tripOption[0].slice[0].duration  + " minutes</div>");
        $('#flight').append("<div class=flight1 title>" + data.flight[0].trips.tripOption[0].saleTotal + "</div></br>");

        $('#flight').append("<div class=flight1><span class=titleblue>Flight #2:</span>" + data.flight[1].trips.data.carrier[0].name + "</div>");
        $('#flight').append("<div class=flight1 title>" + data.flight[1].trips.tripOption[0].slice[0].duration  + " minutes</div>");
        $('#flight').append("<div class=flight1 title>" + data.flight[1].trips.tripOption[0].saleTotal + "</div></br>");

        $('#flight').append("<div class=flight1><span class=titleblue>Things to see:</span></div>");
        for (var i = 0; i < data.site.length; i++) {
            if (i > 10) { break; }
            $('#flight').append("<div class=flight1 title>" + data.site[i] + "</div>");
        }

    });

}
