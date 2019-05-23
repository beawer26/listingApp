import React from 'react';
import {History, Redirect} from 'react-router-dom';
import Http from '../../utils/http';

import Footer from '../Layout/Footer'
import Header from '../Layout/RegisterHeader'

class Recover extends React.Component {
    constructor(props){
        super(props);
        this.state =  {
            email : '',
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleSubmit(e){
        e.preventDefault();
        const email = this.state.email;
        Http.post('emails', {email: email})
            .then(response=> {
                if(response['data'] === true){
                    this.setState({err: true});
                }
                else {
                    Http.post('password/email', {email: email})
                        .then(response => {
                            this.setState({err: false});
                            setTimeout(() => {
                                this.props.history.push(`/login`);
                            }, 3000)
                        })
                        .catch(error => {
                            this.setState({err: true});
                        });
                }
            })
    }


    handleChange(e){
        const email = e.target.value;
        this.setState({email : email});
    }

    render() {
        let error = this.state.err ;
        let msg = (!error) ? 'We have e-mailed your password reset link!' : 'User doesn\'t exist' ;
        let name = (!error) ? 'alert alert-success' : 'alert alert-danger' ;
        const user = localStorage.getItem('user_id');
        if(user){
            return <Redirect to="/clients" />
        }
        return (
            <div className="wrapper" id="reset-wrapper">
                <Header/>
            <div className="block-center mt-xl wd-xl">
                { /* START panel */ }
                <div className="panel panel-dark panel-flat">

                    <div className="panel-body">
                        <p className="text-center pv">PASSWORD RESET</p>
                        <form role="form" onSubmit={this.handleSubmit}>
                            <p className="text-center">Fill with your mail to receive instructions on how to reset your password.</p>
                            <div className="form-group has-feedback">
                                <label htmlFor="email" className="text-muted">Email address</label>
                                {error != undefined && <p className="text-danger">{msg}</p>}
                                <input id="email" type="email" placeholder="Enter email" value={this.state.email} onChange={this.handleChange} autoComplete="off" className="form-control" />
                                <span className="fa fa-envelope form-control-feedback text-muted"></span>
                            </div>
                            <button type="submit" className="btn btn-danger btn-block">Reset</button>
                        </form>
                    </div>
                </div>
                { /* END panel */ }
            </div>
                <Footer/>
            </div>
            );
    }

}

export default Recover;

