/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
} from 'reactstrap';

const HeaderNav = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div >
      <Navbar color="light" light expand="md">
        <NavbarToggler onClick={toggle} />
        <img src="../../assets/img/contacto.png" />
        <Collapse isOpen={isOpen} navbar>
          <Nav className=" navbar-nav ml-auto" navbar>
            <NavItem >
              <NavLink style={{ textDecoration: 'none' }} to="/login"><b>Log In</b></NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default HeaderNav;