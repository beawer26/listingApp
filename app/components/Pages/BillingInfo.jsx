import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import {History, Redirect} from 'react-router-dom';
import {Panel, Table} from 'react-bootstrap';
import Http from '../../utils/http'

class BillingInfo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: '',
            loading: true,
            updated: true
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
        if(this.state.updated == true) {
            Http.get('billing-history')
                .then(res => {
                    let billing_list = [];
                    res['data'].map((billing, index) => {
                        let new_arr = []
                        new_arr['id'] = billing['id'];
                        var a = new Date(billing['created'] * 1000);
                        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        var year = a.getFullYear();
                        var month = months[a.getMonth()];
                        var date = a.getDate();
                        var hour = a.getHours();
                        var min = a.getMinutes();
                        var sec = a.getSeconds();
                        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
                        new_arr['created'] = time;
                        new_arr['customer'] = billing['customer']
                        new_arr['plan'] = billing['statement_descriptor']
                        new_arr['amount'] = billing['amount']/100 +' '+billing['currency'];
                        new_arr['status'] = billing['status']
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
                        <td>{billing.customer}</td>
                        <td>{billing.plan}</td>
                        <td>{billing.amount}</td>
                        <td>
                            {billing.status}
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
                        <h3>Billing History</h3>
                    </div>
                    {/* START table-responsive */}
                    <Table id="client_table" responsive bordered hover>
                        <thead>
                        <tr>
                            <th>CID</th>
                            <th>Paid on</th>
                            <th>Customer</th>
                            <th>Package</th>
                            <th>Amount</th>
                            <th>Status</th>
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

export default BillingInfo;
