import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase Web App Config
const firebaseConfig = {
  apiKey: "AIzaSyB-AgI36x8bH63Y1rwjl_6yBuDB2Oensbw",
  authDomain: "projekti-individual.firebaseapp.com",
  projectId: "projekti-individual",
  storageBucket: "projekti-individual.firebasestorage.app",
  messagingSenderId: "502964597769",
  appId: "1:502964597769:web:47e42a223a2a2bc10634d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Google provider for Popup Login (WEB)
export const googleProvider = new GoogleAuthProvider();

export default app;
