
/*****************************************************************************/
/* MapDemoIndex: Lifecycle Hooks */
/*****************************************************************************/

Template.mapCanvas.rendered = function () {
    var tmpl = this;
    var searchInput = this.$('#address');

    VazcoMaps.init({}, function() {

        // gMaps.js plugin usage [ http://hpneo.github.io/gmaps/ ]

        tmpl.mapEngine = VazcoMaps.gMaps();

        tmpl.newMap = new tmpl.mapEngine({
            div: '#map-canvas',
            lat: 52.22968,
            lng: 21.01223
        });

        tmpl.newMap.addMarker({
          lat: 52.22968,
          lng: 21.01223,
          draggable: true,
          dragend: function() {
            var point = this.getPosition();
            tmpl.mapEngine.geocode({location: point, callback: function(results) {
              searchInput.val(results[0].formatted_address);
              tmpl.newMap.setCenter(results[0].geometry.location.lat(), results[0].geometry.location.lng());
            }});
          }
        });

        // or standard google maps api
        // var mapOptions = {
        //     zoom: 13
        // };
        // tmpl.newMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    });

};

Template.mapCanvas2.rendered = function () {
    var tmpl = this;

    VazcoMaps.init({}, function() {

        tmpl.mapEngine = VazcoMaps.gMaps();

        tmpl.newMap2 = new tmpl.mapEngine({ 
            div: '#map-canvas2',
            lat: 51.10789,
            lng: 17.03854,
            zoom: 6
        });

        tmpl.newMap2.drawRoute({
          origin: [51.10789, 17.03854],
          destination: [52.22968, 21.01223],
          travelMode: 'driving',
          strokeColor: '#131540',
          strokeOpacity: 0.6,
          strokeWeight: 6
        });

    });

};

Template.mapCanvas3.rendered = function () {
    var tmpl = this;

    VazcoMaps.init({}, function() {

        tmpl.mapEngine = VazcoMaps.gMaps();

        tmpl.newMap3 = new tmpl.mapEngine({ 
            div: '#map-canvas3',
            lat: -12.043333,
            lng: -77.028333
        });

        tmpl.newMap3.addControl({
          position: 'top_center',
          content: 'Go to Wrocław!',
          style: {
            margin: '10px',
            padding: '1px 6px',
            fontSize: '16px',
            border: 'solid 1px #717B87',
            background: '#fff'
          },
          events: {
            click: function(){
              tmpl.mapEngine.geocode({
                address: "Wrocław",
                callback: function(results, status) {
                  tmpl.newMap3.removeMarkers();
                  if (status == 'OK') {
                    var latlng = results[0].geometry.location;
                    tmpl.newMap3.setCenter(latlng.lat(), latlng.lng());
                    tmpl.newMap3.addMarker({
                      lat: latlng.lat(),
                      lng: latlng.lng(),
                      draggable: true,
                      dragstart: function() {
                        console.log('drag started');
                      },
                      dragend: function() {
                        console.log('drag end')
                      }
                    });
                  } else {
                    console.log(status);
                  }
                }
              });
            }
          }
        });

    });

};


/*****************************************************************************/
/* MapDemoIndex: Event Handlers and Helpers */
/*****************************************************************************/
Template.mapCanvas.events({
  'submit form': function(e, tmpl) {
      e.preventDefault();
      var searchInput = $(e.target).find('#address');
      tmpl.newMap.removeMarkers();
      tmpl.mapEngine.geocode({
        address: searchInput.val(),
        callback: function(results, status) {
          if (status == 'OK') {
            var latlng = results[0].geometry.location;
            tmpl.newMap.setCenter(latlng.lat(), latlng.lng());
            tmpl.newMap.addMarker({
              lat: latlng.lat(),
              lng: latlng.lng(),
              draggable: true,
              dragend: function() {
                var point = this.getPosition();
                tmpl.mapEngine.geocode({location: point, callback: function(results) {
                  searchInput.val(results[0].formatted_address);
                  tmpl.newMap.setCenter(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                }});
              }
            });
            searchInput.val(results[0].formatted_address);
          } else {
            console.log(status);
          }
        }
      });
  }
});
