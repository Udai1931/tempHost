// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgKU9OrhW-LJA99K3cWwVIIjGyZsgkQxw",
    authDomain: "reels-next-yt.firebaseapp.com",
    projectId: "reels-next-yt",
    storageBucket: "reels-next-yt.appspot.com",
    messagingSenderId: "470141788128",
    appId: "1:470141788128:web:1a9911e580f632d94e9585"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export { auth, storage, db }
export default app