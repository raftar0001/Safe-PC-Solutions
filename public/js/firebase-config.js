// Firebase Configuration — Replace with your project credentials
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA5UpbqPGSj3ubhO10526qRZzXoFCHOP0o",
  authDomain: "safe-pc-solutions.firebaseapp.com",
  projectId: "safe-pc-solutions",
  storageBucket: "safe-pc-solutions.firebasestorage.app",
  messagingSenderId: "1057979163787",
  appId: "1:1057979163787:web:c7930a2b376816fe6e208e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
