import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import {Link, History, Redirect} from 'react-router-dom';
import {Row, Col, Panel, Table, ButtonToolbar, DropdownButton, MenuItem} from 'react-bootstrap';
import SweetAlert from 'sweetalert2-react';
import Http from '../../utils/http'

class UsersList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: '',
            loading: true,
            updated: true,
            checked: true
        }

        this.handleSuspend = this.handleSuspend.bind(this)
        this.handleCheckAll = this.handleCheckAll.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.showClients = this.showClients.bind(this)
    }

    componentDidUpdate() {
        if(this.state.updated == true) {
            $('#check_all').prop('checked', false);
            Http.get('get-users')
                .then(res => {
                    let users_list = [];
                    res['data'].map((users, index) => {
                        let new_arr = []
                        new_arr['id'] = users['user_id'];
                        new_arr['email'] = users['user_email']
                        new_arr['phone'] = users['phone']
                        let name = users['user_name'].split(" ")
                        new_arr['first_name'] = name[0]
                        new_arr['last_name'] = name[1]
                        let x = (users['plan_buyers'] - users['buyers_left']) / users['plan_buyers'] * 100
                        new_arr['clients'] = x % 5 < 3 ? (x % 5 === 0 ? x : Math.floor(x / 5) * 5) : Math.ceil(x / 5) * 5;
                        new_arr['company'] = users['company']
                        new_arr['plan'] = users['stripe_plan']
                        new_arr['billing_date'] = users['current_period_start']
                        if (users['status'] == true) {
                            new_arr['status'] = 'Suspend'
                        }
                        else {
                            new_arr['status'] = 'Un-suspend'
                        }
                        new_arr['license'] = users['license']
                        users_list[index] = new_arr;
                    })
                    this.setState({
                        data: users_list,
                        loading: false,
                        updated: false,
                    });
                })
                .catch((err) => {

                })
        }
    }

    handleSuspend(e)
    {
        let id = this.state.id

                Http.get('suspend-subscription/'+id)
                    .then(res =>{
                        this.setState({updated: true,
                        show: false})
                    })
                    .catch((err) => {

                    })

    }

    showClients(e)
    {
        e.preventDefault();
        let id = e.currentTarget.id;
        this.props.history.push(`/customer-clients/`+id);
    }

    handleCheckAll(e)
    {
        e.preventDefault()
        if(this.state.checked === true) {
            $(':checkbox').prop('checked', this.state.checked);
            this.setState({checked: false})
        }
        else{
            $(':checkbox').prop('checked', this.state.checked)
            this.setState({checked: true})
        }
    }

    handleDelete(e)
    {
        let newArr = []
        $(":checkbox").each(function(index, element){
            if(element.checked && element.id !== 'check_all'){
                newArr.push(element.id);
            }
        });
        Http.post('user-delete', newArr)
            .then(res=>{
                this.setState({updated: true,
                show_del: false})
            })
    }



    render() {
        let content;
        let loader;
        let border_style = '';
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
            content = this.state.data.map((users, index) => {
                if(users.status === 'Un-suspend'){
                    border_style = "danger";
                }
                else{
                    border_style="";
                }
                new_phone = users.phone.replace(/\D+/g, '')
                    .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                return (
                    <tr key={index} id={users.id} onDoubleClick={this.showInfo}  className={border_style}>
                        <td>{users.id}</td>
                        <td title={users.first_name} className="tr-overflow"><div className="div-ellipsis">{users.first_name}</div></td>
                        <td title={users.last_name} className="tr-overflow"><div className="div-ellipsis">{users.last_name}</div></td>
                        <td title={users.company} className="tr-overflow"><div className="div-ellipsis">{users.company}</div></td>
                        <td title={users.license} className="tr-overflow"><div className="div-ellipsis">{users.license}</div></td>
                        <td title={users.plan} className="tr-overflow"><div className="div-ellipsis">{users.plan}</div></td>
                        <td title={users.billing_date} className="tr-overflow"><div className="div-ellipsis">{users.billing_date}</div></td>
                        <td title={users.email} className="tr-overflow"><div className="div-ellipsis"><a href={"mailto:"+users.email}>{users.email}</a></div></td>
                        <td title={new_phone} className="tr-overflow"><div className="div-ellipsis"><a href={"tel:"+new_phone}>{new_phone}</a></div></td>
                        <td className="text-center subscribers" id={users.id} onClick={this.showClients}>
                            <div data-label={users.clients} className={"radial-bar radial-bar-"+users.clients+" radial-bar-xs"}></div>
                        </td>
                        <td>
                            <ButtonToolbar>
                                <DropdownButton bsStyle="primary" title="action" id="action">
                                    <MenuItem eventKey="1" onSelect={() => this.props.history.push('/customer-info/'+users.id)}>Profile</MenuItem>
                                    <MenuItem eventKey="2" onSelect={() => this.props.history.push('/customer-clients/'+users.id)}>Clients List</MenuItem>
                                    <MenuItem eventKey="3" onSelect={() => this.props.history.push('/customer-billing/'+users.id)}>
                                            Billing Info
                                    </MenuItem>
                                    <MenuItem eventKey="4" onSelect={() => this.setState({ show: true, id: users.id })}>
                                        {users.status}
                                    </MenuItem>
                                </DropdownButton>
                            </ButtonToolbar>
                        </td>
                            <SweetAlert
                                show={this.state.show}
                                title="Change users subscription status?"
                                showCancelButton
                                onConfirm={this.handleSuspend}
                                onCancel={() => {this.setState({ show: false });}}
                            />
                        <td>
                            <div data-toggle="tooltip" data-title="Check User" className="checkbox c-checkbox">
                                <label>
                                    <input type="checkbox" id={users.id}/>
                                    <em className="fa fa-check"></em>
                                </label>
                            </div>
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
                        <h3>List of all Users</h3>
                    </div>
                    {/* START table-responsive */}
                    <Table id="client_table" responsive bordered hover>
                        <thead>
                        <tr>
                            <th>UID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Company</th>
                            <th>License</th>
                            <th>Package</th>
                            <th>Billing Date</th>
                            <th className="email-overflow">Email</th>
                            <th>Phone</th>
                            <th>Subscribers</th>
                            <th></th>
                            <th data-check-all="data-check-all">
                                <div data-toggle="tooltip" data-title="Check All" onClick={this.handleCheckAll} className="checkbox c-checkbox">
                                    <label>
                                        <input type="checkbox" id="check_all" />
                                        <em className="fa fa-check"></em>
                                    </label>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {content}
                        </tbody>
                    </Table>
                    {loader}
                    {/* END table-responsive */}
                    <div className="panel-footer">
                        <Row>
                            <Col lg={2}>

                            </Col>
                            <Col lg={8}></Col>
                            <Col lg={2}>
                                <div className="input-group pull-right">
                                    <span className="input-group-btn">
                                              <button className="btn btn-danger" onClick={() => this.setState({ show_del: true})}>Delete selected users</button>
                                        <SweetAlert
                                            show={this.state.show_del}
                                            title="Delete selected users?"
                                            showCancelButton
                                            onConfirm={this.handleDelete}
                                            onCancel={() => {this.setState({ show_del: false });}}
                                        />
                                           </span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </ContentWrapper>
        )
    }

}

export default UsersList;
