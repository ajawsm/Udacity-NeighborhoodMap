var map;
var marker;
var infowindow;
var wikiURL;
var text;
var venueInfo;
var markers = [];
var markerNames = [];
var wikiURLs = [];
var venueArray = [];
var blackMarker = ('https://www.google.com/mapfiles/marker_black.png');
var yellowMarker = ('https://www.google.com/mapfiles/marker_yellow.png');
var currentMarker;
var currentVenue;
var venueList;
var filterVenues;
var clicker;
var venueMatch;
var venue;
var i;
var userSearch;
var setVenue;
var clickedVenue;

//The Model - Pro/Collegiate Stadiums in PGH, Pa.
var venues = [
  {
    name: "PNC Park",
    lat: 40.446855,
    lng: -80.0056666,
    marker: '',
    info: ''
  },
  {
    name: "Heinz Field",
    lat: 40.4466765,
    lng: -80.01576,
    marker: '',
    info: ''
  },
  {
    name: "PPG Paints Arena",
    lat: 40.439593,
    lng: -79.989338,
    marker: '',
    info: ''
  },
  {
    name: "Highmark Stadium",
    lat: 40.4362358,
    lng: -80.00959209999999,
    marker: '',
    info: ''
  },
  {
    name: "Peterson Events Center",
    lat: 40.443828,
    lng: -79.962283,
    marker: '',
    info: ''
  }
];


function ajaxCall(i){
  var venue = venues[i];
  wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' +venue.name+ '&format=json&callback=wikiCallback';


  wikiURLs.push(wikiURL);

  $.ajax ({
      url: wikiURL,
      dataType: "jsonp",
      success: function(data){
            text = data[2];
            venues[i].info = text[0];


              if (venue.info === undefined) {
                venue.info = 'Whoops! Our data never showed up. Check out '+venue.name+' on Wikipedia for more!';
              }
              marker = new google.maps.Marker({
                position: {lat: venue.lat, lng: venue.lng},
                icon: blackMarker,
                map: map,
                name: venue.name,
                draggable: false,
                content: '<h2>'+venue.name+'</h2><p>'+venue.info+'</p>',
                visible: true
              });



                markers.push(marker);
                venue.marker = marker;
                markerNames.push(marker.name);



            infowindow = new google.maps.InfoWindow({
                  content: this.content
                });



                marker.addListener('click', function(){
                  infowindow.setContent(this.content);
                  infowindow.open(map, this);
                  for (var i = 0; i<markers.length; i++){
                    markers[i].setIcon(blackMarker);
                  }
                  this.setIcon(yellowMarker);

                });
        }
      });

  }








//capturing locations and names in arrays as we iterate through createMarker function
//marker creator

function createMarker(venue){
for (var i=0; i < venues.length; i++){
ajaxCall(i);

}
}




var viewmodel = function() {


var self = this;


self.userSearch = ko.observable("");
self.venues = ko.observableArray(venues);
this.currentVenue = ko.observable(self.venues()[0]);
this.setVenue = function(clickedVenue) {
  self.currentVenue(clickedVenue);
  google.maps.event.trigger(clickedVenue.marker, 'click');
};



self.filterVenues = ko.computed(function (venue) {
  var search = self.userSearch().toLowerCase();

  if (!search) {
    return self.venues();

  } else {
    return ko.utils.arrayFilter(self.venues(), function(venue) {
    if (venue.name.toLowerCase().indexOf(search) !== -1) {
      venue.marker.setVisible(true);
      return true;
    } else {
      venue.marker.setVisible(false);
      return false;

    }


    });
   }


});
};







//Map Initializer

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.446855, lng: -80.0056666},
    zoom: 14,
    mapTypeId: 'satellite'
  });


    createMarker();




ko.applyBindings(new viewmodel());



}
