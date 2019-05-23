import React from 'react';
import { History, Redirect} from 'react-router-dom';
import { FormControl, Panel } from 'react-bootstrap';

import PropTypes from 'prop-types'
import ContentWrapper from '../Layout/ContentWrapper';
import {connect} from "react-redux";
import {getProfile, updateProfile} from '../../utils/service'
import _ from "lodash";
import ReeValidate from 'ree-validate'

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.validator = new ReeValidate({
            user_email: 'required|email',
            user_name: 'required',
            phone: 'required',
            mobile: 'required',
            website: 'required',
            address: 'required',
            city: 'required',
            state: 'required',
            zip: 'required',
            logo: 'required',
            company: 'required',
            license: 'required'
        })
        this.state = {
            credentials: {
                user_email: '',
                user_name: '',
                phone: '',
                mobile: '',
                method: '',
                website: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                logo: 1,
                company: '',
                license: '',
            },
            errors: this.validator.errors,
            message: '',
            loading: true,
            load_picture: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        const user = localStorage.getItem('user_id');
        this.props.dispatch(getProfile(user))

    }

    componentWillUpdate()
    {

    }

    componentDidUpdate(params) {

        function getFileParam() {
            try {
                var file = document.getElementById('file-upload').files[0];
                if (file) {
                    var fileSize = 0;

                    if (file.size > 1024 * 1024) {
                        fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                    }else {
                        fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
                    }

                    document.getElementById('file-name1').innerHTML = 'Logo: ' + file.name;
                    document.getElementById('file-size1').innerHTML = 'Logo size: ' + fileSize;

                    if (/\.(jpe?g|bmp|gif|png)$/i.test(file.name)) {
                        var elPreview = document.getElementById('preview1');
                        elPreview.innerHTML = '';
                        var newImg = document.createElement('img');
                        newImg.className = "preview-img";

                        if (typeof file.getAsDataURL=='function') {
                            if (file.getAsDataURL().substr(0,11)=='data:image/') {
                                newImg.onload=function() {
                                    document.getElementById('file-name1').innerHTML+=' ('+newImg.naturalWidth+'x'+newImg.naturalHeight+' px)';
                                }
                                newImg.setAttribute('src',file.getAsDataURL());
                                elPreview.appendChild(newImg);
                            }
                        }else {
                            var reader = new FileReader();
                            reader.onloadend = function(evt) {
                                if (evt.target.readyState == FileReader.DONE) {
                                    newImg.onload=function() {
                                        document.getElementById('file-name1').innerHTML+=' ('+newImg.naturalWidth+'x'+newImg.naturalHeight+' px)';
                                    }

                                    newImg.setAttribute('src', evt.target.result);
                                    elPreview.appendChild(newImg);
                                }
                            };

                            var blob;
                            if (file.slice) {
                                blob = file.slice(0, file.size);
                            }else if (file.webkitSlice) {
                                blob = file.webkitSlice(0, file.size);
                            }else if (file.mozSlice) {
                                blob = file.mozSlice(0, file.size);
                            }
                            reader.readAsDataURL(blob);
                        }
                    }
                }
            }catch(e) {
                var file = document.getElementById('file-upload').value;
                file = file.replace(/\\/g, "/").split('/').pop();
                document.getElementById('file-name1').innerHTML = 'Èìÿ: ' + file;
            }
        }


        $('#file-upload').off('change.file').on('change.file', function () {

            getFileParam()
        })

        $('#phone').inputmask('999-999-9999')
        $('#mobile').inputmask('999-999-9999')

        if (this.props.profile !== params.profile) {

            this.setState({
                credentials: {
                    user_email: this.props.profile.userEmail,
                    user_name: this.props.profile.userName,
                    phone: this.props.profile.phone,
                    mobile: this.props.profile.mobile,
                    method: this.props.profile.method,
                    website: this.props.profile.website,
                    address: this.props.profile.address,
                    city: this.props.profile.city,
                    state: this.props.profile.state,
                    zip: this.props.profile.zip,
                    logo: this.props.profile.logo,
                    company: this.props.profile.company,
                    license: this.props.profile.license

                },
                loading: false
            });
        }
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

    handleSubmit(e) {
        e.preventDefault();
        var formD = new FormData();
        let id = localStorage.getItem('user_id')
        if(!(document.getElementById('file-upload').files[0])){
            formD.append('file', $('#logo_img').attr('src'))
        }
        else{
            formD.append('file', document.getElementById('file-upload').files[0]);
        }

        formD.append('user_email', $('#user_email').val());
        formD.append('user_name', $('#user_name').val());
        formD.append('phone', $('#phone').val());
        formD.append('mobile', $('#mobile').val());
        formD.append('method', $('#method').val());
        formD.append('website', $('#website').val());
        formD.append('address', $('#address').val());
        formD.append('city', $('#city').val());
        formD.append('company', $('#company').val());
        formD.append('state', $('#state').val());
        formD.append('zip', $('#zip').val());
        formD.append('license', $('#license').val())

        $.ajax({
            method: 'POST',
            url: 'https://api.listing2text.com/profile/'+id,
            contentType: false,
            processData: false,
            cache: false,
            async: true,
            data: formD,
            headers: {'Access-Control-Allow-Origin': '*'},
            withCredentials: true,
        }).done(function (data) {
            //localStorage.setItem('access_token', data)
            window.location.replace('https://app.listing2text.com/clients')
        })
    }

    render() {
        let content;
        const user = localStorage.getItem('user_id');
        let image;
        if(this.state.credentials.logo !== ''){
            image = <img id="logo_img" width="200px" src={"https://api.listing2text.com/upload/"+this.state.credentials.logo}></img>
        }
        else{
            image = <p>{this.state.credentials.company}</p>
        }
        if(user == 1){
            return <Redirect to="/users-list" />
        }
        if (this.state.loading) {
            content =
                <div className="panel b mt-xxl wd-xxl">
                    <div className="panel-body text-center bb">
                        <div className="text-bold">Contact information</div>
                        <p className="text-primary">{this.state.message}</p>
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
                            <p className="text-primary">{this.state.message}</p>
                        </div>
                        <form id="profile-form" onSubmit={this.handleSubmit} encType="multipart/form-data">
                            <div className="row">
                                <div className="panel-body">
                                    <div className="col-md-6">
                                        <label htmlFor="user_name">Name</label>
                                        <FormControl id="user_name" name="user_name" type="text"
                                                     className="form-control required"
                                                     value={this.state.credentials.user_name}
                                                     onChange={this.handleChange}/>
                                        <label htmlFor="user_email">Email</label>
                                        <FormControl id="user_email" name="user_email" type="text"
                                                     className="form-control required email"
                                                     value={this.state.credentials.user_email}
                                                     onChange={this.handleChange}/>
                                        <label htmlFor="phone">Phone</label>
                                        <input id="phone" name="phone" type="text"
                                                     className="form-control required"
                                                     placeholder="555-555-5555"
                                                     value={this.state.credentials.phone} onChange={this.handleChange}/>
                                        <label htmlFor="mobile">Mobile</label>
                                        <input id="mobile" name="mobile" type="text"
                                                     className="form-control phone"
                                                     placeholder="555-555-5555"
                                                     value={this.state.credentials.mobile}
                                                     onChange={this.handleChange}/>
                                        <label htmlFor="method">Notification Method</label>
                                        <select id="method" name="method" className="form-control" defaultValue={this.state.credentials.method}>
                                            <option value={0}>Text</option>
                                            <option value={1}>Email</option>
                                        </select>
                                        <label htmlFor="address">Address</label>
                                        <FormControl id="address" name="address" type="text"
                                                     className="form-control required"
                                                     value={this.state.credentials.address}
                                                     onChange={this.handleChange}/>
                                        <label htmlFor="city">City</label>
                                        <FormControl id="city" name="city" type="text" className="form-control required"
                                                     value={this.state.credentials.city} onChange={this.handleChange}/>
                                        <label htmlFor="state">State</label>
                                        <FormControl id="state" name="state" type="text"
                                                     className="form-control required"
                                                     value={this.state.credentials.state} onChange={this.handleChange}/>
                                        <label htmlFor="zip">Zip</label>
                                        <FormControl id="zip" name="zip" type="text" className="form-control zip number"
                                                     value={this.state.credentials.zip} onChange={this.handleChange}/>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="logo">Company Logo</label>
                                        <br />
                                        {image}                                        <br />
                                        <label htmlFor="file-upload" className="custom-file-upload">
                                            <i className="fa fa-cloud-upload"></i> Upload Company Logo
                                        </label>
                                        <input id="file-upload" type="file"/>
                                        <div id="preview1">&nbsp;</div>
                                        <div id="file-name1">&nbsp;</div>
                                        <div id="file-size1">&nbsp;</div>
                                        <br/>
                                        <label htmlFor="company">Company name</label>
                                        <FormControl id="company" name="company" type="text"
                                                     className="form-control required"
                                                     value={this.state.credentials.company}
                                                     onChange={this.handleChange}/>
                                        <label htmlFor="license">License Number</label>
                                        <FormControl id="license" name="license" type="text"
                                                     className="form-control required"
                                                     value={this.state.credentials.license}
                                                     onChange={this.handleChange}/>
                                        <label htmlFor="website">Web site</label>
                                        <FormControl id="website" name="website" type="text"
                                                     className="form-control"
                                                     value={this.state.credentials.website}
                                                     onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">Update</button>
                                </div>
                                <br/>
                            </div>
                        </form>
                    </div>
        }
        return (
            <ContentWrapper>
                {content}
            </ContentWrapper>
        );
    }
}
Profile.propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object,
    profile: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        profile: state.profile
    }
}

export default connect(mapStateToProps)(Profile);