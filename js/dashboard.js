// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const languageSelector = document.querySelector('.language-selector select');
const performanceTypeSelect = document.querySelector('.chart-controls select');
const performanceChart = document.querySelector('#performanceChart');
const logoutBtn = document.querySelector('.logout-btn');

// Constants
const DARK_MODE_KEY = 'dashboard_dark_mode';
const LANG_KEY = 'preferred_language';
const USER_DATA_KEY = 'user_data';

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
        cgpa: 'CGPA',
        attendance_rate: 'Attendance Rate',
        subjects: 'Subjects',
        rank: 'Class Rank',
        recent_marksheets: 'Recent Marksheets',
        view_all: 'View All',
        academic_performance: 'Academic Performance',
        upcoming_events: 'Upcoming Events',
        download: 'Download',
        loading: 'Loading...',
        success: 'Success',
        error: 'Error'
    },
    hi: {
        overview: 'अवलोकन',
        marksheets: 'मार्कशीट',
        performance: 'प्रदर्शन',
        attendance: 'उपस्थिति',
        profile: 'प्रोफ़ाइल',
        settings: 'सेटिंग्स',
        logout: 'लॉग आउट',
        cgpa: 'सीजीपीए',
        attendance_rate: 'उपस्थिति दर',
        subjects: 'विषय',
        rank: 'कक्षा रैंक',
        recent_marksheets: 'हाल की मार्कशीट',
        view_all: 'सभी देखें',
        academic_performance: 'शैक्षणिक प्रदर्शन',
        upcoming_events: 'आगामी कार्यक्रम',
        download: 'डाउनलोड',
        loading: 'लोड हो रहा है...',
        success: 'सफल',
        error: 'त्रुटि'
    },
    bn: {
        overview: 'ওভারভিউ',
        marksheets: 'মার্কশিট',
        performance: 'পারফরম্যান্স',
        attendance: 'উপস্থিতি',
        profile: 'প্রোফাইল',
        settings: 'সেটিংস',
        logout: 'লগআউট',
        cgpa: 'সিজিপিএ',
        attendance_rate: 'উপস্থিতির হার',
        subjects: 'বিষয়',
        rank: 'ক্লাস র‍্যাঙ্ক',
        recent_marksheets: 'সাম্প্রতিক মার্কশিট',
        view_all: 'সব দেখুন',
        academic_performance: 'একাডেমিক পারফরম্যান্স',
        upcoming_events: 'আসন্ন ইভেন্ট',
        download: 'ডাউনলোড',
        loading: 'লোড হচ্ছে...',
        success: 'সফল',
        error: 'ত্রুটি'
    }
};

// Initialize dashboard
function initialize() {
    setupTheme();
    setupLanguage();
    setupChart();
    loadUserData();
    setupEventListeners();
}

// Theme Management
function setupTheme() {
    const isDarkMode = localStorage.getItem(DARK_MODE_KEY) === 'true';
    document.body.classList.toggle('dark-mode', isDarkMode);
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem(DARK_MODE_KEY, isDarkMode);
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Language Management
function setupLanguage() {
    const currentLang = localStorage.getItem(LANG_KEY) || 'en';
    languageSelector.value = currentLang;
    updatePageLanguage(currentLang);
}

function updatePageLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.dataset.translate;
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// Chart Management
function setupChart() {
    const ctx = performanceChart.getContext('2d');
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradientFill.addColorStop(1, 'rgba(99, 102, 241, 0)');

    const data = {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
        datasets: [{
            label: 'CGPA',
            data: [8.5, 8.7, 9.0, 8.8, 9.2, 9.4],
            borderColor: '#6366f1',
            backgroundColor: gradientFill,
            tension: 0.4,
            fill: true
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 6,
                    max: 10,
                    grid: {
                        display: true,
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };

    window.performanceChart = new Chart(ctx, config);
}

// User Data Management
function loadUserData() {
    showLoading();
    
    // Simulated API call
    setTimeout(() => {
        const userData = {
            name: 'John Doe',
            roll: 'CSE/2020/001',
            cgpa: 9.2,
            attendance: 92,
            subjects: 48,
            rank: 5,
            recentMarksheets: [
                { name: 'Semester 6 Final', date: '2024-03-15', type: 'Final' },
                { name: 'Semester 6 Mid-term', date: '2024-02-01', type: 'Mid-term' },
                { name: 'Semester 5 Final', date: '2023-12-20', type: 'Final' }
            ],
            upcomingEvents: [
                { name: 'Project Submission', date: '2024-04-10', type: 'Deadline' },
                { name: 'Final Examination', date: '2024-04-20', type: 'Exam' },
                { name: 'Result Declaration', date: '2024-05-05', type: 'Result' }
            ]
        };

        updateDashboard(userData);
        hideLoading();
    }, 1000);
}

function updateDashboard(userData) {
    // Update quick stats
    document.querySelector('.cgpa-value').textContent = userData.cgpa;
    document.querySelector('.attendance-value').textContent = userData.attendance + '%';
    document.querySelector('.subjects-value').textContent = userData.subjects;
    document.querySelector('.rank-value').textContent = '#' + userData.rank;

    // Update marksheets list
    const marksheetsList = document.querySelector('.marksheet-list');
    marksheetsList.innerHTML = userData.recentMarksheets.map(marksheet => `
        <div class="marksheet-item">
            <div class="marksheet-icon">
                <i class="fas fa-file-alt"></i>
            </div>
            <div class="marksheet-info">
                <h3>${marksheet.name}</h3>
                <p>${marksheet.type}</p>
                <span class="date">${formatDate(marksheet.date)}</span>
            </div>
            <button class="download-btn" onclick="downloadMarksheet('${marksheet.name}')">
                <i class="fas fa-download"></i>
            </button>
        </div>
    `).join('');

    // Update events list
    const eventsList = document.querySelector('.events-list');
    eventsList.innerHTML = userData.upcomingEvents.map(event => `
        <div class="event-item">
            <div class="event-date">
                <span class="date">${new Date(event.date).getDate()}</span>
                <span class="month">${new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div class="event-info">
                <h3>${event.name}</h3>
                <p><i class="fas fa-calendar"></i> ${formatDate(event.date)}</p>
                <p><i class="fas fa-tag"></i> ${event.type}</p>
            </div>
        </div>
    `).join('');
}

// Event Listeners
function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    
    languageSelector.addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        localStorage.setItem(LANG_KEY, selectedLang);
        updatePageLanguage(selectedLang);
    });

    performanceTypeSelect.addEventListener('change', (e) => {
        updatePerformanceChart(e.target.value);
    });

    logoutBtn.addEventListener('click', handleLogout);

    // Add touch gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });
}

// Utility Functions
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.querySelector('.loading-overlay');
    if (loader) {
        loader.remove();
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    const container = document.querySelector('.toast-container') || (() => {
        const cont = document.createElement('div');
        cont.className = 'toast-container';
        document.body.appendChild(cont);
        return cont;
    })();

    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function downloadMarksheet(name) {
    showToast(`Downloading ${name}...`, 'success');
    // Implement actual download logic here
}

function handleLogout() {
    showLoading();
    setTimeout(() => {
        window.location.href = '../../index.html';
    }, 1000);
}

function handleSwipeGesture() {
    const SWIPE_THRESHOLD = 100;
    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) < SWIPE_THRESHOLD) return;

    if (difference > 0) {
        // Swipe left - show sidebar
        document.querySelector('.sidebar').classList.add('show');
    } else {
        // Swipe right - hide sidebar
        document.querySelector('.sidebar').classList.remove('show');
    }
}

function updatePerformanceChart(type) {
    const chart = window.performanceChart;
    if (!chart) return;

    // Simulated data for different performance types
    const data = {
        cgpa: [8.5, 8.7, 9.0, 8.8, 9.2, 9.4],
        attendance: [85, 90, 88, 92, 95, 93],
        subjects: [6, 6, 7, 8, 8, 7]
    };

    chart.data.datasets[0].data = data[type] || data.cgpa;
    chart.data.datasets[0].label = type.toUpperCase();
    chart.update();
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize); 