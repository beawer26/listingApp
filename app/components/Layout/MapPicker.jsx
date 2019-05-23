import {initGmap} from '../Common/geolocation-picker'
import React from 'react';

class MapPicker extends React.Component {
    componentDidUpdate() {
        $('[data-gmap]').each(initGmap);
    }

    render() {
        return (
            <div id="draw-map">
            <div id="panel">
                <br />
                <div className="text-right">
                    <button id="delete-button" className="btn btn-danger">Delete Selected Shape</button>
                </div>
                <br />
            </div>
            <div data-gmap=""  id="map" className="gmap"></div>
                <label>Select the area you wish to search by clicking on the map and circling the area you wish searched</label>
                <br />
                <br />
            </div>

        );
    }

}

export default MapPicker;