import React from 'react';
import { withRouter, Switch, Route, Miss, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';
import AdminBase from './components/Layout/AdminBase';

import Login from './components/Pages/Login';
import Register from './components/Pages/Register';
import Recover from './components/Pages/Recover';
import Profile from './components/Pages/Profile';
import Clients from './components/Pages/Clients'
import NewClient from './components/Pages/NewClient'
import PaymentInfo from './components/Pages/PaymentInfo'
import BillingInfo from './components/Pages/BillingInfo'
import UsersList from './components/Pages/UsersList'
import SubscriptionPlans from './components/Pages/SubscriptionPlans'
import Plans from './components/Pages/Plans';
import NewPlan from './components/Pages/NewPlan'
import Reset from './components/Pages/Reset'
import CustomerBilling from './components/Pages/CustomerBilling'
import CustomerInfo from './components/Pages/CustomerInfo'
import CustomerClientsInfo from './components/Pages/CustomerClientsInfo'
import ListingPage from './components/Pages/ListingPage'
import Suspend from './components/Pages/Suspend'
import Verify from './components/Pages/Verify'
import ChangePassword from './components/Pages/ChangePassword'
import Unsubscribe from './components/Pages/Unsubscribe'
import EditBuyer from './components/Pages/EditBuyer'


const listofPages = [
    'login',
    'register',
    'recover',
    'plans',
    'reset',
    'listing-page',
    'verify',
    'unsubscribe'
];

const adminPages = [
    'billing-info',
    'users-list',
    'subscription-plans',
    'new-plan',
    'customer-billing',
    'customer-info',
    'customer-clients'
];

const userPages = [
    'clients',
    'new-client',
    'edit-buyer',
    'profile',
    'payment-info',
    'expired',
    'change-password'
]



const Routes = ({ location }) => {
    const currentKey = location.pathname.split('/')[1] || '/';
    const timeout = { enter: 500, exit: 500 };
    const user = localStorage.getItem('user_id');
    const animationName = 'rag-fadeIn'
    if((listofPages.indexOf(currentKey) > -1)) {
        return (
            <BasePage>
                <Switch location={location}>
                    <Route path="/login" component={Login}/>
                    <Route path="/plans" component={Plans}/>
                    <Route path="/register/:plan" component={Register}/>
                    <Route path="/recover" component={Recover}/>
                    <Route path="/reset/:param" component={Reset} />
                    <Route path="/listing-page/:token" component={ListingPage} />
                    <Route path="/verify/:token" component={Verify} />
                    <Route path="/unsubscribe/:token" component={Unsubscribe} />
                </Switch>
            </BasePage>
        )
    }
    else if(adminPages.indexOf(currentKey) > -1)
    {
        return (
            <AdminBase>
                <TransitionGroup>
                    <CSSTransition key={currentKey} timeout={timeout} classNames={animationName}>
                        <div>
                            <Switch location={location}>
                                <Route path="/billing-info" component={BillingInfo} />
                                <Route path="/users-list" component={UsersList} />
                                <Route path="/subscription-plans" component={SubscriptionPlans} />
                                <Route path="/new-plan" component={NewPlan} />
                                <Route path="/customer-billing/:user_id" component={CustomerBilling} />
                                <Route path="/customer-info/:user_id" component={CustomerInfo} />
                                <Route path="/customer-clients/:user_id" component={CustomerClientsInfo} />
                            </Switch>
                        </div>
                    </CSSTransition>
                </TransitionGroup>
            </AdminBase>
        )
    }
    else if (userPages.indexOf(currentKey) > -1) {
        return (
            <Base>
                <TransitionGroup>
                    <CSSTransition key={currentKey} timeout={timeout} classNames={animationName}>
                        <div>
                            <Switch location={location}>

                                <Route path="/profile" component={Profile}/>
                                <Route path="/payment-info" component={PaymentInfo} />
                                <Route path="/change-password" component={ChangePassword} />

                                <Route path="/clients" component={Clients} />
                                <Route path="/new-client" component={NewClient} />

                                <Route path="/expired" component={Suspend} />

                                <Route path="/edit-buyer/:buyer_id" component={EditBuyer}/>

                            </Switch>
                        </div>
                    </CSSTransition>
                </TransitionGroup>
            </Base>
        )
    }
    else {
        return <Redirect to='/login' />
    }
}

export default withRouter(Routes);