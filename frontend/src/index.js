import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/firestore';
import reportWebVitals from './reportWebVitals';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZFlwpw91E6UoJ8LpfsLZD0DX5-yTlhdw",
  authDomain: "gravity-studio.firebaseapp.com",
  projectId: "gravity-studio",
  storageBucket: "gravity-studio.appspot.com",
  messagingSenderId: "578866384591",
  appId: "1:578866384591:web:63e43b531ce5878911f1ba",
  measurementId: "G-VHWQ6CNY3C"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
