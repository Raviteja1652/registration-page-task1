import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getDatabase, ref, set} from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyBkqc9mcM5c2Ql4ZMkGbcCBBFym6HVGyWY",
    authDomain: "registration-page-5e518.firebaseapp.com",
    databaseURL: "https://registration-page-5e518-default-rtdb.firebaseio.com",
    projectId: "registration-page-5e518",
    storageBucket: "registration-page-5e518.firebasestorage.app",
    messagingSenderId: "296108636531",
    appId: "1:296108636531:web:add52291b412ed5f986d06"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)

export { auth, db }