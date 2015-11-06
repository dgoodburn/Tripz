__author__ = 'dangoodburn'

from flask import Flask, jsonify, render_template, request
import requests
import json
application = Flask(__name__)

VarKey = "AIzaSyAMngV44Qd0ka-ROJtN2TCuKKQdwh9UUFM"

def landmarkapicall(code, detail):

    if code == 1:
        HTML = "autocomplete"
        TxtCode = "input="
        VarCode = detail
        TxtTypes = "&types="
        VarTypes = "geocode"
    elif code == 2:
        HTML = "details"
        TxtCode = "placeid="
        VarCode = detail
        TxtTypes = ""
        VarTypes = ""
    else:
        HTML = "nearbysearch"
        TxtCode = "location="
        VarCode = detail
        TxtTypes = "&radius=3000&types="
        VarTypes = ""

    TxtHTML = "https://maps.googleapis.com/maps/api/place/" + HTML + "/json?"
    TxtKey = "&key="

    print VarCode
    address = ""
    address += TxtHTML
    address += TxtCode
    address += VarCode
    address += TxtTypes
    address += VarTypes
    address += TxtKey
    address += VarKey
    print address
    return requests.get(address).json()


def returnAirportCode(city):

    apikey = "03107a4ad71079da436cb5f55457f578"

    url = "https://airport.api.aero/airport/match/" + city + "?user_key="
    url = url + apikey

    r = requests.get(url).text

    return r[r.find("code")+7:r.find("code")+10]


def flightsapicall(city, startdate, enddate):

    airportCode = returnAirportCode(city)
    print airportCode

    url = "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyAMngV44Qd0ka-ROJtN2TCuKKQdwh9UUFM"
    headers = {'content-type': 'application/json'}

    params = {
      "request": {
        "slice": [
          {
            "origin": "SEA",
            "destination": airportCode,
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

    params = {
      "request": {
        "slice": [
          {
            "origin": airportCode,
            "destination": "SEA",
            "date": enddate  # "2015-11-18"
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
    r2 = requests.post(url, headers=headers, data=json.dumps(params)).json()
    return [r1, r2]




@application.route('/sites')
def sites():

    city = request.args.get('city', 0, type=str)
    startdate = request.args.get('startdate', 0, type=str)
    enddate = request.args.get('enddate', 0, type=str)

    var = landmarkapicall(1, city)['predictions'][0]['place_id']
    var = landmarkapicall(2, var)['result']['geometry']['location']
    var = str(var['lat']) + "," + str(var['lng'])
    var = landmarkapicall(3, var)
    listofsites = []
    for i in range(len(var)):
        listofsites.append(var['results'][i]['name'])

    return jsonify(site=listofsites, flight=flightsapicall(city, startdate, enddate))



@application.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    application.debug = True
    application.run()






