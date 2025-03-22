// DOM Elements
const editButtons = document.querySelectorAll('.edit-btn');
const editAvatarBtn = document.querySelector('.edit-avatar');
const editCoverBtn = document.querySelector('.edit-cover');
const modal = document.getElementById('editProfileModal');
const closeModalBtn = document.querySelector('.close-modal');
const saveChangesBtn = document.querySelector('.btn-save');
const cancelBtn = document.querySelector('.btn-cancel');
const changePasswordBtn = document.querySelector('.btn-change-password');
const settingToggles = document.querySelectorAll('.switch input');

// Form field templates for different sections
const formTemplates = {
    personal: `
        <div class="form-group">
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" name="fullName" value="John Doe">
        </div>
        <div class="form-group">
            <label for="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob" value="2000-03-15">
        </div>
        <div class="form-group">
            <label for="gender">Gender</label>
            <select id="gender" name="gender">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
        </div>
        <div class="form-group">
            <label for="bloodGroup">Blood Group</label>
            <select id="bloodGroup" name="bloodGroup">
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
            </select>
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" value="john.doe@example.com">
        </div>
        <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" name="phone" value="+91 98765 43210">
        </div>
    `,
    academic: `
        <div class="form-group">
            <label for="department">Department</label>
            <input type="text" id="department" name="department" value="Computer Science & Engineering" readonly>
        </div>
        <div class="form-group">
            <label for="batch">Batch</label>
            <input type="text" id="batch" name="batch" value="2020-2024" readonly>
        </div>
        <div class="form-group">
            <label for="semester">Current Semester</label>
            <input type="text" id="semester" name="semester" value="6th Semester" readonly>
        </div>
        <div class="form-group">
            <label for="cgpa">Current CGPA</label>
            <input type="text" id="cgpa" name="cgpa" value="8.75" readonly>
        </div>
    `,
    contact: `
        <div class="form-group">
            <label for="currentAddress">Current Address</label>
            <textarea id="currentAddress" name="currentAddress" rows="3">123 College Road, Student Housing Block A</textarea>
        </div>
        <div class="form-group">
            <label for="permanentAddress">Permanent Address</label>
            <textarea id="permanentAddress" name="permanentAddress" rows="3">456 Main Street, Apartment 7B, New Delhi, 110001</textarea>
        </div>
        <div class="form-group">
            <label for="emergencyContact">Emergency Contact</label>
            <input type="text" id="emergencyContact" name="emergencyContact" value="Robert Doe (Father)">
        </div>
        <div class="form-group">
            <label for="emergencyPhone">Emergency Phone</label>
            <input type="tel" id="emergencyPhone" name="emergencyPhone" value="+91 98765 43211">
        </div>
    `,
    password: `
        <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <div class="password-input">
                <input type="password" id="currentPassword" name="currentPassword">
                <button type="button" class="toggle-password">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
        <div class="form-group">
            <label for="newPassword">New Password</label>
            <div class="password-input">
                <input type="password" id="newPassword" name="newPassword">
                <button type="button" class="toggle-password">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
        <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <div class="password-input">
                <input type="password" id="confirmPassword" name="confirmPassword">
                <button type="button" class="toggle-password">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `
};

// Initialize
function initialize() {
    setupEventListeners();
    loadUserSettings();
}

// Event Listeners
function setupEventListeners() {
    // Edit buttons
    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.closest('.profile-card').querySelector('h2').textContent.trim();
            openEditModal(section);
        });
    });

    // Avatar and cover photo
    editAvatarBtn.addEventListener('click', () => handleImageUpload('avatar'));
    editCoverBtn.addEventListener('click', () => handleImageUpload('cover'));

    // Modal controls
    closeModalBtn.addEventListener('click', closeModal);
    saveChangesBtn.addEventListener('click', handleSave);
    cancelBtn.addEventListener('click', closeModal);
    changePasswordBtn.addEventListener('click', () => openEditModal('Change Password'));

    // Setting toggles
    settingToggles.forEach(toggle => {
        toggle.addEventListener('change', handleSettingToggle);
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Modal Management
function openEditModal(section) {
    const modalTitle = modal.querySelector('.modal-header h2');
    const modalBody = modal.querySelector('.modal-body');
    
    modalTitle.textContent = section;
    
    switch (section) {
        case 'Personal Information':
            modalBody.innerHTML = formTemplates.personal;
            break;
        case 'Academic Information':
            modalBody.innerHTML = formTemplates.academic;
            break;
        case 'Contact Information':
            modalBody.innerHTML = formTemplates.contact;
            break;
        case 'Change Password':
            modalBody.innerHTML = formTemplates.password;
            setupPasswordToggles();
            break;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Form Handling
function handleSave() {
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        closeModal();
        showToast('Changes saved successfully', 'success');
    }, 1500);
}

// Image Upload Handling
function handleImageUpload(type) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            showLoading();
            
            // Simulate upload
            setTimeout(() => {
                hideLoading();
                showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`, 'success');
            }, 1500);
        }
    };
    
    input.click();
}

// Settings Management
function handleSettingToggle(e) {
    const setting = e.target.id.replace('-toggle', '');
    const enabled = e.target.checked;
    
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        showToast(`${setting.toUpperCase()} ${enabled ? 'enabled' : 'disabled'}`, 'success');
        saveUserSettings();
    }, 1000);
}

function loadUserSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    settingToggles.forEach(toggle => {
        const setting = toggle.id.replace('-toggle', '');
        toggle.checked = settings[setting] || false;
    });
}

function saveUserSettings() {
    const settings = {};
    settingToggles.forEach(toggle => {
        const setting = toggle.id.replace('-toggle', '');
        settings[setting] = toggle.checked;
    });
    
    localStorage.setItem('userSettings', JSON.stringify(settings));
}

// Password Management
function setupPasswordToggles() {
    const toggles = document.querySelectorAll('.toggle-password');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const button = e.currentTarget;
            const input = button.previousElementSibling;
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initialize); 