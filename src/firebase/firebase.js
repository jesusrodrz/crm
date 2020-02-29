import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

export const firebaseApp = firebase.initializeApp(config);
export const db = firebaseApp.firestore();

export const actionUserWithEmailLinkSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: process.env.REACT_APP_SIGNUP_URL,
  // This must be true.
  handleCodeInApp: true
};
