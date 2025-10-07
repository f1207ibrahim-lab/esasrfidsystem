// Firebase Configuration
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "surautrack.firebaseapp.com",
    projectId: "surautrack",
    storageBucket: "surautrack.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Authentication state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User signed in:', user.email);
        // Redirect to main page if on login page
        if (window.location.pathname.includes('index.html') || 
            window.location.pathname === '/') {
            window.location.href = 'attendance.html';
        }
    } else {
        // User is signed out
        console.log('User signed out');
        // Redirect to login if not on login page
        if (!window.location.pathname.includes('index.html') && 
            window.location.pathname !== '/') {
            window.location.href = 'index.html';
        }
    }
});

// Utility functions
// Demo mode Firebase simulation
const firebaseUtils = {
    // Get current user from localStorage
    getCurrentUser: () => {
        const userData = localStorage.getItem('surautrack_user');
        return userData ? JSON.parse(userData) : null;
    },

    // Format timestamp
    formatTimestamp: (timestamp) => {
        if (!timestamp) return '-';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ms-MY', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    },

    // Get today's date range for queries
    getTodayRange: () => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        
        return { start: start.getTime(), end: end.getTime() };
    },

    // Error handler
    handleError: (error) => {
        console.error('Error:', error);
        let message = 'Ralat sistem. Sila cuba lagi.';
        
        alert(message);
        return message;
    },

    // Demo data for attendance
    getDemoAttendanceData: () => {
        const demoStudents = [
            { id: 'S12345', name: 'Ahmad bin Mahmud', avatar: 'AM' },
            { id: 'S12346', name: 'Siti binti Mohd', avatar: 'SM' },
            { id: 'S12347', name: 'Muhammad bin Ali', avatar: 'MA' },
            { id: 'S12348', name: 'Nurul binti Razak', avatar: 'NR' },
            { id: 'S12349', name: 'Hafiz bin Abdullah', avatar: 'HA' }
        ];

        const prayerTimes = ['subuh', 'zohor', 'asar', 'maghrib', 'isyak'];
        const attendanceData = [];

        // Generate random attendance records for today
        demoStudents.forEach(student => {
            const recordsCount = Math.floor(Math.random() * 3) + 1; // 1-3 records per student
            for (let i = 0; i < recordsCount; i++) {
                const randomPrayer = prayerTimes[Math.floor(Math.random() * prayerTimes.length)];
                const randomTime = new Date();
                randomTime.setHours(6 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));
                
                attendanceData.push({
                    id: Math.random().toString(36).substr(2, 9),
                    studentInfo: student,
                    prayerTime: randomPrayer,
                    timestamp: randomTime.getTime(),
                    locationVerified: Math.random() > 0.2 // 80% verified
                });
            }
        });

        // Sort by timestamp
        return attendanceData.sort((a, b) => b.timestamp - a.timestamp);
    }
};

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('index.html') && 
        window.location.pathname !== '/' && 
        window.location.pathname !== '') {
        
        const user = firebaseUtils.getCurrentUser();
        if (!user) {
            alert('Sila log masuk terlebih dahulu.');
            window.location.href = 'index.html';
            return;
        }
        
        console.log('User logged in:', user.email);
    }
});