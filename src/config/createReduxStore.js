import { combineReducers, compose, createStore } from 'redux';
import { firestoreReducer, reduxFirestore } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';
import firebase from './firebaseConfig';

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
});

const createStoreWithFirebase = compose(
    reduxFirestore(firebase),
)(createStore);


const initialState = {
    firestore: {
        ordered: {
            users: [],
        },
        data: {
            users: [],
        }
    }
}

export default createStoreWithFirebase(rootReducer, initialState);
