import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAsKEXk3nu7TdG1rvfp7NSgCb3i4OplHAU",
    authDomain: "reactnative-30188.firebaseapp.com",
    projectId: "reactnative-30188",
    storageBucket: "reactnative-30188.appspot.com",
    messagingSenderId: "359000884417",
    appId: "1:359000884417:web:2760bec980cb341b980040",
    measurementId: "G-M61DM74EZ2"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };