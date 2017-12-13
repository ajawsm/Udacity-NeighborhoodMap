function createwikiURL(){
  wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' +venues[i].name+ '&format=json&callback=wikiCallback';
  wikiURLs.push(wikiURL);
}

function getWiki () {
  $.ajax ({
      url: wikiURL,
      dataType: "jsonp",
      success: function(data){
            text = data[2];
            venueInfo = text[0];
            console.log(venueInfo);
            marker = new google.maps.Marker({
              position: {lat: venues[i].lat, lng: venues[i].lng},
              map: map,
              draggable: false,
              content: '<h2>'+venues[i].name+'</h2> <p>'+venueInfo+'</p>'
              });

              markerNames.push(venues[i].name);
              markers.push(marker);


          infowindow = new google.maps.InfoWindow({
                content: this.content
              });



            marker.addListener('click', function(){
              infowindow.setContent(this.content);
              infowindow.open(map, this);
            });
      }
    });
}

function createMarker(){
  for (i =0; i<= venues.length; i++){
  createwikiURL();
  getWiki();
}
}

/*
function setMarker() {
  marker = new google.maps.Marker({
    position: {lat: venues[i].lat, lng: venues[i].lng},
    map: map,
    draggable: false,
    content: '<h2>'+venues[i].name+'</h2> <p>'+venueInfo+'</p>'
    });

    markerNames.push(venues[i].name);
    markers.push(marker);


infowindow = new google.maps.InfoWindow({
      content: this.content
    });



  marker.addListener('click', function(){
    infowindow.setContent(this.content);
    infowindow.open(map, this);
  });
}

function createMarker(){
  for (i =0; i<= venues.length; i++){
  createwikiURL();
  getWiki();
  setMarker();
}
}



function createwikiURL(){
  wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' +venues[i].name+ '&format=json&callback=wikiCallback';
  wikiURLs.push(wikiURL);
}

function getWiki () {
  $.ajax ({
      url: wikiURL,
      dataType: "jsonp",
      success: function(data){
            text = data[2];
            venueInfo = text[0];
            console.log(venueInfo);
      }
    });
}

function setMarker() {
  marker = new google.maps.Marker({
    position: {lat: venues[i].lat, lng: venues[i].lng},
    map: map,
    draggable: false,
    content: '<h2>'+venues[i].name+'</h2> <p>'+venueInfo+'</p>'
    });

    markerNames.push(venues[i].name);
    markers.push(marker);


infowindow = new google.maps.InfoWindow({
      content: this.content
    });



  marker.addListener('click', function(){
    infowindow.setContent(this.content);
    infowindow.open(map, this);
  });
}

function createMarker(){
  for (i =0; i<= venues.length; i++){
  createwikiURL();
  getWiki();
  setMarker();
}
}
*/
