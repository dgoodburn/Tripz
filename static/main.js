/**
 * Created by dangoodburn on 11/5/15.
 */

$(document).ready(function() {

    $('#SubmitButton').click(button);

});

function button() {

    // remove alert if necessary
    $('.alert').remove();

    // retrieve inputs from form
    var origin = $('#origin').val();
    var destination = $('#destination').val();
    var startdate = $('#startdate').val();
    var enddate = $('#enddate').val();
    var flightdiv = $('#flight');

    // remove any current results if necessary
    flightdiv.empty();
    $('#flight2').css('display','none');

    // check if all inputs are valid
    var errormessage = formValidation(origin, destination, startdate, enddate);

    if (errormessage === null) {
        $('#SubmitButton').css('display','none');
        $('#loader').css('display','inline');

        $.getJSON($SCRIPT_ROOT + '/sites', {

            origin: origin,
            destination: destination,
            startdate: startdate,
            enddate: enddate

        }, function (data) {

            $('#flight2').css('display','inline');
            $('#loader').css('display','none');
            $('#SubmitButton').css('display','inline');

            // output results on screen
            outputFlightData(flightdiv, data);
            outputSiteData(flightdiv, data);
            outputHotelData(flightdiv, data);
            outputRestaurantData(flightdiv, data);

        });
    }

}


function outputFlightData(flightdiv, data) {

    try {
        flightdiv.append("<div class=flight1><span class=titleblue>Flight #1:</span>" + data.flight[0].trips.data.carrier[0].name + "</div>");
        flightdiv.append("<div class=flight1 title>" + data.flight[0].trips.tripOption[0].slice[0].duration  + " minutes</div>");
        flightdiv.append("<div class=flight1 title>" + data.flight[0].trips.tripOption[0].saleTotal + "</div></br>");

        flightdiv.append("<div class=flight1><span class=titleblue>Flight #2:</span>" + data.flight[1].trips.data.carrier[0].name + "</div>");
        flightdiv.append("<div class=flight1 title>" + data.flight[1].trips.tripOption[0].slice[0].duration  + " minutes</div>");
        flightdiv.append("<div class=flight1 title>" + data.flight[1].trips.tripOption[0].saleTotal + "</div></br>");
    }
    catch(err) {
        message = "Unable to find flight. Please try again.";
        createAlert(message);
    }

}

function outputSiteData(flightdiv, data) {

    try {
        flightdiv.append("<div class=site1><span class=titleblue>Things to see:</span></div>");
        for (var i = 0; i < data.site[0].length; i++) {
            if (i > 10) { break; }
            flightdiv.append("<div class=site1 title>" + data.site[0][i] + "</div>");
        }
    }
    catch(err) {
        message = "Unable to find sightseeing details. Please try again.";
        createAlert(message);
    }
}

function outputHotelData(flightdiv, data) {

    try {
        flightdiv.append("</br><div class=site2><span class=titleblue>Hotel:</span></div>");
        flightdiv.append("<div class=site2 title>" + data.site[2].results[0].name + "</div>");

    }
    catch(err) {
        message = "Unable to find hotel details. Please try again.";
        createAlert(message);
    }
}

function outputRestaurantData(flightdiv, data) {

    try {
        flightdiv.append("</br><div class=site3><span class=titleblue>Restaurants:</span></div>");
        for (var i = 0; i < data.site[2].results.length; i++) {
            if (i > 10) { break; }
            flightdiv.append("<div class=site3 title>" + data.site[1].results[i].name + "</div>");
        }
    }
    catch(err) {
        message = "Unable to find restaurant details. Please try again.";
        createAlert(message);
    }
}


function formValidation(origin, destination, startdate, enddate) {
// checks that form inputs are valid

    message = null;

    new Date(startdate).toString() === "Invalid Date" ? message = 'Sorry. Date format is incorrect. "YYYY-MM-DD"' : void(0);
    new Date(enddate).toString() === "Invalid Date" ? message = 'Sorry. Date format is incorrect. "YYYY-MM-DD"' : void(0);

    destination === "" ? message = "Destination not found." : void(0);
    origin === "" ? message = "Origin not found." : void(0);

    message === null ? void(0) : createAlert(message);
    return message
}


function createAlert(message) {
// creates message upon error

    $('.alert').remove();
    $('.mdl-card:first-child').append('<div class="alert alert-danger" role="alert">' + message + '</div>');

}