import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyDt0q2r7Nh8UfRC7hrkZMFtuSDDDLrd_xM",
  authDomain: "bullandbear-22fad.firebaseapp.com",
  projectId: "bullandbear-22fad",
  storageBucket: "bullandbear-22fad.appspot.com",
  messagingSenderId: "693022755667",
  appId: "1:693022755667:web:9bd607b68ebaca01fbafa6",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
var db = firebase.firestore();

export { storage, db, firebase as default };
