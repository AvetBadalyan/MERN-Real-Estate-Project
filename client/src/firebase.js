import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "avets-real-estate.firebaseapp.com",
  projectId: "avets-real-estate",
  messagingSenderId: "3195121215",
  appId: "1:3195121215:web:119b1bff4d0e467befd28a",
};

export const app = initializeApp(firebaseConfig);
