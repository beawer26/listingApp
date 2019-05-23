import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import {History, Redirect} from 'react-router-dom';
import {Row, Col, Panel, Table} from 'react-bootstrap';
import Http from '../../utils/http'

class CustomerBilling extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: '',
            loading: true,
            updated: true,
            user_id: props.match.params.user_id
        }

    }

    componentDidUpdate() {
        if(this.state.updated == true) {
            Http.get('customer-billing/'+this.state.user_id)
                .then(res => {
                    let billing_list = [];
                    res['data'].map((billing, index) => {
                        let new_arr = []
                        new_arr['id'] = billing['id'];
                        new_arr['created'] = billing['current_period_start'];
                        new_arr['plan'] = billing['stripe_plan']
                        new_arr['amount'] = "$"+billing['plan_amount'];
                        billing_list[index] = new_arr;
                    })
                    this.setState({
                        data: billing_list,
                        loading: false,
                        updated: false
                    });
                })
                .catch((err) => {

                })
        }
    }



    render() {
        let content;
        let loader;
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
            content = this.state.data.map((billing, index) => {
                return (
                    <tr key={index}>
                        <td>{billing.id}</td>
                        <td>{billing.created}</td>
                        <td>{billing.plan}</td>
                        <td>{billing.amount}</td>
                    </tr>
                )
            })
            loader = <div></div>


        }
        return (
            <ContentWrapper>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Billing History
                    </div>
                    {/* START table-responsive */}
                    <Table id="client_table" responsive bordered hover>
                        <thead>
                        <tr>
                            <th>SID</th>
                            <th>Paid on</th>
                            <th>Package</th>
                            <th>Amount</th>
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

export default CustomerBilling;
