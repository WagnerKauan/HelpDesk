import {initializeApp} from 'firebase/app'
import { getAuth } from 'firebase/auth'; 
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCHA9Q00aHVPNe0EZkDng3II0tCegd3O6U",
  authDomain: "tickets-55441.firebaseapp.com",
  projectId: "tickets-55441",
  storageBucket: "tickets-55441.firebasestorage.app",
  messagingSenderId: "1072956793512",
  appId: "1:1072956793512:web:a2997ff3a94b1bc800589d",
  measurementId: "G-GX9NPBZ0FB"
};

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

export {auth, db, storage}