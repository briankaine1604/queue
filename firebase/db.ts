// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANsEUuAZdFwp0kh2n_V3fL1rAbVNEIskM",
  authDomain: "queue-9de5c.firebaseapp.com",
  projectId: "queue-9de5c",
  storageBucket: "queue-9de5c.appspot.com",
  messagingSenderId: "635977961932",
  appId: "1:635977961932:web:b8e25b76bb986b9e8dcd69",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);
const realtime = getDatabase(app);

export { storage, firestore, realtime };
