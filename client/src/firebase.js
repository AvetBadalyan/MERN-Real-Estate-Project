// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "avets-real-estate.firebaseapp.com",
  projectId: "avets-real-estate",
  storageBucket: "avets-real-estate.appspot.com",
  messagingSenderId: "3195121215",
  appId: "1:3195121215:web:119b1bff4d0e467befd28a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
