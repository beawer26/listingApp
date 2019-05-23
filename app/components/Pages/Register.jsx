import React from 'react';
import {Panel, FormControl} from 'react-bootstrap';
import {History, Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import Http from '../../utils/http'


import Footer from '../Layout/Footer'
import Header from '../Layout/RegisterHeader'
import terms from "../../../termsOfUse"


class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            phone: '',
            mobile: '',
            website: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            file: '',
            company: '',
            number: '',
            expiry: '',
            cvc: '',
            plan: '',
            license: '',
            plan_name: '',
            plan_amount: '',
            plan_id: props.match.params.plan
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        Http.get('get-plan/' + this.state.plan_id)
            .then(res => {
                $('#plan-name').text(res['data']['plan_name'])
                $('#plan-amount').text(res['data']['plan_amount'] + '/pm')
            })
            .catch(err => {

            })
    }

    componentDidMount() {

        Stripe.setPublishableKey('pk_live_WLY9LVSnLmmSmkANTW1M9tag');


        function getFileParam() {
            try {
                var file = document.getElementById('file-upload').files[0];

                if (file) {
                    var fileSize = 0;

                    if (file.size > 1024 * 1024) {
                        fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                    } else {
                        fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
                    }

                    document.getElementById('file-name1').innerHTML = 'Logo: ' + file.name;
                    document.getElementById('file-size1').innerHTML = 'Logo size: ' + fileSize;

                    if (/\.(jpe?g|bmp|gif|png)$/i.test(file.name)) {
                        var elPreview = document.getElementById('preview1');
                        elPreview.innerHTML = '';
                        var newImg = document.createElement('img');
                        newImg.className = "preview-img";

                        if (typeof file.getAsDataURL == 'function') {
                            if (file.getAsDataURL().substr(0, 11) == 'data:image/') {
                                newImg.onload = function () {
                                    document.getElementById('file-name1').innerHTML += ' (' + newImg.naturalWidth + 'x' + newImg.naturalHeight + ' px)';
                                }
                                newImg.setAttribute('src', file.getAsDataURL());
                                elPreview.appendChild(newImg);
                            }
                        } else {
                            var reader = new FileReader();
                            reader.onloadend = function (evt) {
                                if (evt.target.readyState == FileReader.DONE) {
                                    newImg.onload = function () {
                                        document.getElementById('file-name1').innerHTML += ' (' + newImg.naturalWidth + 'x' + newImg.naturalHeight + ' px)';
                                    }

                                    newImg.setAttribute('src', evt.target.result);
                                    elPreview.appendChild(newImg);
                                }
                            };

                            var blob;
                            if (file.slice) {
                                blob = file.slice(0, file.size);
                            } else if (file.webkitSlice) {
                                blob = file.webkitSlice(0, file.size);
                            } else if (file.mozSlice) {
                                blob = file.mozSlice(0, file.size);
                            }
                            reader.readAsDataURL(blob);
                        }
                    }
                }
            } catch (e) {
                var file = document.getElementById('file-upload').value;
                file = file.replace(/\\/g, "/").split('/').pop();
                document.getElementById('file-name1').innerHTML = '���: ' + file;
            }
        }

        if (!$.fn.validate || !$.fn.steps) return;
        // FORM EXAMPLE
        var emails;
        var form = $("#register-form");

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
                password: {
                    minlength: 6
                },
                confirm: {
                    equalTo: "#password"
                },
                email: {
                    remote: {
                        method: 'POST',
                        url: 'https://api.listing2text.com/emails',
                        async: true,
                        data: {
                            data: function () {
                                return $("#email").val();
                            }
                        },
                        headers: {'Access-Control-Allow-Origin': '*'},
                        withCredentials: true,
                    }
                },
                cardNumber: {
                    checkCard: true,
                    // remote: {
                    //     method: 'POST',
                    //     url: 'https://api.listing2text.com/check-card',
                    //     async: true,
                    //     data: {
                    //         data: function () {
                    //             return $("#number").val();
                    //         }
                    //     },
                    //     headers: {'Access-Control-Allow-Origin': '*'},
                    //     withCredentials: true,
                    // }
                },

                startDate: {
                    checkExpiry: true
                },

                cvc: {
                    checkCvc: true
                }

            }
        });

        $('#wizard').steps({
            headerTag: "h4",
            bodyTag: "fieldset",
            transitionEffect: "slideLeft",
            onStepChanging: function (event, currentIndex, newIndex) {

                form.validate().settings.ignore = ":disabled,:hidden";
                $('#last_loader').hide()
                $('#step_5').hide()
                $(function () {
                    $('#startDate').monthpicker({changeYear: true, minDate: "+1 M", maxDate: "+100 Y"});
                    $('#file-upload').change(function () {
                        getFileParam()
                    })
                });
                $('#cvc').inputmask('999');
                $('#number').inputmask('9999 9999 9999 9999');
                $('#phone').inputmask('999-999-9999')
                $('#mobile').inputmask('999-999-9999')

                if (currentIndex > newIndex) {
                    return true;
                }

                return form.valid();
            },
            onStepChanged: function (event, currentIndex, priorIndex) {
                var currentStep = $("#wizard").steps("getStep", currentIndex);
                history.pushState(currentStep, currentStep.title, "");
                window.onpopstate = function (event) {
                    $("#wizard").steps("previous");
                };
            },
            onFinishing: function (event, currentIndex) {
                form.validate().settings.ignore = ":disabled";
                return form.valid();
            },
            onFinished: function (event, currentIndex) {
                var formD = new FormData();

                let expiry = $('#startDate').val().split("/");

                $('#payment-div').hide()
                $('#step_5').hide()
                $('ul').hide()
                $('#last_loader').show()

                formD.append('file', $('#file-upload')[0].files[0]);
                formD.append('email', $('#email').val());
                formD.append('password', $('#password').val());
                formD.append('name', $('#name').val());
                formD.append('phone', $('#phone').val());
                formD.append('mobile', $('#mobile').val());
                formD.append('method', $('#method').val());
                formD.append('website', $('#website').val());
                formD.append('address', $('#address').val());
                formD.append('city', $('#city').val());
                formD.append('company', $('#company').val());
                formD.append('state', $('#state').val());
                formD.append('zip', $('#zip').val());
                formD.append('plan', $('#plan-id').val());
                formD.append('number', $('#number').val());
                formD.append('exp_month', expiry[0]);
                formD.append('exp_year', expiry[1]);
                formD.append('cvc', $('#cvc').val());
                formD.append('license', $('#license').val())

                $.ajax({
                    method: 'POST',
                    url: 'https://api.listing2text.com/register',
                    contentType: false,
                    processData: false,
                    cache: false,
                    async: true,
                    data: formD,
                    headers: {'Access-Control-Allow-Origin': '*'},
                    withCredentials: true,
                }).done(function (data) {
                    //localStorage.setItem('access_token', data)
                    $('#last_loader').hide()
                    $('#step_5').show()
                })

            }
        });

    }

    handleChange(event) {

    }

    handleSubmit(event) {
        //const {email, password, } = this.state;
        axios.post('http://local.app.listing2text.com/register', this.state);
    }

    render() {
        const user = localStorage.getItem('user_id');
        if (user) {
            return <Redirect to="/clients"/>
        }
        return (
            <div className="wrapper" id="register-wrapper">
                <Header/>
                <div className="block-center register-page">
                    <h3>Registration</h3>
                    <Panel header="Account registration">
                        <form id="register-form" method="POST" encType="multipart/form-data">
                            <div id="wizard">
                                <h4>Account
                                </h4>
                                <fieldset>
                                    <label htmlFor="email">Email *</label>
                                    <FormControl id="email" name="email" type="text"
                                                 className="form-control required email input-width"
                                                 value={this.state.email}
                                                 onChange={this.handleChange}/>
                                    <label htmlFor="password">Password *</label>
                                    <FormControl id="password" name="password" type="password"
                                                 className="form-control required input-width"
                                                 value={this.state.password}
                                                 onChange={this.handleChange}/>
                                    <label htmlFor="confirm">Confirm Password *</label>
                                    <FormControl id="confirm" name="confirm" type="password"
                                                 className="form-control required input-width"/>
                                    <p>(*) Required fields</p>
                                </fieldset>
                                <h4>Profile
                                    <br/>
                                    <small></small>
                                </h4>
                                <fieldset>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label htmlFor="name">Name *</label>
                                            <FormControl id="name" name="name" type="text"
                                                         className="form-control required input-width"
                                                         value={this.state.name} onChange={this.handleChange}/>
                                            <label htmlFor="phone">Phone *</label>
                                            <input id="phone" name="phone"
                                                   className="form-control required input-width"
                                                   value={this.state.phone} placeholder="555-555-5555"/>
                                            <label htmlFor="mobile">Mobile</label>
                                            <input id="mobile" name="mobile"
                                                   className="form-control phone input-width"
                                                   value={this.state.mobile}
                                                   placeholder="555-555-5555"/>
                                            <label htmlFor="method">Notification Method</label>
                                            <select id="method" name="method" className="form-control input-width">
                                                <option value={0}>Text</option>
                                                <option value={1}>Email</option>
                                            </select>
                                            <label htmlFor="website">Web site</label>
                                            <FormControl id="website" name="website" type="text"
                                                         className="form-control phone input-width"
                                                         value={this.state.website}
                                                         onChange={this.handleChange}/>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="address">Address*</label>
                                            <FormControl id="address" name="address" type="text"
                                                         className="form-control required input-width"
                                                         value={this.state.address}
                                                         onChange={this.handleChange}/>
                                            <label htmlFor="city">City*</label>
                                            <FormControl id="city" name="city" type="text"
                                                         className="form-control required input-width"
                                                         value={this.state.city} onChange={this.handleChange}/>
                                            <label htmlFor="state">State*</label>
                                            <FormControl id="state" name="state" type="text"
                                                         className="form-control required input-width"
                                                         value={this.state.state} onChange={this.handleChange}/>
                                            <label htmlFor="zip">Zip*</label>
                                            <FormControl id="zip" name="zip" type="text"
                                                         className="form-control zip number required input-width"
                                                         value={this.state.zip} onChange={this.handleChange}/>
                                        </div>
                                    </div>
                                    <br/>
                                    <label htmlFor="file-upload" className="custom-file-upload">
                                        <i className="fa fa-cloud-upload"></i> Upload Company Logo
                                    </label>
                                    <input id="file-upload" className="form-control" type="file"/>
                                    <div id="preview1">&nbsp;</div>
                                    <div id="file-name1">&nbsp;</div>
                                    <div id="file-size1">&nbsp;</div>
                                    <label htmlFor="company">Company name*</label>
                                    <FormControl id="company" name="company" type="text"
                                                 className="form-control required input-width"
                                                 value={this.state.company}
                                                 onChange={this.handleChange}/>
                                    <label htmlFor="license">License Number*</label>
                                    <FormControl id="license" name="license" type="text"
                                                 className="form-control required input-width"
                                                 value={this.state.license}
                                                 onChange={this.handleChange}/>

                                    <p>(*) Required fields</p>
                                </fieldset>
                                <h4>Terms of Use</h4>
                                <fieldset>
                                    <div id="last_step">
                                        <p className="lead">Terms of use</p>
                                        <textarea id="terms" defaultValue={terms}>
                                        </textarea>
                                        <div>
                                            <div className="checkbox c-checkbox needsclick houses">
                                                <label className="needsclick">
                                                    <input type="checkbox" id="terms-use" name="terms-use"
                                                           className="needsclick required"/>
                                                    <em className="fa fa-check"></em>I agree with terms of use</label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <h4>Payment
                                </h4>
                                <fieldset>
                                    <div id="payment-div">
                                    <label>Selected subscription plan:</label>
                                    <p id="plan-name"></p>
                                    <em className="fa fa-usd"></em><label id="plan-amount"></label>
                                    <input id="plan-id" type="hidden" defaultValue={this.state.plan_id}/>
                                    <div className="form-group">
                                        <label>Credit Card Number*</label>
                                        <input id="number" name="cardNumber" value={this.state.number}
                                               size="20" maxLength="19" placeholder="____ ____ ____ ____"
                                               className="form-control required input-width"/>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-5">
                                            <div className="form-group">
                                                <label>Expiry date*</label>

                                                <input name="startDate" id="startDate"
                                                       className="date-picker form-control required"/>
                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                            <div className="form-group">
                                                <label>CVC*</label>
                                                <input id="cvc" name="cvc" size="3" maxLength="3"
                                                       placeholder="___" value={this.state.cvc}
                                                       className="form-control required"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt clearfix">
                                        <p className="pull-right text-sm"><i>Fields marked with (*) are required</i>
                                        </p>
                                    </div>
                                    </div>
                                <div>
                                        <div id="last_loader" className="panel b text-center">
                                            <p className="text-primary">Processing payment and registration</p>
                                            <div className="loader-demo text-center">
                                                <div className="ball-beat">
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="step_5" className="panel b text-center">
                                            <p className="text-primary">Thank you for signing up with Listing2Text. You
                                                purchase was successful.</p>
                                            <p>Please&nbsp;
                                                <Link to="https://app.listing2text.com/login" title="Log in">log in here</Link>
                                                &nbsp;and start adding buyers.</p>

                                        </div>
                                </div>
                                </fieldset>
                            </div>
                        </form>
                    </Panel>
                </div>
                <Footer/>
            </div>
        );
    }

}

export default Register;
