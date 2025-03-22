document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.login-form');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            forms.forEach(form => form.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(button.dataset.form).classList.add('active');
            
            // Clear error messages when switching tabs
            document.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');
        });
    });

    // Student login form handling
    document.getElementById('studentLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const rollNo = document.getElementById('studentRollNo').value;
        const password = document.getElementById('studentPassword').value;
        
        const student = dataManager.getStudent(rollNo, password);
        if (student) {
            localStorage.setItem('currentUser', JSON.stringify({
                type: 'student',
                rollNo: student.rollNo,
                name: student.name
            }));
            window.location.replace('student.html');
        } else {
            document.getElementById('studentError').textContent = 'Invalid roll number or password';
        }
    });

    // Admin login form handling
    document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        
        if (dataManager.validateAdmin(username, password)) {
            localStorage.setItem('currentUser', JSON.stringify({
                type: 'admin',
                username: username
            }));
            window.location.replace('admin.html');
        } else {
            document.getElementById('adminError').textContent = 'Invalid username or password';
        }
    });

    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        if (currentUser.type === 'admin') {
            window.location.replace('admin.html');
        } else if (currentUser.type === 'student') {
            window.location.replace('student.html');
        }
    }
});

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

// Logout functionality
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Add event listener for logout button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

// Search functionality
const studentSearch = document.getElementById('studentSearch');
if (studentSearch) {
    studentSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.student-card');
        
        cards.forEach(card => {
            const studentName = card.querySelector('h3').textContent.toLowerCase();
            const rollNo = card.querySelector('p').textContent.toLowerCase();
            
            if (studentName.includes(searchTerm) || rollNo.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Export functionality
function exportData() {
    dataManager.exportToJSON();
}

// Add event listener for export button
const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
    exportBtn.addEventListener('click', exportData);
}

// Bulk upload functionality
const bulkUploadForm = document.getElementById('bulkUploadForm');
if (bulkUploadForm) {
    bulkUploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = document.getElementById('marksFile').files[0];
        try {
            await dataManager.handleFileUpload(file);
            closeModal('bulkUploadModal');
            loadMarksTable();
            updateDashboardStats();
        } catch (error) {
            alert('Error uploading file: ' + error.message);
        }
    });
}
