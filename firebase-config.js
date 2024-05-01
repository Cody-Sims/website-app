import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyByWMBdhBHM1v2A-e-nJNjaJa0ED0Yb9VM",
  authDomain: "portfolio-site-fa89e.firebaseapp.com",
  projectId: "portfolio-site-fa89e",
  storageBucket: "portfolio-site-fa89e.appspot.com",
  messagingSenderId: "613149820070",
  appId: "1:613149820070:web:40f29e6b1fc385c4a96067",
  measurementId: "G-XR7TEJJZFV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to get the current user's email
const getCurrentUserEmail = () => new Promise((resolve, reject) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe();  // Detach listener after getting user data
    if (user) {
      resolve(user.email);  // Resolve the promise with the user's email
    } else {
      reject('No user logged in');  // Reject the promise if no user is logged in
    }
  }, reject);  // Also reject the promise on any error
});

export { auth, getCurrentUserEmail };