# Job Portal - Full Stack Application

A modern, full-featured job portal connecting employers with talented job seekers. Built with Next.js, Node.js, Express, and MongoDB.

## 🌐 Live Demo

- **Frontend:** https://jobportal-frontend-navy-xi.vercel.app
- **Backend API:** https://jobportal-oc40.onrender.com

## 📋 Features

### For Job Seekers (Students)
- 🔍 Advanced job search with filters (location, type, experience, salary)
- 📝 Easy application management with status tracking
- ❤️ Save jobs for later
- 💬 Real-time chat with employers
- 📊 Dashboard with application statistics
- 📄 Resume upload and profile management
- 🔔 Real-time notifications

### For Employers (Recruiters)
- � Piost and manage job listings
- 👥 View and manage applicants
- ✅ Accept or reject applications
- � Real-time chat with candidates
- 📊 Dashboard with hiring statistics
- 🔍 Filter and search applicants
- �  Initiate conversations with applicants

### General Features
- 🔐 Secure authentication with JWT & refresh tokens
- �  Google OAuth integration
- 📱 Fully responsive design
- ⚡ Real-time messaging with Socket.io
- 🖼️ Image upload with ImageKit
- 🔄 Pagination, sorting, and filtering
- 👁️ Typing indicators in chat
- ✉️ Unread message counts

## �️ Tech Stack

**Frontend:** Next.js 14, React, CSS Modules, Socket.io Client, React Hook Form

**Backend:** Node.js, Express, MongoDB (Prisma ORM), Socket.io, JWT, Passport.js, ImageKit

**Database:** MongoDB with Prisma

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- ImageKit account (for image uploads)
- Google OAuth credentials (optional)

### Backend Setup
```bash
cd Backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client and push schema
npm run prisma:generate
npm run prisma:push

# Seed database with sample data
node seedData.js

# Start development server
npm run dev
```

Backend will run on `http://localhost:5001`

### Frontend Setup
```bash
cd frontend
npm install

# Copy and configure environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL="your_mongodb_connection_string"
PORT=5001
NODE_ENV=development

JWT_SECRET="your_jwt_secret"
JWT_REFRESH_SECRET="your_refresh_secret"

IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
IMAGEKIT_URL_ENDPOINT="your_imagekit_url"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:5001/api/auth/google/callback"

FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

## 🧪 Test Accounts

After running the seed script, you can use these test accounts:

**Employers:**
- hr@techcorp.com / password123
- jobs@startuphub.com / password123
- careers@globalsolutions.com / password123

**Students:**
- alice.j@email.com / password123
- bob.smith@email.com / password123
- carol.w@email.com / password123

The seed script creates:
- 5 employers
- 10 students
- 35 job listings across various categories

## 📄 License

MIT License

---

**Made with ❤️ using Next.js and Node.js**
