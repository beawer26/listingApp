import {initGmap} from '../Common/map-view'
import React from 'react';

class MapView extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidUpdate() {
        $('[data-gmap]').each(initGmap);
    }

    render() {
        return (
            <div id="draw-map">
                <div data-gmap=""  id="map" className="gmap"></div>
                <br />
            </div>

        );
    }

}

export default MapView;