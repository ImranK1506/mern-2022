import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhAr58TsMZXA1it7IhUqBt5mEg4Qt0ULU",
  authDomain: "mern-linkedin.firebaseapp.com",
  projectId: "mern-linkedin",
  storageBucket: "mern-linkedin.appspot.com",
  messagingSenderId: "588062666121",
  appId: "1:588062666121:web:5cc4158543cbe677c48558"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
