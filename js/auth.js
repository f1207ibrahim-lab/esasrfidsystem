// Authentication functions - Temporary system without Firebase
class AuthManager {
    constructor() {
        this.demoAccounts = {
            'admin': {
                password: '123',
                role: 'admin',
                name: 'Pentadbir Sistem'
            },
            'warden@surautrack.com': {
                password: 'password123', 
                role: 'warden',
                name: 'Warden Surau'
            }
        };
        this.initEventListeners();
        this.checkExistingLogin();
    }

    initEventListeners() {
        // Login form submission
        const loginBtn = document.getElementById('loginBtn');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogin();
            });

            // Enter key support
            [emailInput, passwordInput].forEach(input => {
                if (input) {
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            this.handleLogin();
                        }
                    });
                }
            });
        }

        // Forgot password
        const forgotPassword = document.getElementById('forgotPassword');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');

        // Validation
        if (!email || !password) {
            this.showMessage('Sila isi kedua-dua email dan kata laluan.', 'error');
            return;
        }

        // Show loading state
        loginBtn.textContent = 'Log Masuk...';
        loginBtn.disabled = true;

        // Simulate API call delay
        setTimeout(() => {
            if (this.authenticateUser(email, password)) {
                this.showMessage('Log masuk berjaya!', 'success');
                
                // Save to localStorage
                localStorage.setItem('surautrack_user', JSON.stringify({
                    email: email,
                    role: this.demoAccounts[email].role,
                    name: this.demoAccounts[email].name,
                    loginTime: new Date().toISOString()
                }));
                
                // Redirect after success
                setTimeout(() => {
                    window.location.href = 'attendance.html';
                }, 1000);
                
            } else {
                this.showMessage('Email atau kata laluan tidak betul.', 'error');
                loginBtn.textContent = 'Log Masuk';
                loginBtn.disabled = false;
            }
        }, 1500);
    }

    authenticateUser(email, password) {
        return (
            this.demoAccounts[email] && 
            this.demoAccounts[email].password === password
        );
    }

    handleForgotPassword() {
        const email = prompt('Sila masukkan email anda untuk menetapkan semula kata laluan:');
        
        if (!email) return;

        if (this.demoAccounts[email]) {
            alert(`Kata laluan untuk ${email}: ${this.demoAccounts[email].password}`);
        } else {
            alert('Email tidak ditemui dalam sistem.');
        }
    }

    checkExistingLogin() {
        const userData = localStorage.getItem('surautrack_user');
        if (userData) {
            // Auto-redirect if already logged in
            if (!window.location.pathname.includes('index.html') && 
                window.location.pathname !== '/') {
                window.location.href = 'attendance.html';
            }
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.login-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `login-message login-message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 12px;
            margin: 15px 0;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            ${type === 'error' ? 
                'background: #FFEBEE; color: #D32F2F; border: 1px solid #FFCDD2;' : 
                'background: #E8F5E9; color: #2E7D32; border: 1px solid #C8E6C9;'
            }
        `;

        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.insertBefore(messageDiv, loginForm.firstChild);
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Logout function
    logout() {
        localStorage.removeItem('surautrack_user');
        window.location.href = 'index.html';
    }

    // Check if user is logged in
    isLoggedIn() {
        return !!localStorage.getItem('surautrack_user');
    }

    // Get current user
    getCurrentUser() {
        const userData = localStorage.getItem('surautrack_user');
        return userData ? JSON.parse(userData) : null;
    }

    // Check if user is admin
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }
}

// Demo login function for testing
function demoLogin(role) {
    let email, password;

    if (role === 'admin') {
        email = 'admin@surautrack.com';
        password = 'password123';
    } else if (role === 'warden') {
        email = 'warden@surautrack.com';
        password = 'password123';
    }

    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
    
    // Auto-fill and show login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager();
    
    // Add demo buttons for easier testing
    addDemoButtons();
});

function addDemoButtons() {
    if (!document.querySelector('.demo-buttons')) {
        const demoButtons = document.createElement('div');
        demoButtons.className = 'demo-buttons';
        demoButtons.style.cssText = `
            margin-top: 20px;
            text-align: center;
        `;
        
        demoButtons.innerHTML = `
            <p style="margin-bottom: 10px; color: #666; font-size: 14px;">Cepat Log Masuk:</p>
            <button onclick="demoLogin('admin')" class="btn btn-secondary" style="margin: 5px; padding: 8px 16px;">
                👨‍💼 Admin Demo
            </button>
            <button onclick="demoLogin('warden')" class="btn btn-secondary" style="margin: 5px; padding: 8px 16px;">
                👮 Warden Demo
            </button>
        `;
        
        const demoAccounts = document.querySelector('.demo-accounts');
        if (demoAccounts) {
            demoAccounts.appendChild(demoButtons);
        }
    }
}
