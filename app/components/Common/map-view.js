export function initGmap() {

    var map;
    var placeMarkers = [];
    var input;

    initialize()
    google.maps.event.addDomListener(window, "resize", resizingMap());

    function initialize() {
        document.getElementById('test').style = 'font-color:red';
        if(!map) {
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 8,
                center: new google.maps.LatLng(24.8998373, 91.8258764),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: false,
                zoomControl: true
            });
        }
        resizingMap()
        var coords = localStorage.getItem('coords');
        var shape_type = localStorage.getItem('shape_type');
        if(coords) {
            var shape_coords = [];
            console.log(shape_type)
            var shape_view;
            var latLng = coords.split(",");
            var bounds = new google.maps.LatLngBounds();
            var polyOptions = {
                strokeWeight: 0,
                fillOpacity: 0.45,
                editable: true,
                strokeColor: '#1E90FF',
                fillColor: '#1E90FF'
            };
            if (shape_type == 'circle') {

            }
            else if (shape_type == 'polygon') {
                for (var i = 0; i < latLng.length; i += 2) {
                    shape_coords.push({
                        lat: parseFloat(latLng[i]),
                        lng: parseFloat(latLng[i + 1])
                    });

                }
                for (var i = 0; i < shape_coords.length; i++) {
                    //bounds.extend(parseFloat(shape_coords[i]));
                }
                // shape_view = new google.maps.Polygon({
                //     paths: shape_coords,
                //     strokeWeight: 0,
                //     fillOpacity: 0.45,
                //     editable: true,
                //     strokeColor: '#1E90FF',
                //     fillColor: '#1E90FF'
                // });
            }

            console.log(map)
            //shape_view.setMap(map);
            localStorage.removeItem('coords');
            localStorage.removeItem('shape_type');
        }

    }
    function resizingMap() {
        if(typeof map =="undefined") return;
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    }

}