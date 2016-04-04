# SaferEats
Node.js back end + AngularJS front end will go here.
##TO DO
#####Chamu
Task | Status
--- | --- | ---
Create Restaurant ADT & API | **Tentative Complete**
Find suitable Tree data structure | **Tentative Complete**

##Testing
To run the server, do
```
$ node server.js
```
with nodejs installed (<https://nodejs.org/en/download/>).

##Server Specifications

* Binary search
```
/binary?name=<NAME>
```
Does a binary search for a restuarant with the exact given name, and returns it if it exists, otherwise returns null.

* Substring search
```
/mults?substr=<SUBSTRING>
```
Does a linear search for all restaurants that contain the given substring, and returns all of them. If no such
restaurants exists, returns null.

* Area search
```
/area?lat=<LATTITUDE>&long=<LONGITUDE>&dist=<RADIUS>
```
Queries the qaudtree to get a smaller set of restuarants around the given location, and then does a linear search
for all restuarants within the given radius (in meters) using haversine. Returns either (1) All of the restaurants within the radius,
or (2) Empty list if no such restaurants exist, or (3) null if the coordinates given are not within the appropriate range.

