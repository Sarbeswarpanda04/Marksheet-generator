// Sample student data
const students = [
    {
        rollNo: '2023001',
        name: 'John Doe',
        password: 'student123', // In a real app, this would be hashed
        class: '12th',
        profilePicture: 'https://via.placeholder.com/150',
        email: 'john.doe@example.com',
        phone: '+91 98765 43210',
        address: '123 Main St, City',
        marks: [
            { subject: 'Mathematics', marks: 95, total: 100, grade: 'A+' },
            { subject: 'Physics', marks: 90, total: 100, grade: 'A' },
            { subject: 'Chemistry', marks: 92, total: 100, grade: 'A+' },
            { subject: 'English', marks: 88, total: 100, grade: 'A' },
            { subject: 'Computer Science', marks: 95, total: 100, grade: 'A+' }
        ]
    }
];

// Admin credentials
const adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

// Data Management Class
class DataManager {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || students;
        this.initializeAdmin();
    }

    // Student Functions
    getStudent(rollNo, password) {
        return this.students.find(student => 
            student.rollNo === rollNo && 
            student.password === password
        );
    }

    getAllStudents() {
        return this.students;
    }

    addStudent(studentData) {
        const existingIndex = this.students.findIndex(s => s.rollNo === studentData.rollNo);
        if (existingIndex !== -1) {
            this.students[existingIndex] = { ...this.students[existingIndex], ...studentData };
        } else {
            this.students.push(studentData);
        }
        this.saveToLocalStorage();
        return true;
    }

    updateStudent(rollNo, updatedData) {
        const index = this.students.findIndex(s => s.rollNo === rollNo);
        if (index !== -1) {
            this.students[index] = { ...this.students[index], ...updatedData };
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    deleteStudent(rollNo) {
        const index = this.students.findIndex(s => s.rollNo === rollNo);
        if (index !== -1) {
            this.students.splice(index, 1);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // Marks Functions
    addMarks(rollNo, marksData) {
        const student = this.students.find(s => s.rollNo === rollNo);
        if (student) {
            const existingMarkIndex = student.marks.findIndex(m => m.subject === marksData.subject);
            if (existingMarkIndex !== -1) {
                student.marks[existingMarkIndex] = marksData;
            } else {
                student.marks.push(marksData);
            }
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    updateMarks(rollNo, subject, marksData) {
        const student = this.students.find(s => s.rollNo === rollNo);
        if (student) {
            const markIndex = student.marks.findIndex(m => m.subject === subject);
            if (markIndex !== -1) {
                student.marks[markIndex] = { ...student.marks[markIndex], ...marksData };
                this.saveToLocalStorage();
                return true;
            }
        }
        return false;
    }

    deleteMarks(rollNo, subject) {
        const student = this.students.find(s => s.rollNo === rollNo);
        if (student) {
            const markIndex = student.marks.findIndex(m => m.subject === subject);
            if (markIndex !== -1) {
                student.marks.splice(markIndex, 1);
                this.saveToLocalStorage();
                return true;
            }
        }
        return false;
    }

    getStudentMarks(rollNo) {
        const student = this.students.find(s => s.rollNo === rollNo);
        return student ? student.marks : [];
    }

    // Authentication Functions
    validateAdmin(username, password) {
        return username === adminCredentials.username && 
               password === adminCredentials.password;
    }

    // Storage Functions
    saveToLocalStorage() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('students');
        if (data) {
            this.students = JSON.parse(data);
        }
    }

    // Utility Functions
    calculateGrade(percentage) {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 50) return 'D';
        return 'F';
    }

    calculatePercentage(marks, total) {
        return Math.round((marks / total) * 100);
    }

    // File Upload Functions
    handleFileUpload(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (Array.isArray(data)) {
                        data.forEach(student => {
                            const existingIndex = this.students.findIndex(s => s.rollNo === student.rollNo);
                            if (existingIndex !== -1) {
                                this.students[existingIndex] = student;
                            } else {
                                this.students.push(student);
                            }
                        });
                        this.saveToLocalStorage();
                        resolve(true);
                    } else {
                        reject(new Error('Invalid file format'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsText(file);
        });
    }

    // Export Functions
    exportToJSON() {
        const dataStr = JSON.stringify(this.students, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'marksheet_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Initialize admin credentials
    initializeAdmin() {
        // No need for implementation as we're using static credentials
    }

    updateStudentProfile(rollNo, updatedData) {
        return new Promise((resolve, reject) => {
            const index = this.students.findIndex(s => s.rollNo === rollNo);
            if (index !== -1) {
                // Handle profile picture upload
                if (updatedData.profilePicture instanceof File) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.students[index] = {
                            ...this.students[index],
                            ...updatedData,
                            profilePicture: e.target.result
                        };
                        this.saveToLocalStorage();
                        resolve(true);
                    };
                    reader.onerror = () => reject(new Error('Error reading profile picture'));
                    reader.readAsDataURL(updatedData.profilePicture);
                } else {
                    this.students[index] = {
                        ...this.students[index],
                        ...updatedData
                    };
                    this.saveToLocalStorage();
                    resolve(true);
                }
            } else {
                resolve(false);
            }
        });
    }
}

// Initialize DataManager
const dataManager = new DataManager(); 