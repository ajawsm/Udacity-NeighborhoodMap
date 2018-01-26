var map;
var marker;
var markers = [];
var markerNames = [];
var wikiURLs = [];
var blackMarker = ('https://www.google.com/mapfiles/marker_black.png');
var yellowMarker = ('https://www.google.com/mapfiles/marker_yellow.png');


var venues = [{
    name: "PNC Park",
    lat: 40.446855,
    lng: -80.0056666,
    marker: '', //Saves the marker data retreived from Google Maps API
    info: '' //Saves the info retreived from Wikipedia
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

//This function interfaces with the Wikipedia API to access the data for each venue's page
function ajaxCall(i) {
  var venue = venues[i];
  wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + venue.name + '&format=json&callback=wikiCallback';

  //Places the Wikipedia URLS in an array. I don't use this, but it might be handy if, say, I wanted to create a hyperlink in the info window that users could click.
  wikiURLs.push(wikiURL);

  $.ajax({
    url: wikiURL,
    dataType: "jsonp",
  })
    .done(function(data) {
      text = data[2];
      //Gets the first entry only
      venues[i].info = text[0];

      //If no data is available, provides an error message.
      if (venue.info === undefined) {
        venue.info = 'Whoops! Our data never showed up. Check out ' + venue.name + ' on Wikipedia for more!';
      }
      //generates a map marker for each venue location
      marker = new google.maps.Marker({
        position: {
          lat: venue.lat,
          lng: venue.lng
        },
        icon: blackMarker,
        map: map,
        name: venue.name,
        draggable: false,
        content: '<h2>' + venue.name + '</h2><p>' + venue.info + '</p>',
        visible: true
      });

      //pushes the marker to the markers array, saves the marker property of each venue with the appropriate marker data.
      markers.push(marker);
      venue.marker = marker;
      markerNames.push(marker.name);

      //sets the infowindow content
      infowindow = new google.maps.InfoWindow({
        content: this.content
      });

      //creates a click event that changes the marker color.
      marker.addListener('click', function() {
        infowindow.setContent(this.content);
        infowindow.open(map, this);
        for (var i = 0; i < markers.length; i++) {
          markers[i].setIcon(blackMarker);
        }
        this.setIcon(yellowMarker);

      });

    })

    .fail(function(){
    alert('Something went wrong!');

    });
  }



//capturing locations and names in arrays as we iterate through createMarker function
//marker creator
//Thanks to the StackOverflow community for their troubleshooting support. I was also able to accomplish this all in the ajaxCall function using an IIFE, but I liked this approach better.
//https://stackoverflow.com/questions/46259764/google-maps-wikipedia-ajax-call-for-loop-issue
function createMarker(venue) {
  for (var i = 0; i < venues.length; i++) {
    ajaxCall(i);

  }
}

//The View Model
var viewmodel = function() {
  var self = this;

  //turns the data entered by the user into a KO Observable
  self.userSearch = ko.observable("");

  //Converts the venue array to an observable array
  self.venues = ko.observableArray(venues);

  //Sets the current venue, so that the appropriate infowindow, etc., open on user click
  this.currentVenue = ko.observable(self.venues()[0]);
  this.setVenue = function(clickedVenue) {
    self.currentVenue(clickedVenue);
    google.maps.event.trigger(clickedVenue.marker, 'click');
  };

  //The filter, filters the list and marker visibility based on the user's entry
  //This tutorial was very helpful with filters: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html

  self.filterVenues = ko.computed(function(venue) {
    //creates a variable that converts the user entered data to lowercase, which is necessary for the filter functionality
    var search = self.userSearch().toLowerCase();
    //Uses the KO filter utility to return the appropriate markers and list items, based on the user search.
    return ko.utils.arrayFilter(self.venues(), function(venue) {

      if (!search) {
        //If there is no search, set all markers to be visible and return the entire venue list
        for (marker in markers) {
          venue.marker.setVisible(true);
          return true;
        }
        return self.venues();
      }
      //Otherwise check the user entered data and match it using indexOf, returning only the appropriate list items and venue names.
      //Attribution: https://www.w3schools.com/jsref/jsref_indexof.as
      else if (venue.name.toLowerCase().indexOf(search) !== -1) {
        venue.marker.setVisible(true);
        return true;
      } else {
        venue.marker.setVisible(false);
        return false;
      }
    });

  }, self);
};




//Map Initializer
//Attribution: The Google Team's Tutorial within the Udacity Coursework
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 40.439593,
      lng: -79.989338,
    },
    zoom: 14,
    mapTypeId: 'satellite',

  });

  //Invocates createMarker function
  createMarker();

  //creates a new View Model.
  ko.applyBindings(new viewmodel());

}

//Alerts user that Google Maps didn't load
function mapError() {
  alert("We're sorry. Google Maps did not load!");
}
