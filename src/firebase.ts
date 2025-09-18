// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfgEngp5hHKLbK1xTtlAjm5osBsJOuD2U",
  authDomain: "my-taskflow-app-3e3ec.firebaseapp.com",
  projectId: "my-taskflow-app-3e3ec",
  storageBucket: "my-taskflow-app-3e3ec.firebasestorage.app",
  messagingSenderId: "839093287133",
  appId: "1:839093287133:web:3f3f0ac866dd756d8d4334",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db };
