import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import firebase from "firebase";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";

var firebaseConfig = {
  apiKey: "AIzaSyDSi1feg1BCBy_HtDM2wGeieNZq23LAurQ",
  authDomain: "project-1554988899708860863.firebaseapp.com",
  projectId: "project-1554988899708860863",
  storageBucket: "project-1554988899708860863.appspot.com",
  messagingSenderId: "970092593605",
  appId: "1:970092593605:web:0df1d6aa984d2e15ffcbac"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
