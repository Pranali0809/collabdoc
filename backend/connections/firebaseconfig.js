
const firebase=require("firebase/app");


const firebaseConfig = {
  apiKey: "AIzaSyDnb-nyY7qVp417tg9bpXtKhzKhGzhnLBY",
  authDomain: "collabdoc-45a93.firebaseapp.com",
  projectId: "collabdoc-45a93",
  storageBucket: "collabdoc-45a93.appspot.com",
  messagingSenderId: "649864961315",
  appId: "1:649864961315:web:06c574abe8ffb54eab0096",
  measurementId: "G-B5LTVDQQ5C"
};


const app = firebase.initializeApp(firebaseConfig);


module.exports={app};