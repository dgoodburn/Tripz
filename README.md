# Tripz

![Alt text](https://github.com/dgoodburn/Tripz/blob/master/Screenshot.png "Demo")

TRIPZ is a very basic app that, with an origin, destination and start and end dates, will generate a set of flights and a list of landmarks to see at your destination.

---

$ virtualenv Tripz  
$ source Tripz/bin/activate  
$ cd Tripz  
$ git clone https://github.com/dgoodburn/Tripz.git  
$ cd tripz  
$ pip install -r requirements.txt

in application.py, adjust lines 11-12:

VarKey = instance.returngoogleAPIkey()  # google api key
apikey = instance.returnairportAPIkey()  # airport api key

Enter API keys obtained from:

Google apikey: https://console.developers.google.com/home/
Airport apikey: https://www.developer.aero/admin/applications

$ python Tripz.py  

http://localhost:5000/
