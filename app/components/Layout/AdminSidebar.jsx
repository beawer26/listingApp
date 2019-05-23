import React from 'react';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import pubsub from 'pubsub-js';
import { Collapse } from 'react-bootstrap';
import SidebarRun from './Sidebar.run';

class AdminSidebar extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            userBlockCollapse: false,
            collapse: {
                billing_info: this.routeActive('billing-info'),
                user_list: this.routeActive('users-list'),
                subscription_plans: this.routeActive('subscription-plans'),
                pages: false
            }
        };
        this.pubsub_token = pubsub.subscribe('toggleUserblock', () => {
            this.setState({
                userBlockCollapse: !this.state.userBlockCollapse
            });
        });
    };

    componentDidMount() {
        // pass navigator to access router api
        SidebarRun(this.navigator.bind(this));
    }

    navigator(route) {
        this.props.history.push(route);
    }

    componentWillUnmount() {
        // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
        pubsub.unsubscribe(this.pubsub_token);
    }

    routeActive(paths) {
        paths = Array.isArray(paths) ? paths : [paths];
        if (paths.indexOf(this.props.location.pathname.replace('/','')) > -1)
            return true;
        return false;
    }

    toggleItemCollapse(stateName) {
        var newCollapseState = {};
        for (let c in this.state.collapse) {
            if (this.state.collapse[c] === true && c !== stateName)
                this.state.collapse[c] = false;
        }
        this.setState({
            collapse: {
                [stateName]: !this.state.collapse[stateName]
            }
        });
    }

    hideAside()
    {
        $('#mobile-aside').click();
    }

    render() {
        return (
            <aside className='aside'>
                { /* START Sidebar (left) */ }
                <div className="aside-inner">
                    <nav data-sidebar-anyclick-close="" className="sidebar">
                        { /* START sidebar nav */ }
                        <ul className="nav">

                            { /* Iterates over all sidebar items */ }
                            <li className="nav-heading ">
                                <span data-localize="sidebar.heading.HEADER">Main Navigation</span>
                            </li>
                            <li className={ this.routeActive(['user-list']) ? 'active' : '' }>
                                <Link to="/users-list" title="Users List">
                                        <em className="icon-people"></em>
                                        <span data-localize="sidebar.nav.USERLIST" onClick={this.hideAside.bind(this)}>Users List</span>
                                    <Collapse in={this.state.collapse.users_list}>
                                        <ul id="#" className="nav sidebar-subnav">
                                        </ul>
                                    </Collapse>
                                </Link>
                            </li>
                            <li className={ this.routeActive(['billing-info']) ? 'active' : '' }>
                                <Link to="/billing-info" title="Billing History">
                                        <em className="icon-wallet"></em>
                                        <span data-localize="sidebar.nav.CLIENTS" onClick={this.hideAside.bind(this)}>Billing History</span>
                                    <Collapse in={this.state.collapse.billing_info}>
                                        <ul id="#" className="nav sidebar-subnav">
                                        </ul>
                                    </Collapse>
                                </Link>
                            </li>
                            <li className={ this.routeActive(['Subscription Plans']) ? 'active' : '' }>
                                <Link to="/subscription-plans" title="Subscription Plans">
                                        <em className="icon-settings"></em>
                                        <span data-localize="sidebar.nav.SUBSCRIPTION_PLANS" onClick={this.hideAside.bind(this)}>Subscription Plans</span>
                                    <Collapse in={this.state.collapse.subscription_plans}>
                                        <ul id="#" className="nav sidebar-subnav">
                                        </ul>
                                    </Collapse>
                                </Link>
                            </li>
                        </ul>
                        { /* END sidebar nav */ }
                    </nav>
                </div>
                { /* END Sidebar (left) */ }
            </aside>
        );
    }

}

export default withRouter(AdminSidebar);