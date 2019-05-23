import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import {History, Redirect} from 'react-router-dom';
import {Panel, Button, Table, Modal, ButtonToolbar, DropdownButton, MenuItem} from 'react-bootstrap';
import Http from '../../utils/http'

class CustomerClientsInfo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: '',
            loading: true,
            id:'',
            user_id: props.match.params.user_id,
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
                county: ''
            }
        }

    }

    componentWillMount(){
        this.setState({
            isMounted: true
        })
    }

    componentWillUnmount(){
        this.setState({
            isMounted: false
        })
    }


    componentDidMount() {
        Http.get('buyers/' + this.state.user_id)
            .then(res => {
                let client_list= [];
                let length = res['data'].length
                let profile = res['data'][length-2];
                delete res['data'][length-2]
                let subscription = res['data'][length-1];
                delete res['data'][length-1]
                res['data'].map((clients, index) => {
                    let field_counter = 0;
                    Object.keys(clients).map(function(objectKey, index) {

                        if(clients[objectKey] !== null){
                            field_counter++;
                        }
                    });
                    let new_arr = []
                    new_arr['id'] = clients['id'];
                    new_arr['email'] = clients['email']
                    new_arr['phone'] = clients['phone']
                    let name = clients['name'].split(" ")
                    new_arr['first_name'] = name[0]
                    new_arr['second_name'] = name[1]
                    let x = field_counter/Object.keys(clients).length*100
                    new_arr['profile'] = x%5<3 ? (x%5===0 ? x : Math.floor(x/5)*5) : Math.ceil(x/5)*5;
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
                    client_list[clients['id']]=new_arr;
                })
                this.setState({
                    data: client_list,
                    loading: false});
            })
            .catch((err) => {

            })
    }

    close(e) {
        this.setState({
            showModal: false
        });
    }

    open(e) {
        const id = e;
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
                city: this.state.data[id].city,
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
                county: county
            },
            showModal: true,
            id: id
        });
    }


    render() {
        let content;
        let loader;
        let new_phone;
        const user = localStorage.getItem('user_id');
        if(user != 1){
            return <Redirect to="/clients" />
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
            content = this.state.data.map((clients, index) => {
                new_phone = clients.phone.replace(/\D+/g, '')
                    .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                return (
                    <tr key={index}>
                        <td>{clients.id}</td>
                        <td><a href={"tel:"+new_phone}>{new_phone}</a></td>
                        <td>{clients.first_name}</td>
                        <td>{clients.second_name}</td>
                        <td><a href={"mailto:"+clients.email}>{clients.email}</a></td>
                        <td>
                            <ButtonToolbar>
                                <DropdownButton bsStyle="primary" title="action" id="action">
                                    <MenuItem eventKey={clients.id} onSelect={this.open.bind(this)}>Search Options</MenuItem>
                                </DropdownButton>
                            </ButtonToolbar>
                        </td>
                        <Modal show={this.state.showModal} key={clients.id} onHide={this.close.bind(this)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Search Options</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="panel-body">
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
                                <Button onClick={ this.close.bind(this) }>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </tr>
                )
            })
            loader = <div></div>


        }
        return (
            <ContentWrapper>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3>Clients list</h3>
                    </div>
                    {/* START table-responsive */}
                    <Table id="client_table" responsive bordered hover>
                        <thead>
                        <tr>
                            <th>CID</th>
                            <th>Phone Number</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {content}
                        </tbody>
                    </Table>
                    {loader}
                    {/* END table-responsive */}
                </div>
            </ContentWrapper>
        )
    }

}

export default CustomerClientsInfo;
