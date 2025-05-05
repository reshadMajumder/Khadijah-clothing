// src/firebase/config.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBlf6VaFd6nzm9_iQJVYdv50f8fiZe5u6E",
  authDomain: "khadijah-fashion.firebaseapp.com",
  projectId: "khadijah-fashion",
  storageBucket: "khadijah-fashion.firebasestorage.app",
  messagingSenderId: "540610881780",
  appId: "1:540610881780:web:6472cbc41b83abac1e96a1",
  measurementId: "G-740GXW4EBW"
};

// Initialize Firebase if not already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export the services
export { auth, db, storage, analytics };
export default app;
