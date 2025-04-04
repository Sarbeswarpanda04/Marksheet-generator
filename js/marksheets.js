import { PullToRefresh, TouchGestureHandler, MobileNavigation, mobileAnimations } from './mobile-utils.js';

// DOM Elements
const searchInput = document.getElementById('searchMarksheet');
const semesterFilter = document.getElementById('semesterFilter');
const typeFilter = document.getElementById('typeFilter');
const yearFilter = document.getElementById('yearFilter');
const marksheetGrid = document.querySelector('.marksheets-grid');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.querySelector('.current-page');
const totalPagesSpan = document.querySelector('.total-pages');
const modal = document.getElementById('previewModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const downloadBtn = document.getElementById('downloadMarksheet');
const marksheetsList = document.querySelector('.marksheets-list');
const filterControls = document.querySelector('.filter-controls');
const sidebar = document.querySelector('.sidebar');
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

// State
let currentPage = 1;
let totalPages = 1;
let marksheets = [];
let filteredMarksheets = [];

// Constants
const ITEMS_PER_PAGE = 9;
const MARKSHEETS_KEY = 'student_marksheets';

// Initialize
function initialize() {
    setupMobileFeatures();
    loadMarksheets();
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
        container: marksheetsList,
        onRefresh: () => {
            return new Promise((resolve) => {
                loadMarksheets().then(resolve);
            });
        }
    });

    // Setup touch gestures for marksheet cards
    setupMarksheetCardGestures();

    // Animate elements on page load
    animatePageElements();
}

// Touch Gestures for Marksheet Cards
function setupMarksheetCardGestures() {
    document.querySelectorAll('.marksheet-card').forEach(card => {
        new TouchGestureHandler({
            element: card,
            onSwipeLeft: () => {
                card.classList.add('swiping', 'swiping-left');
                setTimeout(() => showDeleteConfirmation(card), 300);
            },
            onSwipeRight: () => {
                card.classList.add('swiping', 'swiping-right');
                setTimeout(() => downloadMarksheet(card.dataset.id), 300);
            },
            onLongPress: () => {
                showMarksheetOptions(card);
            },
            onDoubleTap: () => {
                previewMarksheet(card.dataset.id);
            }
        });

        // Add touch feedback
        card.classList.add('touch-feedback');
        card.addEventListener('touchstart', () => {
            card.classList.add('active');
        });
        card.addEventListener('touchend', () => {
            card.classList.remove('active');
        });
    });
}

// Animate Page Elements
function animatePageElements() {
    // Animate filter controls
    mobileAnimations.slideIn(filterControls, 'top', 0.2);

    // Animate marksheet cards
    document.querySelectorAll('.marksheet-card').forEach((card, index) => {
        mobileAnimations.fadeIn(card, 0.1 * index);
    });
}

// Mobile Modal for Marksheet Options
function showMarksheetOptions(card) {
    const modal = document.createElement('div');
    modal.className = 'mobile-modal';
    modal.innerHTML = `
        <div class="modal-drag-handle"></div>
        <div class="modal-content">
            <h3>Marksheet Options</h3>
            <div class="modal-options">
                <button onclick="previewMarksheet('${card.dataset.id}')">
                    <i class="fas fa-eye"></i> Preview
                </button>
                <button onclick="downloadMarksheet('${card.dataset.id}')">
                    <i class="fas fa-download"></i> Download
                </button>
                <button onclick="shareMarksheet('${card.dataset.id}')">
                    <i class="fas fa-share"></i> Share
                </button>
                <button onclick="deleteMarksheet('${card.dataset.id}')" class="danger">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('show'));

    // Setup drag to dismiss
    let startY = 0;
    modal.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });

    modal.addEventListener('touchmove', (e) => {
        const deltaY = e.touches[0].clientY - startY;
        if (deltaY > 0) {
            modal.style.transform = `translateY(${deltaY}px)`;
        }
    });

    modal.addEventListener('touchend', (e) => {
        const deltaY = e.changedTouches[0].clientY - startY;
        if (deltaY > 100) {
            closeModal(modal);
        } else {
            modal.style.transform = '';
        }
    });
}

// Close Modal with Animation
function closeModal(modal) {
    modal.classList.remove('show');
    modal.addEventListener('transitionend', () => {
        modal.remove();
    });
}

// Load Marksheets
function loadMarksheets() {
    showLoading();

    // Simulated API call
    setTimeout(() => {
        marksheets = [
            {
                id: 1,
                name: 'Semester 6 Final',
                type: 'Final',
                semester: 6,
                year: 2024,
                date: '2024-03-15',
                subjects: 6,
                totalMarks: 600,
                obtainedMarks: 542,
                percentage: 90.33,
                grade: 'A+'
            },
            {
                id: 2,
                name: 'Semester 6 Mid-term',
                type: 'Mid Term',
                semester: 6,
                year: 2024,
                date: '2024-02-01',
                subjects: 6,
                totalMarks: 300,
                obtainedMarks: 265,
                percentage: 88.33,
                grade: 'A'
            },
            {
                id: 3,
                name: 'Semester 5 Final',
                type: 'Final',
                semester: 5,
                year: 2023,
                date: '2023-12-20',
                subjects: 6,
                totalMarks: 600,
                obtainedMarks: 558,
                percentage: 93.00,
                grade: 'A+'
            },
            // Add more marksheets here
        ];

        filteredMarksheets = [...marksheets];
        totalPages = Math.ceil(filteredMarksheets.length / ITEMS_PER_PAGE);
        updatePagination();
        renderMarksheets();
        hideLoading();
    }, 1000);
}

// Render Marksheets
function renderMarksheets() {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageMarksheets = filteredMarksheets.slice(start, end);

    marksheetGrid.innerHTML = pageMarksheets.map(marksheet => `
        <div class="marksheet-card" data-id="${marksheet.id}" onclick="previewMarksheet(${marksheet.id})">
            <div class="marksheet-header">
                <div class="marksheet-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="marksheet-info">
                    <h3>${marksheet.name}</h3>
                    <p>${marksheet.type} • ${formatDate(marksheet.date)}</p>
                </div>
            </div>
            <div class="marksheet-details">
                <div class="detail-item">
                    <span class="detail-label">Subjects</span>
                    <span class="detail-value">${marksheet.subjects}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Grade</span>
                    <span class="detail-value">${marksheet.grade}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Percentage</span>
                    <span class="detail-value">${marksheet.percentage.toFixed(2)}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Marks</span>
                    <span class="detail-value">${marksheet.obtainedMarks}/${marksheet.totalMarks}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Marksheets
function filterMarksheets() {
    const searchTerm = searchInput.value.toLowerCase();
    const semester = semesterFilter.value;
    const type = typeFilter.value;
    const year = yearFilter.value;

    filteredMarksheets = marksheets.filter(marksheet => {
        const matchesSearch = marksheet.name.toLowerCase().includes(searchTerm);
        const matchesSemester = !semester || marksheet.semester === parseInt(semester);
        const matchesType = !type || marksheet.type.toLowerCase().includes(type.toLowerCase());
        const matchesYear = !year || marksheet.year === parseInt(year);

        return matchesSearch && matchesSemester && matchesType && matchesYear;
    });

    currentPage = 1;
    totalPages = Math.ceil(filteredMarksheets.length / ITEMS_PER_PAGE);
    updatePagination();
    renderMarksheets();
}

// Preview Marksheet
function previewMarksheet(id) {
    const marksheet = marksheets.find(m => m.id === id);
    if (!marksheet) return;

    const previewContainer = modal.querySelector('.preview-container');
    previewContainer.innerHTML = `
        <div class="preview-header">
            <h3>${marksheet.name}</h3>
            <p>Date: ${formatDate(marksheet.date)}</p>
            <p>Type: ${marksheet.type}</p>
        </div>
        <div class="preview-content">
            <div class="student-info">
                <p><strong>Student Name:</strong> John Doe</p>
                <p><strong>Roll Number:</strong> CSE/2020/001</p>
                <p><strong>Semester:</strong> ${marksheet.semester}</p>
            </div>
            <div class="marks-table">
                <table>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Total Marks</th>
                            <th>Obtained Marks</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateSubjectsTable(marksheet)}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td><strong>Total</strong></td>
                            <td>${marksheet.totalMarks}</td>
                            <td>${marksheet.obtainedMarks}</td>
                            <td>${marksheet.grade}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="result-summary">
                <p><strong>Percentage:</strong> ${marksheet.percentage.toFixed(2)}%</p>
                <p><strong>Grade:</strong> ${marksheet.grade}</p>
                <p><strong>Result:</strong> PASS</p>
            </div>
        </div>
    `;

    downloadBtn.onclick = () => downloadMarksheet(marksheet);
    modal.classList.add('active');
}

// Generate Subjects Table
function generateSubjectsTable(marksheet) {
    // Simulated subjects data
    const subjects = [
        { name: 'Mathematics', total: 100, obtained: 92, grade: 'A+' },
        { name: 'Physics', total: 100, obtained: 88, grade: 'A' },
        { name: 'Chemistry', total: 100, obtained: 95, grade: 'A+' },
        { name: 'English', total: 100, obtained: 85, grade: 'A' },
        { name: 'Computer Science', total: 100, obtained: 98, grade: 'A+' },
        { name: 'Biology', total: 100, obtained: 90, grade: 'A+' }
    ];

    return subjects.map(subject => `
        <tr>
            <td>${subject.name}</td>
            <td>${subject.total}</td>
            <td>${subject.obtained}</td>
            <td>${subject.grade}</td>
        </tr>
    `).join('');
}

// Download Marksheet
function downloadMarksheet(marksheet) {
    showToast(`Downloading ${marksheet.name}...`, 'success');
    // Implement actual download logic here
    setTimeout(() => {
        showToast(`${marksheet.name} downloaded successfully!`, 'success');
    }, 1500);
}

// Pagination
function updatePagination() {
    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
        renderMarksheets();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
        renderMarksheets();
    }
}

// Event Listeners
function setupEventListeners() {
    // Search and filters
    searchInput.addEventListener('input', debounce(filterMarksheets, 300));
    semesterFilter.addEventListener('change', filterMarksheets);
    typeFilter.addEventListener('change', filterMarksheets);
    yearFilter.addEventListener('change', filterMarksheets);

    // Pagination
    prevPageBtn.addEventListener('click', prevPage);
    nextPageBtn.addEventListener('click', nextPage);

    // Modal
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    // Add smooth scrolling
    marksheetsList.classList.add('smooth-scroll');
}

// Utility Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize); 