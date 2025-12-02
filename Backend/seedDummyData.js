import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting to seed dummy data...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  console.log("👥 Creating users...");

  let employer1 = await prisma.user.findUnique({
    where: { email: "employer1@company.com" },
  });

  if (!employer1) {
    employer1 = await prisma.user.create({
      data: {
        fullName: "Sarah Johnson",
        email: "employer1@company.com",
        password: hashedPassword,
        phoneNumber: "9876543210",
      role: "Employer",
      profileBio: "HR Manager at Tech Corp. Looking for talented developers.",
      skills: [],
        profilePhoto: "https://i.pravatar.cc/150?img=1",
      },
    });
  }

  let employer2 = await prisma.user.findUnique({
    where: { email: "employer2@startup.com" },
  });

  if (!employer2) {
    employer2 = await prisma.user.create({
      data: {
      fullName: "Michael Chen",
      email: "employer2@startup.com",
      password: hashedPassword,
      phoneNumber: "9876543211",
      role: "Employer",
      profileBio: "Founder & CEO at StartupXYZ. Building the future of tech.",
      skills: [],
        profilePhoto: "https://i.pravatar.cc/150?img=12",
      },
    });
  }

  let employer3 = await prisma.user.findUnique({
    where: { email: "recruiter@bigcorp.com" },
  });

  if (!employer3) {
    employer3 = await prisma.user.create({
      data: {
      fullName: "Emily Rodriguez",
      email: "recruiter@bigcorp.com",
      password: hashedPassword,
      phoneNumber: "9876543212",
      role: "Employer",
      profileBio: "Senior Technical Recruiter at BigCorp Inc.",
      skills: [],
        profilePhoto: "https://i.pravatar.cc/150?img=5",
      },
    });
  }

  let student1 = await prisma.user.findUnique({
    where: { email: "john.doe@student.com" },
  });

  if (!student1) {
    student1 = await prisma.user.create({
      data: {
      fullName: "John Doe",
      email: "john.doe@student.com",
      password: hashedPassword,
      phoneNumber: "8765432100",
      role: "Student",
      profileBio:
        "Computer Science graduate passionate about full-stack development.",
      skills: [
        "JavaScript",
        "React",
        "Node.js",
        "MongoDB",
        "Express",
        "TypeScript",
      ],
        profilePhoto: "https://i.pravatar.cc/150?img=33",
      },
    });
  }

  let student2 = await prisma.user.findUnique({
    where: { email: "jane.smith@student.com" },
  });

  if (!student2) {
    student2 = await prisma.user.create({
      data: {
      fullName: "Jane Smith",
      email: "jane.smith@student.com",
      password: hashedPassword,
      phoneNumber: "8765432101",
      role: "Student",
      profileBio:
        "Frontend developer with 2 years experience. Love creating beautiful UIs.",
      skills: [
        "React",
        "Vue.js",
        "CSS",
        "Tailwind",
        "Figma",
        "JavaScript",
        "HTML",
      ],
        profilePhoto: "https://i.pravatar.cc/150?img=10",
      },
    });
  }

  let student3 = await prisma.user.findUnique({
    where: { email: "alex.kumar@student.com" },
  });

  if (!student3) {
    student3 = await prisma.user.create({
      data: {
      fullName: "Alex Kumar",
      email: "alex.kumar@student.com",
      password: hashedPassword,
      phoneNumber: "8765432102",
      role: "Student",
      profileBio: "Backend engineer specializing in scalable systems.",
      skills: [
        "Python",
        "Django",
        "PostgreSQL",
        "Docker",
        "AWS",
        "Redis",
        "GraphQL",
      ],
        profilePhoto: "https://i.pravatar.cc/150?img=15",
      },
    });
  }

  let student4 = await prisma.user.findUnique({
    where: { email: "maria.garcia@student.com" },
  });

  if (!student4) {
    student4 = await prisma.user.create({
      data: {
      fullName: "Maria Garcia",
      email: "maria.garcia@student.com",
      password: hashedPassword,
      phoneNumber: "8765432103",
      role: "Student",
      profileBio: "Full-stack developer and UI/UX enthusiast.",
      skills: [
        "JavaScript",
        "React",
        "Node.js",
        "UI/UX Design",
        "Figma",
        "MongoDB",
      ],
        profilePhoto: "https://i.pravatar.cc/150?img=20",
      },
    });
  }

  let student5 = await prisma.user.findUnique({
    where: { email: "david.lee@student.com" },
  });

  if (!student5) {
    student5 = await prisma.user.create({
      data: {
      fullName: "David Lee",
      email: "david.lee@student.com",
      password: hashedPassword,
      phoneNumber: "8765432104",
      role: "Student",
      profileBio: "DevOps engineer with cloud expertise.",
      skills: [
        "AWS",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "Linux",
        "Terraform",
        "Jenkins",
      ],
        profilePhoto: "https://i.pravatar.cc/150?img=25",
      },
    });
  }

  console.log("💼 Creating jobs...");

  const job1 = await prisma.job.create({
    data: {
      title: "Senior Full Stack Developer",
      description:
        "We are looking for an experienced Full Stack Developer to join our growing team. You will work on cutting-edge web applications using modern technologies. Must have strong problem-solving skills and ability to work in a fast-paced environment.",
      requirements: [
        "5+ years of experience with React and Node.js",
        "Strong understanding of RESTful APIs",
        "Experience with MongoDB or PostgreSQL",
        "Knowledge of Docker and CI/CD",
        "Excellent communication skills",
      ],
      salary: "$120,000 - $150,000",
      experienceLevel: 5,
      location: "San Francisco, CA (Hybrid)",
      jobType: "Full-time",
      position: 2,
      createdById: employer1.id,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: "Frontend Developer (React)",
      description:
        "Join our startup as a Frontend Developer and help build amazing user experiences. We value creativity, attention to detail, and passion for clean code. Great opportunity for growth and learning.",
      requirements: [
        "3+ years of React experience",
        "Proficiency in TypeScript",
        "Experience with state management (Redux/Context)",
        "Understanding of responsive design",
        "Portfolio of previous work",
      ],
      salary: "$90,000 - $110,000",
      experienceLevel: 3,
      location: "Remote",
      jobType: "Full-time",
      position: 3,
      createdById: employer2.id,
    },
  });

  const job3 = await prisma.job.create({
    data: {
      title: "Backend Engineer (Node.js)",
      description:
        "We need a talented Backend Engineer to design and implement scalable APIs. You'll work with microservices architecture and cloud technologies. Perfect for someone who loves solving complex technical challenges.",
      requirements: [
        "4+ years of Node.js experience",
        "Experience with microservices",
        "Knowledge of AWS or Azure",
        "Database design skills (SQL and NoSQL)",
        "Understanding of security best practices",
      ],
      salary: "$100,000 - $130,000",
      experienceLevel: 4,
      location: "New York, NY",
      jobType: "Full-time",
      position: 1,
      createdById: employer3.id,
    },
  });

  const job4 = await prisma.job.create({
    data: {
      title: "Junior Web Developer",
      description:
        "Great opportunity for recent graduates or career changers! We provide mentorship and training. You'll work on real projects and learn from experienced developers. Looking for someone eager to learn and grow.",
      requirements: [
        "Basic knowledge of HTML, CSS, JavaScript",
        "Familiarity with React or Vue.js",
        "Good problem-solving skills",
        "Willingness to learn",
        "Portfolio or GitHub projects",
      ],
      salary: "$60,000 - $75,000",
      experienceLevel: 0,
      location: "Austin, TX",
      jobType: "Full-time",
      position: 2,
      createdById: employer1.id,
    },
  });

  const job5 = await prisma.job.create({
    data: {
      title: "DevOps Engineer",
      description:
        "Looking for a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. You'll work with cutting-edge tools and help scale our platform. Must be comfortable with automation and infrastructure as code.",
      requirements: [
        "3+ years of DevOps experience",
        "Strong knowledge of AWS/GCP/Azure",
        "Experience with Docker and Kubernetes",
        "CI/CD pipeline setup (Jenkins, GitLab CI)",
        "Scripting skills (Bash, Python)",
      ],
      salary: "$110,000 - $140,000",
      experienceLevel: 3,
      location: "Remote",
      jobType: "Full-time",
      position: 1,
      createdById: employer2.id,
    },
  });

  const job6 = await prisma.job.create({
    data: {
      title: "UI/UX Designer & Frontend Developer",
      description:
        "Unique role combining design and development! Create beautiful, user-friendly interfaces and bring them to life with code. Perfect for someone who loves both design and coding.",
      requirements: [
        "2+ years of UI/UX design experience",
        "Proficiency in Figma or Adobe XD",
        "Strong HTML/CSS/JavaScript skills",
        "Experience with React",
        "Portfolio showcasing design and code",
      ],
      salary: "$85,000 - $105,000",
      experienceLevel: 2,
      location: "Los Angeles, CA (Hybrid)",
      jobType: "Full-time",
      position: 1,
      createdById: employer3.id,
    },
  });

  const job7 = await prisma.job.create({
    data: {
      title: "Intern - Software Development",
      description:
        "Summer internship program for students! Work on real projects, learn from industry experts, and build your portfolio. We offer mentorship, training, and potential for full-time conversion.",
      requirements: [
        "Currently pursuing CS degree",
        "Basic programming knowledge",
        "Enthusiasm to learn",
        "Good communication skills",
        "Available for 3 months",
      ],
      salary: "$25/hour",
      experienceLevel: 0,
      location: "Seattle, WA",
      jobType: "Internship",
      position: 5,
      createdById: employer1.id,
    },
  });

  console.log("📝 Creating applications...");

  const app1 = await prisma.application.create({
    data: {
      jobId: job1.id,
      applicantId: student1.id,
      status: "Pending",
    },
  });

  const app2 = await prisma.application.create({
    data: {
      jobId: job1.id,
      applicantId: student2.id,
      status: "Accepted",
    },
  });

  const app3 = await prisma.application.create({
    data: {
      jobId: job2.id,
      applicantId: student2.id,
      status: "Pending",
    },
  });

  const app4 = await prisma.application.create({
    data: {
      jobId: job2.id,
      applicantId: student4.id,
      status: "Rejected",
    },
  });

  const app5 = await prisma.application.create({
    data: {
      jobId: job3.id,
      applicantId: student3.id,
      status: "Accepted",
    },
  });

  const app6 = await prisma.application.create({
    data: {
      jobId: job4.id,
      applicantId: student1.id,
      status: "Pending",
    },
  });

  const app7 = await prisma.application.create({
    data: {
      jobId: job5.id,
      applicantId: student5.id,
      status: "Accepted",
    },
  });

  const app8 = await prisma.application.create({
    data: {
      jobId: job6.id,
      applicantId: student4.id,
      status: "Pending",
    },
  });

  const app9 = await prisma.application.create({
    data: {
      jobId: job7.id,
      applicantId: student1.id,
      status: "Pending",
    },
  });

  const app10 = await prisma.application.create({
    data: {
      jobId: job7.id,
      applicantId: student3.id,
      status: "Pending",
    },
  });

  console.log("💬 Creating sample conversations...");

  const [user1Id, user2Id] = [employer1.id, student2.id].sort();
  const conversation1 = await prisma.conversation.create({
    data: {
      user1Id,
      user2Id,
      participants: [employer1.id, student2.id],
      applicationId: app2.id,
      jobId: job1.id,
      initiatedBy: employer1.id,
      lastMessage: "Congratulations! We'd like to schedule an interview.",
      lastMessageAt: new Date(),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation1.id,
      senderId: employer1.id,
      content:
        "Hi Jane! We reviewed your application and we're impressed with your experience. We'd like to schedule an interview. Are you available next week?",
      isRead: true,
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation1.id,
      senderId: student2.id,
      content:
        "Thank you so much! Yes, I'm available next week. Tuesday or Wednesday would work best for me.",
      isRead: true,
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation1.id,
      senderId: employer1.id,
      content:
        "Perfect! Let's schedule it for Tuesday at 2 PM. I'll send you a calendar invite with the video call link.",
      isRead: false,
    },
  });

  console.log("\n✅ Dummy data seeded successfully!");
  console.log("\n📊 Summary:");
  console.log("   - 8 Users created (3 Employers + 5 Students)");
  console.log("   - 7 Jobs posted");
  console.log("   - 10 Applications submitted");
  console.log("   - 1 Conversation with 3 messages");
  console.log("\n🔑 Login Credentials (password for all: password123):");
  console.log("\n   Employers:");
  console.log("   - employer1@company.com");
  console.log("   - employer2@startup.com");
  console.log("   - recruiter@bigcorp.com");
  console.log("\n   Students:");
  console.log("   - john.doe@student.com");
  console.log("   - jane.smith@student.com");
  console.log("   - alex.kumar@student.com");
  console.log("   - maria.garcia@student.com");
  console.log("   - david.lee@student.com");
  console.log("\n💡 Application Status Examples:");
  console.log("   - Pending: John applied to Senior Full Stack (job1)");
  console.log("   - Accepted: Jane accepted for Senior Full Stack (job1)");
  console.log("   - Rejected: Maria rejected for Frontend Developer (job2)");
  console.log(
    "\n📧 Chat Example: Employer Sarah has conversation with Student Jane"
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
