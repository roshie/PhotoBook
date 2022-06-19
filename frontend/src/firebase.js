import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDZFlwpw91E6UoJ8LpfsLZD0DX5-yTlhdw",
  authDomain: "gravity-studio.firebaseapp.com",
  projectId: "gravity-studio",
  storageBucket: "gravity-studio.appspot.com",
  messagingSenderId: "578866384591",
  appId: "1:578866384591:web:63e43b531ce5878911f1ba",
  measurementId: "G-VHWQ6CNY3C",
};

export const app = initializeApp(firebaseConfig);
