import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting to seed dummy data (safe mode)...\n");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = [
    {
      email: "employer1@company.com",
      fullName: "Sarah Johnson",
      phoneNumber: "9876543220",
      role: "Employer",
      profileBio: "HR Manager at Tech Corp. Looking for talented developers.",
      profilePhoto: "https://i.pravatar.cc/150?img=1",
    },
    {
      email: "employer2@startup.com",
      fullName: "Michael Chen",
      phoneNumber: "9876543211",
      role: "Employer",
      profileBio: "Founder & CEO at StartupXYZ. Building the future of tech.",
      profilePhoto: "https://i.pravatar.cc/150?img=12",
    },
    {
      email: "recruiter@bigcorp.com",
      fullName: "Emily Rodriguez",
      phoneNumber: "9876543212",
      role: "Employer",
      profileBio: "Senior Technical Recruiter at BigCorp Inc.",
      profilePhoto: "https://i.pravatar.cc/150?img=5",
    },
    {
      email: "john.doe@student.com",
      fullName: "John Doe",
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
    {
      email: "jane.smith@student.com",
      fullName: "Jane Smith",
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
    {
      email: "alex.kumar@student.com",
      fullName: "Alex Kumar",
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
    {
      email: "maria.garcia@student.com",
      fullName: "Maria Garcia",
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
    {
      email: "david.lee@student.com",
      fullName: "David Lee",
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
  ];

  console.log("👥 Creating/Finding users...");
  const createdUsers = {};
  let newUsersCount = 0;
  let existingUsersCount = 0;

  for (const userData of users) {
    let user = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            ...userData,
            password: hashedPassword,
            skills: userData.skills || [],
          },
        });
        console.log(`   ✅ Created: ${userData.email}`);
        newUsersCount++;
      } catch (error) {
        console.log(`   ⚠️  Skipped: ${userData.email} (phone number exists)`);
        continue;
      }
    } else {
      console.log(`   ℹ️  Exists: ${userData.email}`);
      existingUsersCount++;
    }

    createdUsers[userData.email] = user;
  }

  const employer1 = createdUsers["employer1@company.com"];
  const employer2 = createdUsers["employer2@startup.com"];
  const employer3 = createdUsers["recruiter@bigcorp.com"];
  const student1 = createdUsers["john.doe@student.com"];
  const student2 = createdUsers["jane.smith@student.com"];
  const student3 = createdUsers["alex.kumar@student.com"];
  const student4 = createdUsers["maria.garcia@student.com"];
  const student5 = createdUsers["david.lee@student.com"];

  if (!employer1 || !employer2 || !employer3) {
    console.log(
      "\n⚠️  Some employers are missing. Cannot create jobs. Please check phone number conflicts."
    );
    return;
  }

  console.log("\n💼 Creating jobs...");
  let jobsCreated = 0;

  const jobsData = [
    {
      title: "Senior Full Stack Developer",
      description:
        "We are looking for an experienced Full Stack Developer to join our growing team.",
      requirements: [
        "5+ years of experience with React and Node.js",
        "Strong understanding of RESTful APIs",
        "Experience with MongoDB or PostgreSQL",
      ],
      salary: "$120,000 - $150,000",
      experienceLevel: 5,
      location: "San Francisco, CA (Hybrid)",
      jobType: "Full-time",
      position: 2,
      createdById: employer1.id,
    },
    {
      title: "Frontend Developer (React)",
      description:
        "Join our startup as a Frontend Developer and help build amazing user experiences.",
      requirements: [
        "3+ years of React experience",
        "Proficiency in TypeScript",
        "Experience with state management",
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
        "We need a talented Backend Engineer to design and implement scalable APIs.",
      requirements: [
        "4+ years of Node.js experience",
        "Experience with microservices",
        "Knowledge of AWS or Azure",
      ],
      salary: "$100,000 - $130,000",
      experienceLevel: 4,
      location: "New York, NY",
      jobType: "Full-time",
      position: 1,
      createdById: employer3.id,
    },
  ];

  const createdJobs = [];
  for (const jobData of jobsData) {
    const existing = await prisma.job.findFirst({
      where: {
        title: jobData.title,
        createdById: jobData.createdById,
      },
    });

    if (!existing) {
      const job = await prisma.job.create({ data: jobData });
      createdJobs.push(job);
      console.log(`   ✅ Created: ${jobData.title}`);
      jobsCreated++;
    } else {
      createdJobs.push(existing);
      console.log(`   ℹ️  Exists: ${jobData.title}`);
    }
  }

  if (createdJobs.length > 0 && student1 && student2) {
    console.log("\n📝 Creating applications...");
    let appsCreated = 0;

    const applicationsData = [
      {
        jobId: createdJobs[0].id,
        applicantId: student1.id,
        status: "Pending",
      },
      {
        jobId: createdJobs[0].id,
        applicantId: student2.id,
        status: "Accepted",
      },
      {
        jobId: createdJobs[1].id,
        applicantId: student2.id,
        status: "Pending",
      },
    ];

    for (const appData of applicationsData) {
      const existing = await prisma.application.findFirst({
        where: {
          jobId: appData.jobId,
          applicantId: appData.applicantId,
        },
      });

      if (!existing) {
        await prisma.application.create({ data: appData });
        console.log(`   ✅ Created application`);
        appsCreated++;
      } else {
        console.log(`   ℹ️  Application exists`);
      }
    }

    console.log("\n✅ Dummy data seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - ${newUsersCount} new users created`);
    console.log(`   - ${existingUsersCount} existing users found`);
    console.log(`   - ${jobsCreated} new jobs created`);
    console.log(`   - ${appsCreated} new applications created`);
  }

  console.log("\n🔑 Login Credentials (password: password123):");
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
}

main()
  .catch((e) => {
    console.error("\n❌ Error seeding data:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
