/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from 'react';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import { confirmDelete } from '../../../helper_functions/helperFunctions';
import StyledDropzone from '../../../components/StyledDropzone';
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

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: false,
      editMode: !this.props.match.params.id.includes('new'),
      upload: true,
      namePhoto: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = false;
    let { contacts } = prevState;
    if (nextProps.contacts && Object.keys(nextProps.contacts).length !== 0 && !contacts) {
      contacts = nextProps.contacts;
      update = true;
    }
    if (update) {
      return {
        contacts,
      };
    } return null;
  }

  handleUpload = (e) => {
    //canUpload(false);
    const { contacts } = this.state;
    const idContact = this.props.match.params.id;
    const image = e;
    this.setState({ upload: false, namePhoto: image.name });
    const storage = this.props.firebase.storage();
    const uploadTask = storage
      .ref(`contactsPhotos/${idContact}/${image.name}`)
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
          .ref(`contactsPhotos/${idContact}/`)
          .child(image.name)
          .getDownloadURL()
          .then((image) => {
            this.setState({
              contacts: {
                ...contacts,
                photo: image,
              }
            })
          });
      },
    );
  };

  submit = async () => {
    const {
      contacts,
      editMode,
    } = this.state;
    const { firestore, match } = this.props;
    const contactId = match.params.id;
    const idUser = this.props.firebase.auth().currentUser.uid;
    if (editMode) {
      firestore.update(
        { collection: 'contacts', doc: contactId },
        {
          ...contacts,
          namePhoto: this.state.namePhoto,
        },
      );
      this.props.history.push('/dashboard/');
    } else {
      await firestore.add(
        { collection: 'contacts' },
        {
          ...contacts,
          photo: "https://firebasestorage.googleapis.com/v0/b/agendavirtual-f818c.appspot.com/o/photoDefault%2Fphoto_.jpg?alt=media&token=7521d6fb-f361-4b1f-b221-313d5e310aaa",
          userId: idUser,
        },
      );
      this.props.history.push('/dashboard/');
      window.location.reload(true);
    }
  };

  deleteContact() {
    confirmDelete(async () => {
      const firebase = this.props.firestore;
      const contactId = this.props.match.params.id;
      const {contacts} =this.state;
      firebase.delete({ collection: 'contacts', doc: contactId });
      const storage = this.props.firebase.storage().ref();
      await storage
       .child(`contactsPhotos/${contactId}/${contacts.namePhoto}`)
        .delete()
        .then(()=>console.log('contact photo delete'))
        .catch((error)=>console.log(error));

      this.props.history.push('/dashboard');
    });
  }
  render() {
    console.log('photoname', this.state.namePhoto);
    
    const {
      contacts,
      upload,
      editMode,
    } = this.state;
    const bannerStyle = {
      marginBottom: 20,
      width: '100%',
      height: 200,
      objectFit: 'contain',
    };
    return (
      <div className="animated fadeIn">
        {editMode && (
          <>
            <Row className="justify-content-center">
              <Col xs="12" className="justify-content-center">
                <br />
                <img style={bannerStyle} src={contacts.photo} alt="photo" />
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
          </>
        )
        }
        <Row>
          <Col >
            <Card>
              <CardHeader>
                <strong>
                  <i className="icon-info pr-1" />
                  Contact Settings
                </strong>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label>Name: </Label>
                      <Input
                        value={contacts.name || ''}
                        type="text"
                        onChange={(e) => this.setState({
                          contacts: {
                            ...contacts,
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
                        value={contacts.telephone || ''}
                        type="text"
                        onChange={(e) => this.setState({
                          contacts: {
                            ...contacts,
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
                        value={contacts.email || ''}
                        type="email"
                        onChange={(e) => this.setState({
                          contacts: {
                            ...contacts,
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
                        value={contacts.adress || ''}
                        type="text"
                        onChange={(e) => this.setState({
                          contacts: {
                            ...contacts,
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
            onClick={() => this.props.history.push('/dashboard/')}
          >
            Cancel
          </Button>
          &nbsp;
          {editMode && (
            <Button color="danger" onClick={() => this.deleteContact()}>
              Delete
            </Button>
          )}
        </Row>
        <br />
      </div>
    );
  }
}

Contact.defaultProps = {
  contacts: {},
  firestore: {},
  firebase: {},
  history: {},
  match: {},
};
Contact.propTypes = {
  contacts: PropTypes.shape(),
  history: PropTypes.func,
  match: PropTypes.func,
  firestore: PropTypes.shape(),
  firebase: PropTypes.shape(),
};

export default compose(
  firestoreConnect((props) => [
    { collection: 'contacts', doc: props.match.params.id }
  ]),
  connect((state, props) => ({
    contacts: state.firestore.data.contacts ? state.firestore.data.contacts[props.match.params.id] : {}
  }
  )),
)(Contact);
