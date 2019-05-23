import React from 'react'
import {History, Bro} from 'react-router-dom';

import Footer from '../Layout/Footer'
import Header from '../Layout/RegisterHeader'
import Http from "../../utils/http";

class Unsubscribe extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            token: props.match.params.token,
            msg: ''
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        Http.post('unsubscribe/' + this.state.token)
            .then(res => {
                this.setState({msg: 'You will no longer receive messages from Listing2Text'})
            })
            .catch(err => {

            })
    }

    handleBack(e)
    {
        e.preventDefault()
        this.props.history.goBack();
    }

    render() {
        let content = '';
        if(this.state.msg == ''){
            content = <div className="panel-body">
                <h3 className="text-center pv">Unsubscribe confirmation</h3>
                <form role="form" onSubmit={this.handleSubmit.bind(this)}>
                    <p className="text-center">Are you sure?</p>
                    <p className="text-center">You will not be able to receive listing search results.</p>
                    <div>
                        <div className="col-md-6">
                            <button onClick={this.handleBack.bind(this)} className="btn btn-success btn-block">Cancel</button>
                        </div>
                        <div className="col-md-6">
                            <button type="submit" className="btn btn-danger btn-block">Confirm</button>
                        </div>
                    </div>
                </form>
            </div>
        }
        else {
            content = <div className="panel-body">
                    <p className="text-center">{this.state.msg}</p>
            </div>
        }
        return (

            <div className="wrapper" id="reset-wrapper">
                <Header/>
                <div className="block-center mt-xl wd-xl">
                    {/* START panel */}
                    <div className="panel panel-dark panel-flat">

                        {content}
                    </div>
                    {/* END panel */}
                </div>
                <Footer/>
            </div>
        );
    }

}

export default Unsubscribe;