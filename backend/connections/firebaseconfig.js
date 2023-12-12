// Import the functions you need from the SDKs you need
const firebase=require("firebase/app");
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDnb-nyY7qVp417tg9bpXtKhzKhGzhnLBY",
  authDomain: "collabdoc-45a93.firebaseapp.com",
  projectId: "collabdoc-45a93",
  storageBucket: "collabdoc-45a93.appspot.com",
  messagingSenderId: "649864961315",
  appId: "1:649864961315:web:06c574abe8ffb54eab0096",
  measurementId: "G-B5LTVDQQ5C"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

module.exports={app};