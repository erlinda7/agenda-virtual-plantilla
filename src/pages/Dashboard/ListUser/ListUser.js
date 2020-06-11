import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Row,
} from 'reactstrap';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import ReactPaginate from 'react-paginate';
import TableContent from '../../../components/TableContent';
import '../../../styles/pagination.css';


const pageSize = 20;

class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      currentPage: 0,
    };
  }

  firstElement = () => this.state.currentPage * pageSize;

  lastElement = () => this.firstElement() + pageSize;

  listUser() {
    // console.log('users', this.props.users);
    const { currentUser } = this.props.firebase.auth()
    const uid = currentUser.uid;
    const providerId = currentUser.providerData[0].providerId;
    const contacts = this.props.contacts || [];
    const users = this.props.users || [];
    let listUserFilter = [];
    let filterContacts = contacts.filter(item => item.userId !== uid); //que no estan en mis contactos
   
    if (providerId === 'google.com') {
      let listUsersinRepetidos = [];
      filterContacts.forEach(item => {
        if (item.email === currentUser.email) {
          const userId = item.userId;
          const user = users.filter(item => item.uid === userId);
          if (user.length !== 0)
            listUserFilter.push(user[0]);    //que me tienen agregado
        }
      })

      //para eliminar repetidos del array
      listUsersinRepetidos = listUserFilter.filter((valorActual, indiceActual, arreglo) => {
        return arreglo.findIndex(
          valorDelArreglo => JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)
        ) === indiceActual
      });

      return listUsersinRepetidos;
    }

    if (providerId === 'phone') {
      let listUsersinRepetidos = [];
      filterContacts.forEach(item => {        
        if (item.telephone === currentUser.phoneNumber) {
          const userId = item.userId;
          const user = users.filter(item => item.uid === userId);
          if (user.length !== 0)
            listUserFilter.push(user[0]);
        }
      })

      //para eliminar repetidos del array
      listUsersinRepetidos = listUserFilter.filter((valorActual, indiceActual, arreglo) => {
        return arreglo.findIndex(
          valorDelArreglo => JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)
        ) === indiceActual
      });
      console.log('list', listUsersinRepetidos);
      
      return listUsersinRepetidos;
    }


  }

  filterUsers() {
    let str = this.state.filterText;
    let filtered = this.listUser() || [];

    if (str) {
      str = str.toLowerCase();
      filtered = filtered.filter(
        (a) => (a.name || '')
          .toLowerCase().includes(str)
          || (a.telephone || '')
            .toLowerCase().includes(str)
          || (a.email || '')
            .toLowerCase().includes(str),
      );
    }
    return filtered
      .slice()
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  render() {
    const filterUsers = this.filterUsers().slice(
      this.firstElement(),
      this.lastElement(),
    );

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" />
                {' '}
                List of users who have you added
              </CardHeader>
              <CardBody>

                <br />
                <Input
                  type="search"
                  placeholder="Filter"
                  value={this.state.filterText}
                  onChange={(e) => this.setState({
                    filterText: e.target.value,
                    currentPage: 0,
                  })}
                />
                <br />
                <TableContent
                  headers={[
                    { value: 'photo', label: 'Photo', type: 'image' },
                    { value: 'name', label: 'Name' },
                    { value: 'telephone', label: 'Telephone' },
                    { value: 'email', label: 'Email' },
                    //{ value: 'vinculed', label: 'Vinculed', type: 'checkContent' },
                    { label: 'See More', type: 'detail-button' },
                  ]}
                  content={filterUsers}
                  onClick={(item) => this.props.history.push(`/listUser/${item.id}`)}
                />
                <ReactPaginate
                  previousLabel="previous"
                  nextLabel="next"
                  breakLabel="..."
                  breakClassName="break-me"
                  pageCount={Math.ceil(this.filterUsers().length / pageSize)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={(page) => this.setState({ currentPage: page.selected })}
                  containerClassName="pagination"
                  subContainerClassName="pages pagination"
                  activeClassName="active"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

Contacts.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.any])),
  users: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.any])),
  history: PropTypes.objectOf(PropTypes.oneOfType(PropTypes.any)).isRequired,
  firebase: PropTypes.objectOf(PropTypes.oneOfType(PropTypes.any)).isRequired,
};
Contacts.defaultProps = {
  contacts: [],
  users: [],
};
export default compose(
  firestoreConnect(() => [
    { collection: 'contacts' },
    { collection: 'users' },
  ]),
  connect((state) => ({
    contacts: state.firestore.ordered.contacts ? state.firestore.ordered.contacts : [],
    users: state.firestore.ordered.users ? state.firestore.ordered.users : [],
  })),
)(Contacts);
