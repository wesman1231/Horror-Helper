// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import dotenv from 'dotenv';
dotenv.config();
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMX9_1R8yjFMlHc7qL9dSX1M39hZh_ZFM",
  authDomain: "horror-helper-b5e35.firebaseapp.com",
  projectId: "horror-helper-b5e35",
  storageBucket: "horror-helper-b5e35.firebasestorage.app",
  messagingSenderId: "57119151906",
  appId: "1:57119151906:web:fc77d65a6039a4f8bff77b",
  measurementId: "G-0R12S1BTPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth};