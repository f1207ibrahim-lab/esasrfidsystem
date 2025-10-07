// Data pengguna (guna array sebagai contoh, boleh tukar kepada Firebase)
let users = [
    {
        id: 1,
        name: "Ahmad Abdullah",
        email: "ahmad@surau.my",
        role: "admin",
        phone: "012-3456789",
        active: true,
        createdAt: "2024-01-15"
    },
    {
        id: 2,
        name: "Muhammad Ibrahim",
        email: "ibrahim@surau.my",
        role: "imam",
        phone: "013-9876543",
        active: true,
        createdAt: "2024-02-20"
    },
    {
        id: 3,
        name: "Fatimah Zahra",
        email: "fatimah@surau.my",
        role: "ajk",
        phone: "014-5554321",
        active: true,
        createdAt: "2024-03-10"
    },
    {
        id: 4,
        name: "Zainab Ali",
        email: "zainab@surau.my",
        role: "user",
        phone: "015-2223456",
        active: false,
        createdAt: "2024-04-05"
    }
];

// Data log aktiviti
let activityLogs = [
    {
        id: 1,
        userId: 1,
        userName: "Ahmad Abdullah",
        action: "login",
        description: "Log masuk ke sistem",
        timestamp: "2024-10-07 08:30:15"
    },
    {
        id: 2,
        userId: 2,
        userName: "Muhammad Ibrahim",
        action: "update",
        description: "Kemaskini waktu solat",
        timestamp: "2024-10-07 09:15:30"
    },
    {
        id: 3,
        userId: 3,
        userName: "Fatimah Zahra",
        action: "create",
        description: "Tambah pelajar baru",
        timestamp: "2024-10-07 10:45:20"
    }
];

let currentEditUserId = null;
let currentResetUserId = null;

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(targetTab).classList.add('active');
        
        // Load data based on tab
        if (targetTab === 'users') {
            loadUsers();
        } else if (targetTab === 'logs') {
            loadActivityLogs();
        }
    });
});

// Load users on page load
window.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    populateLogUserFilter();
});

// Load Users Table
function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #E0E0E0';
        
        const roleClass = `role-${user.role}`;
        const statusBadge = user.active 
            ? '<span style="color: #4CAF50; font-weight: 500;">● Aktif</span>'
            : '<span style="color: #F44336; font-weight: 500;">● Tidak Aktif</span>';
        
        row.innerHTML = `
            <td style="padding: 12px;">${user.name}</td>
            <td style="padding: 12px;">${user.email}</td>
            <td style="padding: 12px;">
                <span class="role-badge ${roleClass}">${getRoleLabel(user.role)}</span>
            </td>
            <td style="padding: 12px;">${statusBadge}</td>
            <td style="padding: 12px;">
                <div class="user-actions">
                    <button class="action-btn btn-edit" onclick="editUser(${user.id})">✏️ Edit</button>
                    <button class="action-btn btn-reset" onclick="openResetPassword(${user.id})">🔑 Reset</button>
                    <button class="action-btn btn-delete" onclick="deleteUser(${user.id})">🗑️ Padam</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Get Role Label in Malay
function getRoleLabel(role) {
    const labels = {
        'admin': 'Admin',
        'imam': 'Imam',
        'ajk': 'AJK Surau',
        'user': 'Pengguna'
    };
    return labels[role] || role;
}

// Filter Users
function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const tbody = document.getElementById('usersTableBody');
    const rows = tbody.getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Open Add User Modal
function openAddUserModal() {
    currentEditUserId = null;
    document.getElementById('modalTitle').textContent = 'Tambah Pengguna Baru';
    document.getElementById('userForm').reset();
    document.getElementById('editUserId').value = '';
    document.getElementById('userModal').style.display = 'block';
}

// Edit User
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    currentEditUserId = userId;
    document.getElementById('modalTitle').textContent = 'Edit Pengguna';
    document.getElementById('editUserId').value = userId;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userPhone').value = user.phone;
    document.getElementById('userActive').checked = user.active;
    
    document.getElementById('userModal').style.display = 'block';
}

// Close User Modal
function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
    currentEditUserId = null;
}

// Handle User Form Submit
document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        phone: document.getElementById('userPhone').value,
        active: document.getElementById('userActive').checked
    };
    
    if (currentEditUserId) {
        // Update existing user
        const index = users.findIndex(u => u.id === currentEditUserId);
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            addLog(currentEditUserId, userData.name, 'update', `Kemaskini maklumat pengguna`);
        }
    } else {
        // Add new user
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            ...userData,
            createdAt: new Date().toISOString().split('T')[0]
        };
        users.push(newUser);
        addLog(newUser.id, newUser.name, 'create', `Tambah pengguna baru`);
    }
    
    loadUsers();
    closeUserModal();
    alert('Pengguna berjaya disimpan!');
});

// Delete User
function deleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    if (confirm(`Adakah anda pasti untuk memadam ${user.name}?`)) {
        users = users.filter(u => u.id !== userId);
        addLog(userId, user.name, 'delete', `Padam pengguna`);
        loadUsers();
        alert('Pengguna berjaya dipadam!');
    }
}

// Open Reset Password Modal
function openResetPassword(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    currentResetUserId = userId;
    document.getElementById('resetUserInfo').textContent = `${user.name} (${user.email})`;
    document.getElementById('resetPasswordModal').style.display = 'block';
}

// Close Reset Password Modal
function closeResetPasswordModal() {
    document.getElementById('resetPasswordModal').style.display = 'none';
    currentResetUserId = null;
}

// Confirm Reset Password
function confirmResetPassword() {
    if (!currentResetUserId) return;
    
    const user = users.find(u => u.id === currentResetUserId);
    if (user) {
        addLog(currentResetUserId, user.name, 'update', `Reset kata laluan`);
        alert(`Kata laluan baru telah dihantar ke ${user.email}`);
        closeResetPasswordModal();
    }
}

// Load Activity Logs
function loadActivityLogs() {
    const container = document.getElementById('activityLogs');
    container.innerHTML = '';
    
    if (activityLogs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #757575; padding: 20px;">Tiada log aktiviti</p>';
        return;
    }
    
    activityLogs.slice().reverse().forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
            <div style="font-weight: 500;">${log.userName}</div>
            <div style="color: #555; margin: 5px 0;">${log.description}</div>
            <div class="log-time">${log.timestamp}</div>
        `;
        container.appendChild(logItem);
    });
}

// Add Log Entry
function addLog(userId, userName, action, description) {
    const now = new Date();
    const timestamp = `${now.toLocaleDateString('ms-MY')} ${now.toLocaleTimeString('ms-MY')}`;
    
    activityLogs.push({
        id: activityLogs.length + 1,
        userId: userId,
        userName: userName,
        action: action,
        description: description,
        timestamp: timestamp
    });
}

// Populate Log User Filter
function populateLogUserFilter() {
    const select = document.getElementById('logUser');
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        select.appendChild(option);
    });
}

// Filter Logs
function filterLogs() {
    const date = document.getElementById('logDate').value;
    const userId = document.getElementById('logUser').value;
    const action = document.getElementById('logAction').value;
    
    let filtered = activityLogs;
    
    if (date) {
        filtered = filtered.filter(log => log.timestamp.includes(date));
    }
    
    if (userId) {
        filtered = filtered.filter(log => log.userId == userId);
    }
    
    if (action) {
        filtered = filtered.filter(log => log.action === action);
    }
    
    // Display filtered logs
    const container = document.getElementById('activityLogs');
    container.innerHTML = '';
    
    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #757575; padding: 20px;">Tiada log yang sepadan</p>';
        return;
    }
    
    filtered.slice().reverse().forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
            <div style="font-weight: 500;">${log.userName}</div>
            <div style="color: #555; margin: 5px 0;">${log.description}</div>
            <div class="log-time">${log.timestamp}</div>
        `;
        container.appendChild(logItem);
    });
}

// Export Logs
function exportLogs() {
    let csv = 'Tarikh/Masa,Pengguna,Tindakan,Keterangan\n';
    
    activityLogs.forEach(log => {
        csv += `"${log.timestamp}","${log.userName}","${log.action}","${log.description}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log_aktiviti_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const userModal = document.getElementById('userModal');
    const resetModal = document.getElementById('resetPasswordModal');
    
    if (event.target === userModal) {
        closeUserModal();
    }
    if (event.target === resetModal) {
        closeResetPasswordModal();
    }
}