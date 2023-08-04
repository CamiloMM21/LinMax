import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAH8V8iy7vvPqsYPgWNMZGiXSUhCfBWRk",
  authDomain: "cmproject-777d9.firebaseapp.com",
  projectId: "cmproject-777d9",
  storageBucket: "cmproject-777d9.appspot.com",
  messagingSenderId: "1095413331492",
  appId: "1:1095413331492:web:34ceef74726323d626cab1"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


