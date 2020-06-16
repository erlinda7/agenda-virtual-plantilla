import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.scss';


import Login from './pages/Login/Login';
import Home from './containers/Home/Home';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));




class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <React.Suspense fallback={loading()}>
          {
            this.props.auth.isEmpty
              ?
              <Switch>
                <Route exact path="/" render={props => <Home {...props} />} />
                <Route exact path="/login" render={props => <Login {...props} />} />
                {/* <Redirect from="/" to="/" /> */}
              </Switch>
              :
              <Switch>
                <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
                <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
                <Route path="/" name="Home" render={props => <DefaultLayout {...props} />} />
              </Switch>
          }

        </React.Suspense>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    firebase: state.firebase,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}

export default connect(mapStateToProps)(App);
