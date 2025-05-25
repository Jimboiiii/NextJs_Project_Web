This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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


