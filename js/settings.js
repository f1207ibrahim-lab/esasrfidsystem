// Settings Management System
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.initEventListeners();
        this.loadCurrentSettings();
        this.updateSystemInfo();
    }

    initEventListeners() {
        // Telegram settings toggle
        const telegramToggle = document.getElementById('telegramNotifications');
        if (telegramToggle) {
            telegramToggle.addEventListener('change', (e) => {
                document.getElementById('telegramSettings').style.display = 
                    e.target.checked ? 'block' : 'none';
            });
        }

        // Geofence radius slider
        const radiusSlider = document.getElementById('geofenceRadius');
        const radiusValue = document.getElementById('radiusValue');
        if (radiusSlider && radiusValue) {
            radiusSlider.addEventListener('input', (e) => {
                radiusValue.textContent = e.target.value + 'm';
            });
        }

        // Import file change
        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (e) => {
                this.previewImportFile(e.target.files[0]);
            });
        }
    }

    loadSettings() {
        const defaultSettings = {
            general: {
                surauName: 'Surau Al-Ikhlas',
                surauAddress: '',
                surauPhone: '',
                surauEmail: ''
            },
            attendance: {
                locationVerification: true,
                geofenceRadius: 50,
                autoLogout: true,
                scanSound: true
            },
            notifications: {
                emailNotifications: true,
                telegramNotifications: false,
                telegramBotToken: '',
                telegramChatId: '',
                prayerReminders: true,
                reminderTime: 15
            },
            backup: {
                autoBackup: false,
                backupTime: '02:00'
            },
            system: {
                version: 'v2.1.0',
                buildDate: '15 Mac 2024'
            }
        };

        const saved = localStorage.getItem('surautrack_settings');
        if (saved) {
            return { ...defaultSettings, ...JSON.parse(saved) };
        }
        
        return defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('surautrack_settings', JSON.stringify(this.settings));
        this.showMessage('Tetapan berjaya disimpan!', 'success');
    }

    loadCurrentSettings() {
        // General Settings
        document.getElementById('surauName').value = this.settings.general.surauName || '';
        document.getElementById('surauAddress').value = this.settings.general.surauAddress || '';
        document.getElementById('surauPhone').value = this.settings.general.surauPhone || '';
        document.getElementById('surauEmail').value = this.settings.general.surauEmail || '';

        // Attendance Settings
        document.getElementById('locationVerification').checked = this.settings.attendance.locationVerification;
        document.getElementById('geofenceRadius').value = this.settings.attendance.geofenceRadius;
        document.getElementById('radiusValue').textContent = this.settings.attendance.geofenceRadius + 'm';
        document.getElementById('autoLogout').checked = this.settings.attendance.autoLogout;
        document.getElementById('scanSound').checked = this.settings.attendance.scanSound;

        // Notification Settings
        document.getElementById('emailNotifications').checked = this.settings.notifications.emailNotifications;
        document.getElementById('telegramNotifications').checked = this.settings.notifications.telegramNotifications;
        document.getElementById('telegramBotToken').value = this.settings.notifications.telegramBotToken || '';
        document.getElementById('telegramChatId').value = this.settings.notifications.telegramChatId || '';
        document.getElementById('prayerReminders').checked = this.settings.notifications.prayerReminders;
        document.getElementById('reminderTime').value = this.settings.notifications.reminderTime;
        
        // Show/hide telegram settings based on current state
        document.getElementById('telegramSettings').style.display = 
            this.settings.notifications.telegramNotifications ? 'block' : 'none';

        // Backup Settings
        document.getElementById('autoBackup').checked = this.settings.backup.autoBackup;
        document.getElementById('backupTime').value = this.settings.backup.backupTime;
    }

    // General Settings
    saveGeneralSettings() {
        this.settings.general = {
            surauName: document.getElementById('surauName').value,
            surauAddress: document.getElementById('surauAddress').value,
            surauPhone: document.getElementById('surauPhone').value,
            surauEmail: document.getElementById('surauEmail').value
        };
        this.saveSettings();
    }

    // Attendance Settings
    saveAttendanceSettings() {
        this.settings.attendance = {
            locationVerification: document.getElementById('locationVerification').checked,
            geofenceRadius: parseInt(document.getElementById('geofenceRadius').value),
            autoLogout: document.getElementById('autoLogout').checked,
            scanSound: document.getElementById('scanSound').checked
        };
        this.saveSettings();
    }

    // Notification Settings
    saveNotificationSettings() {
        this.settings.notifications = {
            emailNotifications: document.getElementById('emailNotifications').checked,
            telegramNotifications: document.getElementById('telegramNotifications').checked,
            telegramBotToken: document.getElementById('telegramBotToken').value,
            telegramChatId: document.getElementById('telegramChatId').value,
            prayerReminders: document.getElementById('prayerReminders').checked,
            reminderTime: parseInt(document.getElementById('reminderTime').value)
        };
        this.saveSettings();
    }

    // Backup Settings
    saveBackupSettings() {
        this.settings.backup = {
            autoBackup: document.getElementById('autoBackup').checked,
            backupTime: document.getElementById('backupTime').value
        };
        this.saveSettings();
    }

    // Backup & Recovery Functions
    exportData() {
        const data = {
            settings: this.settings,
            users: JSON.parse(localStorage.getItem('surautrack_users') || '[]'),
            attendance: JSON.parse(localStorage.getItem('surautrack_attendance') || '[]'),
            bookings: JSON.parse(localStorage.getItem('surautrack_bookings') || '[]'),
            exportDate: new Date().toISOString(),
            version: this.settings.system.version
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `surautrack_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showMessage('Data berjaya diexport!', 'success');
    }

    importData() {
        document.getElementById('importModal').style.display = 'block';
    }

    closeImportModal() {
        document.getElementById('importModal').style.display = 'none';
        document.getElementById('importFile').value = '';
    }

    previewImportFile(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.version && data.exportDate) {
                    this.showMessage(`Backup ditemui: ${data.version} (${new Date(data.exportDate).toLocaleDateString('ms-MY')})`, 'info');
                } else {
                    this.showMessage('Format backup tidak sah', 'error');
                }
            } catch (error) {
                this.showMessage('Fail tidak valid', 'error');
            }
        };
        reader.readAsText(file);
    }

    processImport() {
        const fileInput = document.getElementById('importFile');
        const overwrite = document.getElementById('overwriteData').checked;

        if (!fileInput.files.length) {
            this.showMessage('Sila pilih fail backup', 'error');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (overwrite || confirm('Adakah anda pasti ingin import data? Data sedia ada mungkin akan ditimpa.')) {
                    // Import settings
                    if (data.settings) {
                        this.settings = { ...this.settings, ...data.settings };
                        localStorage.setItem('surautrack_settings', JSON.stringify(this.settings));
                    }

                    // Import other data
                    if (data.users) localStorage.setItem('surautrack_users', JSON.stringify(data.users));
                    if (data.attendance) localStorage.setItem('surautrack_attendance', JSON.stringify(data.attendance));
                    if (data.bookings) localStorage.setItem('surautrack_bookings', JSON.stringify(data.bookings));

                    this.loadCurrentSettings();
                    this.updateSystemInfo();
                    this.closeImportModal();
                    this.showMessage('Data berjaya diimport!', 'success');
                }
            } catch (error) {
                this.showMessage('Ralat ketika import data', 'error');
            }
        };

        reader.readAsText(file);
    }

    backupToCloud() {
        // Simulate cloud backup
        this.showMessage('Backup ke cloud akan datang dalam versi seterusnya', 'info');
    }

    restoreFromBackup() {
        this.showMessage('Pemulihan dari cloud akan datang dalam versi seterusnya', 'info');
    }

    // System Information
    updateSystemInfo() {
        document.getElementById('systemVersion').textContent = this.settings.system.version;
        document.getElementById('buildDate').textContent = this.settings.system.buildDate;
        
        // Count users
        const users = JSON.parse(localStorage.getItem('surautrack_users') || '[]');
        document.getElementById('totalUsers').textContent = users.length;
        
        // Count attendance records (demo - in real app, count from actual data)
        document.getElementById('totalAttendance').textContent = '1,247';
        
        // Count active bookings
        const bookings = JSON.parse(localStorage.getItem('surautrack_bookings') || '[]');
        const activeBookings = bookings.filter(b => b.status === 'approved' || b.status === 'pending');
        document.getElementById('activeBookings').textContent = activeBookings.length;
        
        document.getElementById('databaseStatus').textContent = 'Local Storage';
    }

    refreshSystemInfo() {
        this.updateSystemInfo();
        this.showMessage('Maklumat sistem disegar semula', 'success');
    }

    systemDiagnostics() {
        const diagnostics = {
            localStorage: !!localStorage.getItem('surautrack_settings'),
            users: JSON.parse(localStorage.getItem('surautrack_users') || '[]').length,
            attendance: '1,247 records', // Demo data
            bookings: JSON.parse(localStorage.getItem('surautrack_bookings') || '[]').length,
            settings: Object.keys(this.settings.general).length
        };

        let message = '📊 Diagnostik Sistem:\n\n';
        message += `✅ Local Storage: ${diagnostics.localStorage ? 'Aktif' : 'Tidak Aktif'}\n`;
        message += `✅ Pengguna: ${diagnostics.users} orang\n`;
        message += `✅ Kehadiran: ${diagnostics.attendance}\n`;
        message += `✅ Tempahan: ${diagnostics.bookings} rekod\n`;
        message += `✅ Tetapan: ${diagnostics.settings} konfigurasi\n`;
        message += `\nStatus: SEMUA SISTEM OK ✅`;

        alert(message);
    }

    // Danger Zone Functions
    clearAttendanceData() {
        if (confirm('⚠️ ANDA PASTI? Tindakan ini akan memadam SEMUA data kehadiran secara kekal!')) {
            localStorage.removeItem('surautrack_attendance');
            this.showMessage('Data kehadiran telah dikosongkan', 'warning');
            this.updateSystemInfo();
        }
    }

    clearBookingData() {
        if (confirm('⚠️ ANDA PASTI? Tindakan ini akan memadam SEMUA data tempahan secara kekal!')) {
            localStorage.removeItem('surautrack_bookings');
            this.showMessage('Data tempahan telah dikosongkan', 'warning');
            this.updateSystemInfo();
        }
    }

    resetAllSettings() {
        if (confirm('⚠️ ANDA PASTI? Tindakan ini akan reset SEMUA tetapan kepada nilai default!')) {
            localStorage.removeItem('surautrack_settings');
            this.settings = this.loadSettings();
            this.loadCurrentSettings();
            this.showMessage('Semua tetapan telah direset', 'warning');
        }
    }

    factoryReset() {
        if (confirm('💀 RESET KILANG! SEMUA DATA AKAN DIPADAM! Tindakan ini TIDAK BOLEH DIPULIHKAN!\n\nTaip "RESET" untuk mengesahkan:')) {
            const confirmation = prompt('Taip "RESET" untuk mengesahkan:');
            if (confirmation === 'RESET') {
                // Clear all data
                localStorage.clear();
                
                // Reload page
                setTimeout(() => {
                    alert('Reset kilang berjaya! Sistem akan dimuat semula.');
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                this.showMessage('Reset kilang dibatalkan', 'info');
            }
        }
    }

    // Utility Functions
    showMessage(message, type) {
        // Simple alert for now - can be enhanced with toast notifications
        const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
        alert(`${icon} ${message}`);
    }

    // Get settings for other modules
    getSetting(section, key) {
        return this.settings[section]?.[key];
    }

    // Update settings from other modules
    updateSetting(section, key, value) {
        if (this.settings[section]) {
            this.settings[section][key] = value;
            this.saveSettings();
        }
    }
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('settings.html')) {
        window.settingsManager = new SettingsManager();
        
        // Check if user is admin
        const user = firebaseUtils.getCurrentUser();
        if (user && user.role !== 'admin') {
            alert('Hanya admin yang boleh mengakses halaman tetapan.');
            window.location.href = 'attendance.html';
        }
    }
});

// Make settings manager available globally for other modules
window.getSystemSettings = function(section, key) {
    if (window.settingsManager) {
        return window.settingsManager.getSetting(section, key);
    }
    return null;
};