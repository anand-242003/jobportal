import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning old data...\n");

  // Delete all data created by anand_mishra or other test users
  const usersToDelete = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: "anand" } },
        { email: { contains: "test" } },
        { email: { contains: "asfdsa" } },
        { email: { contains: "mishra" } },
        { email: { contains: "anan" } },
        { email: { contains: "asasas" } },
        { email: { contains: "jobpost" } },
        { email: { contains: "suryansh" } },
        { email: { contains: "maynak" } },
        { email: { contains: "Jhon" } },
        { email: { contains: "John@" } },
        { email: { contains: "itsantan" } },
        { email: { contains: "aarav" } },
      ],
    },
    select: { id: true, email: true },
  });

  console.log(`Found ${usersToDelete.length} users to clean up:`);
  usersToDelete.forEach((u) => console.log(`   - ${u.email}`));

  // Delete their jobs and applications
  for (const user of usersToDelete) {
    const jobs = await prisma.job.findMany({
      where: { createdById: user.id },
      select: { id: true },
    });

    for (const job of jobs) {
      await prisma.application.deleteMany({ where: { jobId: job.id } });
      await prisma.job.delete({ where: { id: job.id } });
    }

    await prisma.application.deleteMany({ where: { applicantId: user.id } });
    await prisma.conversation.deleteMany({
      where: {
        OR: [{ user1Id: user.id }, { user2Id: user.id }],
      },
    });
    await prisma.user.delete({ where: { id: user.id } });
  }

  console.log("\n✅ Cleanup complete!\n");
  console.log("🌱 Creating fresh dummy data...\n");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create 3 employers
  const employer1 = await prisma.user.create({
    data: {
      fullName: "Sarah Johnson",
      email: "sarah.johnson@techcorp.com",
      password: hashedPassword,
      phoneNumber: "5551234567",
      role: "Employer",
      profileBio:
        "HR Director at TechCorp Solutions. Passionate about building great teams.",
      profilePhoto: "https://i.pravatar.cc/150?img=1",
    },
  });

  const employer2 = await prisma.user.create({
    data: {
      fullName: "Michael Chen",
      email: "michael.chen@innovate.com",
      password: hashedPassword,
      phoneNumber: "5551234568",
      role: "Employer",
      profileBio:
        "Founder & CEO at Innovate Labs. Building the future of technology.",
      profilePhoto: "https://i.pravatar.cc/150?img=12",
    },
  });

  const employer3 = await prisma.user.create({
    data: {
      fullName: "Emily Rodriguez",
      email: "emily.rodriguez@digital.com",
      password: hashedPassword,
      phoneNumber: "5551234569",
      role: "Employer",
      profileBio:
        "Senior Technical Recruiter at Digital Dynamics. Connecting talent with opportunity.",
      profilePhoto: "https://i.pravatar.cc/150?img=5",
    },
  });

  console.log("✅ Created 3 employers");

  // Create 5 students (keep existing ones if they exist)
  const students = [];
  const studentEmails = [
    "john.doe@student.com",
    "jane.smith@student.com",
    "alex.kumar@student.com",
    "maria.garcia@student.com",
    "david.lee@student.com",
  ];

  for (const email of studentEmails) {
    let student = await prisma.user.findUnique({ where: { email } });
    if (student) {
      students.push(student);
      console.log(`   ℹ️  Kept existing student: ${email}`);
    }
  }

  console.log(`✅ ${students.length} students available\n`);

  // Create diverse jobs
  const jobs = [
    {
      title: "Senior Full Stack Developer",
      description:
        "Join our team to build cutting-edge web applications using React, Node.js, and cloud technologies. You'll work on challenging projects and mentor junior developers.",
      requirements: [
        "5+ years of experience with React and Node.js",
        "Strong understanding of RESTful APIs and microservices",
        "Experience with AWS or Azure",
        "Excellent problem-solving skills",
      ],
      salary: "$120,000 - $150,000",
      experienceLevel: 5,
      location: "San Francisco, CA (Hybrid)",
      jobType: "Full-time",
      position: 2,
      createdById: employer3.id,
    },
    {
      title: "Frontend Developer (React)",
      description:
        "We're looking for a talented Frontend Developer to create beautiful, responsive user interfaces. You'll work closely with designers and backend developers.",
      requirements: [
        "3+ years of React experience",
        "Proficiency in TypeScript and modern CSS",
        "Experience with state management (Redux/Context)",
        "Strong attention to detail",
      ],
      salary: "$90,000 - $110,000",
      experienceLevel: 3,
      location: "Remote",
      jobType: "Full-time",
      position: 3,
      createdById: employer2.id,
    },
    {
      title: "Backend Engineer (Node.js)",
      description:
        "Design and implement scalable backend services and APIs. Work with microservices architecture and modern cloud platforms.",
      requirements: [
        "4+ years of Node.js experience",
        "Experience with microservices and Docker",
        "Knowledge of PostgreSQL and MongoDB",
        "Understanding of security best practices",
      ],
      salary: "$100,000 - $130,000",
      experienceLevel: 4,
      location: "New York, NY",
      jobType: "Full-time",
      position: 1,
      createdById: employer1.id,
    },
    {
      title: "Junior Web Developer",
      description:
        "Perfect opportunity for recent graduates! Learn from experienced developers while working on real projects. We provide mentorship and training.",
      requirements: [
        "Basic knowledge of HTML, CSS, JavaScript",
        "Familiarity with React or Vue.js",
        "Good problem-solving skills",
        "Eagerness to learn",
      ],
      salary: "$60,000 - $75,000",
      experienceLevel: 0,
      location: "Austin, TX",
      jobType: "Full-time",
      position: 2,
      createdById: employer1.id,
    },
    {
      title: "DevOps Engineer",
      description:
        "Manage our cloud infrastructure and CI/CD pipelines. Work with cutting-edge tools to ensure reliable, scalable deployments.",
      requirements: [
        "3+ years of DevOps experience",
        "Strong knowledge of AWS/GCP/Azure",
        "Experience with Docker and Kubernetes",
        "CI/CD pipeline expertise (Jenkins, GitLab CI)",
      ],
      salary: "$110,000 - $140,000",
      experienceLevel: 3,
      location: "Remote",
      jobType: "Full-time",
      position: 1,
      createdById: employer2.id,
    },
    {
      title: "UI/UX Designer & Frontend Developer",
      description:
        "Unique hybrid role combining design and development. Create beautiful interfaces and bring them to life with code.",
      requirements: [
        "2+ years of UI/UX design experience",
        "Proficiency in Figma or Adobe XD",
        "Strong HTML/CSS/JavaScript skills",
        "Portfolio showcasing design and code",
      ],
      salary: "$85,000 - $105,000",
      experienceLevel: 2,
      location: "Los Angeles, CA (Hybrid)",
      jobType: "Full-time",
      position: 1,
      createdById: employer3.id,
    },
    {
      title: "Software Engineering Intern",
      description:
        "Summer internship program for students. Work on real projects, learn from experts, and build your portfolio. Potential for full-time conversion.",
      requirements: [
        "Currently pursuing CS degree",
        "Basic programming knowledge",
        "Enthusiasm to learn",
        "Available for 3 months",
      ],
      salary: "$25/hour",
      experienceLevel: 0,
      location: "Seattle, WA",
      jobType: "Internship",
      position: 5,
      createdById: employer1.id,
    },
    {
      title: "Mobile App Developer (React Native)",
      description:
        "Build cross-platform mobile applications for iOS and Android. Work on consumer-facing apps with millions of users.",
      requirements: [
        "3+ years of React Native experience",
        "Published apps on App Store and Play Store",
        "Understanding of mobile UI/UX patterns",
        "Experience with native modules",
      ],
      salary: "$95,000 - $125,000",
      experienceLevel: 3,
      location: "Remote",
      jobType: "Full-time",
      position: 2,
      createdById: employer2.id,
    },
  ];

  const createdJobs = [];
  for (const jobData of jobs) {
    const job = await prisma.job.create({ data: jobData });
    createdJobs.push(job);
    console.log(`✅ Created job: ${job.title}`);
  }

  // Create some applications if students exist
  if (students.length >= 2) {
    console.log("\n📝 Creating sample applications...");

    await prisma.application.create({
      data: {
        jobId: createdJobs[0].id,
        applicantId: students[0].id,
        status: "Pending",
      },
    });

    await prisma.application.create({
      data: {
        jobId: createdJobs[0].id,
        applicantId: students[1].id,
        status: "Accepted",
      },
    });

    await prisma.application.create({
      data: {
        jobId: createdJobs[1].id,
        applicantId: students[1].id,
        status: "Pending",
      },
    });

    console.log("✅ Created 3 sample applications");
  }

  console.log("\n✅ Fresh data seeded successfully!\n");
  console.log("📊 Summary:");
  console.log(`   - 3 new employers created`);
  console.log(`   - ${students.length} students available`);
  console.log(`   - ${createdJobs.length} jobs created`);
  console.log("\n🔑 Login Credentials (password: password123):");
  console.log("\n   Employers:");
  console.log("   - sarah.johnson@techcorp.com (Sarah Johnson - TechCorp)");
  console.log("   - michael.chen@innovate.com (Michael Chen - Innovate Labs)");
  console.log(
    "   - emily.rodriguez@digital.com (Emily Rodriguez - Digital Dynamics)"
  );
  console.log("\n   Students:");
  console.log("   - john.doe@student.com");
  console.log("   - jane.smith@student.com");
  console.log("   - alex.kumar@student.com");
  console.log("   - maria.garcia@student.com");
  console.log("   - david.lee@student.com");
}

main()
  .catch((e) => {
    console.error("\n❌ Error:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
