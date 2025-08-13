// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // <--- Add this import

const firebaseConfig = {
  apiKey: "AIzaSyCiNsVroKUMWkDhkJHsAZOzWk1LRJ7xhwc",
  authDomain: "awpl-connect.firebaseapp.com",
  projectId: "awpl-connect",
  storageBucket: "awpl-connect.firebasestorage.app",
  messagingSenderId: "112089804788",
  appId: "1:112089804788:web:46a038ed92ca81d91413a1",
  measurementId: "G-NYP0G4B40L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);
const storage = getStorage(app); // <--- Add this initialization

export { db, storage }; // <--- Export storage as well
