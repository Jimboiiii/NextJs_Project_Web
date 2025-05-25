✏️Project Description:

This Next.js application features a dynamic user dashboard and blog post system that simulates real-time interaction with users, posts, and comments by integrating the JSONPlaceholder API. It provides a seamless and interactive experience for managing and exploring content.

Key Features:

User Authentication: Intuitive login and registration system with smooth client-side validation.

Visual Insights: Interactive dashboards with ApexCharts display user, post, and comment stats at a glance.

Role-Based Management: Admins can manage all posts and comments, while regular users get a simplified, personalized view.

Location-Enhanced Profiles: Each user profile includes a Google Map component for geographic context.

Modern Frontend Stack: Built with React Hooks and styled using Tailwind CSS for fast, responsive UI.

From user analytics to profile interaction, Human Generator showcases how a mock system can feel functionally real—and visually compelling.


◼️Team Member Contributions

Jimboy G. Garais – Lead Developer: Designed and implemented key UI components, developed authentication logic, and integrated the main dashboard functionalities.

Chanda Jaquilmo – Built the user registration form using React-Hook-Form and Zod for validation; integrated interactive Google Maps functionality.

Carl Entac – Developed and managed the posts and comments system, including CRUD operations and user interaction features.

Mark Angelo Liray – Focused on frontend styling with TailwindCSS and implemented dynamic data visualizations using ApexCharts.

◻️ Features

User Directory with Map Integration: Fetches and displays user profiles from JSON Placeholder, complete with address pins on an interactive Leaflet map for easy geolocation.

Role-Based Content Access: View posts and comments dynamically based on the user's role. Admins see everything; regular users get limited access.

🔨Setup and installation

1.Grab the repo from GitHub:
https://github.com/yourusername/devconnect.git

2.Install required packages
npm install

3.Launch the applicatinstallation
npm run dev

4.Login form authentication and Error handling

🔗Login Form Authentication

Dual Role Support: Allows both Admin and Regular Users to log in using email and password.
Admin Access: Fast login with hardcoded credentials 

Email: admin@admin.com
Password: admin123

User Login via JSONPlaceholder:
Users authenticate using email (as the username) and a password that matches the username field from the JSONPlaceholder API.

Example:
Email: Sincere@april.biz
Password: Bret

Authentication Logic:
User credentials are validated against fetched data.
Password must exactly match the username associated with the provided email.

Error Handling:
Provides clear, user-friendly error messages for invalid credentials or data fetching issues.
Routing & State Management:
Utilizes useState for form state and useRouter for navigation and redirection.

UX & Design:
Built with Tailwind CSS for a responsive and accessible interface.

Includes real-time feedback, interactive inputs, and a mobile-friendly layout.

◻️Deployed URL:
https://next-js-project-web.vercel.app/login
