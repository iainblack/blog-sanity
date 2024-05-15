import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBpBUmNp_Qlj5qkYuXMsD7NUXCqBnIFmmg",
    authDomain: "lou-blog-f8703.firebaseapp.com",
    projectId: "lou-blog-f8703",
    storageBucket: "lou-blog-f8703.appspot.com",
    messagingSenderId: "462819443080",
    appId: "1:462819443080:web:7eeed2dabf9cea3159fa3d",
    measurementId: "G-GBVE29DVPK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };