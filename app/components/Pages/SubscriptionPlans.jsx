import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import {Link, History, Redirect} from 'react-router-dom';
import {Panel, Table, ButtonToolbar, DropdownButton, MenuItem, Modal, FormControl} from 'react-bootstrap';
import SweetAlert from 'sweetalert2-react';
import Http from '../../utils/http'

class SubscriptionPlans extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: '',
            loading: true,
            updated: true,
            credentials:{
                plan_id:"",
                plan_name:"",
                plan_amount:"",
                plan_buyers:"",
                plan_sms:"",
                plan_description:"",
                plan_notification: false,
                plan_showing: false,
                plan_trial: false
            },
        }

        this.handleDelete = this.handleDelete.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidUpdate() {
        if (this.state.updated == true) {
            Http.get('plans')
                .then(res => {
                    let plans_list = [];
                    res['data'].map((plans, index) => {

                        let new_arr = []
                        new_arr['plan_id'] = plans['plan_id'];
                        new_arr['plan_name'] = plans['plan_name'];
                        new_arr['plan_amount'] = plans['plan_amount'];
                        new_arr['plan_buyers'] = plans['plan_buyers'];
                        new_arr['plan_sms'] = plans['plan_sms'];
                        new_arr['plan_description'] = plans['plan_description'];
                        new_arr['plan_notification'] = plans['plan_notification'];
                        new_arr['plan_showing'] = plans['plan_showing'];
                        new_arr['plan_trial'] = plans['plan_trial'];

                        plans_list[index] = new_arr;
                    })
                    this.setState({
                        data: plans_list,
                        loading: false,
                        updated: false
                    });
                })
                .catch((err) => {

                })
        }
    }

    handleDelete(e) {
        let id = this.state.id
        Http.delete('delete-plan/' + id)
            .then(res => {
                this.setState({updated: true,
                show: false})
            })

    }

    open(e){
        let id = e;
        this.setState({showModal: true,
        credentials:{
            plan_id: this.state.data[id].plan_id,
            plan_name: this.state.data[id].plan_name,
            plan_amount: this.state.data[id].plan_amount,
            plan_buyers: this.state.data[id].plan_buyers,
            plan_sms: this.state.data[id].plan_sms,
            plan_description: this.state.data[id].plan_description,
            plan_notification: this.state.data[id].plan_notification,
            plan_showing: this.state.data[id].plan_showing,
            plan_trial: this.state.data[id].plan_trial
        }})
    }

    close(e) {
        this.setState({
            showModal: false
        });
    }

    handleSubmit(e)
    {
        e.preventDefault();
        const id = e.target.id;
        const form = $('#'+id);
        if(form.valid()) {
            const {credentials} = this.state;
            Http.post('edit-plan', credentials)
                .then(res => {
                    this.setState({
                        updated: true,
                        showModal: false
                    })
                })
                .catch(err => {

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

    handleChange(e)
    {
        e.preventDefault();
        const {name, value} = e.target;
        this.setState({credentials: {...this.state.credentials, [name]: value}});
    }

    render() {
        let content;
        let loader;
        let notify = "";
        let showing = "";
        let trial = "";
        const user = localStorage.getItem('user_id');
        if (user != 1) {
            return <Redirect to="/clients"/>
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
            content = this.state.data.map((plans, index) => {
                if(plans.plan_notification == 1){
                    notify = "green";
                }
                else{
                    notify = "danger";
                }
                if(plans.plan_showing == 1){
                    showing = "green";
                }
                else{
                    showing = "danger";
                }
                if(plans.plan_trial == 1){
                    trial = "green";
                }
                else{
                    trial = "danger";
                }
                return (
                    <tr key={index} onClick={this.handleEdit}>
                        <td>{plans.plan_id}</td>
                        <td>{plans.plan_name}</td>
                        <td>{plans.plan_amount}</td>
                        <td>{plans.plan_buyers}</td>
                        <td>{plans.plan_sms}</td>
                        <td title={plans.plan_description} className="tr-overflow"><div className="div-ellipsis">{plans.plan_description}</div></td>
                        <td className="text-center"><span className={"circle circle-"+notify+" notify-circle"}>&nbsp;</span></td>
                        <td className="text-center"><span className={"circle circle-"+showing+" notify-circle"}>&nbsp;</span></td>
                        <td className="text-center"><span className={"circle circle-"+trial+" notify-circle"}>&nbsp;</span></td>
                        <td>
                           <ButtonToolbar>
                                <DropdownButton bsStyle="primary" title="action" id="action">
                                    <MenuItem eventKey="1" onSelect={() => this.setState({show: true, id: plans.plan_id})}>Delete Plan</MenuItem>
                                    <MenuItem eventKey={index} onSelect={this.open.bind(this)}>Edit Plan</MenuItem>
                                </DropdownButton>
                            </ButtonToolbar>
                            <SweetAlert
                                show={this.state.show}
                                title="Delete Subscription Plan?"
                                showCancelButton
                                onConfirm={this.handleDelete}
                                onCancel={() => {
                                    this.setState({show: false});
                                }}
                            />
                            <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
                                <form id={"edit-form"+index} onSubmit={this.handleSubmit.bind(this)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Edit Plan Information</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <label htmlFor="plan_name">Plan Name</label>
                                        <FormControl id="plan_name" name="plan_name" type="text"
                                                     className="form-control required"
                                                     value={this.state.credentials.plan_name}
                                                     onChange={this.handleChange}/>
                                        <label htmlFor="plan_amount">Plan Amount</label>
                                        <FormControl id="plan_amount" name="plan_amount" type="text"
                                                     className="form-control number required"
                                                     value={this.state.credentials.plan_amount}
                                                     onChange={this.handleChange}/>
                                        <label htmlFor="plan_description">Plan Description</label>
                                        <textarea id="plan_description" name="plan_description" type="text"
                                                     className="form-control required"
                                                     value={this.state.credentials.plan_description}
                                                     onChange={this.handleChange}/>
                                        <label htmlFor="plan_buyers">Plan Buyers Amount</label>
                                        <FormControl id="plan_buyers" name="plan_buyers" type="number"
                                                     className="form-control required"
                                                     value={this.state.credentials.plan_buyers}
                                                     onChange={this.handleChange}/>
                                        <label htmlFor="plan_sms">Plan SMS per Month Amount</label>
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
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <button type="submit" className="btn btn-primary">Update</button>
                                    </Modal.Footer>
                                </form>
                            </Modal>
                        </td>
                    </tr>
                )
            })
            loader = <div></div>


        }
        return (
            <ContentWrapper>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3>Subscription Plans List</h3>
                        <Link to="new-plan" title="New Subscription Plan" className="ml4">
                            <button className="btn btn-success">Add new plan</button>
                        </Link>
                    </div>
                    {/* START table-responsive */}
                    <Table id="client_table" responsive bordered hover>
                        <thead>
                        <tr>
                            <th>Plan ID</th>
                            <th>Plan Name</th>
                            <th>Amount</th>
                            <th>Buyers</th>
                            <th>Sms</th>
                            <th>Description</th>
                            <th>Sms notifications</th>
                            <th>Showing request</th>
                            <th>Trial period</th>
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

export default SubscriptionPlans;
