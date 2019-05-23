import React from 'react';
import {FormControl, Panel} from 'react-bootstrap';
import ContentWrapper from '../Layout/ContentWrapper';
import Http from '../../utils/http'


class Blank extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            credentials:
                {
                    password: '',
                    id: localStorage.getItem('user_id')
                }
        }
    }

    componentDidMount() {
        let form = $('#password-form');
        form.validate({
            errorPlacement: function errorPlacement(error, element) {
                element.before(error);
            },
            rules: {
                password: {
                    minlength: 6
                },
                confirm: {
                    equalTo: "#password"
                },
                old_password: {
                    minlength: 6,
                    remote: {
                        method: 'POST',
                        url: 'https://api.listing2text.com/old-pass',
                        async: true,
                        data: {
                            id: function () {
                                return localStorage.getItem('user_id')
                            }
                        },
                        headers: {'Access-Control-Allow-Origin': '*'},
                        withCredentials: true,
                    }
                }
            }

        });
    }

    handleChange(e) {
        e.preventDefault()
        const {name, value} = e.target;
        this.setState({credentials: {...this.state.credentials, [name]: value}});
    }

    handleSubmit(e) {
        e.preventDefault()
        let form = $('#password-form');
        if(form.valid()) {
            Http.post('change-pass', this.state.credentials)
                .then(res => {
                    this.props.history.push('/clients')
                })
                .catch(err => {

                })
        }
    }

    render() {
        return (
            <ContentWrapper>
                <div className="panel b mt-xxl register-page">
                    <div className="panel-body text-center bb">
                        <div className="text-bold">Change Password</div>
                    </div>
                    <form id="password-form" encType="multipart/form-data" onSubmit={this.handleSubmit.bind(this)}>
                        <div className="panel-body">
                            <label htmlFor="old_password">Enter old password</label>
                            <FormControl id="old_password" name="old_password" type="password"
                                         className="form-control required input-width"/>
                            <label htmlFor="password">Enter new password</label>
                            <FormControl id="password" name="password" type="password"
                                         className="form-control required input-width" value={this.state.credentials.password}
                                         onChange={this.handleChange.bind(this)}/>
                            <label htmlFor="confirm">Confirm new password</label>
                            <FormControl id="confirm" name="confirm" type="password"
                                         className="form-control required input-width"/>

                            <br/>
                            <div>
                                <button type="submit" className="btn btn-primary">Change</button>
                            </div>
                            <br/>
                        </div>
                    </form>
                </div>
            </ContentWrapper>
        );
    }

}

export default Blank;
