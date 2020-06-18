import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { confirmDelete, confirmBlocked } from '../../../helper_functions/helperFunctions';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Row,
  Alert,
} from 'reactstrap';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import ReactPaginate from 'react-paginate';
import TableContent from '../../../components/TableContent';
import '../../../styles/pagination.css';


const pageSize = 20;

class ListUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      currentPage: 0,
      visibleAlert: false,
      alert: { type: '', message: '' },
    };
  }

  firstElement = () => this.state.currentPage * pageSize;

  lastElement = () => this.firstElement() + pageSize;

  onDismiss = () => this.setState({ visibleAlert: false });

  async addContact(id) {
    const { users, firestore } = this.props;
    const user = users.filter(item => item.id === id);
    const userId = this.props.firebase.auth().currentUser.uid;
    // console.log('idUser', userId);
    // console.log('vinculed', id)
    // console.log('user add', user);

    await firestore.add(
      { collection: 'contacts' },
      {
        adress: user[0].adress,
        email: user[0].email,
        name: user[0].name,
        photo: user[0].photo,
        telephone: user[0].telephone,
        userId: userId,
        vinculed: id,
        show: true,
      },
    );
    let alert = { type: 'success', message: 'Contact were saved successfully' };
    this.setState({ alert, visibleAlert: true, editedList: false });
    // window.location.reload(true);
  }

  blockUser(id) {
    confirmBlocked(async () => {
      const users = this.props.users || [];
      const contacts = this.props.contacts || [];
      const { firebase, firestore } = this.props;
      const currentUser = firebase.auth().currentUser;
      const uid = currentUser.uid;
      const providerId = currentUser.providerData[0].providerId;
      let loggedUser = {};
      let contact = {};
      ///user logged
      const userCurrent = users.filter(item => item.uid === uid);
      if (userCurrent.length !== 0) {
        loggedUser = userCurrent[0];
      }

      //mi contacto en los contactos del usuario a bloquear
      const contactUser = contacts.filter(item => (item.userId === id));//los contactos del usuario a bloquear
      if (contactUser.length !== 0) {
        if (providerId === 'google.com') {
          const aux = contactUser.filter(item => item.email === loggedUser.email);
          contact = aux[0];
        }
        if (providerId === 'phone') {
          const aux = contactUser.filter(item => item.telephone === loggedUser.telephone);
          contact = aux[0];
        }
      }

      //quien se creo primero el user o contact
      if (contact.created.seconds < loggedUser.created.seconds) {
        //primero el contacto y luego el usuario
        await firestore.update(
          { collection: 'contacts', doc: contact.id },
          {
            vinculed: firestore.FieldValue.delete()
          },
        );

      } else {
        //primero se creo el usuario y luego el contacto
        await firestore.update(
          { collection: 'contacts', doc: contact.id },
          {
            vinculed: firestore.FieldValue.delete(),
            userDeleted: 'User deleted',
          },
        );
      }

      //agregar a la lista de bloqueados
      await firestore.add(
        { collection: 'blockeds' },
        {
          idUser: id,
          blocked_by: uid,
          created: new Date(),
        },
      );
    })
  }

  actionHandler(id, action) {
    switch (action) {
      case 'add_action':
        this.addContact(id);
        break;
      case 'block_action':
        this.blockUser(id);
        break;
      default: console.log('undefined action... =(');
        break;
    }
  }

  listUser() {
    const { currentUser } = this.props.firebase.auth()
    const uid = currentUser.uid;
    const providerId = currentUser.providerData[0].providerId;
    const contacts = this.props.contacts || [];
    const users = this.props.users || [];
    let listUserAggregates = []; //usuarios que me tienen agregado en sus contactos


    let filterNoContacts = contacts.filter(item => item.userId !== uid); //que no estan en mis contactos
    let filterMyContacts = contacts.filter(item => item.userId === uid);


    if (providerId === 'google.com') {
      let listFinal = []; //los que me tienen agregados que no esten en mis contactos
      filterNoContacts.forEach(item => {
        if (item.email === currentUser.email) {
          const userId = item.userId;
          const user = users.filter(item => item.uid === userId);
          if (user.length !== 0)
            listUserAggregates.push(user[0]);
        }
      })

      listUserAggregates.forEach(item => {
        let aux = filterMyContacts.filter(c => c.email === item.email);
        if (aux.length === 0) {
          listFinal.push(item);
        }
      })
      return listFinal;
    }

    if (providerId === 'phone') {
      const tel = currentUser.phoneNumber.substring(4, currentUser.phoneNumber.length);
      let listFinal = [];
      filterNoContacts.forEach(item => {
        if (item.telephone === tel) {
          const userId = item.userId;
          const user = users.filter(item => item.uid === userId);
          if (user.length !== 0)
            listUserAggregates.push(user[0]);
        }
      })

      listUserAggregates.forEach(item => {
        let aux = filterMyContacts.filter(c => c.telephone === item.telephone);
        if (aux.length === 0) {
          listFinal.push(item);
        }
      })
      return listFinal;
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

    const { visibleAlert, alert } = this.state;
    const filterUsers = this.filterUsers().slice(
      this.firstElement(),
      this.lastElement(),
    );
    // console.log('vvvvvv', filterUsers);

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            {visibleAlert && (
              <Alert
                color={alert.type}
                isOpen={visibleAlert}
                toggle={() => this.onDismiss()}
              >
                <strong>{alert.message}</strong>
              </Alert>
            )}
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
                    { label: 'Add Contact', type: 'add-button' },
                    { label: 'Block User', type: 'block-button' },
                  ]}
                  content={filterUsers}
                  //onClick={(item) => this.props.history.push(`/listUser/${item.id}`)}
                  onClick={(item, action) => this.actionHandler(item.id, action)}
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

ListUser.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.any])),
  users: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.any])),
  history: PropTypes.objectOf(PropTypes.oneOfType(PropTypes.any)).isRequired,
  firebase: PropTypes.objectOf(PropTypes.oneOfType(PropTypes.any)).isRequired,
};
ListUser.defaultProps = {
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
)(ListUser);
