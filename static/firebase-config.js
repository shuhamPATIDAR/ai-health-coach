import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYh1WLAOLUfWQFgJaGrCUh86WvtRIzQIE",
  authDomain: "ai-health-coach-94f61.firebaseapp.com",
  projectId: "ai-health-coach-94f61",
  storageBucket: "ai-health-coach-94f61.firebasestorage.app",
  messagingSenderId: "524670246155",
  appId: "1:524670246155:web:699be57c9def09c9b2160e",
  measurementId: "G-GT62YC69K6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
