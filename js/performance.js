// DOM Elements
const cgpaPeriodSelect = document.getElementById('cgpaPeriod');
const subjectSemesterSelect = document.getElementById('subjectSemester');
const gradeFilterSelect = document.getElementById('gradeFilter');
const attendancePeriodSelect = document.getElementById('attendancePeriod');

// Chart Instances
let cgpaChart = null;
let subjectChart = null;
let gradeChart = null;
let attendanceChart = null;

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
    setupCharts();
    setupEventListeners();
    loadPerformanceData();
}

// Setup Charts
function setupCharts() {
    // CGPA Chart
    const cgpaCtx = document.getElementById('cgpaChart').getContext('2d');
    cgpaChart = new Chart(cgpaCtx, {
        type: 'line',
        data: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
            datasets: [{
                label: 'CGPA',
                data: [8.5, 8.7, 9.0, 8.8, 9.2, 9.4],
                borderColor: chartColors.primary,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    return chartColors.gradient(ctx, chartColors.primary);
                },
                tension: 0.4,
                fill: true
            }]
        },
        options: getLineChartOptions('CGPA Progression')
    });

    // Subject Performance Chart
    const subjectCtx = document.getElementById('subjectChart').getContext('2d');
    subjectChart = new Chart(subjectCtx, {
        type: 'radar',
        data: {
            labels: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Biology'],
            datasets: [{
                label: 'Current Performance',
                data: [92, 88, 95, 85, 98, 90],
                borderColor: chartColors.primary,
                backgroundColor: `${chartColors.primary}40`,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: chartColors.primary
            }]
        },
        options: getRadarChartOptions('Subject-wise Performance')
    });

    // Grade Distribution Chart
    const gradeCtx = document.getElementById('gradeChart').getContext('2d');
    gradeChart = new Chart(gradeCtx, {
        type: 'doughnut',
        data: {
            labels: ['A+', 'A', 'B+', 'B', 'C'],
            datasets: [{
                data: [12, 8, 4, 2, 1],
                backgroundColor: [
                    chartColors.success,
                    chartColors.primary,
                    chartColors.secondary,
                    chartColors.warning,
                    chartColors.error
                ]
            }]
        },
        options: getDoughnutChartOptions('Grade Distribution')
    });

    // Attendance vs Performance Chart
    const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
    attendanceChart = new Chart(attendanceCtx, {
        type: 'bar',
        data: {
            labels: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Biology'],
            datasets: [
                {
                    label: 'Attendance (%)',
                    data: [95, 88, 92, 85, 98, 90],
                    backgroundColor: `${chartColors.primary}80`,
                    borderColor: chartColors.primary,
                    borderWidth: 1
                },
                {
                    label: 'Performance (%)',
                    data: [92, 88, 95, 85, 98, 90],
                    backgroundColor: `${chartColors.secondary}80`,
                    borderColor: chartColors.secondary,
                    borderWidth: 1
                }
            ]
        },
        options: getBarChartOptions('Attendance vs Performance')
    });
}

// Chart Options
function getLineChartOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: title,
                color: 'white',
                font: {
                    size: 16
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 6,
                max: 10,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            }
        }
    };
}

function getRadarChartOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: title,
                color: 'white',
                font: {
                    size: 16
                }
            }
        },
        scales: {
            r: {
                min: 0,
                max: 100,
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    backdropColor: 'transparent'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                angleLines: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                pointLabels: {
                    color: 'white'
                }
            }
        }
    };
}

function getDoughnutChartOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: 'white',
                    usePointStyle: true,
                    padding: 20
                }
            },
            title: {
                display: true,
                text: title,
                color: 'white',
                font: {
                    size: 16
                }
            }
        },
        cutout: '70%'
    };
}

function getBarChartOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                    usePointStyle: true,
                    padding: 20
                }
            },
            title: {
                display: true,
                text: title,
                color: 'white',
                font: {
                    size: 16
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            }
        }
    };
}

// Load Performance Data
function loadPerformanceData() {
    showLoading();

    // Simulated API call
    setTimeout(() => {
        // Data will be loaded from API
        hideLoading();
    }, 1000);
}

// Update Charts
function updateCGPAChart(period) {
    const data = period === 'year' ? {
        labels: ['2022', '2023', '2024'],
        data: [8.6, 9.0, 9.3]
    } : {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
        data: [8.5, 8.7, 9.0, 8.8, 9.2, 9.4]
    };

    cgpaChart.data.labels = data.labels;
    cgpaChart.data.datasets[0].data = data.data;
    cgpaChart.update();
}

function updateSubjectChart(semester) {
    const data = semester === 'all' ? {
        data: [90, 89, 92, 87, 95, 88]
    } : {
        data: [92, 88, 95, 85, 98, 90]
    };

    subjectChart.data.datasets[0].data = data.data;
    subjectChart.update();
}

function updateGradeChart(filter) {
    const data = filter === 'overall' ? {
        data: [30, 25, 15, 8, 2]
    } : {
        data: [12, 8, 4, 2, 1]
    };

    gradeChart.data.datasets[0].data = data.data;
    gradeChart.update();
}

function updateAttendanceChart(period) {
    if (period === 'semester') {
        attendanceChart.data.labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'];
        attendanceChart.data.datasets[0].data = [90, 92, 88, 95, 93, 94];
        attendanceChart.data.datasets[1].data = [85, 88, 90, 92, 95, 94];
    } else {
        attendanceChart.data.labels = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Biology'];
        attendanceChart.data.datasets[0].data = [95, 88, 92, 85, 98, 90];
        attendanceChart.data.datasets[1].data = [92, 88, 95, 85, 98, 90];
    }
    attendanceChart.update();
}

// Event Listeners
function setupEventListeners() {
    cgpaPeriodSelect.addEventListener('change', (e) => {
        updateCGPAChart(e.target.value);
    });

    subjectSemesterSelect.addEventListener('change', (e) => {
        updateSubjectChart(e.target.value);
    });

    gradeFilterSelect.addEventListener('change', (e) => {
        updateGradeChart(e.target.value);
    });

    attendancePeriodSelect.addEventListener('change', (e) => {
        updateAttendanceChart(e.target.value);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize); 