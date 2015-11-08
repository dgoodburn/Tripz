__author__ = 'dangoodburn'

from flask import Flask, jsonify, render_template, request
from dateutil import parser
import requests
import json
import instance
application = Flask(__name__)

VarKey = instance.returngoogleAPIkey()  # google api key
apikey = instance.returnairportAPIkey()  # airport api key


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

    startdate = dateformatter(startdate)
    enddate = dateformatter(enddate)
    listofsites = returnlistofsites(destination)
    flights=flightsapicall(origin, destination, startdate, enddate)

    return jsonify(site=listofsites, flight=flights)


def returnlistofsites(city):

    placeid = landmarkapicall(1, city)['predictions'][0]['place_id']
    coordinates = landmarkapicall(2, placeid)['result']['geometry']['location']
    coordinates = str(coordinates['lat']) + "," + str(coordinates['lng'])
    city = landmarkapicall(3, coordinates)
    listofsites = []
    for i in range(len(city)):
        listofsites.append(city['results'][i]['name'])
    restaurants = landmarkapicall(4, coordinates)
    hotel = landmarkapicall(5, coordinates)

    return [listofsites, restaurants, hotel]


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
    elif code == 3:
         addressvariables = {
            "HTML" : "nearbysearch",
            "TxtCode" : "location=",
            "VarCode" : detail,
            "TxtTypes" : "&radius=3000&types=",
            "VarTypes" : ""
        }
    elif code == 4:
        addressvariables = {
            "HTML" : "nearbysearch",
            "TxtCode" : "location=",
            "VarCode" : detail,
            "TxtTypes" : "&radius=3000&types=",
            "VarTypes" : "restaurant"
        }
    else:
        addressvariables = {
            "HTML" : "nearbysearch",
            "TxtCode" : "location=",
            "VarCode" : detail,
            "TxtTypes" : "&radius=3000&types=",
            "VarTypes" : "lodging"
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


    url = "https://airport.api.aero/airport/match/" + city + "?user_key="
    url = url + apikey

    r = requests.get(url).text

    searchtext = 'code'

    listofindices = indices(r, searchtext)
    listofcodes = []

    for i in listofindices:
        listofcodes.append(r[i+7:i+10])

    return listofcodes



def indices(lst, text):
    ### return list of all occurrences of text given

    result = []
    offset = -1
    while True:
        try:
            offset = lst.index(text, offset+1)
        except ValueError:
            return result
        result.append(offset)



def flightsapicall(origin, destination, startdate, enddate):
    ### returns flight information for departure and return

    ### get origin and destination airport codes
    originAirportCodelist = returnAirportCode(origin)
    destinationAirportCodelist = returnAirportCode(destination)

    url = "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyAMngV44Qd0ka-ROJtN2TCuKKQdwh9UUFM"
    headers = {'content-type': 'application/json'}

    ### cycle through airport codes to find a match
    for i in range(len(originAirportCodelist)):
        for j in range(len(destinationAirportCodelist)):

            params = {
              "request": {
                "slice": [
                  {
                    "origin": originAirportCodelist[i],
                    "destination": destinationAirportCodelist[j],
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
            r = requests.post(url, headers=headers, data=json.dumps(params))

            if 'saleTotal' in r.text:
                r1 = r.json()
                params['request']['slice'][0]['origin'] = destinationAirportCodelist[j]
                params['request']['slice'][0]['destination'] = originAirportCodelist[i]
                params['request']['slice'][0]['date'] = enddate
                r2 = requests.post(url, headers=headers, data=json.dumps(params)).json()

                return [r1, r2]


def dateformatter(date):

    dt = parser.parse(date)
    return dt.strftime("%Y-%m-%d")


if __name__ == '__main__':
    application.debug = True
    application.run()
