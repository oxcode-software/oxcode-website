
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAbUFwcYh_jZmfGuruyW3TftNxspG-R6M0",
  authDomain: "oxcode-website.firebaseapp.com",
  projectId: "oxcode-website",
  storageBucket: "oxcode-website.firebasestorage.app",
  messagingSenderId: "998250509445",
  appId: "1:998250509445:web:3d29dabd4ea3d50fdae5ec",
};

// Prevent re-initialization (important in Next.js)
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;








