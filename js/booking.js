// Booking Management System - UPDATED FOR 2 TYPES ONLY
class BookingManager {
    constructor() {
        this.currentBookingType = null;
        this.selectedDate = null;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.myBookings = [];
        this.allBookings = [];
        
        this.initEventListeners();
        this.generateCalendar();
        this.loadMyBookings();
        this.checkAdminAccess();
        
        console.log('BookingManager initialized - 2 Types Only');
    }

    initEventListeners() {
        console.log('Initializing event listeners...');
        
        // Form submission
        const bookingForm = document.getElementById('bookingFormContent');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitBooking();
            });
        }

        // Filter change
        const bookingFilter = document.getElementById('bookingFilter');
        if (bookingFilter) {
            bookingFilter.addEventListener('change', (e) => {
                this.filterBookings(e.target.value);
            });
        }

        // Modal close event
        const bookingModal = document.getElementById('bookingModal');
        if (bookingModal) {
            bookingModal.addEventListener('click', (e) => {
                if (e.target.id === 'bookingModal') {
                    this.closeBookingModal();
                }
            });
        }

        // Add click events to booking cards (alternative method)
        this.addCardClickEvents();
        
        console.log('Event listeners initialized successfully');
    }

    addCardClickEvents() {
        // Add click events to booking cards as backup
        const cards = document.querySelectorAll('.booking-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                const type = card.id.replace('Card', '');
                this.selectBookingType(type);
            });
        });
    }

    selectBookingType(type) {
        console.log('Selecting booking type:', type);
        
        this.currentBookingType = type;
        
        // Remove active class from all cards
        document.querySelectorAll('.booking-card').forEach(card => {
            card.style.borderColor = 'transparent';
            card.style.transform = 'translateY(0)';
        });
        
        // Add active style to selected card
        const selectedCard = document.getElementById(`${type}Card`);
        if (selectedCard) {
            selectedCard.style.borderColor = '#2E7D32';
            selectedCard.style.transform = 'translateY(-5px)';
        }
        
        this.showBookingForm(type);
    }

    showBookingForm(type) {
        console.log('Showing booking form for:', type);
        
        const formTitle = document.getElementById('formTitle');
        const typeBadge = document.getElementById('bookingTypeBadge');
        const formContent = document.getElementById('bookingFormContent');
        const bookingForm = document.getElementById('bookingForm');

        if (!formTitle || !typeBadge || !formContent || !bookingForm) {
            console.error('Form elements not found!');
            return;
        }

        // Update titles and badges
        const typeNames = {
            'barangan': 'Penggunaan Barangan',
            'ruang': 'Booking Ruang Program'
        };

        formTitle.textContent = `Tempahan - ${typeNames[type]}`;
        typeBadge.textContent = typeNames[type];
        typeBadge.className = `status-badge status-upcoming`;

        // Generate form content based on type
        formContent.innerHTML = this.generateFormContent(type);
        bookingForm.style.display = 'block';

        // Scroll to form
        bookingForm.scrollIntoView({ behavior: 'smooth' });
        
        console.log('Booking form shown successfully');
    }

    generateFormContent(type) {
        console.log('Generating form content for:', type);
        
        const today = new Date().toISOString().split('T')[0];
        
        const forms = {
            'barangan': `
                <div class="form-group">
                    <label for="bookingPurpose">Tujuan Penggunaan *</label>
                    <input type="text" id="bookingPurpose" class="form-control" 
                           placeholder="Contoh: Program Maulidur Rasul, Majlis Perkahwinan, etc." required>
                </div>
                
                <div class="form-group">
                    <label>Pilih Barangan *</label>
                    <div class="item-list">
                        <label class="item-checkbox">
                            <input type="checkbox" name="items" value="speaker" onchange="window.bookingManager.toggleItemQuantity('speaker')">
                            <span>Speaker & Sistem Audio</span>
                            <div class="quantity-control" id="speakerQty" style="display: none;">
                                <button type="button" class="quantity-btn" onclick="window.bookingManager.decreaseQuantity('speaker')">-</button>
                                <span class="quantity-display" id="speakerCount">1</span>
                                <button type="button" class="quantity-btn" onclick="window.bookingManager.increaseQuantity('speaker')">+</button>
                            </div>
                        </label>
                        
                        <label class="item-checkbox">
                            <input type="checkbox" name="items" value="mikrofon" onchange="window.bookingManager.toggleItemQuantity('mikrofon')">
                            <span>Mikrofon & Wireless Mic</span>
                            <div class="quantity-control" id="mikrofonQty" style="display: none;">
                                <button type="button" class="quantity-btn" onclick="window.bookingManager.decreaseQuantity('mikrofon')">-</button>
                                <span class="quantity-display" id="mikrofonCount">1</span>
                                <button type="button" class="quantity-btn" onclick="window.bookingManager.increaseQuantity('mikrofon')">+</button>
                            </div>
                        </label>
                        
                        <label class="item-checkbox">
                            <input type="checkbox" name="items" value="tikar" onchange="window.bookingManager.toggleItemQuantity('tikar')">
                            <span>Tikar Sejadah</span>
                            <div class="quantity-control" id="tikarQty" style="display: none;">
                                <button type="button" class="quantity-btn" onclick="window.bookingManager.decreaseQuantity('tikar')">-</button>
                                <span class="quantity-display" id="tikarCount">1</span>
                                <button type="button" class="quantity-btn" onclick="window.bookingManager.increaseQuantity('tikar')">+</button>
                            </div>
                        </label>
                        
                        <label class="item-checkbox">
                            <input type="checkbox" name="items" value="kerusi" onchange="window.bookingManager.toggleItemQuantity('kerusi')">
                            <span>Kerusi Plastik</span>
                            <div class="quantity-control" id="kerusiQty" style="display: none;">
                                <button type="button" class="quantity-btn" onclick="window.bookingManager.decreaseQuantity('kerusi')">-</button>
                                <span class="quantity-display" id="kerusiCount">1</span>
                                <button type="button" class="quantity-btn" onclick="window.bookingManager.increaseQuantity('kerusi')">+</button>
                            </div>
                        </label>
                        
                        <label class="item-checkbox">
                            <input type="checkbox" name="items" value="meja" onchange="window.bookingManager.toggleItemQuantity('meja')">
                            <span>Meja Lipat</span>
                            <div class="quantity-control" id="mejaQty" style="display: none;">
                                <button type="button" class="quantity-btn" onclick="window.bookingManager.decreaseQuantity('meja')">-</button>
                                <span class="quantity-display" id="mejaCount">1</span>
                                <button type="button" class="quantity-btn" onclick="window.bookingManager.increaseQuantity('meja')">+</button>
                            </div>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="bookingDate">Tarikh Penggunaan *</label>
                    <input type="date" id="bookingDate" class="form-control" required 
                           min="${today}">
                </div>
                
                <div class="form-group">
                    <label for="bookingTime">Masa Penggunaan *</label>
                    <select id="bookingTime" class="form-control" required>
                        <option value="">Pilih Masa</option>
                        <option value="08:00-10:00">8:00 PG - 10:00 PG</option>
                        <option value="10:00-12:00">10:00 PG - 12:00 PTG</option>
                        <option value="14:00-16:00">2:00 PTG - 4:00 PTG</option>
                        <option value="16:00-18:00">4:00 PTG - 6:00 PTG</option>
                        <option value="19:00-21:00">7:00 MLM - 9:00 MLM</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="additionalNotes">Nota Tambahan</label>
                    <textarea id="additionalNotes" class="form-control" rows="3" 
                              placeholder="Sebutkan keperluan khusus atau maklumat tambahan..."></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary btn-block">📦 Hantar Tempahan Barangan</button>
            `,

            'ruang': `
                <div class="form-group">
                    <label for="programName">Nama Program *</label>
                    <input type="text" id="programName" class="form-control" 
                           placeholder="Contoh: Majlis Khatam Quran, Ceramah Agama, etc." required>
                </div>
                
                <div class="form-group">
                    <label for="programType">Jenis Program *</label>
                    <select id="programType" class="form-control" required>
                        <option value="">Pilih Jenis Program</option>
                        <option value="ceramah">Ceramah Agama</option>
                        <option value="majlis">Majlis Rasmi</option>
                        <option value="perkahwinan">Majlis Perkahwinan</option>
                        <option value="kenduri">Kenduri/Kesyukuran</option>
                        <option value="lain">Lain-lain</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="expectedAttendance">Anggaran Kehadiran *</label>
                    <input type="number" id="expectedAttendance" class="form-control" 
                           min="1" max="200" placeholder="Anggaran bilangan peserta" required>
                </div>
                
                <div class="form-group">
                    <label for="bookingDate">Tarikh Program *</label>
                    <input type="date" id="bookingDate" class="form-control" required
                           min="${today}">
                </div>
                
                <div class="form-group">
                    <label for="bookingTime">Masa Program *</label>
                    <div class="time-slots">
                        <div class="time-slot" data-time="08:00-10:00" onclick="window.bookingManager.selectTimeSlot(this)">8:00-10:00</div>
                        <div class="time-slot" data-time="10:00-12:00" onclick="window.bookingManager.selectTimeSlot(this)">10:00-12:00</div>
                        <div class="time-slot" data-time="14:00-16:00" onclick="window.bookingManager.selectTimeSlot(this)">14:00-16:00</div>
                        <div class="time-slot" data-time="16:00-18:00" onclick="window.bookingManager.selectTimeSlot(this)">16:00-18:00</div>
                        <div class="time-slot" data-time="19:00-21:00" onclick="window.bookingManager.selectTimeSlot(this)">19:00-21:00</div>
                    </div>
                    <input type="hidden" id="bookingTime" required>
                </div>
                
                <div class="form-group">
                    <label for="additionalNotes">Keperluan Khas</label>
                    <textarea id="additionalNotes" class="form-control" rows="3" 
                              placeholder="Sebutkan keperluan khas seperti setup audio, susunan kerusi, etc."></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary btn-block">🏛️ Hantar Tempahan Ruang</button>
            `
        };

        return forms[type] || '<p>Borang tidak tersedia.</p>';
    }

    toggleItemQuantity(item) {
        console.log('Toggling quantity for:', item);
        const checkbox = document.querySelector(`input[value="${item}"]`);
        const qtyControl = document.getElementById(`${item}Qty`);
        
        if (checkbox && qtyControl) {
            if (checkbox.checked) {
                qtyControl.style.display = 'flex';
            } else {
                qtyControl.style.display = 'none';
                document.getElementById(`${item}Count`).textContent = '1';
            }
        }
    }

    increaseQuantity(item) {
        console.log('Increasing quantity for:', item);
        const countElement = document.getElementById(`${item}Count`);
        if (countElement) {
            let count = parseInt(countElement.textContent);
            countElement.textContent = count + 1;
        }
    }

    decreaseQuantity(item) {
        console.log('Decreasing quantity for:', item);
        const countElement = document.getElementById(`${item}Count`);
        if (countElement) {
            let count = parseInt(countElement.textContent);
            if (count > 1) {
                countElement.textContent = count - 1;
            }
        }
    }

    selectTimeSlot(element) {
        console.log('Selecting time slot:', element);
        // Remove selected class from all time slots
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Add selected class to clicked slot
        element.classList.add('selected');
        document.getElementById('bookingTime').value = element.getAttribute('data-time');
    }

    generateCalendar() {
        const monthNames = [
            "Januari", "Februari", "Mac", "April", "Mei", "Jun",
            "Julai", "Ogos", "September", "Oktober", "November", "Disember"
        ];

        // Update month display
        document.getElementById('currentMonth').textContent = 
            `${monthNames[this.currentMonth]} ${this.currentYear}`;

        // Generate day headers
        const days = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];
        const daysContainer = document.getElementById('calendarDays');
        daysContainer.innerHTML = days.map(day => 
            `<div class="calendar-day">${day}</div>`
        ).join('');

        // Generate dates
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        
        const datesContainer = document.getElementById('calendarDates');
        let datesHTML = '';

        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            datesHTML += '<div class="calendar-date"></div>';
        }

        // Add date cells
        const today = new Date();
        for (let date = 1; date <= daysInMonth; date++) {
            const dateObj = new Date(this.currentYear, this.currentMonth, date);
            const dateStr = dateObj.toISOString().split('T')[0];
            const isPast = dateObj < today;
            const isBooked = this.isDateBooked(dateStr);
            const isSelected = this.selectedDate === dateStr;

            let className = 'calendar-date';
            if (isPast) className += ' booked';
            if (isBooked) className += ' booked';
            if (isSelected) className += ' selected';

            datesHTML += `
                <div class="${className}" 
                     onclick="bookingManager.selectDate('${dateStr}')"
                     ${isPast || isBooked ? 'style="cursor: not-allowed;"' : ''}>
                    ${date}
                </div>
            `;
        }

        datesContainer.innerHTML = datesHTML;
    }

    isDateBooked(dateStr) {
        // Demo booked dates - in real app, check from database
        const demoBooked = [
            '2024-03-15', '2024-03-20', '2024-03-25',
            '2024-04-01', '2024-04-05', '2024-04-10'
        ];
        return demoBooked.includes(dateStr);
    }

    selectDate(dateStr) {
        if (this.isDateBooked(dateStr)) {
            alert('Tarikh ini telah penuh ditempah. Sila pilih tarikh lain.');
            return;
        }

        this.selectedDate = dateStr;
        this.generateCalendar();
        
        // Auto-fill date in form if open
        const dateInput = document.getElementById('bookingDate');
        if (dateInput) {
            dateInput.value = dateStr;
        }
    }

    previousMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.generateCalendar();
    }

    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.generateCalendar();
    }

    async submitBooking() {
        const user = firebaseUtils.getCurrentUser();
        if (!user) {
            alert('Sila log masuk untuk membuat tempahan.');
            return;
        }

        const formData = this.collectFormData();
        if (!formData) return;

        // Create booking object
        const booking = {
            id: 'booking_' + Math.random().toString(36).substr(2, 9),
            type: this.currentBookingType,
            userId: user.email,
            userName: user.name,
            ...formData,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            approvedBy: null,
            approvedAt: null
        };

        try {
            // In real app, save to Firebase
            this.myBookings.unshift(booking);
            this.allBookings.unshift(booking);
            
            this.showBookingSuccess(booking);
            this.loadMyBookings();
            this.resetForm();

            // Log activity
            if (window.userManager) {
                window.userManager.logActivity('create', 
                    `Tempahan ${this.getBookingTypeName(booking.type)}: ${this.getBookingTitle(booking)}`);
            }

        } catch (error) {
            console.error('Booking submission error:', error);
            alert('Ralat menghantar tempahan. Sila cuba lagi.');
        }
    }

    collectFormData() {
        const type = this.currentBookingType;
        
        if (type === 'barangan') {
            const selectedItems = [];
            document.querySelectorAll('input[name="items"]:checked').forEach(checkbox => {
                const item = checkbox.value;
                const quantity = parseInt(document.getElementById(`${item}Count`).textContent);
                selectedItems.push({ item, quantity });
            });

            if (selectedItems.length === 0) {
                alert('Sila pilih sekurang-kurangnya satu barangan.');
                return null;
            }

            return {
                purpose: document.getElementById('bookingPurpose').value,
                items: selectedItems,
                date: document.getElementById('bookingDate').value,
                time: document.getElementById('bookingTime').value,
                notes: document.getElementById('additionalNotes').value
            };
        }
        else if (type === 'ruang') {
            return {
                programName: document.getElementById('programName').value,
                programType: document.getElementById('programType').value,
                attendance: parseInt(document.getElementById('expectedAttendance').value),
                date: document.getElementById('bookingDate').value,
                time: document.getElementById('bookingTime').value,
                notes: document.getElementById('additionalNotes').value
            };
        }

        return null;
    }

    showBookingSuccess(booking) {
        alert(`✅ Tempahan anda telah berjaya dihantar!\n\nJenis: ${this.getBookingTypeName(booking.type)}\nStatus: Menunggu Kelulusan\n\nAnda akan dimaklumkan melalui email setelah permohonan diproses.`);
    }

    resetForm() {
        document.getElementById('bookingFormContent').reset();
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        document.querySelectorAll('.quantity-control').forEach(qty => {
            qty.style.display = 'none';
        });
    }

    async loadMyBookings() {
        const user = firebaseUtils.getCurrentUser();
        if (!user) return;

        // Demo data - in real app, fetch from Firebase
        this.myBookings = [
            {
                id: 'book_001',
                type: 'barangan',
                purpose: 'Program Maulidur Rasul',
                items: [{ item: 'speaker', quantity: 2 }, { item: 'mikrofon', quantity: 3 }],
                date: '2024-03-20',
                time: '19:00-21:00',
                status: 'approved',
                submittedAt: '2024-03-15T10:00:00Z'
            },
            {
                id: 'book_002', 
                type: 'ruang',
                programName: 'Ceramah Agama Bulanan',
                programType: 'ceramah',
                attendance: 50,
                date: '2024-03-25',
                time: '20:00-22:00',
                status: 'pending',
                submittedAt: '2024-03-18T14:30:00Z'
            }
        ];

        this.renderMyBookings();
    }

    renderMyBookings() {
        const container = document.getElementById('myBookings');
        
        if (this.myBookings.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <p>Anda belum membuat sebarang tempahan.</p>
                    <p>Pilih jenis tempahan di atas untuk bermula.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.myBookings.map(booking => `
            <div class="booking-item" onclick="bookingManager.viewBooking('${booking.id}')">
                <div class="booking-info">
                    <h4>${this.getBookingTitle(booking)}</h4>
                    <div class="booking-meta">
                        ${this.getBookingMeta(booking)} • 
                        Dihantar: ${new Date(booking.submittedAt).toLocaleDateString('ms-MY')}
                    </div>
                </div>
                <span class="booking-status status-${booking.status}">
                    ${this.getStatusDisplay(booking.status)}
                </span>
            </div>
        `).join('');
    }

    getBookingTitle(booking) {
        switch(booking.type) {
            case 'barangan': return booking.purpose;
            case 'ruang': return booking.programName;
            default: return 'Tempahan';
        }
    }

    getBookingMeta(booking) {
        switch(booking.type) {
            case 'barangan': 
                return `Barangan (${booking.items.length} item) • ${booking.date}`;
            case 'ruang':
                return `${booking.programType} • ${booking.attendance} orang`;
            default: return '';
        }
    }

    getBookingTypeName(type) {
        const names = {
            'barangan': 'Penggunaan Barangan',
            'ruang': 'Booking Ruang Program'
        };
        return names[type] || type;
    }

    getStatusDisplay(status) {
        const statuses = {
            'pending': 'Menunggu',
            'approved': 'Diluluskan', 
            'rejected': 'Ditolak'
        };
        return statuses[status] || status;
    }

    viewBooking(bookingId) {
        const booking = [...this.myBookings, ...this.allBookings].find(b => b.id === bookingId);
        if (!booking) return;

        this.showBookingModal(booking);
    }

    showBookingModal(booking) {
        const modal = document.getElementById('bookingModal');
        const title = document.getElementById('modalBookingTitle');
        const content = document.getElementById('bookingModalContent');
        const actions = document.getElementById('bookingModalActions');

        title.textContent = `Butiran Tempahan - ${this.getBookingTypeName(booking.type)}`;
        content.innerHTML = this.generateBookingDetails(booking);
        actions.innerHTML = this.generateBookingActions(booking);

        modal.style.display = 'block';
    }

    generateBookingDetails(booking) {
        let details = `
            <div style="margin-bottom: 15px;">
                <strong>Pemohon:</strong> ${booking.userName}<br>
                <strong>Tarikh Dihantar:</strong> ${new Date(booking.submittedAt).toLocaleString('ms-MY')}<br>
                <strong>Status:</strong> <span class="booking-status status-${booking.status}">${this.getStatusDisplay(booking.status)}</span>
            </div>
        `;

        switch(booking.type) {
            case 'barangan':
                details += `
                    <div style="margin-bottom: 15px;">
                        <strong>Tujuan:</strong> ${booking.purpose}<br>
                        <strong>Tarikh:</strong> ${booking.date}<br>
                        <strong>Masa:</strong> ${booking.time}
                    </div>
                    <div>
                        <strong>Barangan:</strong>
                        <ul style="margin: 8px 0; padding-left: 20px;">
                            ${booking.items.map(item => 
                                `<li>${this.getItemDisplayName(item.item)} (${item.quantity} unit)</li>`
                            ).join('')}
                        </ul>
                    </div>
                `;
                break;

            case 'ruang':
                details += `
                    <div style="margin-bottom: 15px;">
                        <strong>Program:</strong> ${booking.programName}<br>
                        <strong>Jenis:</strong> ${booking.programType}<br>
                        <strong>Anggaran Kehadiran:</strong> ${booking.attendance} orang<br>
                        <strong>Tarikh:</strong> ${booking.date}<br>
                        <strong>Masa:</strong> ${booking.time}
                    </div>
                `;
                break;
        }

        if (booking.notes) {
            details += `
                <div style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                    <strong>Nota:</strong><br>${booking.notes}
                </div>
            `;
        }

        return details;
    }

    getItemDisplayName(item) {
        const names = {
            'speaker': 'Speaker & Audio',
            'mikrofon': 'Mikrofon',
            'tikar': 'Tikar Sejadah', 
            'kerusi': 'Kerusi Plastik',
            'meja': 'Meja Lipat'
        };
        return names[item] || item;
    }

    generateBookingActions(booking) {
        const user = firebaseUtils.getCurrentUser();
        const isAdmin = user && user.role === 'admin';
        
        if (!isAdmin) {
            if (booking.status === 'pending') {
                return `
                    <button class="btn btn-secondary" onclick="bookingManager.cancelBooking('${booking.id}')">❌ Batalkan</button>
                    <button class="btn btn-primary" onclick="bookingManager.closeBookingModal()">Tutup</button>
                `;
            }
            return '<button class="btn btn-primary" onclick="bookingManager.closeBookingModal()">Tutup</button>';
        }

        // Admin actions
        if (booking.status === 'pending') {
            return `
                <button class="btn btn-primary" onclick="bookingManager.approveBooking('${booking.id}')">✅ Luluskan</button>
                <button class="btn btn-danger" onclick="bookingManager.rejectBooking('${booking.id}')">❌ Tolak</button>
                <button class="btn btn-secondary" onclick="bookingManager.closeBookingModal()">Tutup</button>
            `;
        }

        return '<button class="btn btn-primary" onclick="bookingManager.closeBookingModal()">Tutup</button>';
    }

    closeBookingModal() {
        document.getElementById('bookingModal').style.display = 'none';
    }

    approveBooking(bookingId) {
        if (confirm('Adakah anda pasti untuk meluluskan tempahan ini?')) {
            this.updateBookingStatus(bookingId, 'approved');
            this.closeBookingModal();
        }
    }

    rejectBooking(bookingId) {
        const reason = prompt('Sila nyatakan sebab penolakan:');
        if (reason) {
            this.updateBookingStatus(bookingId, 'rejected', reason);
            this.closeBookingModal();
        }
    }

    cancelBooking(bookingId) {
        if (confirm('Adakah anda pasti untuk membatalkan tempahan ini?')) {
            this.updateBookingStatus(bookingId, 'cancelled');
            this.closeBookingModal();
        }
    }

    updateBookingStatus(bookingId, status, reason = null) {
        // Update in arrays
        this.myBookings = this.myBookings.map(b => 
            b.id === bookingId ? { ...b, status } : b
        );
        this.allBookings = this.allBookings.map(b => 
            b.id === bookingId ? { ...b, status } : b
        );

        this.renderMyBookings();
        if (document.getElementById('allBookingsSection').style.display !== 'none') {
            this.renderAllBookings();
        }

        // Log activity
        if (window.userManager) {
            const booking = this.myBookings.find(b => b.id === bookingId);
            window.userManager.logActivity('update', 
                `${status === 'approved' ? 'Meluluskan' : 'Menolak'} tempahan: ${this.getBookingTitle(booking)}`);
        }

        alert(`Status tempahan telah dikemas kini kepada: ${this.getStatusDisplay(status)}`);
    }

    checkAdminAccess() {
        const user = firebaseUtils.getCurrentUser();
        const adminSection = document.getElementById('allBookingsSection');
        
        if (user && user.role === 'admin') {
            adminSection.style.display = 'block';
            this.loadAllBookings();
        }
    }

    async loadAllBookings() {
        // Demo data for all bookings
        this.allBookings = [
            ...this.myBookings,
            {
                id: 'book_004',
                type: 'barangan',
                purpose: 'Majlis Perkahwinan',
                items: [{ item: 'kerusi', quantity: 50 }, { item: 'meja', quantity: 10 }],
                date: '2024-03-28',
                time: '18:00-22:00',
                status: 'pending',
                userName: 'Ali bin Ahmad',
                submittedAt: '2024-03-19T16:20:00Z'
            },
            {
                id: 'book_005',
                type: 'ruang', 
                programName: 'Program Tarbiyah Mingguan',
                programType: 'ceramah',
                attendance: 30,
                date: '2024-04-05',
                time: '20:00-22:00',
                status: 'approved',
                userName: 'Siti binti Rahman',
                submittedAt: '2024-03-12T11:45:00Z'
            }
        ];

        this.renderAllBookings();
    }

    renderAllBookings() {
        const container = document.getElementById('allBookings');
        const filter = document.getElementById('bookingFilter').value;

        let filteredBookings = this.allBookings;
        if (filter !== 'all') {
            filteredBookings = this.allBookings.filter(b => b.status === filter);
        }

        container.innerHTML = filteredBookings.map(booking => `
            <div class="booking-item" onclick="bookingManager.viewBooking('${booking.id}')">
                <div class="booking-info">
                    <h4>${this.getBookingTitle(booking)}</h4>
                    <div class="booking-meta">
                        ${this.getBookingMeta(booking)} • 
                        Oleh: ${booking.userName} •
                        ${new Date(booking.submittedAt).toLocaleDateString('ms-MY')}
                    </div>
                </div>
                <span class="booking-status status-${booking.status}">
                    ${this.getStatusDisplay(booking.status)}
                </span>
            </div>
        `).join('');
    }

    filterBookings(status) {
        this.renderAllBookings();
    }

    exportBookings() {
        const csvContent = this.convertBookingsToCSV(this.allBookings);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tempahan_surau_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        alert(`Data tempahan berjaya dieksport (${this.allBookings.length} rekod)`);
    }

    convertBookingsToCSV(bookings) {
        const headers = ['Jenis', 'Pemohon', 'Butiran', 'Tarikh', 'Masa', 'Status', 'Tarikh Dihantar'];
        const rows = bookings.map(booking => [
            this.getBookingTypeName(booking.type),
            booking.userName,
            this.getBookingTitle(booking),
            booking.date,
            booking.time,
            this.getStatusDisplay(booking.status),
            new Date(booking.submittedAt).toLocaleDateString('ms-MY')
        ]);

        return [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
    }
}

// Global functions untuk akses dari HTML
window.selectBookingType = function(type) {
    if (window.bookingManager) {
        window.bookingManager.selectBookingType(type);
    }
};

window.toggleItemQuantity = function(item) {
    if (window.bookingManager) {
        window.bookingManager.toggleItemQuantity(item);
    }
};

window.increaseQuantity = function(item) {
    if (window.bookingManager) {
        window.bookingManager.increaseQuantity(item);
    }
};

window.decreaseQuantity = function(item) {
    if (window.bookingManager) {
        window.bookingManager.decreaseQuantity(item);
    }
};

window.selectTimeSlot = function(element) {
    if (window.bookingManager) {
        window.bookingManager.selectTimeSlot(element);
    }
};

// Initialize booking manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing BookingManager...');
    if (window.location.pathname.includes('booking.html') || 
        window.location.pathname.endsWith('booking.html') ||
        window.location.href.includes('booking')) {
        window.bookingManager = new BookingManager();
        console.log('BookingManager created:', window.bookingManager);
    }
});