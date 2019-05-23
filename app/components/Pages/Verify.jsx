import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import {Row, Panel} from 'react-bootstrap';
import { History, Link } from 'react-router-dom';
import Http from '../../utils/http'


class Verify extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            token: props.match.params.token,
            loading: true
        }
    }

    componentDidMount()
    {
        Http.get('verify/'+this.state.token)
            .then(res => {
                this.setState({
                    loading: false
                })
            })
    }

    render() {
        let content
        if(this.state.loading == true){
           content =
                    <Panel className="loader-demo">
                        <div className="ball-beat">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </Panel>
        }
        else{
            content =
                <div className="text-center mv-lg pv-lg">
                    <Link to="/login" title="Login Page">
                        <p>Now you can Log In</p>
                    </Link>
                </div>
        }
        return (
            <div>
                <div className="container container-md">
                    <div className="text-center mv-lg pv-lg">
                        <div className="h2 text-bold">Thank you for registration in Listing2Text</div>
                    </div>
                    {/* START PLAN TABLE */}
                    <div>
                        {content}
                    </div>
                </div>
            </div>
        )
    }

}

export default Verify;
