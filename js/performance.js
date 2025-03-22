import { PullToRefresh, TouchGestureHandler, MobileNavigation, mobileAnimations } from './mobile-utils.js';

// DOM Elements
const performanceContainer = document.querySelector('.performance-container');
const chartContainer = document.querySelector('.chart-container');
const sidebar = document.querySelector('.sidebar');
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const periodFilter = document.querySelector('#periodFilter');
const subjectFilter = document.querySelector('#subjectFilter');

// Chart Instances
let cgpaChart = null;
let subjectChart = null;
let attendanceChart = null;
let gradeChart = null;

// Chart Colors
const chartColors = {
    primary: '#6366f1',
    secondary: '#a855f7',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: (ctx, color) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, `${color}40`);
        gradient.addColorStop(1, `${color}00`);
        return gradient;
    }
};

// Initialize
function initialize() {
    setupMobileFeatures();
    setupCharts();
    loadPerformanceData();
    setupEventListeners();
}

// Mobile Features Setup
function setupMobileFeatures() {
    // Initialize mobile navigation
    new MobileNavigation({
        sidebar,
        toggle: mobileNavToggle
    });

    // Initialize pull to refresh
    new PullToRefresh({
        container: performanceContainer,
        onRefresh: () => {
            return new Promise((resolve) => {
                loadPerformanceData().then(resolve);
            });
        }
    });

    // Setup touch gestures for charts
    setupChartGestures();

    // Animate elements on page load
    animatePageElements();
}

// Touch Gestures for Charts
function setupChartGestures() {
    const chartContainers = document.querySelectorAll('.chart-wrapper');
    
    chartContainers.forEach(container => {
        new TouchGestureHandler({
            element: container,
            onPinch: (e) => {
                const scale = Math.min(Math.max(e.scale, 0.5), 2);
                container.style.transform = `scale(${scale})`;
            },
            onDoubleTap: () => {
                container.style.transform = 'scale(1)';
            }
        });

        // Add touch feedback
        container.classList.add('touch-feedback');
    });
}

// Animate Page Elements
function animatePageElements() {
    // Animate stats cards
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        mobileAnimations.fadeIn(card, 0.1 * index);
    });

    // Animate charts
    document.querySelectorAll('.chart-wrapper').forEach((chart, index) => {
        mobileAnimations.scaleIn(chart, 0.2 + (0.1 * index));
    });
}

// Setup Charts with Mobile Optimizations
function setupCharts() {
    setupCGPAChart();
    setupSubjectChart();
    setupAttendanceChart();
    setupGradeChart();
    updateChartsResponsiveness();
}

function setupCGPAChart() {
    const ctx = document.getElementById('cgpaChart').getContext('2d');
    cgpaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
            datasets: [{
                label: 'CGPA',
                data: [8.5, 8.7, 9.0, 8.8, 9.2, 9.4],
                borderColor: '#6366f1',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
                    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
                    return gradient;
                },
                tension: 0.4,
                fill: true
            }]
        },
        options: getMobileChartOptions('CGPA Progression')
    });
}

function getMobileChartOptions(title) {
    const isMobile = window.innerWidth <= 768;
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: !isMobile
            },
            title: {
                display: true,
                text: title,
                color: 'white',
                font: {
                    size: isMobile ? 14 : 16
                }
            },
            tooltip: {
                enabled: true,
                mode: isMobile ? 'nearest' : 'index',
                intersect: isMobile
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    font: {
                        size: isMobile ? 10 : 12
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    font: {
                        size: isMobile ? 10 : 12
                    },
                    maxRotation: isMobile ? 45 : 0,
                    minRotation: isMobile ? 45 : 0
                }
            }
        },
        interaction: {
            mode: isMobile ? 'nearest' : 'index',
            intersect: false
        }
    };
}

// Update Charts Responsiveness
function updateChartsResponsiveness() {
    const isMobile = window.innerWidth <= 768;
    const charts = [cgpaChart, subjectChart, attendanceChart, gradeChart];

    charts.forEach(chart => {
        if (!chart) return;

        // Update chart options for mobile
        chart.options.plugins.legend.display = !isMobile;
        chart.options.plugins.title.font.size = isMobile ? 14 : 16;
        chart.options.scales.x.ticks.font.size = isMobile ? 10 : 12;
        chart.options.scales.y.ticks.font.size = isMobile ? 10 : 12;
        chart.options.scales.x.ticks.maxRotation = isMobile ? 45 : 0;
        chart.options.interaction.mode = isMobile ? 'nearest' : 'index';
        chart.update();
    });
}

// Load Performance Data with Loading State
async function loadPerformanceData() {
    showLoading();
    
    try {
        const response = await fetch('/api/performance');
        const data = await response.json();
        updateCharts(data);
        updateStats(data);
    } catch (error) {
        showError('Failed to load performance data');
    } finally {
        hideLoading();
    }
}

// Mobile-friendly Loading Indicator
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading-spinner';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.querySelector('.loading-spinner');
    if (loader) {
        loader.remove();
    }
}

// Event Listeners
function setupEventListeners() {
    // Filter change handlers
    periodFilter.addEventListener('change', updatePeriod);
    subjectFilter.addEventListener('change', updateSubject);

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(updateChartsResponsiveness, 100);
    });

    // Handle resize
    window.addEventListener('resize', debounce(() => {
        updateChartsResponsiveness();
    }, 250));
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize); 