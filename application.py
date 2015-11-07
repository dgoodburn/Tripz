__author__ = 'dangoodburn'

from flask import Flask, jsonify, render_template, request
import requests
import json
application = Flask(__name__)

VarKey = "AIzaSyAMngV44Qd0ka-ROJtN2TCuKKQdwh9UUFM"  # google api key


@application.route('/')
def index():
    ### return initial HTML

    return render_template('index.html')


@application.route('/sites')
def sites():
    ### called after validated push of submit button. returns list of sites and flight information

    origin = request.args.get('origin', 0, type=str)
    destination = request.args.get('destination', 0, type=str)
    startdate = request.args.get('startdate', 0, type=str)
    enddate = request.args.get('enddate', 0, type=str)

    listofsites = returnlistofsites(destination)
    flights=flightsapicall(origin, destination, startdate, enddate)

    return jsonify(site=listofsites, flight=flights)


def returnlistofsites(city):

    var = landmarkapicall(1, city)['predictions'][0]['place_id']
    var = landmarkapicall(2, var)['result']['geometry']['location']
    var = str(var['lat']) + "," + str(var['lng'])
    var = landmarkapicall(3, var)
    listofsites = []
    for i in range(len(var)):
        listofsites.append(var['results'][i]['name'])

    return listofsites


def landmarkapicall(code, detail):
    ### run three times. 1) Use City name to get place ID. 2) Use Place ID to get X,Y location. 3) Use location to get landmarks

    if code == 1:
        addressvariables = {
            "HTML" : "autocomplete",
            "TxtCode" : "input=",
            "VarCode" : detail,
            "TxtTypes" : "&types=",
            "VarTypes" : "geocode"
        }
    elif code == 2:
        addressvariables = {
            "HTML" : "details",
            "TxtCode" : "placeid=",
            "VarCode" : detail,
            "TxtTypes" : "",
            "VarTypes" : ""
        }
    else:
         addressvariables = {
            "HTML" : "nearbysearch",
            "TxtCode" : "location=",
            "VarCode" : detail,
            "TxtTypes" : "&radius=3000&types=",
            "VarTypes" : ""
        }

    TxtHTML = "https://maps.googleapis.com/maps/api/place/" + addressvariables['HTML'] + "/json?"
    TxtKey = "&key="

    address = ""
    address += TxtHTML
    address += addressvariables['TxtCode']
    address += addressvariables['VarCode']
    address += addressvariables['TxtTypes']
    address += addressvariables['VarTypes']
    address += TxtKey
    address += VarKey

    return requests.get(address).json()


def returnAirportCode(city):
    ### return airport code given city name

    apikey = "03107a4ad71079da436cb5f55457f578"

    url = "https://airport.api.aero/airport/match/" + city + "?user_key="
    url = url + apikey

    r = requests.get(url).text

    return r[r.find("code")+7:r.find("code")+10]


def flightsapicall(origin, destination, startdate, enddate):
    ### returns flight information for departure and return

    ### get origin and destination airport codes
    originAirportCode = returnAirportCode(origin)
    destinationAirportCode = returnAirportCode(destination)

    url = "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyAMngV44Qd0ka-ROJtN2TCuKKQdwh9UUFM"
    headers = {'content-type': 'application/json'}

    params = {
      "request": {
        "slice": [
          {
            "origin": originAirportCode,
            "destination": destinationAirportCode,
            "date": startdate  # "2015-11-18"
          }
        ],
        "passengers": {
          "adultCount": 1,
          "infantInLapCount": 0,
          "infantInSeatCount": 0,
          "childCount": 0,
          "seniorCount": 0
        },
        "solutions": 1,
        "refundable": False
      }
    }
    r1 = requests.post(url, headers=headers, data=json.dumps(params)).json()

    ### change variables for second flight
    params['request']['slice'][0]['origin'] = destinationAirportCode
    params['request']['slice'][0]['destination'] = originAirportCode
    params['request']['slice'][0]['date'] = enddate

    r2 = requests.post(url, headers=headers, data=json.dumps(params)).json()

    return [r1, r2]



if __name__ == '__main__':
    application.debug = False
    application.run()
