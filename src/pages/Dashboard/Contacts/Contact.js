/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from 'react';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import { confirmDelete, confirmBlocked } from '../../../helper_functions/helperFunctions';
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
      users: false,
      editMode: this.props.match.params.id !== 'new',
      upload: true,
      namePhoto: false,
      userIdLinked: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = false;
    let { contacts, users, userIdLinked } = prevState;
    if (nextProps.contacts && Object.keys(nextProps.contacts).length !== 0 && !contacts) {
      contacts = nextProps.contacts;
      update = true;
    }
    if (nextProps.users && Object.keys(nextProps.users).length !== 0 && !users) {
      users = nextProps.users;
      update = true;
    }
    if (contacts.linked) {
      let user = users.filter(i => i.uid === contacts.linked);
      userIdLinked = user[0].uid;
      if (user.length !== 0) {
        const aux = {
          adress: user[0].adress,
          email: user[0].email,
          name: contacts.name,
          photo: user[0].photo,
          telephone: user[0].telephone,
          userId: contacts.userId,
          linked: contacts.linked,
          created: contacts.created,
        }
        contacts = aux;
      }
    }
    if (update) {
      return {
        contacts,
        users,
        userIdLinked,
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
        // console.log(error);
      },
      () => {
        // console.log('finish');
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
    const { firebase, firestore, match } = this.props;
    const contactId = match.params.id;
    const currentUser = this.props.firebase.auth().currentUser;
    const idUser = currentUser.uid;

    const providerId = currentUser.providerData[0].providerId;
    let userEmail = '';
    let userPhone = '';
    if (providerId === "google.com") {
      userEmail = currentUser.email;
      userPhone = '';
    }
    if (providerId === 'phone') {
      userEmail = '';
      const telf = currentUser.phoneNumber;
      userPhone = telf.substring(4, telf.length);
    }

    if (editMode) {
      firestore.update(
        { collection: 'contacts', doc: contactId },
        {
          ...contacts,
          namePhoto: this.state.namePhoto,
        },
      );
      this.props.history.push('/contacts/');
    } else {
      const newContact = await firestore.add(
        { collection: 'contacts' },
        {
          ...contacts,
          photo: "https://firebasestorage.googleapis.com/v0/b/agendavirtual-f818c.appspot.com/o/photoDefault%2Fphoto_.jpg?alt=media&token=7521d6fb-f361-4b1f-b221-313d5e310aaa",
          userId: idUser,
          created: new Date(),
        },
      );
      this.props.history.push('/contacts');

      const vincu = await firebase.functions().httpsCallable(
        `contactsRequests/newContact?telephone=${contacts.telephone}&email=${contacts.email}&idContact=${newContact.id}&userEmail=${userEmail}&userPhone=${userPhone}&userId=${idUser}`
      );
      await vincu().then(result => {
        //
      }).catch(error => {
        //
      })
    }
  };

  async deletePhoto() {
    const { contacts } = this.state;
    const contactId = this.props.match.params.id;
    const url = "https://firebasestorage.googleapis.com/v0/b/agendavirtual-f818c.appspot.com/o/photoDefault%2Fphoto_.jpg?alt=media&token=7521d6fb-f361-4b1f-b221-313d5e310aaa";

    if (contacts.photo !== url) {
      const storage = this.props.firebase.storage().ref();
      await storage
        .child(`contactsPhotos/${contactId}/${contacts.namePhoto}`)
        .delete()
    }
  }

  deleteContact() {
    confirmDelete(async () => {
      const firestore = this.props.firestore;
      const contactId = this.props.match.params.id;
      const { contacts } = this.state;
      if (contacts.linked) {
        await firestore.add(
          { collection: 'deletedContacts' },
          {
            ...contacts,
            deleted_at: new Date(),
          },
        );
        firestore.delete({ collection: 'contacts', doc: contactId });

      } else {
        firestore.delete({ collection: 'contacts', doc: contactId });
      }
      await this.deletePhoto();
      this.props.history.push('/contacts');
    });
  }

  blockContact() {
    confirmBlocked(async () => {
      const { firebase, firestore, match } = this.props;
      const contactId = match.params.id;
      const { userIdLinked, users, contacts } = this.state;
      const currentUser = firebase.auth().currentUser;
      const uid = currentUser.uid;
      const providerId = currentUser.providerData[0].providerId;
      let loggedUser = {};
      let contact = {};
      let aggregate = false;
      ///user logged
      const userCurrent = users.filter(item => item.uid === uid);
      if (userCurrent.length !== 0) {
        loggedUser = userCurrent[0];
      }

      //mi contacto en los contactos del usuario a bloquear
      const contactUser = this.props.allContacts.filter(item => (item.userId === userIdLinked));//los contactos del usuario a bloquear
      if (contactUser.length !== 0) {
        if (providerId === 'google.com') {
          const aux = contactUser.filter(item => item.email === loggedUser.email);
          contact = aux[0];
          aggregate = true;
        }
        if (providerId === 'phone') {
          const aux = contactUser.filter(item => item.telephone === loggedUser.telephone);
          contact = aux[0];
          aggregate = true;
        }
      }

      if (contacts.linked) {
        //quien se creo primero el user o contact
        if (aggregate) {
          if (contact.created.seconds < loggedUser.created.seconds) {
            //primero el contacto y luego el usuario
            await firestore.update(
              { collection: 'contacts', doc: contact.id },
              {
                linked: firestore.FieldValue.delete()
              },
            );

          } else {
            //primero se creo el usuario y luego el contacto
            await firestore.update(
              { collection: 'contacts', doc: contact.id },
              {
                linked: firestore.FieldValue.delete(),
                unlinked: 'User deleted',
              },
            );
          }
        }


        //agregar a la lista de bloqueados, cuando esta vinculado el contacto
        await firestore.add(
          { collection: 'blockeds' },
          {
            idUser: contacts.linked,
            blocked_by: uid,
            created: new Date(),
          },
        );
        //eliminar de mis contactos
        firestore.delete({ collection: 'contacts', doc: contactId });
        await this.deletePhoto();
        this.props.history.push('/contacts');

      } else {
        //agregar a la lista de bloqueados, cuando no esta vinculado el contacto
        await firestore.add(
          { collection: 'blockeds' },
          {
            photo: "https://firebasestorage.googleapis.com/v0/b/agendavirtual-f818c.appspot.com/o/photoDefault%2Fphoto_.jpg?alt=media&token=7521d6fb-f361-4b1f-b221-313d5e310aaa",
            name: contacts.name,
            email: contacts.email,
            telephone: contacts.telephone,
            blocked_by: uid,
            created: new Date(),
          },
        );
        //eliminar de mis contactos
        firestore.delete({ collection: 'contacts', doc: contactId });
        await this.deletePhoto();
        this.props.history.push('/contacts');
      }
    })
  }

  render() {
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
        {contacts || !editMode ?
          <>
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
                  {!contacts.linked &&
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
                  }

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
                            disabled={contacts.linked}
                            value={contacts.telephone || ''}
                            type="number"
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
                            disabled={contacts.linked}
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
                            disabled={contacts.linked}
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
                onClick={() => this.props.history.push('/contacts/')}
              >
                Cancel
              </Button>
              &nbsp;
              {editMode && (
                <Button color="warning" onClick={() => this.blockContact()}>
                  Block
                </Button>
              )}
              &nbsp;
              {editMode && (
                <Button color="danger" onClick={() => this.deleteContact()}>
                  Delete
                </Button>
              )}
            </Row>
            <br />
          </>
          :
          <center>
            <br />
            <br />
            <br />
            <br />
            <p><b>The contact does not exist</b></p>
            <Button
              color="secondary"
              onClick={() => this.props.history.push('/contacts/')}
            >
              Go Contacts
          </Button>
          </center>
        }

      </div>
    );
  }
}

Contact.defaultProps = {
  contacts: {},
  users: [],
  allContacts: [],
  firestore: {},
  firebase: {},
  history: {},
  match: {},
};
Contact.propTypes = {
  contacts: PropTypes.shape(),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.func,
  firestore: PropTypes.shape(),
  firebase: PropTypes.shape(),
};

export default compose(
  firestoreConnect((props) => [
    { collection: 'contacts', doc: props.match.params.id },
    { collection: 'contacts' },
    { collection: 'users' },
  ]),
  connect((state, props) => ({
    contacts: state.firestore.data.contacts ? state.firestore.data.contacts[props.match.params.id] : {},
    allContacts: state.firestore.ordered.contacts ? state.firestore.ordered.contacts : [],
    users: state.firestore.ordered.users ? state.firestore.ordered.users : [],
  }
  )),
)(Contact);
