// Enhanced Attendance Management
class AttendanceManager {
    constructor() {
        this.currentFilter = {
            date: '',
            prayerTime: 'all',
            status: 'all'
        };
        this.attendanceData = [];
        this.students = [];
        this.lastScan = null;
        
        this.initEventListeners();
        this.loadStudents();
        this.loadAttendanceData();
        this.setupRFIDScanner();
    }

    initEventListeners() {
        // Filter events
        document.getElementById('applyFilter').addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('resetFilter').addEventListener('click', () => {
            this.resetFilters();
        });

        // Export events
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('previewBtn').addEventListener('click', () => {
            this.previewData();
        });

        document.getElementById('exportFromPreview').addEventListener('click', () => {
            this.exportFromPreview();
        });

        // Simulate RFID scan
        document.getElementById('simulateScan').addEventListener('click', () => {
            this.simulateRFIDScan();
        });

        // Real-time filter updates
        ['dateFilter', 'prayerFilter', 'statusFilter'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.updateFilterValues();
            });
        });

        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dateFilter').value = today;
        document.getElementById('exportStartDate').value = today;
        document.getElementById('exportEndDate').value = today;
    }

    updateFilterValues() {
        this.currentFilter = {
            date: document.getElementById('dateFilter').value,
            prayerTime: document.getElementById('prayerFilter').value,
            status: document.getElementById('statusFilter').value
        };
    }

    async loadStudents() {
        // Demo students data
        this.students = [
            {
                id: 'S12345',
                rfid: '84:A6:C8:12',
                name: 'Ahmad bin Mahmud',
                class: '5 Al-Biruni',
                phone: '012-3456789',
                avatar: 'AM'
            },
            {
                id: 'S12346',
                rfid: '92:B4:D7:23', 
                name: 'Siti binti Mohd',
                class: '5 Al-Khwarizmi',
                phone: '013-4567890',
                avatar: 'SM'
            },
            {
                id: 'S12347',
                rfid: '73:C2:E5:34',
                name: 'Muhammad bin Ali',
                class: '4 Al-Razi',
                phone: '014-5678901',
                avatar: 'MA'
            },
            {
                id: 'S12348',
                rfid: '65:D1:F4:45',
                name: 'Nurul binti Razak',
                class: '4 Ibn Sina',
                phone: '015-6789012',
                avatar: 'NR'
            },
            {
                id: 'S12349',
                rfid: '58:E3:G6:56',
                name: 'Hafiz bin Abdullah',
                class: '6 Al-Farabi',
                phone: '016-7890123',
                avatar: 'HA'
            }
        ];

        this.updateStudentStats();
    }

    async loadAttendanceData() {
        try {
            // Show loading state
            this.showLoading();

            // Generate demo attendance data
            this.generateDemoAttendanceData();
            
            // Apply current filters
            this.applyFilters();

        } catch (error) {
            console.error('Error loading attendance:', error);
            this.showError('Ralat memuatkan data kehadiran.');
        }
    }

    generateDemoAttendanceData() {
        const prayerTimes = ['subuh', 'zohor', 'asar', 'maghrib', 'isyak'];
        this.attendanceData = [];

        // Generate attendance for the last 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            this.students.forEach(student => {
                // Randomly decide if student attended each prayer
                prayerTimes.forEach(prayer => {
                    if (Math.random() > 0.3) { // 70% attendance rate
                        const attendanceTime = new Date(date);
                        attendanceTime.setHours(6 + prayerTimes.indexOf(prayer) * 3, 
                                               Math.floor(Math.random() * 60));
                        
                        this.attendanceData.push({
                            id: `${student.id}_${dateStr}_${prayer}`,
                            studentId: student.id,
                            studentInfo: student,
                            prayerTime: prayer,
                            date: dateStr,
                            timestamp: attendanceTime.getTime(),
                            status: 'present',
                            locationVerified: Math.random() > 0.2,
                            rfid: student.rfid
                        });
                    }
                });
            });
        }

        // Sort by timestamp (newest first)
        this.attendanceData.sort((a, b) => b.timestamp - a.timestamp);
    }

    applyFilters() {
        this.updateFilterValues();
        
        let filteredData = [...this.attendanceData];

        // Apply date filter
        if (this.currentFilter.date) {
            filteredData = filteredData.filter(item => item.date === this.currentFilter.date);
        }

        // Apply prayer time filter
        if (this.currentFilter.prayerTime !== 'all') {
            filteredData = filteredData.filter(item => item.prayerTime === this.currentFilter.prayerTime);
        }

        // Apply status filter
        if (this.currentFilter.status !== 'all') {
            filteredData = filteredData.filter(item => item.status === this.currentFilter.status);
        }

        this.displayAttendanceData(filteredData);
        this.updateStats(filteredData);
    }

    resetFilters() {
        document.getElementById('dateFilter').value = new Date().toISOString().split('T')[0];
        document.getElementById('prayerFilter').value = 'all';
        document.getElementById('statusFilter').value = 'all';
        
        this.applyFilters();
    }

    displayAttendanceData(data) {
        const container = document.getElementById('attendanceList');
        
        // Update result count
        document.getElementById('resultCount').textContent = `${data.length} rekod`;
        
        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 40px; color: #666;">
                    <p>Tiada rekod kehadiran ditemui untuk tapisan ini.</p>
                </div>
            `;
            return;
        }

        const attendanceHTML = data.map(item => this.createAttendanceItem(item)).join('');
        container.innerHTML = attendanceHTML;
    }

    createAttendanceItem(item) {
        const time = this.formatTime(item.timestamp);
        const date = this.formatDate(item.date);
        const student = item.studentInfo;
        
        return `
            <div class="attendance-item">
                <div class="student-info">
                    <div class="student-avatar">${student.avatar}</div>
                    <div>
                        <div class="student-name">${student.name}</div>
                        <div class="student-id">${student.id} • ${student.class}</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div class="attendance-time">${this.getPrayerDisplayName(item.prayerTime)} • ${time}</div>
                    <div class="attendance-date" style="font-size: 11px; color: #999;">${date}</div>
                    <div style="margin-top: 5px;">
                        <span class="status-badge ${item.status === 'present' ? 'status-present' : 'status-absent'}">
                            ${item.status === 'present' ? 'Hadir' : 'Tidak Hadir'}
                        </span>
                        ${item.locationVerified ? '<span class="status-badge status-upcoming" style="margin-left: 5px;">📍 Disahkan</span>' : ''}
                    </div>
                </div>
            </div>
        `;
    }

    updateStats(filteredData) {
        const totalStudents = this.students.length;
        
        // Calculate today's attendance
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = this.attendanceData.filter(item => 
            item.date === today && item.status === 'present'
        );
        
        const presentToday = todayAttendance.length;
        const absentToday = totalStudents - presentToday;
        const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

        // Update UI
        document.getElementById('totalStudents').textContent = totalStudents;
        document.getElementById('presentToday').textContent = presentToday;
        document.getElementById('absentToday').textContent = absentToday > 0 ? absentToday : 0;
        document.getElementById('attendanceRate').textContent = `${attendanceRate}%`;

        // Update filtered stats
        const presentCount = filteredData.filter(item => item.status === 'present').length;
        const absentCount = filteredData.filter(item => item.status === 'absent').length;
        
        console.log(`Stats: ${presentCount} hadir, ${absentCount} tidak hadir dari ${filteredData.length} rekod`);
    }

    setupRFIDScanner() {
        // In real implementation, this would interface with actual RFID hardware
        console.log('RFID Scanner initialized - waiting for scans...');
        
        // Simulate periodic scans for demo
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance of auto-scan
                this.simulateRFIDScan();
            }
        }, 15000);
    }

    simulateRFIDScan() {
        // Randomly select a student for demo
        const randomStudent = this.students[Math.floor(Math.random() * this.students.length)];
        this.processRFIDScan(randomStudent.rfid);
    }

    processRFIDScan(rfidCode) {
        console.log('RFID Scan detected:', rfidCode);
        
        // Find student by RFID
        const student = this.students.find(s => s.rfid === rfidCode);
        if (!student) {
            this.showScanResult(null, 'Kad RFID tidak dikenali.');
            return;
        }

        // Create attendance record
        const now = new Date();
        const attendanceRecord = {
            id: `${student.id}_${now.getTime()}`,
            studentId: student.id,
            studentInfo: student,
            prayerTime: this.getCurrentPrayerTime(),
            date: now.toISOString().split('T')[0],
            timestamp: now.getTime(),
            status: 'present',
            locationVerified: true,
            rfid: rfidCode
        };

        // Add to attendance data
        this.attendanceData.unshift(attendanceRecord);
        
        // Update display
        this.showScanResult(student, attendanceRecord);
        this.applyFilters(); // Refresh the list
        
        // Log the scan
        this.logScanActivity(student, attendanceRecord);
    }

    showScanResult(student, attendanceRecord) {
        if (!student) {
            // Show error for unknown RFID
            document.getElementById('currentScanInfo').style.display = 'none';
            document.getElementById('lastScanInfo').style.display = 'block';
            document.getElementById('scanDetails').innerHTML = `
                <div style="color: #D32F2F;">
                    <p>❌ Kad RFID tidak dikenali</p>
                    <p>RFID: ${attendanceRecord}</p>
                </div>
            `;
            return;
        }

        // Show current scan info
        document.getElementById('currentScanInfo').style.display = 'block';
        document.getElementById('studentDetails').innerHTML = `
            <div class="student-details">
                <div class="student-avatar-large">${student.avatar}</div>
                <div>
                    <div style="font-weight: bold; font-size: 16px;">${student.name}</div>
                    <div>ID: ${student.id} • ${student.class}</div>
                    <div>RFID: ${student.rfid}</div>
                    <div style="margin-top: 8px;">
                        <span class="status-badge status-present">Berjaya Direkodkan</span>
                        <span class="status-badge status-upcoming">${this.getPrayerDisplayName(attendanceRecord.prayerTime)}</span>
                    </div>
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                        Masa: ${this.formatTime(attendanceRecord.timestamp)}
                    </div>
                </div>
            </div>
        `;

        // Update last scan info
        this.lastScan = { student, attendanceRecord };
        document.getElementById('lastScanInfo').style.display = 'block';
        document.getElementById('scanDetails').innerHTML = `
            <div>
                <div><strong>Pelajar:</strong> ${student.name}</div>
                <div><strong>Waktu:</strong> ${this.getPrayerDisplayName(attendanceRecord.prayerTime)} - ${this.formatTime(attendanceRecord.timestamp)}</div>
                <div><strong>Status:</strong> <span class="status-badge status-present">Berjaya</span></div>
            </div>
        `;

        // Hide current scan after 5 seconds
        setTimeout(() => {
            document.getElementById('currentScanInfo').style.display = 'none';
        }, 5000);
    }

    logScanActivity(student, attendanceRecord) {
        console.log(`Scan recorded: ${student.name} at ${new Date(attendanceRecord.timestamp).toLocaleString()}`);
        
        // In real app, this would send to server
        if (window.userManager) {
            window.userManager.logActivity('create', 
                `Rekod kehadiran: ${student.name} (${this.getPrayerDisplayName(attendanceRecord.prayerTime)})`);
        }
    }

    getCurrentPrayerTime() {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 6) return 'subuh';
        if (hour >= 12 && hour < 15) return 'zohor';
        if (hour >= 15 && hour < 18) return 'asar';
        if (hour >= 18 && hour < 20) return 'maghrib';
        return 'isyak';
    }

    getPrayerDisplayName(prayer) {
        const prayerNames = {
            'subuh': 'Subuh',
            'zohor': 'Zohor',
            'asar': 'Asar',
            'maghrib': 'Maghrib',
            'isyak': 'Isyak'
        };
        return prayerNames[prayer] || prayer;
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('ms-MY', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('ms-MY', {
            day: 'numeric',
            month: 'short'
        });
    }

    // Export functionality
    exportData() {
        const startDate = document.getElementById('exportStartDate').value;
        const endDate = document.getElementById('exportEndDate').value;
        const format = document.getElementById('exportFormat').value;

        if (!startDate || !endDate) {
            alert('Sila pilih tarikh mula dan tarikh tamat.');
            return;
        }

        const filteredData = this.getDataForExport(startDate, endDate);
        
        if (filteredData.length === 0) {
            alert('Tiada data untuk dieksport dalam julat tarikh ini.');
            return;
        }

        this.performExport(filteredData, format);
    }

    getDataForExport(startDate, endDate) {
        return this.attendanceData.filter(item => {
            return item.date >= startDate && item.date <= endDate;
        });
    }

    performExport(data, format) {
        let content, mimeType, extension;

        switch (format) {
            case 'csv':
                content = this.convertToCSV(data);
                mimeType = 'text/csv';
                extension = 'csv';
                break;
            case 'excel':
                content = this.convertToExcel(data);
                mimeType = 'application/vnd.ms-excel';
                extension = 'xls';
                break;
            case 'pdf':
                this.exportAsPDF(data);
                return;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kehadiran_surau_${new Date().toISOString().split('T')[0]}.${extension}`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showMessage(`Data berjaya dieksport (${data.length} rekod)`, 'success');
    }

    convertToCSV(data) {
        const headers = ['Nama', 'ID Pelajar', 'Kelas', 'Waktu Solat', 'Tarikh', 'Masa', 'Status', 'RFID'];
        const rows = data.map(item => [
            item.studentInfo.name,
            item.studentInfo.id,
            item.studentInfo.class,
            this.getPrayerDisplayName(item.prayerTime),
            item.date,
            this.formatTime(item.timestamp),
            item.status === 'present' ? 'Hadir' : 'Tidak Hadir',
            item.rfid
        ]);

        return [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
    }

    convertToExcel(data) {
        // Simple HTML table for Excel
        return this.generateHTMLTable(data);
    }

    exportAsPDF(data) {
        // In real implementation, use a PDF library like jsPDF
        alert('PDF export akan datang. Untuk sekarang, gunakan format CSV.');
        this.performExport(data, 'csv');
    }

    previewData() {
        const startDate = document.getElementById('exportStartDate').value;
        const endDate = document.getElementById('exportEndDate').value;

        if (!startDate || !endDate) {
            alert('Sila pilih tarikh mula dan tarikh tamat.');
            return;
        }

        const filteredData = this.getDataForExport(startDate, endDate);
        
        if (filteredData.length === 0) {
            alert('Tiada data untuk dipratonton dalam julat tarikh ini.');
            return;
        }

        this.showPreview(filteredData);
    }

    showPreview(data) {
        const previewContent = document.getElementById('previewContent');
        previewContent.innerHTML = this.generateHTMLTable(data);

        document.getElementById('previewModal').style.display = 'block';
    }

    generateHTMLTable(data) {
        return `
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                    <tr style="background: #2E7D32; color: white;">
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Nama</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">ID</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Kelas</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Waktu</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Tarikh</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Masa</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(item => `
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;">${item.studentInfo.name}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${item.studentInfo.id}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${item.studentInfo.class}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${this.getPrayerDisplayName(item.prayerTime)}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${item.date}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${this.formatTime(item.timestamp)}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">
                                <span class="status-badge ${item.status === 'present' ? 'status-present' : 'status-absent'}">
                                    ${item.status === 'present' ? 'Hadir' : 'Tidak Hadir'}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                <strong>Jumlah Rekod:</strong> ${data.length} | 
                <strong>Tarikh:</strong> ${document.getElementById('exportStartDate').value} hingga ${document.getElementById('exportEndDate').value}
            </div>
        `;
    }

    exportFromPreview() {
        const startDate = document.getElementById('exportStartDate').value;
        const endDate = document.getElementById('exportEndDate').value;
        const format = document.getElementById('exportFormat').value;
        const data = this.getDataForExport(startDate, endDate);
        
        this.performExport(data, format);
        this.closePreviewModal();
    }

    closePreviewModal() {
        document.getElementById('previewModal').style.display = 'none';
    }

    showLoading() {
        const container = document.getElementById('attendanceList');
        if (container) {
            container.innerHTML = `
                <div class="loading-state" style="text-align: center; padding: 40px;">
                    <p>Memuatkan data kehadiran...</p>
                </div>
            `;
        }
    }

    showError(message) {
        alert(message);
    }

    showMessage(message, type) {
        // Simple message display - can be enhanced with toast notifications
        const alertClass = type === 'success' ? 'status-present' : 'status-absent';
        alert(message);
    }

    updateStudentStats() {
        // Additional stats can be calculated here
        console.log(`Loaded ${this.students.length} students`);
    }
}

// Global functions for modal
function closePreviewModal() {
    if (window.attendanceManager) {
        window.attendanceManager.closePreviewModal();
    }
}

// Initialize attendance manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('attendance.html')) {
        window.attendanceManager = new AttendanceManager();
    }
});