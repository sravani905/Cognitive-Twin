import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signUpWithEmail = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);
export const signInWithEmail = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error: any) {
    console.error("Firebase Auth Error:", error);
    if (error.code === 'auth/unauthorized-domain') {
      alert("This domain is not authorized in the Firebase Console. Please add '" + window.location.hostname + "' to your Firebase project's Authorized Domains.");
    } else if (error.code === 'auth/popup-blocked') {
      alert("Popup was blocked by your browser. Please allow popups for this site.");
    } else {
      alert("Authentication error: " + error.message);
    }
    throw error;
  }
};
export const logout = () => signOut(auth);
