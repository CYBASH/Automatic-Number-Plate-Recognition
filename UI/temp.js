import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAczC-rE6vEoi4hudZZ6T7OyHKn0ARabQI",
    authDomain: "loginpage-6a191.firebaseapp.com",
    projectId: "loginpage-6a191",
    storageBucket: "loginpage-6a191.appspot.com",
    messagingSenderId: "244665413838",
    appId: "1:244665413838:web:57bf523fb3101fa606209f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const vehicleRef = collection(db, "vehicles");

onSnapshot(vehicleRef, (snapshot) => {
    const records = snapshot.docs.map(doc => doc.data());
    renderTable(records);
});

function renderTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    data.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${record.image}" alt="Vehicle" class="vehicle-image"></td>
            <td>${record.vehicleNumber}</td>
            <td>${record.ownerName}</td>
            <td>${record.phoneNumber}</td>
            <td>${record.address}</td>
            <td>${record.year}</td>
            <td>${record.department}</td>
            <td>${record.entryTime}</td>
            <td>${record.exitTime}</td>
        `;
        tableBody.appendChild(row);
    });
}

function searchRecords() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    onSnapshot(vehicleRef, (snapshot) => {
        const filteredRecords = snapshot.docs.map(doc => doc.data()).filter(record =>
            Object.values(record).some(value =>
                value.toString().toLowerCase().includes(searchTerm)
            )
        );
        renderTable(filteredRecords);
    });
}

function filterByDate() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert('Please select valid dates');
        return;
    }

    onSnapshot(vehicleRef, (snapshot) => {
        const filteredRecords = snapshot.docs.map(doc => doc.data()).filter(record => {
            const entryDate = new Date(record.entryTime);
            return entryDate >= startDate && entryDate <= endDate;
        });
        renderTable(filteredRecords);
    });
}

function exportToExcel() {
    onSnapshot(vehicleRef, (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data()).map(record => ({
            'Vehicle Number': record.vehicleNumber,
            'Owner Name': record.ownerName,
            'Phone Number': record.phoneNumber,
            'Address': record.address,
            'Year': record.year,
            'Department': record.department,
            'Entry Time': record.entryTime,
            'Exit Time': record.exitTime
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Vehicle Records');
        XLSX.writeFile(wb, 'vehicle_records.xlsx');
    });
}