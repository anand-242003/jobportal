[✅] Phase 0: Foundation & Authentication

Backend: Setup Express server with Prisma and MongoDB.

Backend: Implement signup, login, and logout controllers.

Backend: Create authMiddleware to protect routes using secure httpOnly JWT cookies.

Frontend: Build Login and Signup pages with axios integration.

Frontend: Configure axiosInstance with withCredentials: true to handle cookies.

Refactor: Converted frontend from Tailwind CSS to CSS Modules for scoped styling.

[⬜️] Phase 1: User Profile Management

Goal: Allow users to view and update their professional profile.

Backend: Create GET /api/users/profile endpoint.

Backend: Create PUT /api/users/profile endpoint.

Frontend: Build the Dashboard page to fetch, display, and update profile data (fullName, profileBio, skills, phoneNumber).

Frontend: Add "Sign Out" functionality to the dashboard.

[⬜️] Phase 2: Role-Based Access Control (RBAC)

Goal: Differentiate features available to "Student" vs. "Employer".

Backend: Create isEmployer middleware to protect employer-only routes.

Frontend: Dynamically change the Header component based on user role (e.g., show "Post a Job" for Employers).

Frontend: Protect employer-only pages on the client-side.

[⬜️] Phase 3: Job Management (For Employers)

Goal: Allow employers to create, edit, and delete job listings.

Backend: Create full CRUD endpoints for Jobs (POST, GET, PUT, DELETE /api/jobs).

Frontend: Build a "Post New Job" form.

Frontend: Create an "My Jobs" page for employers to see and manage their listings.

[⬜️] Phase 4: Job Search & Discovery (For Job Seekers)

Goal: Allow seekers to find and view job listings.

Backend: Create a public GET /api/jobs endpoint with search and filtering (by location, type, etc.).

Frontend: Build the Jobs page to display all open jobs.

Frontend: Add search and filter UI to the Jobs page.

Frontend: Create a dynamic [jobId] page to show job details.

[⬜️] Phase 5: Application System

Goal: Allow seekers to apply for jobs and employers to view applicants.

Backend: Create POST /api/apply/:jobId endpoint.

Backend: Create GET /api/applications endpoints (for both seekers and employers).

Frontend: Add "Apply Now" button to job details page.

Frontend: Create "My Applications" page for seekers.

Frontend: Create "View Applicants" dashboard for employers.

5. API Endpoints

Auth (/api/auth)

POST /signup: Register a new user.

POST /login: Log in a user and set cookie.

POST /logout: Clear the user cookie.

Users (/api/users)

GET /profile: (Protected) Get the logged-in user's profile.

PUT /profile: (Protected) Update the logged-in user's profile.

