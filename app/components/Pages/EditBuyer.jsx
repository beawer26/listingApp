import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import MapPicker from '../Layout/MapPicker'
import {History, Redirect} from 'react-router-dom';
import {FormControl, FormGroup, InputGroup, Tabs, Tab, Panel} from 'react-bootstrap';
import Http from '../../utils/http'
import Select from 'react-select';


class EditBuyer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            credentials: {
                name: '',
                email: '',
                phone: '',
                min_baths: '',
                max_baths: '',
                city: '',
                street: '',
                subdivision: '',
                min_price: '',
                max_price: '',
                min_beds: '',
                max_beds: '',
                type: '',
                min_parking: '',
                max_parking: '',
                fireplace: false,
                closet: false,
                vault: false,
                master_bedroom: '',
                status: '',
                keyword: '',
                county: '',
                location:'',
                min_year: '',
                max_year:'',
                min_lot: '',
                max_lot: '',
                min_living: '',
                max_living: '',
                min_floor: '',
                max_floor: '',
                shape_type:''
            },
            cities: '',
            single: '',
            condo: '',
            town: '',
            apartment: '',
            single_back:'',
            condo_back:'',
            town_back:'',
            apartment_back:'',
            subdivisions: '',
            selectedCity: null,
            selectedSubdivision: null,
            loading: true,
            loadingSub: true,
            filters_visibility: true,
            options_visibility: true,
            error_msg: '',
            key: 'map',
            currentLatLng: {
                lat: 0,
                lng: 0
            },
            marks: [],
            buyer_id: props.match.params.buyer_id
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleNewChange = this.handleNewChange.bind(this);
        this.selectProperty = this.selectProperty.bind(this);
        this.hideProperty = this.hideProperty.bind(this);
        this.hideOptions = this.hideOptions.bind(this);
        this.selectSingle = this.selectSingle.bind(this);
        this.selectCondo = this.selectCondo.bind(this);
        this.selectTown = this.selectTown.bind(this);
        this.selectApartment = this.selectApartment.bind(this);
    }



    componentDidMount() {
        Http.get('get-buyer/' + this.state.buyer_id)
            .then(res => {
                let data = res['data']
                Http.get('get-cities')
                    .then(res => {

                        let key;
                        let city = [];
                        let subdivision = [];
                        let type_array = [];
                        let condo = '';
                        let single = '';
                        let town = '';
                        let apartment = '';
                        let county = '';
                        let street = '';
                        let single_back = '#ffffff';
                        let condo_back = '#ffffff';
                        let town_back = '#ffffff';
                        let apartment_back = '#ffffff';
                        $.each(data['type'].split("|"), function(i,e){
                            type_array.push(e)
                        });
                        type_array.map(function(type, index){
                            if(type == 'Single Family'){
                                single = type;
                                single_back = '#5d9cec'
                            }
                            if(type == 'Condominium'){
                                condo = type;
                                condo_back = '#5d9cec'
                            }
                            if(type == 'Townhouse'){
                                town = type;
                                town_back = '#5d9cec'
                            }
                            if(type == 'Apartment'){
                                apartment = type;
                                apartment_back = '#5d9cec'
                            }
                        })
                        if(data['location'] == null){
                            key = 'city'
                            city.push({
                                "label": data['city'],
                                "value": data['city']
                            })
                        }
                        else{
                            key = 'map';
                            city = '';
                            localStorage.setItem('coords', data['location']);
                            localStorage.setItem('shape_type', data['shape_type']);
                        }
                        if(data['subdivision'] == null){
                            subdivision = '';
                        }
                        else{
                            subdivision.push({
                                "label":data['subdivision'],
                                "value":data['subdivision']
                            })
                        }

                        if(data['county'] == null){
                            county = '';
                        }
                        else{
                            county = data['county'];
                        }

                        if(data['street'] == null){
                            street = '';
                        }
                        else{
                            street = data['street']
                        }

                        this.setState({
                            cities: res['data'],
                            key: key,
                            loading: false,
                            selectedCity: city[0],
                            selectedSubdivision: subdivision[0],
                            single: single,
                            condo: condo,
                            town: town,
                            apartment: apartment,
                            single_back: single_back,
                            condo_back: condo_back,
                            town_back: town_back,
                            apartment_back: apartment_back,
                            credentials: {
                                name: data['name'],
                                email: data['email'],
                                phone: data['phone'],
                                min_baths: data['min_baths'],
                                max_baths: data['max_baths'],
                                city: data['city'],
                                street: street,
                                subdivision: data['subdivision'],
                                min_price: data['min_price'],
                                max_price: data['max_price'],
                                min_beds: data['min_beds'],
                                max_beds: data['max_beds'],
                                type: data['type'],
                                min_parking: data['min_parking'],
                                max_parking: data['max_parking'],
                                fireplace: data['fireplace'],
                                closet: data['closet'],
                                vault: data['vault'],
                                master_bedroom: data['master_bedroom'],
                                status: data['status'],
                                keyword: data['keyword'],
                                county: county,
                                location:data['location'],
                                shape_type: data['shape_type'],
                                min_year: data['min_year'],
                                max_year: data['max_year'],
                                min_floor: data['min_floor'],
                                max_floor: data['max_floor'],
                                min_lot: data['min_lot'],
                                max_lot: data['max_lot'],
                                min_living: data['min_living'],
                                max_living: data['max_living']
                            },
                        })
                    })

            })
            .catch((err => {

            }))
    }



    componentDidUpdate() {

        $('#max_price, #min_price').inputmask({
            'alias': 'numeric',
            'min': 0,
            'max': 100000000,
            'groupSeparator': ',',
            'autoGroup': true,
            'placeholder': '0'
        });

        $('#max_beds, #min_beds, #max_baths, #min_baths, #min_parking, #max_parking').inputmask("numeric", {
            min: 0,
            max: 100
        })
        $('#min_year, #max_year').inputmask("numeric", {
            min: 1700,
            max: 3000
        })
        $('#min_floor, #max_floor').inputmask("numeric", {
            min: 0,
            max: 100
        })
        $('#min_lot, #max_lot, #min_living').inputmask("numeric", {
            min: 0,
            max: 100000
        })
        // $('#min_price').inputmask("numeric", {
        //     min: 0,
        //     max: 100000000
        // })
        $('#phone').inputmask('999-999-9999')
    }


    handleChange(e) {
        e.preventDefault();
        const {name, value} = e.target;
        this.setState({credentials: {...this.state.credentials, [name]: value,
                min_price: $('#min_price').val(),
                name: $('#name').val(),
                email: $('#email').val(),
                max_price: $('#max_price').val(),
                min_beds: $('#min_beds').val(),
                max_beds: $('#max_beds').val(),
                min_baths: $('#min_baths').val(),
                max_baths: $('#max_baths').val(),
                min_parking: $('#min_parking').val(),
                max_parking: $('#max_parking').val(),
                min_year: $('#min_year').val(),
                max_year: $('#max_year').val(),
                min_floor: $('#min_floor').val(),
                max_floor: $('#max_floor').val(),
                min_lot: $('#min_lot').val(),
                max_lot: $('#max_lot').val(),
                min_living: $('#min_living').val(),
                max_living: $('#max_living').val(),
                phone: $('#phone').val()}});

    }

    handleNewChange(e){
        e.preventDefault()
        this.setState({credentials: {...this.state.credentials,
                min_price: $('#min_price').val(),
                name: $('#name').val(),
                email: $('#email').val(),
                max_price: $('#max_price').val(),
                min_beds: $('#min_beds').val(),
                max_beds: $('#max_beds').val(),
                min_baths: $('#min_baths').val(),
                max_baths: $('#max_baths').val(),
                min_parking: $('#min_parking').val(),
                max_parking: $('#max_parking').val(),
                min_year: $('#min_year').val(),
                max_year: $('#max_year').val(),
                min_floor: $('#min_floor').val(),
                max_floor: $('#max_floor').val(),
                min_lot: $('#min_lot').val(),
                max_lot: $('#max_lot').val(),
                min_living: $('#min_living').val(),
                max_living: $('#max_living').val(),
                phone: $('#phone').val()}});
    }

    handleSubmit(e) {
        e.preventDefault();

        let error;
        let coords = localStorage.getItem('coords');
        let shape_type = localStorage.getItem('shape_type');
        let form = $('#profile-form');
        $("#profile-form").validate({
            errorPlacement: function (error, element) {
                if (element.attr("name") == "buyer-check")
                    error.insertAfter(".buyer-consent");
                else
                    error.insertAfter(element);
            },
            rules: {
                city: {
                    checkCity: true
                }
            }
        });
        if(this.state.key == 'city') {
            if (this.state.selectedCity == '') {
                error = 1;
                this.setState({
                    error_msg: 'This field is required'
                })
            }
            else {
                error = 0;
                this.setState({
                    error_msg: ''
                })
            }
        }
        if(this.state.key == 'map') {
            if (!coords) {
                error = 1;
                this.setState({
                    error_msg: 'Select shape on map'
                })
            }
            else {
                error = 0;
                this.setState({
                    error_msg: ''
                })
            }
        }

        let type = "";
        if (form.valid() && error == 0) {
            this.refs.btn.setAttribute("disabled", "disabled");
            let {credentials} = this.state;
            credentials.name = $('#name').val()
            credentials.email = $('#email').val();
            if (this.state.single !== '') {
                type = this.state.single + "|";
            }
            if (this.state.condo !== '') {
                type += this.state.condo + "|";
            }
            if (this.state.town !== '') {
                type += this.state.town + "|";
            }
            if (this.state.apartment !== '') {
                type += this.state.apartment + "|";
            }
            credentials.type = type;
            credentials.min_price = parseInt($('#min_price').val().replace(/[^0-9]/g, ''));
            credentials.max_price = parseInt($('#max_price').val().replace(/[^0-9]/g, ''));

            if (this.state.selectedSubdivision == null) {
            }
            else {
                credentials.subdivision = this.state.selectedSubdivision.value;
            }
            credentials.phone = $('#phone').val();
            if ($('#min_beds').val() == null) {
                credentials.min_beds = 0
            }
            else {
                credentials.min_beds = $('#min_beds').val()
            }
            if ($('#max_beds').val() == null) {
                credentials.max_beds = 0
            }
            else {
                credentials.max_beds = $('#max_beds').val()
            }
            if ($('#min_baths').val() == null) {
                credentials.min_baths = 0
            }
            else {
                credentials.min_baths = $('#min_baths').val()
            }
            if ($('#max_baths').val() == null) {
                credentials.max_baths = 0
            }
            else {
                credentials.max_baths = $('#max_baths').val()
            }
            if ($('#min_parking').val() == null) {
                credentials.min_parking = 0
            }
            else {
                credentials.min_parking = $('#min_parking').val()
            }
            if ($('#max_parking').val() == null) {
                credentials.max_parking = 0
            }
            else {
                credentials.max_parking = $('#max_parking').val()
            }
            if ($('#min_year').val() == null) {
                credentials.min_year = 0
            }
            else {
                credentials.min_year = $('#min_year').val()
            }
            if ($('#max_year').val() == null) {
                credentials.max_year = 0
            }
            else {
                credentials.max_year = $('#max_year').val()
            }
            if ($('#min_floor').val() == null) {
                credentials.min_floor = 0
            }
            else {
                credentials.min_floor = $('#min_floor').val()
            }
            if ($('#max_floor').val() == null) {
                credentials.max_floor = 0
            }
            else {
                credentials.max_floor = $('#max_floor').val()
            }
            if ($('#min_lot').val() == null) {
                credentials.min_lot = 0
            }
            else {
                credentials.min_lot = $('#min_lot').val()
            }
            if ($('#max_lot').val() == null) {
                credentials.max_lot = 0
            }
            else {
                credentials.max_lot = $('#max_lot').val()
            }
            if ($('#min_living').val() == null) {
                credentials.min_living = 0
            }
            else {
                credentials.min_living = $('#min_living').val()
            }
            if ($('#max_living').val() == null) {
                credentials.max_living = 0
            }
            else {
                credentials.max_living = $('#max_living').val()
            }

            credentials.master_bedroom = $('#master_bedroom').val()
            if(this.state.key == 'map'){
                credentials.location = coords;
                credentials.shape_type = shape_type;
                credentials.city = null;
                credentials.county = null;
                credentials.subdivision = null;
                credentials.street = null;
            }
            else{
                credentials.city = this.state.selectedCity.value;
                credentials.location = null;

            }

            credentials.user_id = localStorage.getItem('user_id');
            Http.post('edit-buyer/'+this.state.buyer_id, credentials)
                .then(res => {
                    localStorage.removeItem('coords');
                    localStorage.removeItem('shape_type')
                    this.props.history.push('/clients')
                })
                .catch((err) => {

                })
        }
    }

    selectProperty(e) {
        e.preventDefault();
        let id = e.target.id;
        if (!id) {
            id = e.target.parentElement.id;
        }
        let text = $('#' + id).find('label').text();
        if (this.state.credentials.type == text) {
            $('#' + id).css('background-color', '#ffffff')
            this.setState({
                credentials: {
                    ...this.state.credentials,
                    type: ''
                }
            })
        }
        else {
            $('#house').css('background-color', '#ffffff');
            $('#condo').css('background-color', '#ffffff');
            $('#townhouse').css('background-color', '#ffffff');
            $('#multifamily').css('background-color', '#ffffff');
            text = $('#' + id).find('label').text()
            this.setState({
                credentials: {
                    ...this.state.credentials,
                    type: text
                }
            })
            $('#' + id).css('background-color', '#5d9cec')
        }
    }

    selectSingle(e) {
        e.preventDefault();
        let id = e.target.id;
        if (!id) {
            id = e.target.parentElement.id;
        }
        let text = $('#' + id).find('label').text();
        if (this.state.single == text) {
            $('#' + id).css('background-color', '#ffffff')
            this.setState({

                    single: '',
                credentials: {...this.state.credentials,
                    min_price: $('#min_price').val(),
                    name: $('#name').val(),
                    email: $('#email').val(),
                    max_price: $('#max_price').val(),
                    min_beds: $('#min_beds').val(),
                    max_beds: $('#max_beds').val(),
                    min_baths: $('#min_baths').val(),
                    max_baths: $('#max_baths').val(),
                    min_parking: $('#min_parking').val(),
                    max_parking: $('#max_parking').val(),
                    min_year: $('#min_year').val(),
                    max_year: $('#max_year').val(),
                    min_floor: $('#min_floor').val(),
                    max_floor: $('#max_floor').val(),
                    min_lot: $('#min_lot').val(),
                    max_lot: $('#max_lot').val(),
                    min_living: $('#min_living').val(),
                    max_living: $('#max_living').val(),
                    phone: $('#phone').val()}

            })
        }
        else {
            $('#house').css('background-color', '#ffffff');
            text = $('#' + id).find('label').text()
            this.setState({

                    single: text,
                credentials: {...this.state.credentials,
                    min_price: $('#min_price').val(),
                    name: $('#name').val(),
                    email: $('#email').val(),
                    max_price: $('#max_price').val(),
                    min_beds: $('#min_beds').val(),
                    max_beds: $('#max_beds').val(),
                    min_baths: $('#min_baths').val(),
                    max_baths: $('#max_baths').val(),
                    min_parking: $('#min_parking').val(),
                    max_parking: $('#max_parking').val(),
                    min_year: $('#min_year').val(),
                    max_year: $('#max_year').val(),
                    min_floor: $('#min_floor').val(),
                    max_floor: $('#max_floor').val(),
                    min_lot: $('#min_lot').val(),
                    max_lot: $('#max_lot').val(),
                    min_living: $('#min_living').val(),
                    max_living: $('#max_living').val(),
                    phone: $('#phone').val()}

            })
            $('#' + id).css('background-color', '#5d9cec')
        }
    }

    selectCondo(e) {
        e.preventDefault();
        let id = e.target.id;
        if (!id) {
            id = e.target.parentElement.id;
        }
        let text = $('#' + id).find('label').text();
        if (this.state.condo == text) {
            $('#' + id).css('background-color', '#ffffff')
            this.setState({

                    condo: '',
                credentials: {...this.state.credentials,
                    min_price: $('#min_price').val(),
                    name: $('#name').val(),
                    email: $('#email').val(),
                    max_price: $('#max_price').val(),
                    min_beds: $('#min_beds').val(),
                    max_beds: $('#max_beds').val(),
                    min_baths: $('#min_baths').val(),
                    max_baths: $('#max_baths').val(),
                    min_parking: $('#min_parking').val(),
                    max_parking: $('#max_parking').val(),
                    min_year: $('#min_year').val(),
                    max_year: $('#max_year').val(),
                    min_floor: $('#min_floor').val(),
                    max_floor: $('#max_floor').val(),
                    min_lot: $('#min_lot').val(),
                    max_lot: $('#max_lot').val(),
                    min_living: $('#min_living').val(),
                    max_living: $('#max_living').val(),
                    phone: $('#phone').val()}

            })
        }
        else {
            $('#condo').css('background-color', '#ffffff');
            text = $('#' + id).find('label').text()
            this.setState({

                    condo: text,
                credentials: {...this.state.credentials,
                    min_price: $('#min_price').val(),
                    name: $('#name').val(),
                    email: $('#email').val(),
                    max_price: $('#max_price').val(),
                    min_beds: $('#min_beds').val(),
                    max_beds: $('#max_beds').val(),
                    min_baths: $('#min_baths').val(),
                    max_baths: $('#max_baths').val(),
                    min_parking: $('#min_parking').val(),
                    max_parking: $('#max_parking').val(),
                    min_year: $('#min_year').val(),
                    max_year: $('#max_year').val(),
                    min_floor: $('#min_floor').val(),
                    max_floor: $('#max_floor').val(),
                    min_lot: $('#min_lot').val(),
                    max_lot: $('#max_lot').val(),
                    min_living: $('#min_living').val(),
                    max_living: $('#max_living').val(),
                    phone: $('#phone').val()}

            })
            $('#' + id).css('background-color', '#5d9cec')
        }
    }

    selectTown(e) {
        e.preventDefault();
        let id = e.target.id;
        if (!id) {
            id = e.target.parentElement.id;
        }
        let text = $('#' + id).find('label').text();
        if (this.state.town == text) {
            $('#' + id).css('background-color', '#ffffff')
            this.setState({

                    town: '',
                credentials: {...this.state.credentials,
                    min_price: $('#min_price').val(),
                    name: $('#name').val(),
                    email: $('#email').val(),
                    max_price: $('#max_price').val(),
                    min_beds: $('#min_beds').val(),
                    max_beds: $('#max_beds').val(),
                    min_baths: $('#min_baths').val(),
                    max_baths: $('#max_baths').val(),
                    min_parking: $('#min_parking').val(),
                    max_parking: $('#max_parking').val(),
                    min_year: $('#min_year').val(),
                    max_year: $('#max_year').val(),
                    min_floor: $('#min_floor').val(),
                    max_floor: $('#max_floor').val(),
                    min_lot: $('#min_lot').val(),
                    max_lot: $('#max_lot').val(),
                    min_living: $('#min_living').val(),
                    max_living: $('#max_living').val(),
                    phone: $('#phone').val()}

            })
        }
        else {
            $('#townhouse').css('background-color', '#ffffff');
            text = $('#' + id).find('label').text()
            this.setState({

                    town: text,
                credentials: {...this.state.credentials,
                    min_price: $('#min_price').val(),
                    name: $('#name').val(),
                    email: $('#email').val(),
                    max_price: $('#max_price').val(),
                    min_beds: $('#min_beds').val(),
                    max_beds: $('#max_beds').val(),
                    min_baths: $('#min_baths').val(),
                    max_baths: $('#max_baths').val(),
                    min_parking: $('#min_parking').val(),
                    max_parking: $('#max_parking').val(),
                    min_year: $('#min_year').val(),
                    max_year: $('#max_year').val(),
                    min_floor: $('#min_floor').val(),
                    max_floor: $('#max_floor').val(),
                    min_lot: $('#min_lot').val(),
                    max_lot: $('#max_lot').val(),
                    min_living: $('#min_living').val(),
                    max_living: $('#max_living').val(),
                    phone: $('#phone').val()}

            })
            $('#' + id).css('background-color', '#5d9cec')
        }
    }

    selectApartment(e) {
        e.preventDefault();
        let id = e.target.id;
        if (!id) {
            id = e.target.parentElement.id;
        }
        let text = $('#' + id).find('label').text();
        if (this.state.apartment == text) {
            $('#' + id).css('background-color', '#ffffff')
            this.setState({

                    apartment: '',
                credentials: {...this.state.credentials,
                    min_price: $('#min_price').val(),
                    name: $('#name').val(),
                    email: $('#email').val(),
                    max_price: $('#max_price').val(),
                    min_beds: $('#min_beds').val(),
                    max_beds: $('#max_beds').val(),
                    min_baths: $('#min_baths').val(),
                    max_baths: $('#max_baths').val(),
                    min_parking: $('#min_parking').val(),
                    max_parking: $('#max_parking').val(),
                    min_year: $('#min_year').val(),
                    max_year: $('#max_year').val(),
                    min_floor: $('#min_floor').val(),
                    max_floor: $('#max_floor').val(),
                    min_lot: $('#min_lot').val(),
                    max_lot: $('#max_lot').val(),
                    min_living: $('#min_living').val(),
                    max_living: $('#max_living').val(),
                    phone: $('#phone').val()}

            })
        }
        else {
            $('#multifamily').css('background-color', '#ffffff');
            text = $('#' + id).find('label').text()
            this.setState({

                    apartment: text,
                credentials: {...this.state.credentials,
                    min_price: $('#min_price').val(),
                    name: $('#name').val(),
                    email: $('#email').val(),
                    max_price: $('#max_price').val(),
                    min_beds: $('#min_beds').val(),
                    max_beds: $('#max_beds').val(),
                    min_baths: $('#min_baths').val(),
                    max_baths: $('#max_baths').val(),
                    min_parking: $('#min_parking').val(),
                    max_parking: $('#max_parking').val(),
                    min_year: $('#min_year').val(),
                    max_year: $('#max_year').val(),
                    min_floor: $('#min_floor').val(),
                    max_floor: $('#max_floor').val(),
                    min_lot: $('#min_lot').val(),
                    max_lot: $('#max_lot').val(),
                    min_living: $('#min_living').val(),
                    max_living: $('#max_living').val(),
                    phone: $('#phone').val()}

            })
            $('#' + id).css('background-color', '#5d9cec')
        }
    }

    selectCity(e) {
        Http.get('get-subdivision/' + e.value)
            .then(res => {
                this.setState({
                    subdivisions: res['data'],
                    selectedCity: e,
                    selectedSubdivision: null,
                    loadingSub: false
                })
            })
    }

    selectSubdivision(e) {
        this.setState({
            selectedSubdivision: e
        })
    }

    hideProperty(e) {
        e.preventDefault();
        if (this.state.filters_visibility == true) {
            $('#property_type').hide('slow');
            $('#show-hide').html('Show filters <span class="fa fa-caret-down"></span>');
            this.setState({filters_visibility: false})
        }
        else {
            $('#property_type').show('slow');
            $('#show-hide').html('Hide filters <span class="fa fa-caret-up"></span>');
            this.setState({filters_visibility: true})
        }
    }

    hideOptions(e) {
        e.preventDefault();
        if (this.state.options_visibility == true) {
            $('#hide_options').hide('slow');
            $('#show-hide-options').html('Show options <span class="fa fa-caret-down"></span>');
            this.setState({options_visibility: false})
        }
        else {
            $('#hide_options').show('slow');
            $('#show-hide-options').html('Hide options <span class="fa fa-caret-up"></span>');
            this.setState({options_visibility: true})
        }
    }


    checkFireplace(e) {
        if (this.state.credentials.fireplace == true) {
            this.setState({credentials: {...this.state.credentials, fireplace: false,
                    min_price: $('#min_price').val(),
                    name: $('#name').val(),
                    email: $('#email').val(),
                    max_price: $('#max_price').val(),
                    min_beds: $('#min_beds').val(),
                    max_beds: $('#max_beds').val(),
                    min_baths: $('#min_baths').val(),
                    max_baths: $('#max_baths').val(),
                    min_parking: $('#min_parking').val(),
                    max_parking: $('#max_parking').val(),
                    min_year: $('#min_year').val(),
                    max_year: $('#max_year').val(),
                    min_floor: $('#min_floor').val(),
                    max_floor: $('#max_floor').val(),
                    min_lot: $('#min_lot').val(),
                    max_lot: $('#max_lot').val(),
                    min_living: $('#min_living').val(),
                    max_living: $('#max_living').val(),
                    phone: $('#phone').val()}});
        }
        else {
            this.setState({credentials: {...this.state.credentials, fireplace: true,
                    min_price: $('#min_price').val(),
                    max_price: $('#max_price').val(),
                    name: $('#name').val(),
                    email: $('#email').val(),
                    min_beds: $('#min_beds').val(),
                    max_beds: $('#max_beds').val(),
                    min_baths: $('#min_baths').val(),
                    max_baths: $('#max_baths').val(),
                    min_parking: $('#min_parking').val(),
                    max_parking: $('#max_parking').val(),
                    min_year: $('#min_year').val(),
                    max_year: $('#max_year').val(),
                    min_floor: $('#min_floor').val(),
                    max_floor: $('#max_floor').val(),
                    min_lot: $('#min_lot').val(),
                    max_lot: $('#max_lot').val(),
                    min_living: $('#min_living').val(),
                    max_living: $('#max_living').val(),
                    phone: $('#phone').val()}});

        }
    }

    checkCloset(e) {
        if (this.state.credentials.closet == true) {
            this.setState({credentials: {...this.state.credentials, closet: false,
                    min_price: $('#min_price').val(),
                    max_price: $('#max_price').val(),
                    name: $('#name').val(),
                    email: $('#email').val(),
                    min_beds: $('#min_beds').val(),
                    max_beds: $('#max_beds').val(),
                    min_baths: $('#min_baths').val(),
                    max_baths: $('#max_baths').val(),
                    min_parking: $('#min_parking').val(),
                    max_parking: $('#max_parking').val(),
                    min_year: $('#min_year').val(),
                    max_year: $('#max_year').val(),
                    min_floor: $('#min_floor').val(),
                    max_floor: $('#max_floor').val(),
                    min_lot: $('#min_lot').val(),
                    max_lot: $('#max_lot').val(),
                    min_living: $('#min_living').val(),
                    max_living: $('#max_living').val(),
                    phone: $('#phone').val()}});
        }
        else {
            this.setState({credentials: {...this.state.credentials, closet: true,
                    min_price: $('#min_price').val(),
                    max_price: $('#max_price').val(),
                    name: $('#name').val(),
                    email: $('#email').val(),
                    min_beds: $('#min_beds').val(),
                    max_beds: $('#max_beds').val(),
                    min_baths: $('#min_baths').val(),
                    max_baths: $('#max_baths').val(),
                    min_parking: $('#min_parking').val(),
                    max_parking: $('#max_parking').val(),
                    min_year: $('#min_year').val(),
                    max_year: $('#max_year').val(),
                    min_floor: $('#min_floor').val(),
                    max_floor: $('#max_floor').val(),
                    min_lot: $('#min_lot').val(),
                    max_lot: $('#max_lot').val(),
                    min_living: $('#min_living').val(),
                    max_living: $('#max_living').val(),
                    phone: $('#phone').val()}});

        }
    }

    checkVault(e) {
        if (this.state.credentials.vault == true) {
            this.setState({credentials: {...this.state.credentials, vault: false,
                    min_price: $('#min_price').val(),
                    max_price: $('#max_price').val(),
                    name: $('#name').val(),
                    email: $('#email').val(),
                    min_beds: $('#min_beds').val(),
                    max_beds: $('#max_beds').val(),
                    min_baths: $('#min_baths').val(),
                    max_baths: $('#max_baths').val(),
                    min_parking: $('#min_parking').val(),
                    max_parking: $('#max_parking').val(),
                    min_year: $('#min_year').val(),
                    max_year: $('#max_year').val(),
                    min_floor: $('#min_floor').val(),
                    max_floor: $('#max_floor').val(),
                    min_lot: $('#min_lot').val(),
                    max_lot: $('#max_lot').val(),
                    min_living: $('#min_living').val(),
                    max_living: $('#max_living').val(),
                    phone: $('#phone').val()}});
        }
        else {
            this.setState({credentials: {...this.state.credentials, vault: true,
                    min_price: $('#min_price').val(),
                    max_price: $('#max_price').val(),
                    min_beds: $('#min_beds').val(),
                    name: $('#name').val(),
                    email: $('#email').val(),
                    max_beds: $('#max_beds').val(),
                    min_baths: $('#min_baths').val(),
                    max_baths: $('#max_baths').val(),
                    min_parking: $('#min_parking').val(),
                    max_parking: $('#max_parking').val(),
                    min_year: $('#min_year').val(),
                    max_year: $('#max_year').val(),
                    min_floor: $('#min_floor').val(),
                    max_floor: $('#max_floor').val(),
                    min_lot: $('#min_lot').val(),
                    max_lot: $('#max_lot').val(),
                    min_living: $('#min_living').val(),
                    max_living: $('#max_living').val(),
                    phone: $('#phone').val()}});

        }
    }

    handleCheck(e) {
        if (this.state.credentials.buyer_consent == true) {
            this.setState({credentials: {...this.state.credentials, buyer_consent: false}});
        }
        else {
            this.setState({credentials: {...this.state.credentials, buyer_consent: true}});

        }
    }



    render() {
        const user = localStorage.getItem('user_id');

        var city = [];
        var subdivision = [];
        var selectedCity = this.state.selectedCity;
        var selectedSubdivision = this.state.selectedSubdivision;
        let content;

        if (this.state.loadingSub) {
            subdivision = [];
        }
        else {
            Object.keys(this.state.subdivisions).map((index, subdivisions) => {
                subdivision.push({
                    "label": this.state.subdivisions[index],
                    "value": this.state.subdivisions[index]
                })
            })
        }
        if (user == 1) {
            return <Redirect to="/users-list"/>
        }
        const status = localStorage.getItem('user_status');
        if (status == false) {
            return <Redirect to="/expired"/>
        }
        if (this.state.loading) {
            city = [];
            content =
                <div className="panel b mt-xxl wd-xxl">
                    <div className="panel-body text-center bb">
                        <div className="text-bold">Edit buyer information</div>
                    </div>
                    <Panel className="loader-demo">
                        <div className="ball-beat">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </Panel>
                </div>
        }
        else {
            Object.keys(this.state.cities).map((index, cities) => {
                city.push({
                    "label": this.state.cities[index],
                    "value": this.state.cities[index]
                })
            })

            content =
                <form id="profile-form" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="panel b">
                                <div className="panel-body text-center bb">
                                    <div className="text-bold">Search option</div>
                                </div>
                                <div className="panel-body clients-grey">
                                    <div className="text-right">
                                        <a className="" id="show-hide" onClick={this.hideProperty}>Hide
                                            filters <span className="fa fa-caret-up"></span> </a>
                                    </div>
                                    <div className="form-inline">
                                        <FormGroup>
                                            <label>Price</label>&nbsp;
                                            <InputGroup>
                                                <InputGroup.Addon>$</InputGroup.Addon>
                                                <input type="text" id="min_price" name="min_price"
                                                       placeholder="Min" autoComplete="off" value={this.state.credentials.min_price}
                                                       className="form-control min_price required" onChange={this.handleNewChange}/>
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup>
                                            &nbsp;<label>to</label>&nbsp;
                                            <InputGroup>
                                                <InputGroup.Addon>$</InputGroup.Addon>
                                                <input type="text" id="max_price" name="max_price"
                                                       placeholder="Max" autoComplete="off" value={this.state.credentials.max_price}
                                                       className="form-control max_price required" onChange={this.handleNewChange}/>
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                </div>
                                <div id="property_type">
                                    <div className="row panel-body form-inline">
                                        <div className="col-md-6">
                                            <div className="form-inline">
                                                <FormGroup>
                                                    <label>Beds</label>&nbsp;
                                                    <input type="text" min="0" id="min_beds" name="min_beds"
                                                           placeholder="Min" autoComplete="off" value={this.state.credentials.min_beds}
                                                           className="form-control required" onChange={this.handleNewChange}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    &nbsp;<label>to</label>&nbsp;
                                                    <input type="text" min="0" id="max_beds" name="max_beds"
                                                           placeholder="Max" autoComplete="off" value={this.state.credentials.max_beds}
                                                           className="form-control required" onChange={this.handleNewChange}/>
                                                </FormGroup>
                                            </div>
                                            {/*&nbsp;<b>to</b>&nbsp;*/}
                                            {/*<input type="number" step="1" min="0" id="max_beds" name="max_beds"*/}
                                            {/*placeholder="Max" className="form-control"/>*/}
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-inline">
                                                <FormGroup>
                                                    <label>Baths</label>&nbsp;
                                                    <input type="text" min="0" id="min_baths" name="min_baths"
                                                           placeholder="Min" autoComplete="off" value={this.state.credentials.min_baths}
                                                           className="form-control required" onChange={this.handleNewChange}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    &nbsp;<label>to</label>&nbsp;
                                                    <input type="text" min="0" id="max_baths" name="max_baths"
                                                           placeholder="Max" autoComplete="off" value={this.state.credentials.max_baths}
                                                           className="form-control required" onChange={this.handleNewChange}/>
                                                </FormGroup>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="panel-body">
                                        <label>Property type</label>
                                        <br/>
                                        <div className="properties">
                                            <div
                                                className="align-items-center text-center col-lg-2 col-xs-2 col-sm-2 col-md-2 property-type form-control"
                                                id="house" name="house" onClick={this.selectSingle}
                                                style={{backgroundColor : this.state.single_back}}>
                                                <em className="fa fa-home single-icon" name="Single Family"
                                                    onClick={this.selectSingle}></em><br/><label
                                                onClick={this.selectSingle} className="property-label">Single
                                                Family</label>
                                            </div>
                                            <div
                                                className="align-items-center text-center col-lg-2 col-xs-2 col-sm-2 col-md-2 property-type form-control"
                                                id="condo" name="condo" onClick={this.selectCondo}
                                                style={{backgroundColor : this.state.condo_back}}>
                                                <em className="fa fa-building condo-icon"
                                                    onClick={this.selectCondo}></em><br/><label
                                                onClick={this.selectCondo}
                                                className="property-label condo-label">Condominium</label>
                                            </div>
                                            <div
                                                className="align-items-center text-center col-lg-2 col-xs-2 col-sm-2 col-md-2 property-type form-control"
                                                id="townhouse" name="townhouse" onClick={this.selectTown}
                                                style={{backgroundColor : this.state.town_back}}>
                                                <em className="fa fa-home town-icon"
                                                    onClick={this.selectTown}></em><br/><label
                                                onClick={this.selectTown}
                                                className="property-label">Townhouse</label>
                                            </div>
                                            <div
                                                className="align-items-center text-center col-lg-2 col-xs-2 col-sm-2 col-md-2 property-type form-control property-type-last"
                                                id="multifamily" name="multifamily" onClick={this.selectApartment}
                                                style={{backgroundColor : this.state.apartment_back}}>
                                                <em className="fa fa-building-o apartment-icon"
                                                    onClick={this.selectApartment}></em><br/><label
                                                onClick={this.selectApartment}
                                                className="property-label">Apartment</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="panel-body">
                                        <Tabs id="controlled-tab" activeKey={this.state.key}
                                              onSelect={key => this.setState({ key })}>
                                            <Tab eventKey="map" title="Location picker">
                                                <p className="text-danger">{this.state.error_msg}</p>
                                                <MapPicker/>
                                                <br />
                                                <br />
                                            </Tab>
                                            <Tab eventKey="city" title="Manual input">
                                                <label>County:</label>
                                                <input type="text" id="county" name="county" autoComplete="off"
                                                             className="form-control"
                                                             value={this.state.credentials.county}
                                                             onChange={this.handleChange}/>
                                                <label>City:</label>
                                                <Select
                                                    id="city"
                                                    name="city"
                                                    options={city}
                                                    value={selectedCity}
                                                    classNamePrefix="required"
                                                    onChange={this.selectCity.bind(this)}
                                                />
                                                <p className="text-danger">{this.state.error_msg}</p>
                                                <label>Subdivision ID or Name</label>
                                                <Select
                                                    id="subdivision"
                                                    name="subdivision"
                                                    options={subdivision}
                                                    value={selectedSubdivision}
                                                    onChange={this.selectSubdivision.bind(this)}
                                                />
                                                <label>Street:</label>
                                                <input type="text" id="street" name="street" autoComplete="off"
                                                       className="form-control"
                                                       value={this.state.credentials.street}
                                                       onChange={this.handleChange}/>
                                            </Tab>
                                        </Tabs>
                                        <br />
                                        <br />

                                    </div>


                                    <div className="panel-body">
                                        <div>
                                            <div className="text-right">
                                                <a id="show-hide-options" onClick={this.hideOptions}>Hide options <span
                                                    className="fa fa-caret-up"></span></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="hide_options">
                                        <div className="panel-body clients-grey">
                                            <div className="checkbox c-checkbox needsclick houses">
                                                <label className="needsclick">
                                                    <input type="checkbox" id="fireplace" name="fireplace"
                                                           checked={this.state.credentials.fireplace}
                                                           onChange={this.checkFireplace.bind(this)}
                                                           className="needsclick"/>
                                                    <em className="fa fa-check"></em>Fireplace</label>
                                            </div>
                                            <div className="checkbox c-checkbox needsclick houses">
                                                <label className="needsclick">
                                                    <input type="checkbox" id="closet" name="closet"
                                                           checked={this.state.credentials.closet}
                                                           onChange={this.checkCloset.bind(this)}
                                                           className="needsclick"/>
                                                    <em className="fa fa-check"></em>Walk-in Closet</label>
                                            </div>
                                            <div className="checkbox c-checkbox needsclick houses">
                                                <label className="needsclick">
                                                    <input type="checkbox" id="vault" name="vault"
                                                           checked={this.state.credentials.vault}
                                                           onChange={this.checkVault.bind(this)}
                                                           className="needsclick"/>
                                                    <em className="fa fa-check"></em>Vaulted Ceiling</label>
                                            </div>
                                            <label>Location of Master Bedroom</label><br/>
                                            <FormControl componentClass="select" name="master_bedroom"
                                                         id="master_bedroom"
                                                         value={this.state.credentials.master_bedroom}
                                                         onChange={this.handleChange}
                                                         className="form-control m-b">
                                                <option></option>
                                                <option>Upstairs</option>
                                                <option>Downstairs</option>
                                            </FormControl>
                                            <br/>
                                            <div className="row form-inline">
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Garage spaces</label>&nbsp;
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <input type="text" min="0" id="min_parking" name="min_parking"
                                                               placeholder="Min" autoComplete="off" value={this.state.credentials.min_parking}
                                                               className="form-control" onChange={this.handleNewChange}/>
                                                        &nbsp;<label>to</label>&nbsp;
                                                        <input type="text" min="0" id="max_parking" name="max_parking"
                                                               placeholder="Max" autoComplete="off" value={this.state.credentials.max_parking}
                                                               className="form-control" onChange={this.handleNewChange}/>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="row form-inline">
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Year built</label>&nbsp;
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <input type="text" min="0" id="min_year" name="min_year"
                                                               placeholder="Min" autoComplete="off" value={this.state.credentials.min_year}
                                                               className="form-control" onChange={this.handleNewChange}/>
                                                        &nbsp;<label>to</label>&nbsp;
                                                        <input type="text" min="0" id="max_year" name="max_year"
                                                               placeholder="Max" autoComplete="off" value={this.state.credentials.max_year}
                                                               className="form-control" onChange={this.handleNewChange}/>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="row form-inline">
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Level/Floor</label>&nbsp;
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <input type="text" min="0" id="min_floor" name="min_floor"
                                                               placeholder="Min" autoComplete="off" value={this.state.credentials.min_floor}
                                                               className="form-control" onChange={this.handleNewChange}/>
                                                        &nbsp;<label>to</label>&nbsp;
                                                        <input type="text" min="0" id="max_floor" name="max_floor" value={this.state.credentials.max_floor}
                                                               placeholder="Max" autoComplete="off"
                                                               className="form-control" onChange={this.handleNewChange}/>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="row form-inline">
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Lot size sqft</label>&nbsp;
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <input type="text" min="0" id="min_lot" name="min_lot"
                                                               placeholder="Min" autoComplete="off" value={this.state.credentials.min_lot}
                                                               className="form-control" onChange={this.handleNewChange}/>
                                                        &nbsp;<label>to</label>&nbsp;
                                                        <input type="text" min="0" id="max_lot" name="max_lot"
                                                               placeholder="Max" autoComplete="off" value={this.state.credentials.max_lot}
                                                               className="form-control" onChange={this.handleNewChange}/>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="row form-inline">
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Living area sqft</label>&nbsp;
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <input type="text" min="0" id="min_living" name="min_living"
                                                               placeholder="Min" autoComplete="off" value={this.state.credentials.min_living}
                                                               className="form-control" onChange={this.handleNewChange}/>
                                                        &nbsp;<label>to</label>&nbsp;
                                                        <input type="text" min="0" id="max_living" name="max_living"
                                                               placeholder="Max" autoComplete="off" value={this.state.credentials.max_living}
                                                               className="form-control" onChange={this.handleNewChange}/>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <br/>
                                            <label>Status</label>
                                            <FormControl type="text" id="status" name="status"
                                                         className="form-control" autoComplete="off"
                                                         value={this.state.credentials.status}
                                                         onChange={this.handleChange}/>
                                            <label>Keyword</label>
                                            <FormControl type="text" id="keyword" name="keyword"
                                                         className="form-control" autoComplete="off"
                                                         value={this.state.credentials.keyword}
                                                         onChange={this.handleChange}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="panel b">
                                <div className="panel-body text-center bb">
                                    <div className="text-bold">Buyer contact information</div>
                                </div>
                                <div className="panel-body">
                                    <label htmlFor="name">Name *</label>
                                    <input id="name" name="name" autoComplete="off"
                                                 className="form-control required"
                                                 value={this.state.credentials.name}
                                                 onChange={this.handleNewChange}/>
                                    <label htmlFor="email">Email *</label>
                                    <input id="email" name="email" autoComplete="off"
                                                 className="form-control required email"
                                                 value={this.state.credentials.email}
                                                 onChange={this.handleNewChange}/>
                                    <label htmlFor="phone">Mobile phone *</label>
                                    <input id="phone" name="phone" autoComplete="off"
                                           className="form-control required" value={this.state.credentials.phone}
                                           placeholder="555-555-5555" onChange={this.handleNewChange}/>
                                </div>

                            </div>

                            <div className="text-right">
                                <button ref="btn" type="submit" className="btn btn-success">Save</button>
                            </div>
                        </div>
                    </div>

                </form>
        }
        return (
            <ContentWrapper>
                {content}

            </ContentWrapper>
        );
    }

}

export default EditBuyer;
