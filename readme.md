# Job Portal - Full Stack Application

A modern, full-featured job portal connecting employers with talented job seekers. Built with Next.js, Node.js, Express, and MongoDB.

## 🌐 Live Demo

- **Frontend:** [Add your Vercel URL here]
- **Backend API:** [Add your Render URL here]

## 📋 Features

### For Job Seekers
- 🔍 Advanced job search with filters (location, type, experience, salary)
- 📝 Easy application management with status tracking
- ❤️ Save jobs for later
- 💬 Real-time chat with employers (for accepted applications)
- 📊 Dashboard with application statistics
- 📄 Resume upload and profile management

### For Employers
- 📢 Post and manage job listings
- 👥 View and manage applicants
- ✅ Accept or reject applications
- 💬 Real-time chat with candidates
- 📊 Dashboard with hiring statistics

### General Features
- 🔐 Secure authentication with JWT
- 🌓 Dark/Light mode
- 📱 Fully responsive design
- ⚡ Real-time messaging with Socket.io
- 🖼️ Image upload with ImageKit
- 🔄 Pagination, sorting, and filtering

## 🚀 Tech Stack

**Frontend:** Next.js 14, React, module.css, Socket.io Client

**Backend:** Node.js, Express, MongoDB, Prisma, Socket.io, JWT

## 🛠️ Installation

### Backend
```bash
cd Backend
npm install
# Configure .env file
npm run prisma:generate
npm run prisma:push
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Configure .env.local file
npm run dev
```

## 🧪 Test Accounts

- **Employer:** hr@techcorp.com / password123
- **Job Seeker:** john.developer@email.com / password123

## 📄 License

MIT License

---

**Made with ❤️ using Next.js and Node.js**
