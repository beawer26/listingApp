import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import {Link, History, Redirect} from 'react-router-dom';


class Suspend extends React.Component {

    constructor(props)
    {
        super(props)
    }

    componentWillMount()
    {
        const status = localStorage.getItem('user_status');
        if(status == true){
            this.props.history.push('/clients')
        }
    }
    render() {

        return (
            <ContentWrapper>
                <div>
                    <h2 className="text-danger">
                        Your subscription has expired! To continue the work, extend the subscription, please.</h2>
                </div>
            </ContentWrapper>
        );
    }

}

export default Suspend;
