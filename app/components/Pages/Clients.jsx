import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import {Link, History, Redirect} from 'react-router-dom';
import {Panel, Table, Tabs, Tab, Modal, FormControl, Button, InputGroup} from 'react-bootstrap';
import { withGoogleMap, GoogleMap, Marker, Polygon, Circle } from "react-google-maps"
import SweetAlert from 'sweetalert2-react';
import Http from '../../utils/http'
import Select from 'react-select';
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'


class Clients extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: '',
            loading: true,
            updated: true,
            key: 1,
            new_key: '',
            currentLoc: '',
            id:'',
            profile: '',
            subscription: '',
            sms_msg:'',
            buyers_msg:'',
            clients_id: '',
            cities:'',
            subdivisions: '',
            selectedCity: null,
            loadingSub: true,
            isMarkerShown: true,
            credentials:{
                name:'',
                email:'',
                phone:'',
                min_price:'',
                max_price:'',
                min_beds: '',
                max_beds: '',
                min_baths: '',
                max_baths: '',
                type:'',
                city:'',
                user_id:'',
                subdivision:'',
                street:'',
                fireplace:'',
                closet:'',
                vault:'',
                min_parking:'',
                max_parking: '',
                master_bedroom:'',
                min_year:'',
                max_year: '',
                min_lot:'',
                max_lot: '',
                min_living:'',
                max_living: '',
                min_floor: '',
                max_floor: '',
                status: '',
                keyword: '',
                location:'',
                county: '',
                shape_type:'',
                center:''
            }
        }

        this.handleDelete = this.handleDelete.bind(this)
        this.open = this.open.bind(this)


    }

    componentDidMount(){
        this.setState({
            isMounted: true
        })
    }

    componentWillUnmount(){
        this.setState({
            isMounted: false,
            updated: false,
        })
    }

    componentDidUpdate() {
        const user = localStorage.getItem('user_id');
        $('.chosen-select').chosen();
        if (this.state.updated == true) {
            $('#check_all').prop('checked', false);

            Http.get('buyers/' + user)
                .then(res => {
                    let client_list = [];
                    let length = res['data'].length
                    let profile = res['data'][length-2];
                    delete res['data'][length-2]
                    let subscription = res['data'][length-1];
                    delete res['data'][length-1]
                    res['data'].map((clients, index) => {
                        let field_counter = 0;
                        Object.keys(clients).map(function (objectKey, index) {

                            if (clients[objectKey] !== null && clients[objectKey] !== 0) {
                                field_counter++;
                            }
                        });
                        let new_arr = []
                        new_arr['id'] = clients['id'];
                        new_arr['user_id'] = clients['user_id']
                        new_arr['email'] = clients['email']
                        new_arr['phone'] = clients['phone']
                        new_arr['name'] = clients['name']
                        let name = clients['name'].split(" ")
                        new_arr['first_name'] = name[0]
                        new_arr['second_name'] = name[1]
                        let x = field_counter / Object.keys(clients).length * 100
                        new_arr['profile'] = x % 5 < 3 ? (x % 5 === 0 ? x : Math.floor(x / 5) * 5) : Math.ceil(x / 5) * 5;
                        new_arr['type'] = clients['type'];
                        new_arr['min_price'] = clients['min_price']
                        new_arr['max_price'] = clients['max_price']
                        new_arr['min_beds'] = clients['min_beds']
                        new_arr['max_beds'] = clients['max_beds']
                        new_arr['min_baths'] = clients['min_baths']
                        new_arr['max_baths'] = clients['max_baths']
                        new_arr['city'] = clients['city']
                        new_arr['subdivision'] = clients['subdivision']
                        new_arr['street'] = clients['street']
                        new_arr['fireplace'] = clients['fireplace']
                        new_arr['closet'] = clients['closet']
                        new_arr['vault'] = clients['vault']
                        new_arr['min_parking'] = clients['min_parking']
                        new_arr['max_parking'] = clients['max_parking']
                        new_arr['master_bedroom'] = clients['master_bedroom']
                        new_arr['min_lot'] = clients['min_lot']
                        new_arr['max_lot'] = clients['max_lot']
                        new_arr['min_living'] = clients['min_living']
                        new_arr['max_living'] = clients['max_living']
                        new_arr['min_floor'] = clients['min_floor']
                        new_arr['max_floor'] = clients['max_floor']
                        new_arr['min_year'] = clients['min_year']
                        new_arr['max_year'] = clients['max_year']
                        new_arr['status'] = clients['status']
                        new_arr['keyword'] = clients['keyword']
                        new_arr['county'] = clients['county']
                        new_arr['location'] = clients['location']
                        new_arr['shape_type'] = clients['shape_type']

                        client_list[clients['id']] = new_arr;
                    })
                    Http.get('get-cities')
                        .then(res => {
                            this.setState({
                                cities: res['data']
                            })
                        })
                        .catch(err => {

                        })
                    if(this.state.isMounted == true) {
                        this.setState({
                            data: client_list,
                            loading: false,
                            updated: false,
                            profile: profile,
                            subscription: subscription
                        });
                    }
                })
                .catch((err) => {

                })
        }
    }

    handleDelete(e) {
        let id= this.state.clients_id;
        Http.post('buyers-delete/'+id)
            .then(res => {
                this.setState({updated: true,
                    show_del: false})
            })
    }



    open(e) {
        const id = e.target.parentElement.parentElement.id;
        let min_year="";
        let max_year="";
        let min_parking="";
        let max_parking=""
        let min_lot="";
        let max_lot=""
        let min_living="";
        let max_living=""
        let min_floor="";
        let max_floor
        let street = "";
        let type_array = [];
        let status = "";
        let keyword = "";
        let county = "";
        let city = [];
        let subdivision = [];
        let key = '';
        let location = "";
        let currentLoc = '';
        let shape_type=''

        $.each(this.state.data[id].type.split("|"), function(i,e){
            type_array.push(e)
        });
        if(this.state.data[id].min_parking == null){
            min_parking = ''
        }
        else{
            min_parking = this.state.data[id].min_parking
        }
        if(this.state.data[id].max_parking == null){
            max_parking = ''
        }
        else{
            max_parking = this.state.data[id].max_parking
        }
        if(this.state.data[id].min_year == null){
            min_year = ''
        }
        else{
            min_year = this.state.data[id].min_year
        }
        if(this.state.data[id].max_year == null){
            max_year = ''
        }
        else{
            max_year = this.state.data[id].max_year
        }
        if(this.state.data[id].min_lot == null){
            min_lot = ''
        }
        else{
            min_lot = this.state.data[id].min_lot
        }
        if(this.state.data[id].max_lot == null){
            max_lot = ''
        }
        else{
            max_lot = this.state.data[id].max_lot
        }
        if(this.state.data[id].min_living == null){
            min_living = ''
        }
        else{
            min_living = this.state.data[id].min_living
        }
        if(this.state.data[id].max_living == null){
            max_living = ''
        }
        else{
            max_living = this.state.data[id].max_living
        }
        if(this.state.data[id].min_floor == null){
            min_floor = ''
        }
        else{
            min_floor = this.state.data[id].min_floor
        }
        if(this.state.data[id].max_floor == null){
            max_floor = ''
        }
        else{
            max_floor = this.state.data[id].max_floor
        }
        if(this.state.data[id].street == null){
            street = ''
        }
        else{
            street = this.state.data[id].street
        }
        if(this.state.data[id].subdivision == null){
            subdivision = ''
        }
        else{
            subdivision.push({
                "label":this.state.data[id].subdivision,
                "value":this.state.data[id].subdivision
            })
        }
        if(this.state.data[id].status == null){
            status = ''
        }
        else{
            status = this.state.data[id].status
        }
        if(this.state.data[id].keyword == null){
            keyword = ''
        }
        else{
            keyword = this.state.data[id].keyword
        }
        if(this.state.data[id].county == null){
            county = ''
        }
        else{
            county = this.state.data[id].county
        }
        if(this.state.data[id].city == null){
            city = ''
        }
        else {
            city.push({
                "label": this.state.data[id].city,
                "value": this.state.data[id].city
            })
            key = 'city'
        }
        if(this.state.data[id].location == null){
            location = [];
            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(function(position) {
                        currentLoc = {

                            lat: position.coords.latitude,
                            lng: position.coords.longitude

                        }
                    }
                )
            } else {
                error => console.log(error)
            }
        }
        else{
            location = JSON.parse(this.state.data[id].location)
            currentLoc = location[0]
            key = 'map'
        }
        Http.get('get-subdivision/'+this.state.data[id].city)
            .then(res => {

                this.setState({
                    credentials:{
                        name: this.state.data[id].name,
                        email: this.state.data[id].email,
                        phone: this.state.data[id].phone,
                        min_price: this.state.data[id].min_price,
                        max_price: this.state.data[id].max_price,
                        min_beds: this.state.data[id].min_beds,
                        max_beds: this.state.data[id].max_beds,
                        min_baths: this.state.data[id].min_baths,
                        max_baths: this.state.data[id].max_baths,
                        type: type_array,
                        user_id: this.state.data[id].user_id,
                        street: street,
                        fireplace: this.state.data[id].fireplace,
                        closet: this.state.data[id].closet,
                        vault: this.state.data[id].vault,
                        min_parking: min_parking,
                        max_parking: max_parking,
                        master_bedroom: this.state.data[id].master_bedroom,
                        min_year: min_year,
                        max_year: max_year,
                        min_lot: min_lot,
                        max_lot: max_lot,
                        min_living: min_living,
                        max_living: max_living,
                        min_floor: min_floor,
                        max_floor: max_floor,
                        status: status,
                        keyword: keyword,
                        county: county,
                        location: location
                    },
                    showModal: true,
                    selectedCity: city,
                    selectedSubdivision: subdivision,
                    subdivisions: res['data'],
                    id: id,
                    new_key: key,
                    currentLoc: currentLoc
                });
            })

    }





    openInfo(e)
    {
        const id = e.target.parentElement.parentElement.id
        let min_year="";
        let max_year="";
        let min_parking="";
        let max_parking=""
        let min_lot="";
        let max_lot="";
        let min_living="";
        let max_living="";
        let min_floor="";
        let max_floor="";
        let fireplace="";
        let closet="";
        let vault="";
        let street="";
        let master_bedroom="";
        let subdivision="";
        let status = "";
        let keyword = "";
        let county = "";
        let city = "";
        let location = "";
        let shape_coords=[];
        let temp_bounds = new google.maps.LatLngBounds();
        let bounds;
        let latLng = [];
        let shape_type = '';
        if(this.state.data[id].city == null){
            city = 'Unset'
        }
        else{
            city = this.state.data[id].city
        }
        if(this.state.data[id].location == null){
            shape_coords = 'Unset'
        }
        else{
            latLng = this.state.data[id].location.split(",");
            shape_type = this.state.data[id].shape_type;
            if(this.state.data[id].shape_type == 'polygon'){
                for (var i = 0; i < latLng.length; i += 2) {
                    shape_coords.push(new google.maps.LatLng(parseFloat(latLng[i]), parseFloat(latLng[i+1])))
                             }

                for (var i = 0; i < shape_coords.length; i++) {
                    temp_bounds.extend(shape_coords[i]);
                }
                bounds = temp_bounds.getCenter();
            }
            else if(this.state.data[id].shape_type == 'circle'){
                bounds = new google.maps.LatLng(parseFloat(latLng[0]), parseFloat(latLng[1]))
                shape_coords = parseFloat(latLng[2]);
            }

        }
        if(this.state.data[id].min_parking == null){
            min_parking = 'Unset'
        }
        else{
            min_parking = this.state.data[id].min_parking
        }
        if(this.state.data[id].max_parking == null){
            max_parking = 'Unset'
        }
        else{
            max_parking = this.state.data[id].max_parking
        }
        if(this.state.data[id].street == null){
            street = 'Unset'
        }
        else{
            street = this.state.data[id].street
        }
        if(this.state.data[id].subdivision == null){
            subdivision = 'Unset'
        }
        else{
            subdivision = this.state.data[id].subdivision
        }
        if(this.state.data[id].status == null){
            status = 'Unset'
        }
        else{
            status = this.state.data[id].status
        }
        if(this.state.data[id].keyword == null){
            keyword = 'Unset'
        }
        else{
            keyword = this.state.data[id].keyword
        }
        if(this.state.data[id].county == null){
            county = 'Unset'
        }
        else{
            county = this.state.data[id].county
        }
        if(this.state.data[id].master_bedroom == null){
            master_bedroom = 'Unset'
        }
        else{
            master_bedroom = this.state.data[id].master_bedroom
        }
        if(this.state.data[id].min_year == null){
            min_year = 'Unset'
        }
        else{
            min_year = this.state.data[id].min_year
        }
        if(this.state.data[id].max_year == null){
            max_year = 'Unset'
        }
        else{
            max_year = this.state.data[id].max_year
        }
        if(this.state.data[id].min_lot == null){
            min_lot = 'Unset'
        }
        else{
            min_lot = this.state.data[id].min_lot
        }
        if(this.state.data[id].max_lot == null){
            max_lot = 'Unset'
        }
        else{
            max_lot = this.state.data[id].max_lot
        }
        if(this.state.data[id].min_living == null){
            min_living = 'Unset'
        }
        else{
            min_living = this.state.data[id].min_living
        }
        if(this.state.data[id].max_living == null){
            max_living = 'Unset'
        }
        else{
            max_living = this.state.data[id].max_living
        }
        if(this.state.data[id].min_floor == null){
            min_floor = 'Unset'
        }
        else{
            min_floor = this.state.data[id].min_floor
        }
        if(this.state.data[id].max_floor == null){
            max_floor = 'Unset'
        }
        else{
            max_floor = this.state.data[id].max_floor
        }
        if(this.state.data[id].fireplace == 0){
            fireplace = 'Unset'
        }
        else{
            fireplace = "True"
        }
        if(this.state.data[id].closet == 0){
            closet = 'Unset'
        }
        else{
            closet = "True"
        }
        if(this.state.data[id].vault == 0){
            vault = 'Unset'
        }
        else{
            vault = "True"
        }
        let min_price = '$'+this.state.data[id].min_price.toLocaleString('en', {maximumFractionDigits:2})
        let max_price = '$'+this.state.data[id].max_price.toLocaleString('en', {maximumFractionDigits:2})
        this.setState({
            credentials:{
                name: this.state.data[id].name,
                email: this.state.data[id].email,
                phone: this.state.data[id].phone,
                min_price: min_price,
                max_price: max_price,
                min_beds: this.state.data[id].min_beds,
                max_beds: this.state.data[id].max_beds,
                min_baths: this.state.data[id].min_baths,
                max_baths: this.state.data[id].max_baths,
                type: this.state.data[id].type,
                city: city,
                user_id: this.state.data[id].user_id,
                subdivision: subdivision,
                street: street,
                fireplace: fireplace,
                closet: closet,
                vault: vault,
                min_parking: min_parking,
                max_parking: max_parking,
                master_bedroom: master_bedroom,
                min_year: min_year,
                max_year: max_year,
                min_lot: min_lot,
                max_lot: max_lot,
                min_living: min_living,
                max_living: max_living,
                min_floor: min_floor,
                max_floor: max_floor,
                status: status,
                keyword: keyword,
                county: county,
                location: shape_coords,
                center: bounds,
                shape_type: shape_type
            },
            showOption: true,
            id: id
        });
    }

    closeInfo(e)
    {
        this.setState({
            showOption: false
        });
    }

    newChange(e)
    {
        e.preventDefault()
    }
    checkFireplace(e)
    {
        if(this.state.credentials.fireplace == true) {
            this.setState({credentials: {...this.state.credentials, fireplace: false}});
        }
        else{
            this.setState({credentials: {...this.state.credentials, fireplace: true}});

        }
    }

    checkCloset(e)
    {
        if(this.state.credentials.closet == true) {
            this.setState({credentials: {...this.state.credentials, closet: false}});
        }
        else{
            this.setState({credentials: {...this.state.credentials, closet: true}});

        }
    }

    checkVault(e)
    {
        if(this.state.credentials.vault == true) {
            this.setState({credentials: {...this.state.credentials, vault: false}});
        }
        else{
            this.setState({credentials: {...this.state.credentials, vault: true}});

        }
    }




    render() {
        let InfoMap;
        if(this.state.credentials.shape_type == 'polygon') {
            InfoMap = withGoogleMap((props) =>
                <GoogleMap
                    defaultZoom={8}
                    defaultCenter={props.center}
                >

                    <Polygon
                        path={props.marks}
                        options={{
                            strokeWeight: 0,
                            fillOpacity: 0.45,
                            strokeColor: '#1E90FF',
                            fillColor: '#1E90FF'
                        }}
                    />

                </GoogleMap>
            )
        }
        else{
            InfoMap = withGoogleMap((props) =>
                <GoogleMap
                    defaultZoom={8}
                    defaultCenter={props.center}
                >


                    <Circle
                        center={props.center}
                        radius={props.marks}
                        options={{
                            strokeWeight: 0,
                            fillOpacity: 0.45,
                            strokeColor: '#1E90FF',
                            fillColor: '#1E90FF'
                        }}
                    />
                </GoogleMap>
            )
        }
        let content;
        let loader;
        let type_array = ['Single Family', 'Condominium', 'Townhouse', 'Apartment'];
        let property;
        let sms;
        let buyers;
        let add_client;
        let sms_used;
        let sms_radial;
        let x;
        let radial;
        let new_phone;
        let city = [];
        let loc;
        let subdivision = [];
        let selectedCity = this.state.selectedCity;
        let selectedSubdivision = this.state.selectedSubdivision;
        const numberMask = createNumberMask({
            prefix: '',
            suffix: '' // This will put the dollar sign at the end, with a space.
        })


        const user = localStorage.getItem('user_id');
        if(user == 1){
            return <Redirect to="/users-list" />
        }
        const status = localStorage.getItem('user_status');
        if(status == false){
            return <Redirect to="/expired" />
        }
        if (this.state.loading) {
            loader =
                <Panel className="loader-demo">
                    <div className="ball-beat">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </Panel>
            content = <tr></tr>
        }
        else {
            add_client = <Link to="new-client" title="New Buyer" className="ml4">
                <button className="btn btn-success">Add new buyer</button>
            </Link>;
            sms_used = this.state.subscription.plan_sms - this.state.profile.sms_left
            x = (sms_used / this.state.subscription.plan_sms) * 100;
            sms_radial = x % 5 < 3 ? (x % 5 === 0 ? x : Math.floor(x / 5) * 5) : Math.ceil(x / 5) * 5;
            sms = <label>{sms_used} from {this.state.subscription.plan_sms} sms used</label>
            radial = <div data-label={sms_radial+'%'} className={"sms-radial radial-bar radial-bar-"+sms_radial+" radial-bar-xs"}></div>


            if(this.state.profile.buyers_left < 3){
                buyers = <p className="text-danger">Warning! You have only {this.state.profile.buyers_left} buyers left!</p>
            }
            if(this.state.profile.buyers_left == 0){
                add_client = '';
                buyers = <p className="text-danger">You can't add new clients for this package! You can upgrade subscription for more clients!</p>
            }
            if(this.state.credentials.location == 'Unset'){
                loc = <p>{this.state.credentials.location}</p>
            }
            else{
                loc = <InfoMap containerElement={<div style={{ height: `400px` }} />}
                               mapElement={<div style={{ height: `100%` }} />}
                               isMarkerShown={this.state.isMarkerShown}
                               marks={this.state.credentials.location}
                                center={this.state.credentials.center}
                shape={this.state.credentials.shape_type}/>
            }
            Object.keys(this.state.cities).map((index, cities) => {
                city.push({
                    "label":this.state.cities[index],
                    "value":this.state.cities[index]
                })
            })
            Object.keys(this.state.subdivisions).map((index, subdivisions) => {
                subdivision.push({
                    "label":this.state.subdivisions[index],
                    "value":this.state.subdivisions[index]
                })
            })
            content = this.state.data.map((clients, index) => {
                new_phone = clients.phone.replace(/\D+/g, '')
                    .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                property = type_array.map((type, index) => {
                    if(type == clients.type){
                        return(
                            <option key={index} value={type}>{type}</option>
                        )
                    }
                    else{
                        return(
                            <option key={index}>{type}</option>
                        )
                    }
                })
                return (
                    <tr key={index} id={clients.id}>
                        <td>{clients.first_name}</td>
                        <td>{clients.second_name}</td>
                        <td><a href={"tel:"+new_phone}>{new_phone}</a></td>
                        <td><a href={"mailto:"+clients.email}>{clients.email}</a></td>
                        <td className="text-center">
                            <button type="button" className="mb-sm mr-sm btn btn-primary btn-outline" onClick={this.openInfo.bind(this)}>View</button>
                            <Modal show={this.state.showOption} key={clients.id} onHide={this.closeInfo.bind(this)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Search Options</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="panel-body">
                                        <label>Location:</label>
                                        {loc}
                                        <label>County:</label>
                                        <p>{this.state.credentials.county}</p>
                                        <label>City:</label>
                                        <p>{this.state.credentials.city}</p>
                                        <label>Subdivision ID or Name:</label>
                                        <p>{this.state.credentials.subdivision}</p>
                                        <label>Street:</label>
                                        <p>{this.state.credentials.street}</p>
                                        <label>Price:</label>
                                        <p>From:&nbsp;{this.state.credentials.min_price}&nbsp;To:&nbsp;{this.state.credentials.max_price}</p>
                                        <label>Beds:</label>
                                        <p>From:&nbsp;{this.state.credentials.min_beds}&nbsp;To:&nbsp;{this.state.credentials.max_beds}</p>
                                        <label>Baths:</label>
                                        <p>From:&nbsp;{this.state.credentials.min_baths}&nbsp;To:&nbsp;{this.state.credentials.max_baths}</p>                                        <label>Property type:</label>
                                        <p>{this.state.credentials.type}</p>
                                        <label>Fireplace:</label>
                                        <p>{this.state.credentials.fireplace}</p>
                                        <label>Walk-In Closet:</label>
                                        <p>{this.state.credentials.closet}</p>
                                        <label>Vaulted Ceiling:</label>
                                        <p>{this.state.credentials.vault}</p>
                                        <label>Location of Master Bedroom:</label>
                                        <p>{this.state.credentials.master_bedroom}</p>
                                        <label>Garage Spaces:</label>
                                        <p>From:&nbsp;{this.state.credentials.min_parking}&nbsp;To:&nbsp;{this.state.credentials.max_parking}</p>
                                        <label>Year built:</label>
                                        <p>From:&nbsp;{this.state.credentials.min_year}&nbsp;To:&nbsp;{this.state.credentials.max_year}</p>
                                        <label>Level/Floor count:</label>
                                        <p>From:&nbsp;{this.state.credentials.min_floor}&nbsp;To:&nbsp;{this.state.credentials.max_floor}</p>                                        <label>Lot size Sqft:</label>
                                        <p>From:&nbsp;{this.state.credentials.min_lot}&nbsp;To:&nbsp;{this.state.credentials.max_lot}</p>
                                        <label>Living Area size Sqft:</label>
                                        <p>From:&nbsp;{this.state.credentials.min_living}&nbsp;To:&nbsp;{this.state.credentials.max_living}</p>
                                        <label>Status:</label>
                                        <p>{this.state.credentials.status}</p>
                                        <label>Keyword:</label>
                                        <p>{this.state.credentials.keyword}</p>

                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={ this.closeInfo.bind(this) }>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        </td>
                        <td className="text-center">
                            <Link to={"edit-buyer/"+clients.id} title="Edit buyer">
                            <button type="button" className="btn btn-primary">Edit</button>
                            </Link>
                        </td>

                        <td className="text-center">
                            <button type="button" id={clients.id} className="btn btn-danger" onClick={() => this.setState({show_del: true, clients_id: clients.id})}>Delete</button>
                            <SweetAlert
                                show={this.state.show_del}
                                title="Delete selected buyer?"
                                showCancelButton
                                onConfirm={this.handleDelete}
                                onCancel={() => {
                                    this.setState({show_del: false});
                                }}
                            />
                        </td>
                    </tr>
                )
            })
            loader = <div></div>


        }
        return (
            <ContentWrapper>
                <div className="panel panel-default">
                    {buyers}
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-md-6 col-xs-6">
                                <h3>Buyers list</h3>
                            </div>
                            <div className="col-md-6 col-xs-6 text-right">
                                <h3>{add_client}</h3>
                            </div>
                        </div>
                        {radial}{sms}
                        <div className="new-bb"></div>
                        <br />
                    </div>
                    {/* START table-responsive */}
                    <Table id="client_table" responsive bordered hover>
                        <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {content}
                        </tbody>
                    </Table>
                    {loader}
                    {/* END table-responsive */}
                    <div className="panel-footer">

                    </div>
                </div>
            </ContentWrapper>
        )
    }

}

export default Clients;
