import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBMYNoKxaNnzwzH64yL8XJcK6-593tU3l0",
  authDomain: "gram-amirpur.firebaseapp.com",
  projectId: "gram-amirpur",
  storageBucket: "gram-amirpur.firebasestorage.app",
  messagingSenderId: "710252965541",
  appId: "1:710252965541:web:9ba570b40e6f141581e74c"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
