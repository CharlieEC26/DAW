// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWRIvWmey15cjPbBRK0rOXRE-PRzNNJ-c",
  authDomain: "mighty-bull-weightlifting.firebaseapp.com",
  projectId: "mighty-bull-weightlifting",
  storageBucket: "mighty-bull-weightlifting.appspot.com",
  messagingSenderId: "19752619498",
  appId: "1:19752619498:web:ebbe324c50a5be7c337693",
  measurementId: "G-72ZGQZ6P8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();


export { db, auth, provider, app, analytics };

