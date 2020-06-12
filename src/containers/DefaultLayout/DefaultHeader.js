import React, { Component } from 'react';
import { UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppSidebarToggler } from '@coreui/react';
import { firestoreConnect } from 'react-redux-firebase';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  handleLogout() {
    this.props.firebase.logout();
    window.location.assign('/');
  };

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    const photo = this.props.photo ? this.props.photo : '../../assets/img/avatars/6.jpg';

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />

        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="ml-auto" navbar>

          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img src="../../assets/img/contacto.png" className="img-avatar" alt="admin@bootstrapmaster.com" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={(e) => this.handleLogout()}>
                <i className="fa fa-lock" />
                {' '}
                Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default firestoreConnect()(DefaultHeader);