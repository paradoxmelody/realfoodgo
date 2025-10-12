/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyFqIHhDjY5vuvo1S6w-Q8MZaZA_fgOuk",
  authDomain: "foodgo-d19a1.firebaseapp.com",
  projectId: "foodgo-d19a1",
  storageBucket: "foodgo-d19a1.firebasestorage.app",
  messagingSenderId: "542824126359",
  appId: "1:542824126359:web:7d96f95a944cffefb396d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
*/

// src/firebase/firebase.js

// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyFqIHhDjY5vuvo1S6w-Q8MZaZA_fgOuk",
  authDomain: "foodgo-d19a1.firebaseapp.com",
  databaseURL: "https://foodgo-d19a1-default-rtdb.firebaseio.com",
  projectId: "foodgo-d19a1",
  storageBucket: "foodgo-d19a1.firebasestorage.app",
  messagingSenderId: "542824126359",
  appId: "1:542824126359:web:7d96f95a944cffefb396d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
