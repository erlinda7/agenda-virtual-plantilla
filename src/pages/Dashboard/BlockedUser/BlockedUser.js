import React, { Component } from 'react';
import {
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

class BlockedUser extends Component {
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

  async unblock(id) {
    const blockeds = this.props.blockeds || [];
    const contacts = this.props.contacts || [];
    const { firestore } = this.props;
    const currentUser = this.props.firebase.auth().currentUser;
    const providerId = currentUser.providerData[0].providerId;
    const userBlocked = blockeds.filter(item => item.id === id);

    let myContactsBlocked = [];
    let idUserBlocked = [];
    let contactsPromiseArray = [];

    if (userBlocked.length !== 0)
      idUserBlocked = userBlocked[0].idUser;

    //contactos del bloqueado
    const contactsBlocked = contacts.filter(item => item.userId === idUserBlocked);
    //buscar mi contacto en los contactos del bloqueado
    if (contactsBlocked.length !== 0) {
      if (providerId === 'google.com')
        myContactsBlocked = contactsBlocked.filter(item => item.email === currentUser.email);

      if (providerId === 'phone') {
        const tel = currentUser.phoneNumber.substring(4, currentUser.phoneNumber.length);
        myContactsBlocked = contactsBlocked.filter(item => item.telephone === tel);
      }
    }

    if (myContactsBlocked.length !== 0) {
      myContactsBlocked.forEach(item => {
        if (item.unlinked) {
          contactsPromiseArray.push(
            firestore.update(
              { collection: 'contacts', doc: item.id },
              {
                unlinked: firestore.FieldValue.delete(),
                linked: currentUser.uid,
              },
            )
          )
        } else {
          contactsPromiseArray.push(
            firestore.update(
              { collection: 'contacts', doc: item.id },
              {
                linked: currentUser.uid,
              },
            )
          )
        }
      })
    }

    contactsPromiseArray.push(
      firestore.delete({ collection: 'blockeds', doc: id })
    )
    Promise.all(contactsPromiseArray);
    //eliminar id en coleccion blockeds
    let alert = { type: 'success', message: 'User were unblock successfully' };
    this.setState({ alert, visibleAlert: true });
  }

  actionHandler(id, action) {
    switch (action) {
      case 'unblock_action':
        this.unblock(id);
        break;
      default: console.log('undefined action... =(');
        break;
    }
  }

  listUser() {
    const users = this.props.users || [];
    let blockeds = this.props.blockeds || [];
    blockeds = blockeds.filter(item => item.blocked_by === this.props.firebase.auth().currentUser.uid);
    let listFinal = [];
    blockeds.forEach(item => {
      if (item.idUser) {
        const user = users.filter(u => u.uid === item.idUser);
        if (user.length !== 0) {
          const aux = {
            id: item.id,
            photo: user[0].photo,
            name: user[0].name,
            telephone: user[0].telephone,
            email: user[0].email,
          }
          listFinal.push(aux);
        }

      } else {
        const aux = {
          id: item.id,
          photo: item.photo,
          name: item.name,
          telephone: item.telephone,
          email: item.email,
        }
        listFinal.push(aux);
      }
    })
    return listFinal;
  }

  filterBlockeds() {
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
    const filterBlockeds = this.filterBlockeds().slice(
      this.firstElement(),
      this.lastElement(),
    );

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
                List of blocked users
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
                    { label: 'Unblock User', type: 'unblock-button' },
                  ]}
                  content={filterBlockeds}
                  onClick={(item, action) => this.actionHandler(item.id, action)}
                />
                <ReactPaginate
                  previousLabel="previous"
                  nextLabel="next"
                  breakLabel="..."
                  breakClassName="break-me"
                  pageCount={Math.ceil(this.filterBlockeds().length / pageSize)}
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

BlockedUser.propTypes = {
  users: PropTypes.arrayOf(PropTypes.any).isRequired,
  blockeds: PropTypes.arrayOf(PropTypes.any).isRequired,
  contacts: PropTypes.arrayOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  firebase: PropTypes.objectOf(PropTypes.any).isRequired,
};
BlockedUser.defaultProps = {
  users: [],
  blockeds: [],
  contacts: [],
};
export default compose(
  firestoreConnect((props) => [
    { collection: 'users' },
    { collection: 'blockeds' },
    { collection: 'contacts' },
  ]),
  connect((state) => ({
    users: state.firestore.ordered.users ? state.firestore.ordered.users : [],
    blockeds: state.firestore.ordered.blockeds ? state.firestore.ordered.blockeds : [],
    contacts: state.firestore.ordered.contacts ? state.firestore.ordered.contacts : [],
  })),
)(BlockedUser);
