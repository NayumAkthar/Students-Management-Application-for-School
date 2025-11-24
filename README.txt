School Management Project

Project Overview
This is a web-based School Management System designed to simplify student and administrative tasks. It offers dashboards for both administrators and students, enabling user authentication, student management, and academic record keeping in an organised and easy-to-use way.

The project is built using Node.js (Express.js) for the backend, plain HTML, CSS, and JavaScript for the frontend, and MySQL for storing student data and marks.

Setup Instructions

1. Prerequisites
- Node.js: https://nodejs.org/
- MySQL: https://www.mysql.com/downloads/

2. Database Setup
- Create a MySQL database (e.g., school_db).
- Create these tables:
  • users (email, password, role)
  • students (admission_no, name, email, class, password)
  • marks (admission_no, first_language, second_language, third_language, maths, science, social, total_marks)

3. Environment Variables
Create a .env file in your root directory with:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_management
PORT=3000

4. Install Dependencies
npm install express cors dotenv mysql2 bcryptjs

5. Create Initial Admin User
node createAdmin.js

6. Run the Server
node server.js

7. Access the Frontend
Open index.html in your web browser to view the login page.

Features Implemented

• User Authentication
  - Login for Admin and Students
  - Admin login
          email   :- admin@school.com
          passwrod:- Admin@123
  - Change password functionality

• Admin Dashboard
  - Add new students with details and default password
  - Assign marks to students for First Language, Second Language, Third Language, Maths, Science, and Social
  - Reset student passwords

• Student Dashboard
  - View profile details (name, admission number, email, class)
  - View marks for all subjects and total marks
