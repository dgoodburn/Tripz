/**
 * Created by dangoodburn on 11/5/15.
 */

$(document).ready(function() {

    $('#SubmitButton').click(button);

});

function button() {

    $.getJSON($SCRIPT_ROOT + '/sites', { city: $('#location').val(), startdate: $('#startdate').val(), enddate: $('#enddate').val() }, function (data) {
        $('#flight').append("<div class=flight1>FLIGHT #1:</br></br>" + data.flight[0].trips.data.carrier[0].name + "</div>");
        $('#flight').append("<div class=flight1>" + data.flight[0].trips.tripOption[0].slice[0].duration  + " minutes</div>");
        $('#flight').append("<div class=flight1>" + data.flight[0].trips.tripOption[0].saleTotal + "</div></br>");

        $('#flight').append("<div class=flight1>FLIGHT #2:</br></br>" + data.flight[1].trips.data.carrier[0].name + "</div>");
        $('#flight').append("<div class=flight1>" + data.flight[1].trips.tripOption[0].slice[0].duration  + " minutes</div>");
        $('#flight').append("<div class=flight1>" + data.flight[1].trips.tripOption[0].saleTotal + "</div></br>");

        $('#flight').append("<div class=flight1>THINGS TO SEE:</div></br>");
        for (var i = 0; i <= 3; i++) {
            $('#flight').append("<div class=flight1>" + data.site[i] + "</div>");
        }

    });

}
