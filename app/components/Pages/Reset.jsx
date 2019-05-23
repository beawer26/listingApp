import React, { Component } from 'react'
import Http from '../../utils/http';
import {History, Redirect} from 'react-router-dom';

import ReeValidate from "ree-validate";

import Footer from '../Layout/Footer'
import Header from '../Layout/RegisterHeader'



class Reset extends Component{

    constructor(props){
        super(props);
        this.validator = new ReeValidate({
            email: 'required|email',
            password: 'required|min:6',
            password_confirmation: 'required|min:6'
        })
        this.state = {
            token: props.match.params.param,
            email : '',
            password: '',
            password_confirmation: '',
            errors: this.validator.errors,
            msg:''
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleSubmit(e){
        e.preventDefault();
        if (this.state.password !== this.state.password_confirmation){
            const { errors } = this.validator
            errors.add('password_confirmation', 'Passwords doesn\'t match')
            this.setState({...this.state})
        }
        else {
            const {token, email, password, password_confirmation} = this.state;
            Http.post('password/reset', {
                token,
                email,
                password,
                password_confirmation
            })
                .then(response => {
                    this.setState({err: false,
                    msg: 'Password succesfully changed!'});
                    setTimeout(() => {
                        this.props.history.push(`/login`);
                    }, 3000)
                })
                .catch(error => {
                });
        }
    }

    handleChange(e){
        const { errors } = this.validator
        const {name, value} = e.target;
        this.setState({[name]: value});
        errors.remove(name)

        this.validator.validate(name, value)
            .then(() => {
                this.setState({ errors })
            })
    }


    render(){
        const {errors} = this.validator
        const user = localStorage.getItem('user_id');
        if(user){
            return <Redirect to="/clients" />
        }
        return(
            <div className="wrapper" id="reset-wrapper">
                <Header/>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 col-md-offset-2">
                            <div className="panel panel-default">
                                <div className="panel-heading">Reset Password</div>

                                <div className="panel-body">
                                    <div className="col-md-offset-2 col-md-8 col-md-offset-2">
                                        <p className="text-success">{this.state.msg}</p>
                                    </div>
                                    <form className="form-horizontal" role="form"  onSubmit= {this.handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="email" className="col-md-4 control-label">E-Mail Address</label>

                                            <div className="col-md-6">
                                                <input id="email" type="email" value={this.state.email} className="form-control" ref="email" name="email" onChange={this.handleChange} required />
                                                {errors.has('email') && <p className="text-danger">{errors.first('email')}</p>}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password" className="col-md-4 control-label">Password</label>

                                            <div className="col-md-6">
                                                <input id="password" type="password" value={this.state.password} className="form-control" ref="password" name="password" onChange={this.handleChange} required />
                                                {errors.has('password') && <p className="text-danger">{errors.first('password')}</p>}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password_confirmation" className="col-md-4 control-label">Confirm Password</label>
                                            <div className="col-md-6">
                                                <input id="password_confirmation" type="password" className="form-control" value={this.state.password_confirmation} ref="password_confirmation" name="password_confirmation" onChange={this.handleChange}  required />
                                                {errors.has('password_confirmation') && <p className="text-danger">{errors.first('password_confirmation')}</p>}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="col-md-6 col-md-offset-4">
                                                <button type="submit" className="btn btn-primary">
                                                    Reset Password
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <Footer/>
            </div>

        )
    }
}

export default Reset