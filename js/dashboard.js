// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const languageSelect = document.getElementById('languageSelect');
const performanceTypeSelect = document.getElementById('performanceType');
const performanceChart = document.getElementById('performanceChart');
const logoutBtn = document.getElementById('logoutBtn');

// Constants
const DARK_MODE_KEY = 'darkMode';
const LANGUAGE_KEY = 'preferredLanguage';
const USER_DATA_KEY = 'userData';

// Chart Configuration
let chart = null;

// Translations
const translations = {
    en: {
        overview: 'Overview',
        marksheets: 'Marksheets',
        performance: 'Performance',
        attendance: 'Attendance',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout',
        currentCGPA: 'Current CGPA',
        subjects: 'Subjects',
        rank: 'Rank',
        recentMarksheets: 'Recent Marksheets',
        viewAll: 'View All',
        academicPerformance: 'Academic Performance',
        upcomingEvents: 'Upcoming Events'
    },
    hi: {
        overview: 'अवलोकन',
        marksheets: 'मार्कशीट',
        performance: 'प्रदर्शन',
        attendance: 'उपस्थिति',
        profile: 'प्रोफ़ाइल',
        settings: 'सेटिंग्स',
        logout: 'लॉग आउट',
        currentCGPA: 'वर्तमान सीजीपीए',
        subjects: 'विषय',
        rank: 'रैंक',
        recentMarksheets: 'हाल की मार्कशीट',
        viewAll: 'सभी देखें',
        academicPerformance: 'शैक्षणिक प्रदर्शन',
        upcomingEvents: 'आगामी कार्यक्रम'
    },
    bn: {
        overview: 'ওভারভিউ',
        marksheets: 'মার্কশিট',
        performance: 'পারফরম্যান্স',
        attendance: 'উপস্থিতি',
        profile: 'প্রোফাইল',
        settings: 'সেটিংস',
        logout: 'লগআউট',
        currentCGPA: 'বর্তমান সিজিপিএ',
        subjects: 'বিষয়',
        rank: 'র‍্যাঙ্ক',
        recentMarksheets: 'সাম্প্রতিক মার্কশিট',
        viewAll: 'সব দেখুন',
        academicPerformance: 'একাডেমিক পারফরম্যান্স',
        upcomingEvents: 'আসন্ন ইভেন্ট'
    }
};

// Initialize
function initialize() {
    initializeTheme();
    initializeLanguage();
    initializeChart();
    loadUserData();
    setupEventListeners();
}

// Theme Management
function initializeTheme() {
    const isDarkMode = localStorage.getItem(DARK_MODE_KEY) === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggleIcon.classList.replace('fa-moon', 'fa-sun');
        updateChartTheme(true);
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem(DARK_MODE_KEY, isDarkMode);
    
    if (isDarkMode) {
        themeToggleIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeToggleIcon.classList.replace('fa-sun', 'fa-moon');
    }

    updateChartTheme(isDarkMode);
}

// Language Management
function initializeLanguage() {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY) || 'en';
    languageSelect.value = savedLanguage;
    updateLanguage(savedLanguage);
}

function updateLanguage(lang) {
    const t = translations[lang];
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (t[key]) {
            element.textContent = t[key];
        }
    });
    localStorage.setItem(LANGUAGE_KEY, lang);
    updateChartLabels();
}

// Chart Management
function initializeChart() {
    const ctx = performanceChart.getContext('2d');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
            datasets: [{
                label: 'CGPA',
                data: [7.8, 8.1, 8.4, 8.6, 8.7, 8.75],
                borderColor: getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-color').trim(),
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: getChartOptions(isDarkMode)
    });
}

function getChartOptions(isDarkMode) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: isDarkMode ? '#1a1a2e' : 'white',
                titleColor: isDarkMode ? '#e2e8f0' : '#1e293b',
                bodyColor: isDarkMode ? '#e2e8f0' : '#1e293b',
                borderColor: isDarkMode ? '#2d2d44' : '#e2e8f0',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: isDarkMode ? '#e2e8f0' : '#1e293b'
                }
            },
            y: {
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: isDarkMode ? '#e2e8f0' : '#1e293b'
                },
                min: 0,
                max: 10,
                stepSize: 2
            }
        }
    };
}

function updateChartTheme(isDarkMode) {
    if (chart) {
        chart.options = getChartOptions(isDarkMode);
        chart.update();
    }
}

function updateChartData(type) {
    const data = type === 'semester' ? 
        [7.8, 8.1, 8.4, 8.6, 8.7, 8.75] :
        [8.5, 7.9, 9.0, 8.6, 8.2, 8.8];
    
    const labels = type === 'semester' ?
        ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'] :
        ['Math', 'Physics', 'Chemistry', 'English', 'Computer', 'Biology'];

    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

// User Data Management
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}');
    if (userData.name) {
        document.querySelector('.user-name').textContent = userData.name;
    }
    if (userData.avatar) {
        document.querySelector('.avatar').src = userData.avatar;
    }
}

// Event Handlers
function handleLogout() {
    // Show loading overlay
    document.querySelector('.loading-overlay').classList.add('active');
    
    // Simulate logout process
    setTimeout(() => {
        localStorage.removeItem(USER_DATA_KEY);
        window.location.href = '../../index.html';
    }, 1000);
}

// Event Listeners
function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    languageSelect.addEventListener('change', (e) => updateLanguage(e.target.value));
    performanceTypeSelect.addEventListener('change', (e) => updateChartData(e.target.value));
    logoutBtn.addEventListener('click', handleLogout);

    // Mobile navigation
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
        });
    });

    // Download buttons
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const marksheetInfo = e.target.closest('.marksheet-card')
                .querySelector('.marksheet-info');
            const semester = marksheetInfo.querySelector('h3').textContent;
            
            // Show loading state
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            // Simulate download
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-download"></i>';
                btn.disabled = false;
                showToast(`${semester} marksheet downloaded successfully`, 'success');
            }, 1500);
        });
    });

    // Notifications
    const notifications = document.querySelector('.notifications');
    if (notifications) {
        notifications.addEventListener('click', () => {
            showToast('No new notifications', 'info');
        });
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-content ${type}">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-times-circle';
        case 'warning': return 'fa-exclamation-circle';
        default: return 'fa-info-circle';
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initialize); 