// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGbZudHr-Tlg_LAMIQMW1iXRFR0DodkVc",
  authDomain: "campusly-c5a2b.firebaseapp.com",
  projectId: "campusly-c5a2b",
  storageBucket: "campusly-c5a2b.firebasestorage.app",
  messagingSenderId: "458075508262",
  appId: "1:458075508262:web:6a13cb70c84a9f909420e7",
  measurementId: "G-2HTBJMV79S",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export { firebaseApp };
