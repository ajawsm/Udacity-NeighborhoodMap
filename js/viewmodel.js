
for (i = 0; i <= venues.length; i++) {
  new google.maps.Marker({
    draggable: false,
    position: {lat: this.lat, lng: this.lng}
  })
}
