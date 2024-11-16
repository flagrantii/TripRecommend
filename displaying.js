
var map, directionsService, directionsRenderer;
var script = document.createElement("script");
script.src =
  "https://maps.googleapis.com/maps/api/js?key={API_KEY}&callback=initMap";
script.async = true;
initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 13.7563, lng: 100.5018 },
    zoom: 11,
  });
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
  });
  directionsRenderer.setMap(map);
};

document.head.appendChild(script);
window.initMap = initMap;

var NewUrl = sessionStorage.getItem("NewUrl");
var Day = sessionStorage.getItem("Day");
var PalcePerDay = sessionStorage.getItem("PalcePerDay");
var StartDay = sessionStorage.getItem("StartDay");
var result = JSON.parse(sessionStorage.getItem("Result"));
console.log(NewUrl);
display();

var loca = [];
var markers = [];
var waypoints = [];

function display() {
  
  console.log(result);
  createPlaceBox(result);

  function createPlaceBox(result) {
    for (let i = 1; i <= Day; i++) {
      var boxPlace = document.createElement("div");
      boxPlace.className = `boxPlace`;
      boxPlace.id = `boxPlace${i}`;
      document.body.appendChild(boxPlace);

      var DateDisplaying = document.createElement("p");
      var date = new Date(result[i][1].time.time_start);
      var dateString = millisecondsToDate(date);
      DateDisplaying.textContent = dateString;
      DateDisplaying.className = "DateText";
      boxPlace.appendChild(DateDisplaying);

      var divplace = document.createElement("div");
        divplace.id = "placeELement"

      var valButton = document.createElement("button");
      valButton.textContent = `See Day${i} Plan!`;
      valButton.id = `valButton${i}`;
      valButton.className = "valButton";
      valButton.addEventListener("click", function () {
        resetMap();
        ShowMakers(result[i]);
        calculateRoute(result[i]);
      });

      for(let j=0 ;j < PalcePerDay ;j++){
        var time = new Date(result[i][j].time.time_start)
        var timeString = millisecondsToTime(time);

        var divPlaceLine = document.createElement("div");
        divPlaceLine.id = "placeLine";

        var valTime = document.createTextNode(`${timeString}`);
        var valText = document.createTextNode(`${result[i][j].name}`);

        var Circle = document.createElement("div");
        Circle.id = "placeLineCircle";

        var spanTime = document.createElement("span");
        spanTime.id = "placeTime";
        spanTime.appendChild(valTime);

        var pPlace = document.createElement("span");
        pPlace.id = "placeText";
        pPlace.appendChild(valText);

        divPlaceLine.appendChild(Circle);
        divPlaceLine.appendChild(spanTime);
        divPlaceLine.appendChild(pPlace);

        divplace.appendChild(divPlaceLine);

        boxPlace.appendChild(divplace);
        boxPlace.appendChild(valButton);
      }
    }
  }

  function ShowMakers(result) { 
    for (let i = 0; i < Object.keys(result).length; i++) {
      loca[i] = new google.maps.LatLng(
        result[i].geometry.lat,
        result[i].geometry.lon
      );

      var marker = new google.maps.Marker({
        position: loca[i],
        map: map,
        title: result[i].name,
        visible: true,
        photo: result[i].photo[1]
      });

      markers.push(marker);

      marker.addListener("click", function () {
        $("#myModal").modal();
        
        var title = "<h2>" + this.title + "</h2>";

        document.getElementById("modal-title").innerHTML = title;
        var modal = document.getElementById("modal-body");
        var img = document.createElement("img");

        img.src = this.photo;
        img.style.width = "100%";
        img.style.height = "100%";

        modal.appendChild(img);
      });
    }
  }

  function calculateRoute(result) {
    
    for (var i = 0; i <= Object.keys(result).length - 1; i++) {
      waypoints.push({
        location: loca[i],
        stopover: true,
      });
    }
    directionsService.route(
      {
        origin: loca[0],
        destination: loca[loca.length - 1],
        waypoints: waypoints,
        travelMode: "DRIVING",
      },
      function (response, status) {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
          var routeLegs = response.routes[0].legs;
          for (var i = 0; i < routeLegs.length; i++) {
            var routeSteps = routeLegs[i].steps;
            for (var j = 0; j < routeSteps.length; j++) {
              var routeMarkers = routeSteps[j].markers;
              if (routeMarkers) {
                for (var k = 0; k < routeMarkers.length; k++) {
                  routeMarkers[k].setMap(null);
                }
              }
            }
          }
        }
      }
    );
  }

  function resetMap() {
    for (let j = 0; j < markers.length; j++) {
      markers[j].setMap(null);
    }
    waypoints = [];
  }

  function millisecondsToTime(time) {
    var hours = String(time.getHours()).padStart(2, "0");
    var minutes = String(time.getMinutes()).padStart(2, "0");
    var day = time.toLocaleString("en-US", { weekday: "long" });
    var month = time.toLocaleString("en-US", { month: "long" });
    var year = time.getFullYear();

    return hours + ":" + minutes;
  }

  function millisecondsToDate(date) {
    var hours = String(date.getHours()).padStart(2, "0");
    var minutes = String(date.getMinutes()).padStart(2, "0");
    var day = date.toLocaleString("en-US", { weekday: "long" });
    var month = date.toLocaleString("en-US", { month: "long" });
    var year = date.getFullYear();

    return day + " " + date.getDate() + " " + month + " " + year;
  }
}