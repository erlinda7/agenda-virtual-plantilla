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
import TableContent from '../../../components/TableContent';


const pageSize = 20;

class Testimonials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      currentPage: 0,
    };
  }

  firstElement = () => this.state.currentPage * pageSize;

  lastElement = () => this.firstElement() + pageSize;

  filterTestimonial() {
    let str = this.state.filterText;
    let filtered = this.props.testimonial || [];

    if (str) {
      str = str.toLowerCase();
      filtered = filtered.filter(
        (a) => (a.traveler_first_name || '')
          .toLowerCase().includes(str)
          || (a.photographer_first_name || '')
            .toLowerCase().includes(str),
      );
    }

    return filtered
      .slice()
      .sort((a, b) => (a.photographer_first_name > b.photographer_first_name ? 1 : -1));
  }

  render() {
    const filterTestimonial = this.filterTestimonial().slice(
      this.firstElement(),
      this.lastElement(),
    );
    console.log('props contactss ', this.props);
    
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
                    { value: 'name', label: 'Name' },
                    { value: 'telephone', label: 'Telephone' },
                    { value: 'email', label: 'email' },
                    { label: 'See More', type: 'detail-button' },
                  ]}
                  content={filterTestimonial}
                  onClick={(item) => this.props.history.push(`/contacts/${item.id}`)}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

Testimonials.propTypes = {
  testimonial: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.any,
    ]),
  ),
  history: PropTypes.objectOf(PropTypes.oneOfType(PropTypes.any)).isRequired,
};
Testimonials.defaultProps = {
  testimonial: [],
};
export default compose(
  firestoreConnect(() => [
    { collection: 'testimonials', where: ['show_in_home', '==', true] },
  ]),
  connect((state) => ({
    testimonial: state.firestore.ordered.testimonials ? state.firestore.ordered.testimonials : [],
  })),
)(Testimonials);
