// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const loginForm = document.getElementById('loginForm');
const toggleBtns = document.querySelectorAll('.toggle-btn');
const formHeader = document.querySelector('.form-header');
const userIdentifier = document.getElementById('userIdentifier');
const userPassword = document.getElementById('userPassword');
const passwordToggle = document.querySelector('.password-toggle');

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

// Login Type Toggle
function updateLoginType(type) {
    const isAdmin = type === 'admin';
    
    // Update form header
    formHeader.querySelector('.card-icon i').className = isAdmin ? 'fas fa-user-shield' : 'fas fa-user-graduate';
    formHeader.querySelector('h2').textContent = isAdmin ? 'Admin Login' : 'Student Login';
    formHeader.querySelector('p').textContent = isAdmin ? 'Manage student records and generate reports' : 'Access your marksheet and academic performance';
    
    // Update input placeholders
    userIdentifier.placeholder = isAdmin ? 'Username' : 'Roll Number';
    
    // Update validation requirements
    userPassword.setAttribute('minlength', isAdmin ? '8' : '6');
    
    // Add animation
    formHeader.style.animation = 'fadeIn 0.3s ease-out';
    setTimeout(() => formHeader.style.animation = '', 300);
}

// Form Validation
function validateLogin(identifier, password, isAdmin) {
    if (!identifier || identifier.trim() === '') {
        showError(isAdmin ? 'Please enter your username' : 'Please enter your roll number');
        return false;
    }
    
    const minLength = isAdmin ? 8 : 6;
    if (!password || password.length < minLength) {
        showError(`Password must be at least ${minLength} characters long`);
        return false;
    }
    
    return true;
}

// Error Handling with Animation
function showError(message) {
    // Remove existing error messages
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff3860;
        background-color: #feecf0;
        padding: 10px;
        border-radius: 10px;
        margin: 10px 0;
        text-align: center;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    `;

    // Insert error message
    loginForm.insertBefore(errorDiv, loginForm.firstChild);
    
    // Trigger animation
    requestAnimationFrame(() => {
        errorDiv.style.opacity = '1';
        errorDiv.style.transform = 'translateY(0)';
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        errorDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// Form Submission
function handleLogin(e) {
    e.preventDefault();
    
    const isAdmin = document.querySelector('.toggle-btn[data-type="admin"]').classList.contains('active');
    const identifier = userIdentifier.value;
    const password = userPassword.value;

    if (validateLogin(identifier, password, isAdmin)) {
        // Add loading state with spinner animation
        const submitBtn = e.target.querySelector('button');
        const btnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Here you would typically make an API call to verify credentials
            window.location.href = isAdmin ? 'pages/admin/admin-dashboard.html' : 'pages/student/student-dashboard.html';
        }, 1500);
    }
}

// Password Visibility Toggle
function togglePasswordVisibility() {
    const type = userPassword.type === 'password' ? 'text' : 'password';
    userPassword.type = type;
    passwordToggle.classList.toggle('fa-eye');
    passwordToggle.classList.toggle('fa-eye-slash');
}

// Input Animations
function addInputAnimations() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
        });
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    addInputAnimations();
});

themeToggle.addEventListener('click', toggleTheme);
loginForm.addEventListener('submit', handleLogin);
passwordToggle.addEventListener('click', togglePasswordVisibility);

// Toggle Button Event Listeners
toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateLoginType(btn.dataset.type);
    });
});

// Keyboard Shortcuts
document.addEventListener('keypress', (e) => {
    // Theme toggle: Ctrl + T
    if (e.key === 't' && e.ctrlKey) {
        toggleTheme();
    }
    // Quick login type toggle: Ctrl + Q
    if (e.key === 'q' && e.ctrlKey) {
        const currentActive = document.querySelector('.toggle-btn.active');
        const nextType = currentActive.dataset.type === 'student' ? 'admin' : 'student';
        document.querySelector(`.toggle-btn[data-type="${nextType}"]`).click();
    }
}); 