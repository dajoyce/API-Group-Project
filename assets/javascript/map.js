var myLatLng = {
  lat: parseFloat(localStorage.getItem("lat")),
  lng: parseFloat(localStorage.getItem("long"))
};

console.log(myLatLng);

initMap(myLatLng);

function initMap(mapObj) {
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: mapObj,
    mapTypeId: "terrain"
  });
  var marker = new google.maps.Marker({
    position: mapObj,
    map: map,
    title: "Hello World!"
  });
}
