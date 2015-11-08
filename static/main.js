/**
 * Created by dangoodburn on 11/5/15.
 */

$(document).ready(function() {

    $('#SubmitButton').click(button);

});

function button() {

    // remove alert if necessary
    $('.alert').remove();
    $('#flight2').css('display','none');
    $('#flight3').css('display','none');

    $('#combined').css('display','none');
    $('#restaurants1').css('display','none');


    // retrieve inputs from form
    var origin = $('#origin').val();
    var destination = $('#destination').val();
    var startdate = $('#startdate').val();
    var enddate = $('#enddate').val();

    var flightdiv = $('#flight');
    var flightdiv2 = $('#flightnum2');

    // remove any current results if necessary
    flightdiv.empty();
    flightdiv2.empty();
    $('#things').empty();
    $('#hotel').empty();
    $('#restaurants').empty();

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

            $('#flight2').css('display','block');
            $('#flight3').css('display','block');

            $('#combined').css('display','inline');
            $('#restaurants1').css('display','block');
            $('#loader').css('display','none');
            $('#SubmitButton').css('display','inline');

            // output results on screen
            outputFlightData(flightdiv, flightdiv2, data);
            outputSiteData(data);
            outputHotelData(flightdiv, data);
            outputRestaurantData(flightdiv, data);

            adjustdivheight();


        });
    }

}


function outputFlightData(flightdiv, flightdiv2, data) {

    //try {
        for (var i = 0; i<2; i++) {
            var flight = data.flight[i];
            var carrier = flight.trips.data.carrier[0].name;
            var flightnum = flight.trips.tripOption[0].slice[0].segment[0].flight.carrier + flight.trips.tripOption[0].slice[0].segment[0].flight.number;
            var duration = flight.trips.tripOption[0].slice[0].duration;
            var departureAirport = flight.trips.data.airport[0].code;
            var arrivalAirport = flight.trips.data.airport[1].code;
            var departureTime = (flight.trips.tripOption[0].slice[0].segment[0].leg[0].arrivalTime).slice(11,16);
            var arrivalTime = (flight.trips.tripOption[0].slice[0].segment[0].leg[0].departureTime).slice(11,16);
            var totalCost = flight.trips.tripOption[0].saleTotal;
            var layovers = flight.trips.tripOption[0].slice[0].segment.length - 1;

            var currentdiv;
            i === 0 ? currentdiv = flightdiv : currentdiv = flightdiv2;

            $('#combinedFlight').css('display','inline');

            currentdiv.append("\
                    <div class='flight1'><span class=titleblue>Flight #" + (i+1) + ":</div>\
                    <div class='flight1 title'><span class=left>" + carrier + "</span><span class=right>Depart: " + departureAirport + " " + departureTime + "</span></div>\
                    <div class='flight1 title'><span class=left>" + flightnum + "</span><span class=right>Arrive: " + arrivalAirport + " " + arrivalTime + "</span></div>\
                    <div class='flight1 title'><span class=left> </span><span class=right>" + duration  + " minutes</span></div>\
                    <div class='flight1 title'><span class=left>" + totalCost + "</span><span class=right>Layovers: " + layovers  + "</span></div>"
            );
        }
    /*}
    catch(err) {
        message = "Unable to find flight. Please try again.";
        createAlert(message);
    }*/

}

function outputSiteData(data) {

    var currentdiv = $('#things');
    try {
        currentdiv.append("<div class=site1><span class=titleblue>Things to see:</span></div>");
        for (var i = 0; i < data.site[0].length; i++) {
            if (i > 5) { break; }
            currentdiv.append("<div class='site1 title'>" + data.site[0][i] + "</div>");
        }
    }
    catch(err) {
        message = "Unable to find sightseeing details. Please try again.";
        createAlert(message);
    }
}

function outputHotelData(flightdiv, data) {

    var currentdiv = $('#hotel');
    try {
        currentdiv.append("<div class=site2><span class=titleblue>Hotel:</span></div>");
        currentdiv.append("<div class='site2 title'>" + data.site[2].results[0].name + "</div>");
    }
    catch(err) {
        message = "Unable to find hotel details. Please try again.";
        createAlert(message);
    }
}

function outputRestaurantData(flightdiv, data) {

    var currentdiv = $('#restaurants');
    try {
        currentdiv.append("<div class=site3><span class=titleblue>Restaurants:</span></div>");
        for (var i = 0; i < data.site[2].results.length; i++) {
            if (i > 10) { break; }
            currentdiv.append("<div class='site3 title'>" + data.site[1].results[i].name + "</div>");
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
    $('#loader').after('</br><div class="alert alert-danger" role="alert">' + message + '</div>');

}


function adjustdivheight() {

    var one = $('#restaurants1').height();
    var two = $('#hotel1').height();
    var three = $('#blank').height();
    var remaining_height = parseInt(one - two - three - 32);
    $('#things1').height(remaining_height);

}