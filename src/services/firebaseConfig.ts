import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB3pKhP_oWiRwItGjex3ISdAGWHlzJYlgM",
    authDomain: "healthsync2-34906.firebaseapp.com",
    projectId: "healthsync2-34906",
    storageBucket: "healthsync2-34906.firebasestorage.app",
    messagingSenderId: "97456319575",
    appId: "1:97456319575:web:d738a6ffb9dba484028712",
    measurementId: "G-MXFK2N97NM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('patientId', result.user.uid);
    return {
      success: true,
      message: 'Login successful',
      user: result.user
    };
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    return {
      success: false,
      message: error.message || 'Failed to sign in with Google'
    };
  }
};

export { auth };