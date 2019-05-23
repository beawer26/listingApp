import {Link, History, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types'
import _ from 'lodash'
import {connect} from 'react-redux'
import {login} from '../../utils/service'
import {fetchUser} from '../../utils/service'
import {Helmet} from 'react-helmet'

import Footer from '../Layout/Footer'
import Header from '../Layout/RegisterHeader'
import ContentWrapper from '../Layout/ContentWrapper';


import ReeValidate from 'ree-validate'


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.validator = new ReeValidate({
            email: 'required|email',
            password: 'required|min:6',
            remember: ''
        })
        this.state = {
            credentials: {
                email: '',
                password: '',
                remember: false,
            },
            errors: this.validator.errors,
            valid: ''

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const {credentials} = this.state;
        const email = this.state.credentials.email;
        this.props.dispatch(login(credentials))
            .then(res => {
                this.props.dispatch(fetchUser())
            })
            .catch(err => {
                if (err.statusCode === 422) {
                    _.forOwn(err.error, (message, field) => {
                        errors.add(field, message);
                    });
                } else if (err.statusCode === 401) {
                    this.setState({valid: err.error})
                } else if (err.statusCode === 302) {
                    this.setState({valid: err.error})
                }

            })
    }

    handleChange(e) {
        const {errors} = this.validator
        const {name, value} = e.target;
        this.setState({credentials: {...this.state.credentials, [name]: value}});
        errors.remove(name)

        this.validator.validate(name, value)
            .then(() => {
                this.setState({errors})
            })
    }


    render() {
        const auth = localStorage.getItem('access_token')
        const {errors} = this.validator
        if (auth) {
            const user = localStorage.getItem('user_id');
            if (user == 1) {
                return <Redirect to="/users-list"/>

            }
            else {
                return <Redirect to="/clients"/>

            }
        }

        return (
            <div className="wrapper" id="blank-wrapper">

                <Header/>
                <ContentWrapper>
                    <div className="block-center mn-t wd-xl" id="login-panel">
                        {/* START panel */}
                        <div className="panel panel-dark panel-flat" content="width=device-width, initial-scale=1">

                            <div className="panel-body">
                                <p className="text-center pv">SIGN IN TO CONTINUE.</p>
                                <form role="form" data-parsley-validate="" noValidate className="mb-lg"
                                      onSubmit={this.handleSubmit}>
                                    <p className="text-danger">{this.state.valid}</p>
                                    <div className="form-group has-feedback">
                                        <input id="email" name="email" type="email" placeholder="Enter email"
                                               autoComplete="on" value={this.state.credentials.email}
                                               onChange={this.handleChange} required="required"
                                               className="form-control"/>
                                        <span className="fa fa-envelope form-control-feedback text-muted"></span>
                                        {errors.has('email') && <p className="text-danger">{errors.first('email')}</p>}
                                    </div>
                                    <div className="form-group has-feedback">
                                        <input id="password" name="password" type="password" placeholder="Password"
                                               autoComplete="on" value={this.state.credentials.password}
                                               onChange={this.handleChange} required="required"
                                               className="form-control"/>
                                        <span className="fa fa-lock form-control-feedback text-muted"></span>
                                    </div>
                                    {errors.has('password') &&
                                    <p className="text-danger">{errors.first('password')}</p>}
                                    <div className="clearfix">
                                        <div className="checkbox c-checkbox pull-left mt0">
                                            <label>
                                                <input type="checkbox" value={this.state.credentials.remember}
                                                       name="remember" onChange={this.handleChange.bind(this)}/>
                                                <em className="fa fa-check"></em>Remember Me</label>
                                        </div>
                                        <div className="pull-right">
                                            <Link to="recover" className="text-muted">Forgot your password?</Link>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-block btn-primary mt-lg">Login</button>
                                </form>
                                <p className="pt-lg text-center">Need to Signup?</p>
                                <a href="https://listing2text.com" className="btn btn-block btn-default">Register Now</a>
                            </div>
                        </div>

                        {/* END panel */}
                    </div>
                </ContentWrapper>
                <Footer/>
            </div>
        );
    }

}

Login.propTypes = {
    isAuthenticated: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
}
const mapStateToProps = state => {
    return {
        isAuthenticated: state.isAuthenticated,
    }
}

export default connect(mapStateToProps)(Login);
