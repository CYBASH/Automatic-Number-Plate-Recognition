import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
const vehicleRef = collection(db, "vehicle_entries");

function listenForVehicleUpdates() {
    onSnapshot(vehicleRef, (snapshot) => {
        const records = snapshot.docs.map(doc => doc.data());
        renderTable(records);
    });
}

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
            <td>${record.department ? record.department : 'CSE'}</td>
            <td>${record.entryTime}</td>
            <td>${record.exitTime}</td>
        `;
        tableBody.appendChild(row);
    });
}

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is authenticated:", user.uid);
        listenForVehicleUpdates();  // Start listening for changes
    } else {
        console.log("User is not authenticated.");
        // Redirect to login page or show error
    }
});


function searchRecords() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const tableRows = document.querySelectorAll('#tableBody tr');

    tableRows.forEach(row => {
        const rowText = row.innerText.toLowerCase();
        row.style.display = rowText.includes(searchTerm) ? '' : 'none';
    });
}

// function filterByDate() {
//     const startDateInput = document.getElementById('startDate').value;
//     const endDateInput = document.getElementById('endDate').value;

//     // Include the full day for endDate by setting time to the end of the day
//     const startDate = new Date(startDateInput + 'T00:00:00');
//     const endDate = new Date(endDateInput + 'T23:59:59');

//     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//         alert('Please select valid dates');
//         return;
//     }

//     const tableRows = document.querySelectorAll('#tableBody tr');

//     tableRows.forEach(row => {
//         const entryTimeText = row.children[7]?.innerText; // Assuming Entry Time is in the 8th column
//         const entryDate = new Date(entryTimeText.replace(' ', 'T')); // Convert to ISO format

//         // Check if the entryDate is within the range
//         if (entryDate >= startDate && entryDate <= endDate) {
//             row.style.display = '';
//         } else {
//             row.style.display = 'none';
//         }
//     });
// }

function filterByDate() {
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;

    // Set startDate and endDate based on input
    let startDate = startDateInput ? new Date(startDateInput + 'T00:00:00') : null;
    let endDate = endDateInput ? new Date(endDateInput + 'T23:59:59') : null;

    // If both are empty, show all rows
    if (!startDate && !endDate) {
        document.querySelectorAll('#tableBody tr').forEach(row => {
            row.style.display = '';
        });
        return;
    }

    // If only startDate is provided, set endDate to the current date/time
    if (startDate && !endDate) {
        endDate = new Date();
    }

    // If only endDate is provided, set startDate to a very early date
    if (!startDate && endDate) {
        startDate = new Date('2000-01-01T00:00:00'); // Adjust to your earliest possible record date
    }

    const tableRows = document.querySelectorAll('#tableBody tr');

    tableRows.forEach(row => {
        const entryTimeText = row.children[7]?.innerText; // Assuming Entry Time is in the 8th column
        const entryDate = new Date(entryTimeText.replace(' ', 'T')); // Convert to ISO format

        // Check if the entryDate is within the range
        if (entryDate >= startDate && entryDate <= endDate) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}




function exportToExcel() {
    const visibleRows = Array.from(document.querySelectorAll('#tableBody tr'))
        .filter(row => row.style.display !== 'none');

    const data = visibleRows.map(row => {
        const cells = row.children;
        return {
            'Vehicle Number': cells[1]?.innerText,
            'Owner Name': cells[2]?.innerText,
            'Phone Number': cells[3]?.innerText,
            'Address': cells[4]?.innerText,
            'Year': cells[5]?.innerText,
            'Department': cells[6]?.innerText,
            'Entry Time': cells[7]?.innerText,
            'Exit Time': cells[8]?.innerText
        };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vehicle Records');
    XLSX.writeFile(wb, 'vehicle_records.xlsx');
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchInput')?.addEventListener('input', searchRecords);
    document.getElementById('searchButton')?.addEventListener('click', searchRecords);
    // document.getElementById('startDate')?.addEventListener('change', filterByDate);
    // document.getElementById('endDate')?.addEventListener('change', filterByDate);
    document.getElementById('exportButton')?.addEventListener('click', exportToExcel);
    document.getElementById('filterButton')?.addEventListener('click', filterByDate);
});
