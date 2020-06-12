/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import { firestoreConnect } from 'react-redux-firebase';


const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: false,
    }
  }

  async componentDidMount() {
    const uid = this.props.firebase.auth().currentUser.uid;
    const { firebase } = this.props;
    let user = {};
    await firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(function (doc) {
        user = doc.data();
      })
    this.setState({ user })
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>


  render() {
    const { user } = this.state;
    const bannerStyle = {
      marginBottom: 20,
      marginLeft: 30,
      width: 100,
      height: 100,
      //objectFit: 'contain',
    };
    const font = {
      fontSize: 14,
      textAlign: 'center'
    }

    const photo = user ? user.photo : 'https://firebasestorage.googleapis.com/v0/b/agendavirtual-f818c.appspot.com/o/photoDefault%2Fphoto_.jpg?alt=media&token=7521d6fb-f361-4b1f-b221-313d5e310aaa';
    const name = user ? user.name : '';
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader photo={photo || ''} {...this.props} />
          </Suspense>
        </AppHeader>
        <div className="app-body">

          <AppSidebar fixed display="lg" className="main-sidebar">
            <div>
              <br />
              <img style={bannerStyle} src={photo || ''} alt="photo" className="rounded-circle" />
              <p style={font}>{name || ''}</p>
              <br />
              <hr />
            </div>
            <AppSidebarHeader />
            <AppSidebarForm  />
            <Suspense>
              <AppSidebarNav navConfig={navigation} {...this.props} router={router} />
            </Suspense>
            {/* <AppSidebarFooter />
            <AppSidebarMinimizer /> */}
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/profile" />
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
      </div>
    );
  }
}

export default firestoreConnect()(DefaultLayout);
