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

  listContacts() {
    const uid = this.props.firebase.auth().currentUser.uid;
    const users = this.props.users || [];
    let contacts = this.props.contacts || [];
    contacts = contacts.filter((item) => item.userId === uid);
    let listContacts = [];

    contacts.forEach(item => {
      if (item.vinculed) {
        console.log('vinculed', item.vinculed);
        let user = users.filter(i => i.uid === item.vinculed);
        if (user.length !== 0) {
          const aux = {
            id: item.id,
            adress: user[0].adress,
            email: user[0].email,
            name: item.name,
            photo: user[0].photo,
            telephone: user[0].telephone,
            userId: item.userId,
            vinculed: item.vinculed,
          }
          listContacts.push(aux);
        }

      } else {
        listContacts.push(item);
      }
    })
    return listContacts;

  }

  filterContacts() {
    let str = this.state.filterText;

    let filtered = this.listContacts() || [];

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
    const filterContacts = this.filterContacts().slice(
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
                Contacts
              </CardHeader>
              <CardBody>
                <Link to="/contacts/new">
                  <Button color="primary">Add New</Button>
                </Link>
                <br />
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
                    { value: 'vinculed', label: 'Vinculed', type: 'checkContent' },
                    { label: 'See More', type: 'detail-button' },
                  ]}
                  content={filterContacts}
                  onClick={(item) => this.props.history.push(`/contacts/${item.id}`)}
                />
                <ReactPaginate
                  previousLabel="previous"
                  nextLabel="next"
                  breakLabel="..."
                  breakClassName="break-me"
                  pageCount={Math.ceil(this.filterContacts().length / pageSize)}
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
