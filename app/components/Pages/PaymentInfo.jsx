import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import {Panel} from 'react-bootstrap';
import {History, Redirect} from 'react-router-dom';
import SweetAlert from 'sweetalert2-react';
import Http from '../../utils/http'

class PaymentInfo extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: '',
            loading: true,
            plans: '',
            selected_plan: '',
            credentials: {
                plan_name: '',
            },
            card_credentilas: {
                number: '',
                exp_month: '',
                exp_year: '',
                cvc: ''
            },
            sub_button: '',
            update: true,
            sub_style: ''

        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSubmitCard = this.handleSubmitCard.bind(this)
        this.handleSuspend = this.handleSuspend.bind(this)
    }

    componentDidUpdate() {
        $('#cvc').inputmask('999')
        $('#startDate').monthpicker({changeYear: true, minDate: "+1 M", maxDate: "+100 Y"});
        $('#number').inputmask('9999 9999 9999 9999')
        Stripe.setPublishableKey('pk_live_WLY9LVSnLmmSmkANTW1M9tag');
        let form = $('#paymentcard-form');
        $.validator.addMethod('checkCard', function (value, element, param) {

            return Stripe.card.validateCardNumber(value);
        }, 'Enter valid credit card number');
        $.validator.addMethod('checkExpiry', function (value, element, param) {

            let expiry = value.split('/');
            return Stripe.card.validateExpiry(expiry[0], expiry[1])
        }, 'Enter valid expiry date');
        $.validator.addMethod('checkCvc', function (value, element, param) {

            return Stripe.card.validateCVC(value);
        }, 'Enter valid cvc number');
        form.validate({
            errorPlacement: function errorPlacement(error, element) {
                element.before(error);
            },
            rules: {
                cardNumber: {
                    checkCard: true
                },

                startDate: {
                    checkExpiry: true
                },

                cvc: {
                    checkCvc: true
                }

            }
        });

    }

    componentDidMount() {

        if (this.state.update == true) {
            const user = localStorage.getItem('user_id')
            const status = localStorage.getItem('user_status')
            let button
            let style
            if (status == true) {
                button = 'Cancel Subscription';
                style = 'btn btn-danger'
            }
            else {
                button = 'Reactivate Subscription';
                style = 'btn btn-success'
            }

            Http.get('payment/' + user)
                .then(res => {
                    this.setState({
                        data: res['data'],
                        selected_plan: res['data']['plan_name'],
                        loading: false,
                        sub_button: button,
                        sub_style: style
                    })
                })
                .catch(err => {

                })
            Http.get('plans')
                .then(res => {
                    let plans_list = [];
                    let selected = false
                    res['data'].map((plans, index) => {

                        let new_arr = []
                        new_arr['id'] = plans['plan_id'];
                        new_arr['name'] = plans['plan_name'];
                        new_arr['amount'] = plans['plan_amount'];
                        new_arr['statement_descriptor'] = plans['plan_description'];
                        new_arr['buyers'] = plans['plan_buyers'];
                        new_arr['sms'] = plans['plan_sms'];
                        plans_list[index] = new_arr
                    })
                    this.setState({
                        plans: plans_list,
                        update: false
                    })
                })
                .catch(err => {

                })
        }
    }


    handleSubmit(e) {
        e.preventDefault()
        let data = {};
        const user = localStorage.getItem('user_id')
        data['plan_name'] = $('#plan').val();
        Http.post('sub-update/' + user, data)
            .then(res => {
                this.props.history.push('/clients', 1500)
            })
            .catch(err => {

            })
    }

    handleSubmitCard(e) {
        e.preventDefault();
        let form = $('#paymentcard-form');
        if (form.valid()) {
            let data = {};
            let expiry = $('#startDate').val().split("/")
            const user = localStorage.getItem('user_id')
            data['number'] = $('#number').val();
            data['exp_month'] = expiry[0];
            data['exp_year'] = expiry[1];
            data['cvc'] = $('#cvc').val();
            Http.post('card-update/' + user, data)
                .then(res => {
                    this.props.history.push('/clients', 1500)
                })
                .catch(err => {

                })
        }
    }

    handleSuspend(e) {
        const user = localStorage.getItem('user_id');
        let status = localStorage.getItem('user_status')
        let button;
        let style;
        if (status == true) {
            button = 'Reactivate Subscription';
            style = 'btn btn-success';
            status = false
        }
        else {
            button = 'Cancel Subscription';
            style = 'btn btn-danger';
            status = true
        }
        Http.get('suspend-subscription/' + user)
            .then(res => {
                localStorage.setItem('user_status', status)
                this.setState({
                    sub_button: button,
                    show_del: false,
                    update: true,
                    sub_style: style
                })
            })
            .catch(err => {

            })
    }

    render() {
        let content;
        const user = localStorage.getItem('user_id');
        if (user == 1) {
            return <Redirect to="/users-list"/>
        }
        let plan;
        let selected = [];
        if (this.state.loading) {
            content =
                <div className="panel b mt-xxxl payment-panel">
                    <div className="panel-body text-center bb">
                        <div className="text-bold">Payment Information</div>
                    </div>
                    <Panel className="loader-demo">
                        <div className="ball-beat">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </Panel>
                </div>
        } else {
            plan = this.state.plans.map((plans, index) => {
                if (plans.id === this.state.selected_plan) {
                    selected = plans;
                }
                return (
                    <option key={index} value={plans.id}>{plans.name}&nbsp;/&nbsp;${plans.amount}.</option>
                )
            })
            content =
                <div>
                <div className="panel b mt-xxxl payment-panel">
                    <div className="panel-body text-center bb">
                        <div className="text-bold">Payment Information</div>
                        <p className="text-primary">{this.state.message}</p>
                    </div>
                    <div className="row">
                        <div className="panel-body">
                            <div className="col-md-6">
                                <label>Selected subscription:</label>
                                <p>{selected.name}, Buyers: {selected.buyers}, Sms: {selected.sms}.</p>
                                <p>Cost: ${selected.amount} per month</p>

                                <br/>
                                <form id="paymentinfo-form" onSubmit={this.handleSubmit}>
                                    <label>Change subscription:</label>
                                    <select id="plan" name="plan" className="form-control" defaultValue={selected.id}>
                                        {plan}
                                    </select>
                                    <br/>
                                    <br />
                                    <br />
                                    <div className="text-right">
                                        <button type="submit" className="btn btn-primary">Update Plan</button>
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-6">
                                <form id="paymentcard-form" onSubmit={this.handleSubmitCard}>
                                    <label>Your credit card:</label>
                                    <p>{this.state.data.brand}: *{this.state.data.last4}</p>
                                    <p>Expiry date: {this.state.data.exp_month}/{this.state.data.exp_year}</p>
                                    <div className="form-group">
                                        <label>New Credit Card Number*</label>
                                        <input id="number" name="cardNumber"
                                               size="20" maxLength="19" placeholder="____ ____ ____ ____"
                                               className="form-control"/>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-5">
                                            <div className="form-group">
                                                <label>Expiry date*</label>
                                                {/*<input type="text" id="expiry" name="expiry" placeholder="mm/yyyy"*/}
                                                {/*value={this.state.expiry} size="7" maxLength="7"*/}
                                                {/*className="form-control"/>*/}
                                                <input name="startDate" id="startDate"
                                                       className="date-picker form-control"/>
                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                            <div className="form-group">
                                                <label>CVC*</label>
                                                <input id="cvc" name="cvc" size="3" maxLength="3"
                                                       placeholder="___"
                                                       className="form-control"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <button type="submit" className="btn btn-primary">Update Card</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <br/>

                </div>
                    <div className="panel b mt-xxxl payment-panel">
                        <label>Cancel your subscription</label>
                <div className="panel-body text-right">

                <button className={this.state.sub_style}
            onClick={() => this.setState({show_del: true})}>{this.state.sub_button}</button>
        <SweetAlert
            show={this.state.show_del}
            title={this.state.sub_button + "?"}
            showCancelButton
            onConfirm={this.handleSuspend}
            onCancel={() => {
                this.setState({show_del: false});
            }}
            />
        </div>
                    </div>
            </div>

        }
        return (
            <ContentWrapper>
                {content}
            </ContentWrapper>
        );
    }

}

export default PaymentInfo;
