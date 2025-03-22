# GIFT College Marksheet Management System

A comprehensive web-based marksheet management system for GIFT College, featuring both student and admin interfaces.

## Features

### Student Features
- Secure login with roll number and password
- View personal profile information
- Access marksheet with subject-wise marks
- View performance analysis with charts
- Dark mode support
- Responsive design for all devices

### Admin Features
- Secure admin login
- Dashboard with key statistics
- Student management (add, edit, delete)
- Marks management (add, edit, delete)
- Bulk upload marks via JSON
- Export data functionality
- Performance reports and analytics
- Dark mode support
- Responsive design for all devices

## Technical Stack

- HTML5
- CSS3 (with CSS Variables for theming)
- JavaScript (ES6+)
- Chart.js for data visualization
- Local Storage for data persistence
- Font Awesome for icons

## Getting Started

1. Clone the repository
2. Open `index.html` in a web browser
3. Use the following test credentials:

### Student Login
- Roll Number: 2023001
- Password: student123

### Admin Login
- Username: admin
- Password: admin123

## Project Structure

```
marksheet/
├── index.html          # Landing page with login
├── student.html        # Student dashboard
├── admin.html          # Admin dashboard
├── styles.css          # Global styles
├── script.js           # Login functionality
├── data.js            # Data management
└── README.md          # Project documentation
```

## Data Management

The system uses Local Storage to persist data. The data structure includes:

### Student Object
```javascript
{
    rollNo: string,
    name: string,
    password: string,
    class: string,
    marks: [
        {
            subject: string,
            marks: number,
            total: number,
            grade: string
        }
    ]
}
```

### Admin Credentials
```javascript
{
    username: string,
    password: string
}
```

## Security Considerations

- Passwords are stored in plain text for demo purposes. In a production environment, implement proper password hashing.
- Implement proper session management and authentication.
- Add input validation and sanitization.
- Use HTTPS for secure data transmission.
- Implement rate limiting for login attempts.

## Future Enhancements

1. Backend Integration
   - Server-side validation
   - Database integration
   - API endpoints

2. Additional Features
   - Email notifications
   - SMS alerts
   - QR code verification
   - Biometric authentication
   - Parent dashboard
   - Online fee payment integration

3. Performance Improvements
   - Data caching
   - Lazy loading
   - Image optimization
   - Code splitting

4. Security Enhancements
   - JWT authentication
   - Role-based access control
   - Two-factor authentication
   - Audit logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GIFT College for providing the opportunity
- Chart.js for data visualization
- Font Awesome for icons
- All contributors and maintainers 