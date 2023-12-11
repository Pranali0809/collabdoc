// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);