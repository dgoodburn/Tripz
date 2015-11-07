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

        $('#flight').append("<div class=flight1><span class=title>FLIGHT #1:</span></br></br>" + data.flight[0].trips.data.carrier[0].name + "</div>");
        $('#flight').append("<div class=flight1>" + data.flight[0].trips.tripOption[0].slice[0].duration  + " minutes</div>");
        $('#flight').append("<div class=flight1>" + data.flight[0].trips.tripOption[0].saleTotal + "</div></br></br>");

        $('#flight').append("<div class=flight1><span class=title>FLIGHT #2:</span></br></br>" + data.flight[1].trips.data.carrier[0].name + "</div>");
        $('#flight').append("<div class=flight1>" + data.flight[1].trips.tripOption[0].slice[0].duration  + " minutes</div>");
        $('#flight').append("<div class=flight1>" + data.flight[1].trips.tripOption[0].saleTotal + "</div></br></br>");

        $('#flight').append("<div class=flight1><span class=title>THINGS TO SEE:</span></div></br></br>");
        for (var i = 0; i < data.site.length; i++) {
            if (i > 10) { break; }
            $('#flight').append("<div class=flight1>" + data.site[i] + "</div>");
        }

    });

}
