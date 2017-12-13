var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.446855, lng: -80.0056666},
    zoom: 14,
    mapTypeId: 'satellite'
  });
}
