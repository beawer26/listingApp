export function initGmap(callback) {
    var drawingManager;
    var selectedShape;
    var oldShape;
    var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
    var selectedColor;
    var colorButtons = {};
    var posstr;
    var pathstr;
    var cntrstr;
    var radstr;
    var bndstr;
    var cntstr;

    function updateCoords(shape, shape_type){
        var coords = [];
        localStorage.removeItem('coords');
        localStorage.removeItem('shape_type');

        if (shape_type == 'circle') {
            coords.push(shape.getCenter().toUrlValue());
            coords.push(shape.getRadius());
            localStorage.setItem('shape_type', shape_type);
        }
        else{
            for (var i = 0; i < shape.getPath().getLength(); i++) {
                coords.push(shape.getPath().getAt(i).toUrlValue());
                localStorage.setItem('shape_type', shape_type);
            }
        }
        localStorage.setItem('coords', coords);

    }

    function clearSelection() {
        if (selectedShape) {
            if (typeof selectedShape.setEditable == 'function') {
                selectedShape.setEditable(false);
            }
            selectedShape = null;
        }
    }

    function updateCurSelText(shape) {
        posstr = "" + selectedShape.position;
        if (typeof selectedShape.position == 'object') {
            posstr = selectedShape.position.toUrlValue();
        }
        pathstr = "" + selectedShape.getPath;
        if (typeof selectedShape.getPath == 'function') {
            pathstr = "[ ";
            for (var i = 0; i < selectedShape.getPath().getLength(); i++) {
                // .toUrlValue(5) limits number of decimals, default is 6 but can do more
                pathstr += selectedShape.getPath().getAt(i).toUrlValue() + " , ";
            }
            pathstr += "]";
        }
        bndstr = "" + selectedShape.getBounds;
        cntstr = "" + selectedShape.getBounds;
        if (typeof selectedShape.getBounds == 'function') {
            var tmpbounds = selectedShape.getBounds();
            cntstr = "" + tmpbounds.getCenter().toUrlValue();
            bndstr = "[NE: " + tmpbounds.getNorthEast().toUrlValue() + " SW: " + tmpbounds.getSouthWest().toUrlValue() + "]";
        }
        cntrstr = "" + selectedShape.getCenter;
        if (typeof selectedShape.getCenter == 'function') {
            cntrstr = "" + selectedShape.getCenter().toUrlValue();
        }
        radstr = "" + selectedShape.getRadius;
        if (typeof selectedShape.getRadius == 'function') {
            radstr = "" + selectedShape.getRadius();
        }
    }

    function setSelection(shape, isNotMarker) {
        clearSelection();

        selectedShape = shape;
        if (isNotMarker)
            shape.setEditable(true);


        updateCurSelText(shape);
    }

    function deleteSelectedShape(e) {
        e.preventDefault()
        if (selectedShape) {
            selectedShape.setMap(null);
            localStorage.removeItem('coords');
            localStorage.removeItem('shape_type');
        }
    }

/////////////////////////////////////
    var map; //= new google.maps.Map(document.getElementById('map'), {
// these must have global refs too!:
    var placeMarkers = [];
    var input;

    function deletePlacesSearchResults() {
        for (var i = 0, marker; marker = placeMarkers[i]; i++) {
            marker.setMap(null);
        }
        placeMarkers = [];
        input.value = ''; // clear the box too
    }

    initialize()

/////////////////////////////////////
    function initialize() {

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 9,
            center: new google.maps.LatLng(34.1144744, -118.3775139),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: false,
            zoomControl: true
        });
        var coords = localStorage.getItem('coords');
        var shape_type = localStorage.getItem('shape_type');
        if(coords) {
            var shape_coords = [];
            var shape_view;
            var temp_bounds = new google.maps.LatLngBounds();
            var latLng = coords.split(",");
            var bounds = new google.maps.LatLngBounds();
            var isNotMarker = (google.maps.drawing.OverlayType.MARKER);
            var polyOptions = {
                strokeWeight: 0,
                fillOpacity: 0.45,
                editable: true,
                strokeColor: '#1E90FF',
                fillColor: '#1E90FF'
            };
            if (shape_type == 'circle') {
                bounds = new google.maps.LatLng(parseFloat(latLng[0]), parseFloat(latLng[1]))
                shape_coords = parseFloat(latLng[2]);
                shape_view = new google.maps.Circle({
                    center: bounds,
                    radius: shape_coords,
                    strokeWeight: 0,
                    fillOpacity: 0.45,
                    editable: true,
                    strokeColor: '#1E90FF',
                    fillColor: '#1E90FF'
                });
                selectedShape = shape_view
                oldShape = shape_view;
                shape_view.setMap(map)
                map.setCenter(bounds);
                google.maps.event.addListener(shape_view, 'click', function () {
                    setSelection(shape_view, isNotMarker);
                });
                google.maps.event.addListener(shape_view, 'drag', function () {
                    updateCoords(shape_view, 'circle');
                });
                google.maps.event.addListener(shape_view, 'dragend', function () {
                    updateCoords(shape_view, 'circle');
                });
                shape_view.addListener('bounds_changed', function () {
                    updateCoords(shape_view, 'circle');
                });

            }
            else if (shape_type == 'polygon') {
                for (var i = 0; i < latLng.length; i += 2) {
                    shape_coords.push(new google.maps.LatLng(parseFloat(latLng[i]), parseFloat(latLng[i+1])))

                }
                for (var i = 0; i < shape_coords.length; i++) {
                    temp_bounds.extend(shape_coords[i]);
                }
                bounds = temp_bounds.getCenter();
                shape_view = new google.maps.Polygon({
                    paths: shape_coords,
                    bounds: shape_coords,
                    strokeWeight: 0,
                    fillOpacity: 0.45,
                    editable: true,
                    strokeColor: '#1E90FF',
                    fillColor: '#1E90FF'
                });
                selectedShape = shape_view;
                oldShape = shape_view;
                shape_view.setMap(map)
                map.setCenter(bounds);
                google.maps.event.addListener(shape_view, 'click', function () {
                    setSelection(shape_view, isNotMarker);
                });
                google.maps.event.addListener(shape_view, 'drag', function () {
                    updateCoords(shape_view, 'polygon');
                });
                google.maps.event.addListener(shape_view, 'dragend', function () {
                    updateCoords(shape_view, 'polygon');
                });
                google.maps.event.addListener(shape_view.getPath(), 'insert_at', function(index, obj) {
                    updateCoords(shape_view, 'polygon');
                });
                google.maps.event.addListener(shape_view.getPath(), 'set_at', function(index, obj) {
                    updateCoords(shape_view, 'polygon');
                });

            }

        }
        else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    map.setCenter(pos);
                })
            }
        }

        var polyOptions = {
            strokeWeight: 0,
            fillOpacity: 0.45,
            editable: true,
            strokeColor: '#1E90FF',
            fillColor: '#1E90FF'
        };

        drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControlOptions: {
                drawingModes: ['circle', 'polygon']
            },
            markerOptions: {
                draggable: true,
                editable: true,
            },
            polylineOptions: {
                editable: true
            },
            rectangleOptions: polyOptions,
            circleOptions: polyOptions,
            polygonOptions: polyOptions,
            map: map
        });
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
            //~ if (e.type != google.maps.drawing.OverlayType.MARKER) {
            var isNotMarker = (e.type != google.maps.drawing.OverlayType.MARKER);
            // Switch back to non-drawing mode after drawing a shape.
            drawingManager.setDrawingMode(null);

            var newShape = e.overlay;
            newShape.type = e.type;
            if (oldShape) {
                oldShape.setMap(null);
            }
            oldShape = newShape;
            google.maps.event.addListener(newShape, 'click', function () {
                setSelection(newShape, isNotMarker);
            });
            google.maps.event.addListener(newShape, 'drag', function () {
                updateCoords(newShape);
            });

            google.maps.event.addListener(newShape, 'dragend', function () {
                updateCoords(newShape);
            });
            if(newShape.type == 'circle'){
                newShape.addListener('bounds_changed', function () {
                    updateCoords(newShape, 'circle');
                });
            }
            else {

                google.maps.event.addListener(newShape.getPath(), 'insert_at', function (index, obj) {
                    updateCoords(newShape, 'polygon');
                });
                google.maps.event.addListener(newShape.getPath(), 'set_at', function (index, obj) {
                    updateCoords(newShape, 'polygon');
                });
            }
            updateCoords(newShape, newShape.type)
            setSelection(newShape, isNotMarker);
            //~ }// end if
        });
        // Clear the current selection when the drawing mode is changed, or when the
        // map is clicked.
        google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
        google.maps.event.addListener(map, 'click', clearSelection);
        google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);
        //~ initSearch();
        // Create the search box and link it to the UI element.

        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
        //
        var DelPlcButDiv = document.createElement('div');
        //~ DelPlcButDiv.style.color = 'rgb(25,25,25)'; // no effect?
        DelPlcButDiv.style.backgroundColor = '#fff';
        DelPlcButDiv.style.cursor = 'pointer';
        DelPlcButDiv.innerHTML = 'DEL';
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(DelPlcButDiv);
        google.maps.event.addDomListener(DelPlcButDiv, 'click', deletePlacesSearchResults);

        // Bias the SearchBox results towards places that are within the bounds of the
        // current map's viewport.
        //////////////////
    }

}