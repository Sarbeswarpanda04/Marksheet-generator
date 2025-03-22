// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const studentLoginForm = document.getElementById('studentLoginForm');
const adminLoginForm = document.getElementById('adminLoginForm');

// Theme Management
const DARK_MODE_KEY = 'darkMode';

// Initialize theme
function initializeTheme() {
    const isDarkMode = localStorage.getItem(DARK_MODE_KEY) === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggleIcon.classList.replace('fa-moon', 'fa-sun');
    }
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem(DARK_MODE_KEY, isDarkMode);
    
    // Toggle icon
    if (isDarkMode) {
        themeToggleIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeToggleIcon.classList.replace('fa-sun', 'fa-moon');
    }

    // Add animation effect
    themeToggle.style.transform = 'scale(1.1)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
    }, 200);
}

// Form Validation
function validateStudentLogin(rollNumber, password) {
    if (!rollNumber || rollNumber.trim() === '') {
        showError('Please enter your roll number');
        return false;
    }
    if (!password || password.length < 6) {
        showError('Password must be at least 6 characters long');
        return false;
    }
    return true;
}

function validateAdminLogin(username, password) {
    if (!username || username.trim() === '') {
        showError('Please enter your username');
        return false;
    }
    if (!password || password.length < 8) {
        showError('Admin password must be at least 8 characters long');
        return false;
    }
    return true;
}

// Error Handling
function showError(message) {
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff3860;
        background-color: #feecf0;
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0;
        text-align: center;
        animation: fadeIn 0.3s ease-in-out;
    `;

    // Remove existing error messages
    document.querySelectorAll('.error-message').forEach(error => error.remove());

    // Show new error message
    const activeForm = document.activeElement.closest('form');
    if (activeForm) {
        activeForm.insertBefore(errorDiv, activeForm.firstChild);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            errorDiv.style.animation = 'fadeOut 0.3s ease-in-out';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }
}

// Form Submissions
function handleStudentLogin(e) {
    e.preventDefault();
    const rollNumber = document.getElementById('studentRoll').value;
    const password = document.getElementById('studentPassword').value;

    if (validateStudentLogin(rollNumber, password)) {
        // Add loading state
        const submitBtn = e.target.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Here you would typically make an API call to verify credentials
            window.location.href = 'pages/student/student-dashboard.html';
        }, 1500);
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (validateAdminLogin(username, password)) {
        // Add loading state
        const submitBtn = e.target.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Here you would typically make an API call to verify credentials
            window.location.href = 'pages/admin/admin-dashboard.html';
        }, 1500);
    }
}

// Add animations for form inputs
function addInputAnimations() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('input-focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('input-focused');
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    addInputAnimations();
});

themeToggle.addEventListener('click', toggleTheme);
studentLoginForm.addEventListener('submit', handleStudentLogin);
adminLoginForm.addEventListener('submit', handleAdminLogin);

// Add keypress support for theme toggle
document.addEventListener('keypress', (e) => {
    if (e.key === 't' && e.ctrlKey) {
        toggleTheme();
    }
}); 