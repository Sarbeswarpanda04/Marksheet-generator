// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const languageSelect = document.getElementById('language');
const settingsToggles = document.querySelectorAll('.switch input');
const confirmationModal = document.getElementById('confirmationModal');
const closeModalBtn = document.querySelector('.close-modal');
const confirmActionBtn = document.querySelector('.confirm-action');
const cancelActionBtn = document.querySelector('.cancel-action');
const deleteAccountBtn = document.querySelector('.delete-account');
const clearCacheBtn = document.querySelector('.clear-cache');
const downloadDataBtn = document.querySelector('.download-data');
const viewHistoryBtn = document.querySelector('.view-history');
const changePasswordBtn = document.querySelector('.change-password');

// Constants
const STORAGE_KEYS = {
    THEME: 'theme',
    LANGUAGE: 'language',
    SETTINGS: 'userSettings',
    LOGIN_HISTORY: 'loginHistory'
};

const TOAST_DURATION = 3000; // 3 seconds

// Initialize
function initialize() {
    loadSavedSettings();
    setupEventListeners();
    animateSettingsSections();
}

// Event Listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Language selection
    languageSelect.addEventListener('change', handleLanguageChange);

    // Settings toggles
    settingsToggles.forEach(toggle => {
        toggle.addEventListener('change', handleSettingToggle);
    });

    // Buttons
    deleteAccountBtn.addEventListener('click', () => showConfirmationModal('delete-account'));
    clearCacheBtn.addEventListener('click', () => showConfirmationModal('clear-cache'));
    downloadDataBtn.addEventListener('click', handleDataDownload);
    viewHistoryBtn.addEventListener('click', showLoginHistory);
    changePasswordBtn.addEventListener('click', showChangePasswordModal);

    // Modal
    closeModalBtn.addEventListener('click', closeModal);
    confirmActionBtn.addEventListener('click', handleConfirmAction);
    cancelActionBtn.addEventListener('click', closeModal);

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            closeModal();
        }
    });
}

// Theme Management
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    themeToggle.querySelector('i').classList.toggle('fa-sun', isDarkMode);
    themeToggle.querySelector('i').classList.toggle('fa-moon', !isDarkMode);
    localStorage.setItem(STORAGE_KEYS.THEME, isDarkMode ? 'dark' : 'light');
    showToast(`${isDarkMode ? 'Dark' : 'Light'} mode enabled`, 'success');
}

// Language Management
function handleLanguageChange(e) {
    const language = e.target.value;
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    showToast(`Language changed to ${e.target.options[e.target.selectedIndex].text}`, 'success');
    // Here you would typically trigger a page reload or language update
}

// Settings Management
function handleSettingToggle(e) {
    const settingId = e.target.id;
    const isEnabled = e.target.checked;
    
    // Handle specific settings
    switch (settingId) {
        case 'notifications-toggle':
            handleNotificationPermission(isEnabled);
            break;
        case '2fa-toggle':
            handle2FAToggle(isEnabled);
            break;
        default:
            saveSettingState(settingId, isEnabled);
            showToast(`${formatSettingName(settingId)} ${isEnabled ? 'enabled' : 'disabled'}`, 'success');
    }
}

function formatSettingName(settingId) {
    return settingId
        .replace('-toggle', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Notification Management
async function handleNotificationPermission(isEnabled) {
    if (isEnabled) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            saveSettingState('notifications-toggle', true);
            showToast('Notifications enabled', 'success');
        } else {
            document.getElementById('notifications-toggle').checked = false;
            showToast('Notification permission denied', 'error');
        }
    } else {
        saveSettingState('notifications-toggle', false);
        showToast('Notifications disabled', 'success');
    }
}

// 2FA Management
function handle2FAToggle(isEnabled) {
    if (isEnabled) {
        // Here you would typically show a 2FA setup modal
        showToast('2FA setup required', 'info');
    } else {
        saveSettingState('2fa-toggle', false);
        showToast('2FA disabled', 'success');
    }
}

// Modal Management
function showConfirmationModal(action) {
    const modalBody = confirmationModal.querySelector('.modal-body p');
    const confirmBtn = confirmationModal.querySelector('.confirm-action');
    
    switch (action) {
        case 'delete-account':
            modalBody.textContent = 'Are you sure you want to delete your account? This action cannot be undone.';
            confirmBtn.classList.add('btn-danger');
            break;
        case 'clear-cache':
            modalBody.textContent = 'Are you sure you want to clear all locally stored data?';
            confirmBtn.classList.remove('btn-danger');
            break;
    }
    
    confirmActionBtn.dataset.action = action;
    confirmationModal.classList.add('active');
}

function closeModal() {
    confirmationModal.classList.remove('active');
}

function handleConfirmAction() {
    const action = confirmActionBtn.dataset.action;
    
    switch (action) {
        case 'delete-account':
            handleAccountDeletion();
            break;
        case 'clear-cache':
            handleCacheClear();
            break;
    }
    
    closeModal();
}

// Data Management
function handleDataDownload() {
    showLoading();
    
    // Simulate data preparation
    setTimeout(() => {
        const userData = {
            settings: JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}'),
            loginHistory: JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGIN_HISTORY) || '[]'),
            // Add other user data here
        };
        
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = 'user-data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        hideLoading();
        showToast('Data downloaded successfully', 'success');
    }, 1500);
}

function handleCacheClear() {
    showLoading();
    
    // Simulate cache clearing
    setTimeout(() => {
        localStorage.clear();
        hideLoading();
        showToast('Cache cleared successfully', 'success');
        loadSavedSettings(); // Reload default settings
    }, 1500);
}

function handleAccountDeletion() {
    showLoading();
    
    // Simulate account deletion
    setTimeout(() => {
        hideLoading();
        showToast('Account deleted successfully', 'success');
        // Here you would typically redirect to the login page
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 1500);
    }, 2000);
}

// Login History
function showLoginHistory() {
    const loginHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGIN_HISTORY) || '[]');
    // Here you would typically show a modal with the login history
    console.log('Login History:', loginHistory);
}

// Utility Functions
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = document.createElement('i');
    icon.className = `fas ${getToastIcon(type)}`;
    
    const text = document.createElement('span');
    text.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(text);
    
    const container = document.getElementById('toastContainer');
    container.appendChild(toast);
    
    // Trigger reflow for animation
    toast.offsetHeight;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, TOAST_DURATION);
}

function getToastIcon(type) {
    switch (type) {
        case 'success':
            return 'fa-check-circle';
        case 'error':
            return 'fa-times-circle';
        case 'warning':
            return 'fa-exclamation-circle';
        default:
            return 'fa-info-circle';
    }
}

function showLoading() {
    // Here you would typically show a loading spinner
    document.body.style.cursor = 'wait';
}

function hideLoading() {
    document.body.style.cursor = 'default';
}

function loadSavedSettings() {
    // Load theme
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
    
    // Load language
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
    languageSelect.value = savedLanguage;
    
    // Load other settings
    const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
    settingsToggles.forEach(toggle => {
        const settingId = toggle.id;
        if (savedSettings.hasOwnProperty(settingId)) {
            toggle.checked = savedSettings[settingId];
        }
    });
}

function saveSettingState(settingId, value) {
    const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
    savedSettings[settingId] = value;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(savedSettings));
}

function animateSettingsSections() {
    const sections = document.querySelectorAll('.settings-section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initialize); 