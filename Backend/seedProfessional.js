import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting professional seed data...\n");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = [
    {
      email: "hr@techcorp.com",
      fullName: "Sarah Johnson",
      phoneNumber: "4155551001",
      role: "Employer",
      profileBio: "Senior HR Manager at TechCorp with 10+ years of experience in talent acquisition.",
      profilePhoto: "https://i.pravatar.cc/150?img=1",
    },
    {
      email: "recruiter@innovatelabs.com",
      fullName: "Michael Chen",
      phoneNumber: "4155551002",
      role: "Employer",
      profileBio: "Technical Recruiter at Innovate Labs. Passionate about connecting talent with opportunities.",
      profilePhoto: "https://i.pravatar.cc/150?img=12",
    },
    {
      email: "hiring@startupxyz.com",
      fullName: "Emily Rodriguez",
      phoneNumber: "4155551003",
      role: "Employer",
      profileBio: "Head of People Operations at StartupXYZ. Building diverse and inclusive teams.",
      profilePhoto: "https://i.pravatar.cc/150?img=5",
    },
    
    // Job Seekers / Students
    {
      email: "john.developer@email.com",
      fullName: "John Anderson",
      phoneNumber: "4155552001",
      role: "Student",
      profileBio: "Full-stack developer with 3 years of experience. Passionate about building scalable web applications.",
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express", "TypeScript", "Docker"],
      profilePhoto: "https://i.pravatar.cc/150?img=33",
    },
    {
      email: "jane.frontend@email.com",
      fullName: "Jane Smith",
      phoneNumber: "4155552002",
      role: "Student",
      profileBio: "Frontend specialist with expertise in modern UI/UX design and React ecosystem.",
      skills: ["React", "Vue.js", "CSS", "Tailwind", "Figma", "JavaScript", "HTML", "Redux"],
      profilePhoto: "https://i.pravatar.cc/150?img=10",
    },
    {
      email: "alex.backend@email.com",
      fullName: "Alex Kumar",
      phoneNumber: "4155552003",
      role: "Student",
      profileBio: "Backend engineer specializing in microservices architecture and cloud infrastructure.",
      skills: ["Python", "Django", "PostgreSQL", "Docker", "AWS", "Redis", "GraphQL", "Kubernetes"],
      profilePhoto: "https://i.pravatar.cc/150?img=15",
    },
    {
      email: "maria.fullstack@email.com",
      fullName: "Maria Garcia",
      phoneNumber: "4155552004",
      role: "Student",
      profileBio: "Full-stack engineer with strong focus on performance optimization and clean code.",
      skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "AWS", "TypeScript"],
      profilePhoto: "https://i.pravatar.cc/150?img=20",
    },
    {
      email: "david.devops@email.com",
      fullName: "David Lee",
      phoneNumber: "4155552005",
      role: "Student",
      profileBio: "DevOps engineer with expertise in CI/CD pipelines and cloud infrastructure automation.",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Terraform", "Jenkins", "Python"],
      profilePhoto: "https://i.pravatar.cc/150?img=25",
    },
  ];

  console.log("👥 Creating users...");
  const createdUsers = {};
  let newUsersCount = 0;

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
        console.log(`   ✅ Created: ${userData.fullName} (${userData.email})`);
        newUsersCount++;
      } catch (error) {
        console.log(`   ⚠️  Skipped: ${userData.email} (${error.message})`);
        continue;
      }
    } else {
      console.log(`   ℹ️  Exists: ${userData.fullName} (${userData.email})`);
    }

    createdUsers[userData.email] = user;
  }

  const employer1 = createdUsers["hr@techcorp.com"];
  const employer2 = createdUsers["recruiter@innovatelabs.com"];
  const employer3 = createdUsers["hiring@startupxyz.com"];
  const student1 = createdUsers["john.developer@email.com"];
  const student2 = createdUsers["jane.frontend@email.com"];
  const student3 = createdUsers["alex.backend@email.com"];
  const student4 = createdUsers["maria.fullstack@email.com"];
  const student5 = createdUsers["david.devops@email.com"];

  if (!employer1 || !employer2 || !employer3) {
    console.log("\n⚠️  Some employers are missing. Cannot create jobs.");
    return;
  }

  console.log("\n💼 Creating professional job postings...");
  let jobsCreated = 0;

  const jobsData = [
    // TechCorp Jobs
    {
      title: "Senior Full Stack Developer",
      description: "Join our engineering team to build next-generation cloud-based solutions. You'll work on scalable microservices architecture, lead technical discussions, and mentor junior developers. We offer competitive compensation, flexible work arrangements, and comprehensive benefits.",
      requirements: [
        "5+ years of experience with React and Node.js",
        "Strong understanding of RESTful APIs and microservices",
        "Experience with MongoDB or PostgreSQL",
        "Proficiency in TypeScript",
        "Experience with cloud platforms (AWS/GCP/Azure)",
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
      description: "We're looking for a talented Frontend Developer to create beautiful, responsive user interfaces. You'll collaborate with designers and backend engineers to deliver exceptional user experiences. This role offers growth opportunities and the chance to work with cutting-edge technologies.",
      requirements: [
        "3+ years of React experience",
        "Proficiency in TypeScript and modern JavaScript",
        "Experience with state management (Redux/Zustand)",
        "Strong CSS skills and responsive design",
        "Familiarity with testing frameworks (Jest/React Testing Library)",
      ],
      salary: "$90,000 - $110,000",
      experienceLevel: 3,
      location: "Remote",
      jobType: "Full-time",
      position: 3,
      createdById: employer1.id,
    },
    {
      title: "Junior Web Developer",
      description: "Perfect opportunity for recent graduates or career changers! We provide comprehensive mentorship, training programs, and hands-on experience with real projects. You'll learn from experienced developers while contributing to meaningful work. We value enthusiasm, curiosity, and a growth mindset.",
      requirements: [
        "Basic knowledge of HTML, CSS, JavaScript",
        "Familiarity with React or Vue.js",
        "Good problem-solving skills",
        "Eagerness to learn and grow",
        "Strong communication skills",
      ],
      salary: "$60,000 - $75,000",
      experienceLevel: 0,
      location: "Austin, TX (On-site)",
      jobType: "Full-time",
      position: 2,
      createdById: employer1.id,
    },
    
    // Innovate Labs Jobs
    {
      title: "Backend Engineer (Node.js)",
      description: "Design and implement scalable backend services for our growing platform. You'll work with modern technologies, contribute to architectural decisions, and help shape our engineering culture. We offer competitive compensation, equity, and a collaborative work environment.",
      requirements: [
        "4+ years of Node.js experience",
        "Experience with microservices architecture",
        "Strong knowledge of databases (SQL and NoSQL)",
        "Experience with AWS or Azure",
        "Understanding of security best practices",
      ],
      salary: "$100,000 - $130,000",
      experienceLevel: 4,
      location: "New York, NY (Hybrid)",
      jobType: "Full-time",
      position: 1,
      createdById: employer2.id,
    },
    {
      title: "DevOps Engineer",
      description: "Manage our cloud infrastructure and CI/CD pipelines. You'll work with cutting-edge tools to ensure reliable, scalable deployments. This role offers the opportunity to work with modern DevOps practices and contribute to our infrastructure strategy.",
      requirements: [
        "3+ years of DevOps experience",
        "Strong knowledge of AWS/GCP/Azure",
        "Experience with Docker and Kubernetes",
        "CI/CD pipeline expertise (Jenkins, GitLab CI, GitHub Actions)",
        "Infrastructure as Code (Terraform/CloudFormation)",
      ],
      salary: "$110,000 - $140,000",
      experienceLevel: 3,
      location: "Seattle, WA (Remote)",
      jobType: "Full-time",
      position: 2,
      createdById: employer2.id,
    },
    
    // StartupXYZ Jobs
    {
      title: "Full Stack Engineer (Startup)",
      description: "Join our fast-paced startup as an early engineering team member. You'll have significant impact on product direction, work across the entire stack, and help build our engineering culture. We offer equity, flexible hours, and the opportunity to grow with the company.",
      requirements: [
        "2+ years of full-stack development experience",
        "Proficiency in React and Node.js",
        "Experience with PostgreSQL or MongoDB",
        "Comfortable working in a fast-paced environment",
        "Strong ownership mentality",
      ],
      salary: "$85,000 - $115,000 + Equity",
      experienceLevel: 2,
      location: "Remote",
      jobType: "Full-time",
      position: 3,
      createdById: employer3.id,
    },
    {
      title: "UI/UX Designer & Frontend Developer",
      description: "Unique hybrid role combining design and development. You'll create beautiful designs and implement them using modern frontend technologies. Perfect for someone who loves both design and code. We value creativity, attention to detail, and user-centric thinking.",
      requirements: [
        "2+ years of UI/UX design experience",
        "Proficiency in Figma or Sketch",
        "Strong HTML, CSS, JavaScript skills",
        "Experience with React or Vue.js",
        "Portfolio demonstrating design and development work",
      ],
      salary: "$80,000 - $105,000",
      experienceLevel: 2,
      location: "Los Angeles, CA (Hybrid)",
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
      // Applications for Senior Full Stack Developer
      { jobId: createdJobs[0].id, applicantId: student1.id, status: "Pending" },
      { jobId: createdJobs[0].id, applicantId: student4.id, status: "Accepted" },
      
      // Applications for Frontend Developer
      { jobId: createdJobs[1].id, applicantId: student2.id, status: "Pending" },
      { jobId: createdJobs[1].id, applicantId: student4.id, status: "Pending" },
      
      // Applications for Junior Web Developer
      { jobId: createdJobs[2].id, applicantId: student1.id, status: "Pending" },
      { jobId: createdJobs[2].id, applicantId: student2.id, status: "Accepted" },
      { jobId: createdJobs[2].id, applicantId: student3.id, status: "Pending" },
      
      // Applications for Backend Engineer
      { jobId: createdJobs[3].id, applicantId: student1.id, status: "Pending" },
      { jobId: createdJobs[3].id, applicantId: student3.id, status: "Accepted" },
      
      // Applications for DevOps Engineer
      { jobId: createdJobs[4].id, applicantId: student5.id, status: "Pending" },
      
      // Applications for Full Stack Engineer (Startup)
      { jobId: createdJobs[5].id, applicantId: student1.id, status: "Pending" },
      { jobId: createdJobs[5].id, applicantId: student4.id, status: "Pending" },
      
      // Applications for UI/UX Designer
      { jobId: createdJobs[6].id, applicantId: student2.id, status: "Pending" },
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
        appsCreated++;
      }
    }

    console.log(`   ✅ Created ${appsCreated} applications`);
  }

  console.log("\n✅ Professional seed data completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - ${newUsersCount} new users created`);
  console.log(`   - ${jobsCreated} new jobs created`);
  console.log(`   - ${createdJobs.length} total jobs available`);

  console.log("\n🔑 Login Credentials (password: password123):");
  console.log("\n   Employers:");
  console.log("   - hr@techcorp.com (Sarah Johnson - TechCorp)");
  console.log("   - recruiter@innovatelabs.com (Michael Chen - Innovate Labs)");
  console.log("   - hiring@startupxyz.com (Emily Rodriguez - StartupXYZ)");
  console.log("\n   Job Seekers:");
  console.log("   - john.developer@email.com (John Anderson - Full Stack)");
  console.log("   - jane.frontend@email.com (Jane Smith - Frontend)");
  console.log("   - alex.backend@email.com (Alex Kumar - Backend)");
  console.log("   - maria.fullstack@email.com (Maria Garcia - Full Stack)");
  console.log("   - david.devops@email.com (David Lee - DevOps)");
}

main()
  .catch((e) => {
    console.error("\n❌ Error seeding data:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
