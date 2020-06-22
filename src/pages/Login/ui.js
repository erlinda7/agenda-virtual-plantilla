import firebase from '../../config/firebaseConfig';
import * as firebaseui from 'firebaseui'
// import { functions } from 'firebase/app';
// import axios from "axios";

// const url = 'https://us-central1-agendavirtual-f818c.cloudfunctions.net/usersRequests/newUser';

const user = async (uid) => {
  let userExits = false;
  await firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        userExits = true;
      } else {
        // console.log('no such document');
      }
    }).catch(function (error) {
      // console.log('error getting document', error);
    })
  return userExits
}

const db = async (currentUser) => {
  const userExits = await user(currentUser.uid);

  const name = currentUser.displayName;
  const email = currentUser.email;
  const telephone = currentUser.phoneNumber;
  const uid = currentUser.uid;
  const providerId = currentUser.providerData[0].providerId;

  if (userExits === false) {
    if (providerId === 'phone') {
      const tel = telephone.substring(4, telephone.length);
      await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .set(
          {
            name: '',
            email: '',
            telephone: tel,
            uid,
            providerId,
            adress: '',
            photo: "https://firebasestorage.googleapis.com/v0/b/agendavirtual-f818c.appspot.com/o/photoDefault%2Fphoto_.jpg?alt=media&token=7521d6fb-f361-4b1f-b221-313d5e310aaa",
            created: new Date(),
          }
        )
      // console.log('telefono', telephone);

      const vincu = await firebase.functions().httpsCallable(
        `usersRequests/newUser?providerId=${providerId}&uid=${uid}&telephone=${tel}`
      );
      await vincu().then(result => {
        //
      }).catch(error => {
        //
      })
    }
    if (providerId === 'google.com') {
      await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .set(
          {
            name,
            email,
            telephone: '',
            uid,
            providerId,
            adress: '',
            photo: "https://firebasestorage.googleapis.com/v0/b/agendavirtual-f818c.appspot.com/o/photoDefault%2Fphoto_.jpg?alt=media&token=7521d6fb-f361-4b1f-b221-313d5e310aaa",
            created: new Date(),
          }
        )

      const vincu = await firebase.functions().httpsCallable(
        `usersRequests/newUser?providerId=${providerId}&uid=${uid}&email=${email}`
      );
      await vincu().then(result => {
        //
      }).catch(error => {
        //
      })
    }
    // window.location.assign('/');
  }
  // else {
  //   window.location.assign('/');
  // }
}

let uiConfig = {
  callbacks: {
    signInSuccess: async function (currentUser, credential, redirectUrl) {
      db(currentUser);

      return false;
    },
    uiShown: function () {
      document.getElementById('loader').style.display = 'none';
    }
  },
  signInFlow: 'popup',
  //signInSuccessUrl: '/dashboard',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      recaptchaParameters: {
        type: 'image',
        size: 'invisible',
        badge: 'bottomleft'
      },
      defaultCountry: 'BO',
    }
  ],
};

export const startUi = (elementId) => {
  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start(elementId, uiConfig)
}