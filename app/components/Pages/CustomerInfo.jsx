import React from 'react';
import { History, Redirect} from 'react-router-dom';
import { Panel } from 'react-bootstrap';
import ContentWrapper from '../Layout/ContentWrapper';

import Http from '../../utils/http'



class CustomerInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: '',
            user_id: props.match.params.user_id,
            loading: true
        }
    }


    componentDidMount() {
        Http.get('profiles/'+this.state.user_id)
            .then(res=>{
                this.setState({
                    data: res['data'],
                    loading: false
                })
            })

    }


    render() {
        let content;
        const user = localStorage.getItem('user_id');
        if(user != 1){
            return <Redirect to="/clients" />
        }
        if (this.state.loading) {
            content =
                <div className="panel b mt-xxl wd-xxl">
                    <div className="panel-body text-center bb">
                        <div className="text-bold">Contact information</div>
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
            content =
                <div className="panel b mt-xxl register-page">
                    <div className="panel-body text-center bb">
                        <div className="text-bold">Contact information</div>
                    </div>

                    <div className="panel-body">
                        <label htmlFor="user_name">Name</label>
                        <p>{this.state.data.user_name}</p>
                        <label htmlFor="user_email">Email</label>
                        <p>{this.state.data.user_email}</p>
                        <label htmlFor="phone">Phone</label>
                        <p>{this.state.data.phone}</p>
                        <label htmlFor="mobile">Mobile</label>
                        <p>{this.state.data.mobile}</p>
                        <label htmlFor="address">Address</label>
                        <p>{this.state.data.address}</p>
                        <label htmlFor="city">City</label>
                        <p>{this.state.data.city}</p>
                        <label htmlFor="state">State</label>
                        <p>{this.state.data.state}</p>
                        <label htmlFor="zip">Zip</label>
                        <p>{this.state.data.zip}</p>

                        <label htmlFor="logo">Company logo</label>
                        <br />
                        <img width="200px" src={"https://api.listing2text.com/upload/"+this.state.data.logo}></img>
                        <br/>
                        <label htmlFor="company">Company name</label>
                        <p>{this.state.data.company}</p>
                        <label htmlFor="website">Web site</label>
                        <p>{this.state.data.website}</p>
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


export default CustomerInfo;