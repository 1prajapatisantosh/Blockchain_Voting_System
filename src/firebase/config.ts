import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKPePFgBT6d60jaDMPMGkb6kjRISISqso",
  authDomain: "Yblockchain-voting-system-dfdb0.firebaseapp.com",
  projectId: "blockchain-voting-system-dfdb0",
  storageBucket: "blockchain-voting-system-dfdb0.firebasestorage.app",
  messagingSenderId: "388411173575D",
  appId: "1:388411173575:web:daa7994ca9c2d9de07ace2",
  measurementId: "G-EXD352CHPY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
