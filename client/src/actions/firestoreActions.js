import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZFlwpw91E6UoJ8LpfsLZD0DX5-yTlhdw",
  authDomain: "gravity-studio.firebaseapp.com",
  projectId: "gravity-studio",
  storageBucket: "gravity-studio.appspot.com",
  messagingSenderId: "578866384591",
  appId: "1:578866384591:web:63e43b531ce5878911f1ba",
  measurementId: "G-VHWQ6CNY3C",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export function validateAlbumCode(code) {
  return getDocs(query(collection(db, "Albums"))).then((querySnapshot) => {
    var valid = false;
    var data = null;
    querySnapshot.forEach((doc) => {
      if (doc.id == code) {
        console.log("Album Exists");
        valid = true;
        data = doc.data();
      }
    });
    return [valid, data];
  });
}

export function createAlbumDoc(data) {
  // Add a new document with a generated id.
  return addDoc(collection(db, "Albums"), data).then((docRef) => {
    return docRef.id;
  });
}

export function checkSession(code) {
  return "albumCode" in sessionStorage && sessionStorage["albumCode"] === code;
}
