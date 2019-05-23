import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import ReeValidate from 'ree-validate';
import { FormControl} from 'react-bootstrap';
import {History, Redirect} from 'react-router-dom';
import Http from '../../utils/http'



class NewPlan extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            credentials:
                {
                    plan_id: '',
                    plan_name: '',
                    plan_amount: '',
                    plan_description: '',
                    plan_buyers: '',
                    plan_sms: '',
                    plan_notification: false,
                    plan_showing: false,
                    plan_trial: false
                },
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        e.preventDefault()
        const {name, value} = e.target;
        this.setState({credentials: {...this.state.credentials, [name]: value}});

    }

    handleSubmit(e) {
        e.preventDefault()
        let form = $('#plan-form')
        if(form.valid()) {
            Http.post('add-plan', this.state.credentials)
                .then(res => {
                    this.props.history.push('/subscription-plans')
                })
        }
    }

    handleCheck(e)
    {
        if(this.state.credentials.plan_notification == true) {
            this.setState({credentials: {...this.state.credentials, plan_notification: false}});
        }
        else{
            this.setState({credentials: {...this.state.credentials, plan_notification: true}});

        }
    }

    handleCheckShowing(e)
    {
        if(this.state.credentials.plan_showing == true) {
            this.setState({credentials: {...this.state.credentials, plan_showing: false}});
        }
        else{
            this.setState({credentials: {...this.state.credentials, plan_showing: true}});

        }
    }

    handleCheckTrial(e)
    {
        if(this.state.credentials.plan_trial == true) {
            this.setState({credentials: {...this.state.credentials, plan_trial: false}});
        }
        else{
            this.setState({credentials: {...this.state.credentials, plan_trial: true}});

        }
    }

    render() {
        const user = localStorage.getItem('user_id');
        if(user != 1){
            return <Redirect to="/clients" />
        }
        return (
            <ContentWrapper>
                <div className="panel b mt-xxl wd-xxl">
                    <div className="panel-body text-center bb">
                        <div className="h3 text-bold">Add new Subscription Plan</div>
                    </div>
                    <form id="plan-form" onSubmit={this.handleSubmit}>
                        <div className="panel-body">
                            <label htmlFor="plan_id">Plan ID *</label>
                            <FormControl id="plan_id" name="plan_id" type="text"
                                         className="form-control required"
                                         value={this.state.credentials.plan_id}
                                         onChange={this.handleChange}/>
                            <label htmlFor="plan_name">Plan Name *</label>
                            <FormControl id="plan_name" name="plan_name" type="text"
                                         className="form-control required"
                                         value={this.state.credentials.plan_name}
                                         onChange={this.handleChange}/>
                            <label htmlFor="plan_amount">Plan Amount *</label>
                            <FormControl id="plan_amount" name="plan_amount" type="text"
                                         className="form-control number required"
                                         value={this.state.credentials.plan_amount}
                                         onChange={this.handleChange}/>
                            <label htmlFor="plan_description">Plan Description *</label>
                            <textarea id="plan_description" name="plan_description" type="text"
                                         className="form-control required"
                                         value={this.state.credentials.plan_description}
                                         onChange={this.handleChange}/>
                            <label htmlFor="plan_buyers">Plan Buyers Amount *</label>
                            <FormControl id="plan_buyers" name="plan_buyers" type="number"
                                         className="form-control required"
                                         value={this.state.credentials.plan_buyers}
                                         onChange={this.handleChange}/>
                            <label htmlFor="plan_sms">Plan SMS per Month Amount *</label>
                            <FormControl id="plan_sms" name="plan_sms" type="text"
                                         className="form-control required"
                                         value={this.state.credentials.plan_sms}
                                         onChange={this.handleChange}/>
                            <div className="checkbox c-checkbox">
                                <label>
                                    <input type="checkbox" id="plan_notification" name="plan_notification" checked={this.state.credentials.plan_notification} onChange={this.handleCheck.bind(this)}/>
                                    <em className="fa fa-check"></em>Enable sms notification</label>
                            </div>
                            <div className="checkbox c-checkbox">
                                <label>
                                    <input type="checkbox" id="plan_showing" name="plan_showing" checked={this.state.credentials.plan_showing} onChange={this.handleCheckShowing.bind(this)}/>
                                    <em className="fa fa-check"></em>Enable showing request</label>
                            </div>
                            <div className="checkbox c-checkbox">
                                <label>
                                    <input type="checkbox" id="plan_trial" name="plan_trial" checked={this.state.credentials.plan_trial} onChange={this.handleCheckTrial.bind(this)}/>
                                    <em className="fa fa-check"></em>Enable plan month trial period</label>
                            </div>
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">Save Plan</button>
                        </div>
                        <br />
                    </form>
                </div>
            </ContentWrapper>
        );
    }

}

export default NewPlan;
