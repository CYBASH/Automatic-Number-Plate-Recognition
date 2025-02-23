import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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
const db = getFirestore(app);
const auth = getAuth();

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
    if (user) {
        const form = document.getElementById('add-vehicle-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const vehicleNumber = document.getElementById('vehicleNumber').value;
            const ownerName = document.getElementById('ownerName').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const address = document.getElementById('address').value;
            const year = document.getElementById('year').value;
            const semester = document.getElementById('semester').value;

            try {
                await setDoc(doc(db, "vehicles", vehicleNumber), {
                    vehicleNumber,
                    ownerName,
                    phoneNumber,
                    address,
                    year,
                    semester,
                    timestamp: new Date(),
                    userId: user.uid
                });

                document.getElementById('status-message').innerText = "Vehicle registered successfully!";
                form.reset();
            } catch (error) {
                document.getElementById('status-message').innerText = "Error: " + error.message;
            }
        });
    } else {
        window.location.href = "./Login.html"; // Redirect to login page if not authenticated
    }
});
