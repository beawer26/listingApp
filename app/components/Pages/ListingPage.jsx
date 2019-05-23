import React from 'react';
import { Link, History} from 'react-router-dom';
import ContentWrapper from '../Layout/ContentWrapper';
import {Panel, Accordion, Tooltip, Button, Modal} from 'react-bootstrap';
import initGmap from '../Common/maps-google'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css"
import Http from '../../utils/http'
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class ListingPage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            data: '',
            token: props.match.params.token,
            key: 1,
            msg: '',
            img_count: 1,
            credentials:{
                buyer_name: '',
                buyer_phone: '',
                buyer_email: '',
                date: '',
                buyer_property: '',
                email:'',
                time:'',
                showing: ''
            }
        }
    }

    componentDidUpdate() {
        $('[data-gmap]').each(initGmap);
    }

    componentWillMount() {
        Http.get('get-listing/' + this.state.token)
            .then(res => {
                this.setState({
                    data: res['data'],
                    loading: false,
                    credentials:{
                        buyer_name: res['data'].buyer.name,
                        buyer_email: res['data'].buyer.email,
                        buyer_phone: res['data'].buyer.phone,
                        buyer_property: res['data'].listing.address.street+", "+res['data'].listing.address.city+", "+res['data'].listing.address.state+" "+res['data'].listing.address.zip,
                        date_time: '',
                        time: '',
                        showing: '',
                        email: res['data'].user_email
                    }
                })
            })
    }

    handleSelect(key) {
        this.setState({
            key
        });
    }

    handleClose(e) {
        e.preventDefault();
        $('#contact-agent').show()
        $('#agent-panel').hide()
    }

    showAgentInfo(e) {
        e.preventDefault()
        $('#contact-agent').hide()
        $('#agent-panel').show()
    }


    open(e)
    {
        this.setState({
            showModal: true
        })
    }

    close(e)
    {
        this.setState({
            showModal: false
        })
    }

    closeThankYou(e)
    {
        this.setState({
            showThankYou: false
        })
    }

    handleChange(e)
    {
        this.setState({credentials: {...this.state.credentials, date: e}});
    }

    handleSelect(e)
    {
        this.setState({credentials: {...this.state.credentials, time: e.target.value}});
    }

    handleSend(e)
    {
        e.preventDefault()
        Http.post('send-request', this.state.credentials)
            .then(res => {
                this.setState({
                    showModal: false,
                    showThankYou: true
                })
            })
            .catch(err => {

            })
    }

    render() {
        let content;

        if (this.state.loading) {
            content =
                <Panel className="loader-demo">
                    <div className="ball-beat">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </Panel>

        }
        else if (this.state.data.listing == false) {
            content =
                <Panel className="loader-demo">
                    <div>
                        <h3>Nothing were found!</h3>
                    </div>
                </Panel>
        }
        else {
            let accordionHeader = <h3>
                <small>
                    <em className="fa fa-plus text-primary mr"></em>
                </small>
                Nearby Schools</h3>
            let accordionMapHeader = <h3>
                <small>
                    <em className="fa fa-plus text-primary mr"></em>
                </small>
                Google map</h3>
            let accordionPropHeader = <h3>
                <small>
                    <em className="fa fa-plus text-primary mr"></em>
                </small>
                Property and Facts</h3>
            let sqft;
            let new_sqft;
            let baths;
            let img;
            let schools = "";
            let school_list = [];
            let pricesqft = "No data";
            let pricesqftnew;
            let request;
            if(this.state.data.showing == 1){
                request = <Button bsStyle="primary" bsSize="large" id="request-button" onClick={this.open.bind(this)}>
                    Request a Showing
                </Button>
            }
            else{
                request = '';
            }
            let phone = this.state.data.phone.replace(/\D+/g, '')
                .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');

            let street = this.state.data.listing.address.street ? this.state.data.listing.address.street : "No data";
            if (this.state.data.listing.size) {
                new_sqft = this.state.data.listing.size ? this.state.data.listing.size  : "";
                sqft = new_sqft.toLocaleString('en', {maximumFractionDigits:2})+" sqft"


            }
            else {
                sqft = ""
            }
            if (this.state.data.listing.images) {
                img = this.state.data.listing.images[0] ? this.state.data.listing.images[0] : ""
            }
            else {
                img = ''
            }

            let city = this.state.data.listing.address.city ? this.state.data.listing.address.city : ''
            let state = this.state.data.listing.address.state ? this.state.data.listing.address.state : ""
            let zip = this.state.data.listing.address.zip ? this.state.data.listing.address.zip : ""
            let beds = this.state.data.listing.beds ? this.state.data.listing.beds + " beds" : "";
            if (this.state.data.listing.baths) {
                baths = this.state.data.listing.baths.total ? this.state.data.listing.baths.total + " baths" : ""
            }
            else {
                baths = ''
            }
            let listingType = this.state.data.listing.listingType ? this.state.data.listing.listingType : ""
            let listingPrice = this.state.data.listing.listPrice ?  this.state.data.listing.listPrice : "";
            listingPrice = listingPrice.toLocaleString('en', {maximumFractionDigits:2})
            let description = this.state.data.listing.description ? this.state.data.listing.description : "No data"

            let daysOnMarket;
            if (this.state.data.listing.daysOnMarket) {
                daysOnMarket = <ul>
                    <strong>Days on Market:</strong>
                    <li className="listing-list">{this.state.data.listing.daysOnMarket}</li>
                </ul>
            }
            else {
                daysOnMarket = "";
            }

            let status;
            if (this.state.data.listing.status) {
                status = <ul>
                    <strong>Status:</strong>
                    <li className="listing-list">{this.state.data.listing.status}</li>
                </ul>
            }
            else {
                status = "";
            }

            let county;
            if (this.state.data.listing.county) {
                county = <ul>
                    <strong>County:</strong>
                    <li className="listing-list">{this.state.data.listing.county}</li>
                </ul>
            }
            else {
                county = "";
            }

            let facts;
            let fact_keys;
            facts = Object.keys(this.state.data.listing.features).map((feature, index) => {
                fact_keys = Object.keys(this.state.data.listing.features[feature]).map((key, index) => {
                    return (
                        <li className="listing-list" key={index}>{this.state.data.listing.features[feature][key]}</li>
                    )
                })
                if (feature == 'Listing' || feature[index] == 'No data') {
                    return
                }
                else {
                    return (
                        <ul key={index}>
                                <strong>{feature}:</strong>
                                {fact_keys}
                        </ul>
                    )
                }
            })


            if (this.state.data.listing.schools) {
                school_list = []
                Object.keys(this.state.data.listing.schools).map((school, index) => {
                    school_list.push(
                        <div key={index}>
                            <strong>{school}</strong>
                            <p>{this.state.data.listing.schools[school]}</p>
                        </div>
                    )
                })
                schools = <Accordion>
                    <Panel header={accordionHeader} eventKey="1" className="b">
                        {school_list}
                    </Panel>
                </Accordion>;
            }
            else {
                schools = ""
            }
            let tooltip = <Tooltip id="tooltip">
                {street}
            </Tooltip>;
            let yesterday = Datetime.moment().subtract( 1, 'day' );
            let valid = function( current ){
                return current.isAfter( yesterday );
            };
            let address = street + ", " + city + ", " + state + " " + zip;
            let images = [];
            let img_length = this.state.data.listing.images.length;
            let img_count;
            let logo;
            if (this.state.data.logo !== ''){
                logo = <a href={this.state.data.website}><img height="100px" id="logo-img" className="img-responsive"
                                                       src={'https://api.listing2text.com/upload/' + this.state.data.logo}/></a>
            }
            else{
                logo = <a href={this.state.data.website}><label id="company-label">{this.state.data.company}</label></a>
            }
            Object.keys(this.state.data.listing.images).map((image, index) => {
                img_count = index+1;
                images.push(
                    <div key={index}>
                        <img width="100%" height="auto"
                             src={this.state.data.listing.images[image]}/>
                        <p className="text-right"><strong>{img_count} of {img_length}</strong></p>
                    </div>
                )
            })


            content =
                <div className="block-center listing-page">
                    <div>
                        <div className="panel text-center listing-header">
                            <div className="panel-body">
                                {logo}
                            </div>
                        </div>
                        <div className="panel b">

                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-md-4">
                                <p className="agent-info">{this.state.data.user_name}</p>
                                <p className="agent-info"><a
                                    href={"tel:" + phone}>{phone}</a></p>
                                <p className="agent-info"><a
                                    href={"mailto:" + this.state.data.user_email}>{this.state.data.user_email}</a></p>
                                <p className="agent-info">{this.state.data.company}</p>
                                <p className="agent-info"><a
                                    href={this.state.data.website}>{this.state.data.website}</a></p>
                                <p className="agent-info" id="agent-license">{this.state.data.license}</p>
                                    </div>
                                    <div className="col-md-4 text-center" id="request-div">
                                        {request}
                                        <Modal show={this.state.showModal} onHide={this.close.bind(this)} id="request-modal">
                                            <Modal.Header closeButton>
                                                <Modal.Title>Request a Showing</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div className="panel-body">
                                                    <label>Select date</label>
                                                    <Datetime value={this.state.credentials.date} utc={true} stringParsing={true} isValidDate={ valid } inputProps={{ placeholder: 'Date'}} timeFormat={false} dateFormat="MM/DD/YYYY" onChange={this.handleChange.bind(this)}/>
                                                    <label>Select time</label>
                                                    <select id="time" name="time" className="form-control" onChange={this.handleSelect.bind(this)}>
                                                        <option>8am</option>
                                                        <option>9am</option>
                                                        <option>10am</option>
                                                        <option>11am</option>
                                                        <option>12am</option>
                                                        <option>1pm</option>
                                                        <option>2pm</option>
                                                        <option>3pm</option>
                                                        <option>4pm</option>
                                                        <option>5pm</option>
                                                        <option>6pm</option>
                                                        <option>7pm</option>
                                                    </select>
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <button type="submit" className="btn btn-primary" onClick={this.handleSend.bind(this)}>Send Request</button>
                                            </Modal.Footer>
                                        </Modal>
                                        <Modal show={this.state.showThankYou} onHide={this.closeThankYou.bind(this)} id="thankyou-modal">
                                            <Modal.Header closeButton>
                                                <Modal.Title>Request a Showing</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div className="panel-body text-center">
                                                    <strong>Thank you!</strong>
                                                    <br />
                                                    <p>Your agent will contact you</p>
                                                    <p>shortly to confirm</p>
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button onClick={ this.closeThankYou.bind(this) }>Close</Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel b">
                            <div className="panel-body text-center">
                                <Slider adaptiveHeight={true}>
                                    {images}
                                </Slider>

                            </div>
                        </div>
                        <div className="panel b">
                            <div className="panel-body row">
                                <div className="col-md-6 text-left listing-address">
                                    <h4>{street}, <br/>
                                        {city},&nbsp;
                                        {state}&nbsp;
                                        {zip}</h4>
                                    <h5 className="listing-padding"><strong><b
                                        className="text-danger">&bull; </b>{listingType}</strong></h5>
                                    <h5><strong>${listingPrice}</strong></h5>
                                </div>
                                <div className="col-md-6 text-right listing-address listing-padding">

                                    <h5><strong>{beds}</strong></h5> <h5><strong>{baths}</strong></h5> <h5><strong>Living area: {sqft}</strong></h5>
                                </div>
                            </div>
                        </div>
                        <Accordion>
                            <Panel header={accordionMapHeader} eventKey="2" className="b">
                                <Panel header="Property on map">
                                    <div data-gmap="" data-address={address} className="gmap"></div>
                                </Panel>
                            </Panel>
                        </Accordion>
                        <div className="panel b">
                            <div className="panel-body">
                                <p id="description">{description}</p>
                            </div>
                        </div>
                        <Accordion>
                            <Panel header={accordionPropHeader} eventKey="2" className="b">
                                <Panel header="">
                                    <div className="panel-body">
                                        {facts}
                                        {county}
                                        {status}
                                        {daysOnMarket}
                                    </div>
                                </Panel>
                            </Panel>
                        </Accordion>

                        {schools}
                    </div>
                    <div className="panel-foot">
                        <div id="listing-footer" className="row">
                            <div id="listing-footer-left" className="col-md-6 text-left">
                                <Link to={"/unsubscribe/"+this.state.token}>
                                    Click Here to Unsubscribe<br/>
                                </Link>

                            </div>
                            <div id="listing-footer-right" className="col-md-6 text-right">
                                <a href="https://listing2text.com/terms-of-use/">Terms of use&nbsp;</a><b>|&nbsp;</b>
                                <a href="https://listing2text.com/privacy-policy/">Privacy
                                    Policy&nbsp;</a><b>|&nbsp;</b>
                                <a href="http://support.listing2text.com/">Support</a>

                                <h4>Powered By</h4>
                                <a href="https://listing2text.com/"><img src="/img/logoColor.png" alt="App Logo"
                                                                         width="30%" height="30%"
                                                                         className="img-responsive" id="footer-image"/></a>

                            </div>
                        </div>
                    </div>
                </div>
        }
        return (
            <ContentWrapper id="listing-content-wrapper">
                {content}
            </ContentWrapper>
        )
    }

}

export default ListingPage;
