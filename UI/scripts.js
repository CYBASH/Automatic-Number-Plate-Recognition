import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAczC-rE6vEoi4hudZZ6T7OyHKn0ARabQI",
    authDomain: "loginpage-6a191.firebaseapp.com",
    projectId: "loginpage-6a191",
    storageBucket: "loginpage-6a191.appspot.com",
    messagingSenderId: "244665413838",
    appId: "1:244665413838:web:57bf523fb3101fa606209f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Handle Signup
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('Signup successful!');
            showLogin();
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Handle Login
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Redirect to the home page after successful login
            window.location.href = './home.html';
        })
        .catch((error) => {
            alert(error.message);
        });
});


// Show Signup Page
window.showSignup = function () {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('signup-page').style.display = 'block';
};

// Show Login Page
window.showLogin = function () {
    document.getElementById('signup-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
};
