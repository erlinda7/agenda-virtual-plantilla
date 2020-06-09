/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StyledDropzone from '../../../components/StyledDropzone';
import Loader from 'react-loader-spinner';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Label,
  Col,
  Row,
  FormGroup,
} from 'reactstrap';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: false,
      usersProps: false,
      idUser: this.props.firebase.auth().currentUser.uid,
      upload: true,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = false;
    let { users, idUser, usersProps } = prevState;
    if (nextProps.users && Object.keys(nextProps.users).length !== 0 && !users) {
      let user = nextProps.users.filter((item) => item.id === idUser);
      users = user[0];
      usersProps = user[0];
      update = true;
    }
    if (update) {
      return {
        users,
      };
    } return null;
  }

  handleUpload = (e) => {
    const { users, idUser } = this.state;
    this.setState({ upload: false });
    const image = e;
    const storage = this.props.firebase.storage();
    const uploadTask = storage
      .ref(`usersPhotos/${idUser}/${image.name}`)
      .put(image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        this.setState({ upload: false });
      },
      (error) => {
        // Error function ...
        this.setState({ upload: true });
        console.log(error);
      },
      () => {
        console.log('finish');
        this.setState({ upload: true });

        // complete function ...
        storage
          .ref(`usersPhotos/${idUser}/`)
          .child(image.name)
          .getDownloadURL()
          .then((image) => {
            this.setState({
              users: {
                ...users,
                photo: image,
              }
            })
          });
      },
    );
  };

  submit = async () => {
    const {
      users,
      idUser,
    } = this.state;
    const { firestore } = this.props;
    await firestore.update(
      { collection: 'users', doc: idUser },
      {
        ...users,
      },
    );
    window.location.reload(true);
  };

  cancel = async () => {
    this.setState({
      users: this.state.usersProps
    })
  }

  render() {
    const {
      users,
      upload,
    } = this.state;

    const bannerStyle = {
      marginBottom: 20,
      width: '100%',
      height: 200,
      objectFit: 'contain',

    };

    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" className="justify-content-center">
            <br />
            <img style={bannerStyle} src={users.photo} alt="photo" />
          </Col>
        </Row>
        <Row>
          <Col></Col>
          <Col xs="12" md="6" className="justify-content-center">
            {upload && (
              <StyledDropzone
                text="Drag and Drop to Update Photo"
                onDrop={(files) => {
                  this.handleUpload(files[0]);
                }}
              />
            )}

            {!upload && (
              <Loader
                type="ThreeDots"
                color="lightBlue"
                width="50"
                height="50"
              />
            )}
          </Col>
          <Col></Col>
        </Row>
        <br />
        <Row>
          <Col >
            <Card>
              <CardHeader>
                <strong>
                  <i className="icon-info pr-1" />
                  My Profile
                </strong>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label>Name: </Label>
                      <Input
                        value={users.name || ''}
                        type="text"
                        onChange={(e) => this.setState({
                          users: {
                            ...users,
                            name: e.target.value
                          }
                        })}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label>Telephone: </Label>
                      <Input
                        value={users.telephone || ''}
                        type="text"
                        onChange={(e) => this.setState({
                          users: {
                            ...users,
                            telephone: e.target.value
                          }
                        })}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label>Email: </Label>
                      <Input
                        value={users.email || ''}
                        type="email"
                        onChange={(e) => this.setState({
                          users: {
                            ...users,
                            email: e.target.value
                          }
                        })}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label>Adress: </Label>
                      <Input
                        value={users.adress || ''}
                        type="text"
                        onChange={(e) => this.setState({
                          users: {
                            ...users,
                            adress: e.target.value
                          }
                        })}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <br />
        <Row className="justify-content-center">
          <Button
            className="button-update"
            color="primary"
            onClick={() => {
              this.submit();
            }}
          >
            Submit
          </Button>
          &nbsp;
          <Button
            color="secondary"
            onClick={() => { this.cancel() }}
          >
            Cancel
          </Button>
        </Row>
        <br />
      </div>
    );
  }
}

Profile.defaultProps = {
  users: {},
  firestore: {},
  history: {},
  match: {},
};
Profile.propTypes = {
  users: PropTypes.shape(),
  history: PropTypes.func,
  match: PropTypes.func,
  firestore: PropTypes.shape(),
};

export default compose(
  firestoreConnect((props) => [
    { collection: 'users' }
  ]),
  connect((state, props) => ({
    users: state.firestore.ordered.users ? state.firestore.ordered.users : {}
  }
  )),
)(Profile);

