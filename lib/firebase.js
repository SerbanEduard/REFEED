import  { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { collection, getDocs, getFirestore, limit, query, where } from "firebase/firestore"
import { getStorage, } from "firebase/storage"

const firebaseConfig ={
    apiKey: "AIzaSyBhnDG-Xt6Zp4B6YEeVareJd4603Dfcft4",
    authDomain: "creare-soft.firebaseapp.com",
    projectId: "creare-soft",
    storageBucket: "creare-soft.appspot.com",
    messagingSenderId: "552559397345",
    appId: "1:552559397345:web:d95765b690ced64491eaa0"
}

export async function getUserWithUsername(username) {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('username', '==', username), limit(1))
    const userDoc = await getDocs(q);
    return userDoc.docs[0];
}

export function textToJSON(doc) {
    const data = doc.data();
    const date = new Date(data.createdAt);
    const date1 = new Date(data.updatedAt);
    return {
        ...data,
        createdAt: date,
        updatedAt: date1,
    }
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export const firestore = getFirestore(app);
export const storage = getStorage(app);