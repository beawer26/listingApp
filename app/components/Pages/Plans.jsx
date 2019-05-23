import React from 'react';
import {Row, Col, Panel} from 'react-bootstrap';
import {Link, History, Redirect} from 'react-router-dom';
import Http from '../../utils/http'

import Footer from '../Layout/Footer'
import Header from '../Layout/RegisterHeader'

class Plans extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plans: '',
            loading: true
        }
    }

    componentWillMount() {
        Http.get('plans')
            .then(res => {
                this.setState({
                    plans: res['data'],
                    loading: false
                })
            })
            .catch(err => {

            })
    }


    render() {
        let content;
        const user = localStorage.getItem('user_id');
        let notify = ''
        let showing = '';
        let trial = '';
        if(user){
            return <Redirect to="/clients" />
        }
        if (this.state.loading) {
            content =
                <Panel className="loader-demo">
                    <div className="ball-beat">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </Panel>

        } else {
            let plan_list = this.state.plans
            plan_list.sort(function(a,b){
                if (a > b) return -1;
                if (a < b) return 1;
            })
            content = plan_list.map((plans, index) => {
                if(plans.plan_notification == 1){
                    notify = <li><em className="fa fa-check">Listing views sms notification</em></li>
                }
                else{
                    notify = <li>&nbsp;</li>
                }
                if(plans.plan_showing == 1){
                    showing = <li><em className="fa fa-check">Buyers showing request</em></li>
                }
                else{
                    showing = <li>&nbsp;</li>
                }
                if(plans.plan_trial == 1){
                    trial = <li><em className="fa fa-check">Month of trial period</em></li>
                }
                else{
                    trial = <li>&nbsp;</li>
                }
                return (
                    <Col md={4} key={index}>
                        <div className={"plan plan"+index}>
                            <h3 className="plan-header">{plans.plan_name}</h3>
                            <div className="plan-price">
                                <div className="text-lg"><sup>
                                    <small>$</small>
                                </sup>{plans.plan_amount}
                                </div>
                                <input type="hidden" id={plans.plan_name} value={plans.plan_amount} />
                            </div>
                            <ul className="plan-features">
                                <li>
                                    {plans.plan_description}</li>
                                <li>
                                    <em className="fa fa-check"></em>Maximum clients: {plans.plan_buyers}</li>
                                <li>
                                    <em className="fa fa-check"></em>SMS per month: {plans.plan_sms}</li>
                                {notify}
                                {showing}
                                {trial}
                            </ul>
                            <hr/>
                            <div className="text-center" id={plans.plan_amount}>
                                <Link to={"register/"+plans.plan_id} title="Choose subscription">
                                    <button key={index} className={"btn btn-primary btn-lg plan_button"+index} id={plans.plan_id}
                                            name={plans.plan_name}
                                            onClick={this.selectPlan}>Buy now
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </Col>
                )
            })

        }
        return (
            <div className="wrapper text-center" id="register-wrapper">
                <Header/>
                <div className="container container-md">
                    <div className="text-center mv-lg pv-lg">
                        <div className="h2 text-bold">Select subscription plan</div>
                    </div>
                    {/* START PLAN TABLE */}
                    <Row>
                        {content}
                    </Row>
                </div>
                <Footer/>
            </div>
        )


    }
}

export default Plans;
