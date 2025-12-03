import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data in correct order (respecting foreign key constraints)
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // Create 5 Employers
  const employers = [];
  const employerData = [
    { fullName: "Tech Corp", email: "hr@techcorp.com", phoneNumber: "555-0101" },
    { fullName: "StartupHub Inc", email: "jobs@startuphub.com", phoneNumber: "555-0102" },
    { fullName: "Global Solutions", email: "careers@globalsolutions.com", phoneNumber: "555-0103" },
    { fullName: "Innovation Labs", email: "hiring@innovationlabs.com", phoneNumber: "555-0104" },
    { fullName: "Digital Dynamics", email: "recruit@digitaldynamics.com", phoneNumber: "555-0105" },
  ];

  for (const emp of employerData) {
    const employer = await prisma.user.create({
      data: {
        ...emp,
        password: await bcrypt.hash("password123", 10),
        role: "Employer",
      },
    });
    employers.push(employer);
  }

  console.log("✅ Created 5 employers");

  // Create 10 Students
  const students = [];
  const studentData = [
    { fullName: "Alice Johnson", email: "alice.j@email.com", phoneNumber: "555-1001", skills: ["JavaScript", "React", "Node.js"] },
    { fullName: "Bob Smith", email: "bob.smith@email.com", phoneNumber: "555-1002", skills: ["Python", "Django", "PostgreSQL"] },
    { fullName: "Carol Williams", email: "carol.w@email.com", phoneNumber: "555-1003", skills: ["Java", "Spring Boot", "MySQL"] },
    { fullName: "David Brown", email: "david.b@email.com", phoneNumber: "555-1004", skills: ["C#", ".NET", "Azure"] },
    { fullName: "Emma Davis", email: "emma.d@email.com", phoneNumber: "555-1005", skills: ["React Native", "TypeScript", "Firebase"] },
    { fullName: "Frank Miller", email: "frank.m@email.com", phoneNumber: "555-1006", skills: ["PHP", "Laravel", "Vue.js"] },
    { fullName: "Grace Wilson", email: "grace.w@email.com", phoneNumber: "555-1007", skills: ["Ruby", "Rails", "Redis"] },
    { fullName: "Henry Moore", email: "henry.m@email.com", phoneNumber: "555-1008", skills: ["Go", "Docker", "Kubernetes"] },
    { fullName: "Ivy Taylor", email: "ivy.t@email.com", phoneNumber: "555-1009", skills: ["Swift", "iOS", "SwiftUI"] },
    { fullName: "Jack Anderson", email: "jack.a@email.com", phoneNumber: "555-1010", skills: ["Kotlin", "Android", "Jetpack"] },
  ];

  for (const std of studentData) {
    const student = await prisma.user.create({
      data: {
        ...std,
        password: await bcrypt.hash("password123", 10),
        role: "Student",
      },
    });
    students.push(student);
  }

  console.log("✅ Created 10 students");

  // Create 35 Jobs
  const jobsData = [
    // Tech Corp Jobs (7)
    {
      title: "Senior Full Stack Developer",
      description: "We're looking for an experienced full stack developer to join our growing team. You'll work on cutting-edge web applications using modern technologies.",
      requirements: ["5+ years of experience", "React and Node.js expertise", "Strong problem-solving skills", "Experience with AWS"],
      salary: "$120,000 - $160,000",
      location: "San Francisco, CA",
      jobType: "Full-time",
      experienceLevel: 5,
      position: 2,
    },
    {
      title: "Frontend Developer",
      description: "Join our frontend team to build beautiful, responsive user interfaces. Work with React, TypeScript, and modern CSS frameworks.",
      requirements: ["3+ years React experience", "TypeScript proficiency", "CSS/SASS expertise", "Git workflow knowledge"],
      salary: "$90,000 - $120,000",
      location: "San Francisco, CA",
      jobType: "Full-time",
      experienceLevel: 3,
      position: 3,
    },
    {
      title: "DevOps Engineer",
      description: "Help us build and maintain our cloud infrastructure. Work with AWS, Docker, Kubernetes, and CI/CD pipelines.",
      requirements: ["AWS certification preferred", "Docker & Kubernetes", "CI/CD experience", "Linux administration"],
      salary: "$110,000 - $150,000",
      location: "Remote",
      jobType: "Full-time",
      experienceLevel: 4,
      position: 1,
    },
    {
      title: "UI/UX Designer",
      description: "Create stunning user experiences for our products. Work closely with developers to bring designs to life.",
      requirements: ["Figma expertise", "Portfolio required", "User research experience", "Prototyping skills"],
      salary: "$80,000 - $110,000",
      location: "San Francisco, CA",
      jobType: "Full-time",
      experienceLevel: 3,
      position: 2,
    },
    {
      title: "Data Scientist",
      description: "Analyze large datasets and build machine learning models to drive business decisions.",
      requirements: ["Python & R proficiency", "ML/AI experience", "Statistics background", "SQL expertise"],
      salary: "$130,000 - $170,000",
      location: "San Francisco, CA",
      jobType: "Full-time",
      experienceLevel: 4,
      position: 1,
    },
    {
      title: "Mobile Developer (iOS)",
      description: "Build native iOS applications using Swift and SwiftUI. Work on apps used by millions.",
      requirements: ["Swift expertise", "iOS SDK knowledge", "App Store experience", "UI/UX sensibility"],
      salary: "$100,000 - $140,000",
      location: "Remote",
      jobType: "Full-time",
      experienceLevel: 3,
      position: 2,
    },
    {
      title: "QA Engineer",
      description: "Ensure quality across our products through automated and manual testing.",
      requirements: ["Test automation experience", "Selenium/Cypress", "API testing", "Attention to detail"],
      salary: "$70,000 - $95,000",
      location: "San Francisco, CA",
      jobType: "Full-time",
      experienceLevel: 2,
      position: 2,
    },

    // StartupHub Inc Jobs (7)
    {
      title: "Backend Developer",
      description: "Build scalable backend services using Node.js and PostgreSQL. Work in a fast-paced startup environment.",
      requirements: ["Node.js expertise", "PostgreSQL/MongoDB", "RESTful API design", "Microservices architecture"],
      salary: "$95,000 - $130,000",
      location: "Austin, TX",
      jobType: "Full-time",
      experienceLevel: 3,
      position: 2,
    },
    {
      title: "Product Manager",
      description: "Lead product development from conception to launch. Work with cross-functional teams.",
      requirements: ["3+ years PM experience", "Agile methodology", "Technical background", "Strong communication"],
      salary: "$110,000 - $145,000",
      location: "Austin, TX",
      jobType: "Full-time",
      experienceLevel: 3,
      position: 1,
    },
    {
      title: "Marketing Manager",
      description: "Drive our marketing strategy and grow our user base. Experience with digital marketing required.",
      requirements: ["Digital marketing expertise", "SEO/SEM knowledge", "Content strategy", "Analytics skills"],
      salary: "$85,000 - $115,000",
      location: "Remote",
      jobType: "Full-time",
      experienceLevel: 4,
      position: 1,
    },
    {
      title: "Junior Developer",
      description: "Start your career with us! Learn from experienced developers and work on real projects.",
      requirements: ["CS degree or bootcamp", "JavaScript basics", "Git knowledge", "Eager to learn"],
      salary: "$60,000 - $80,000",
      location: "Austin, TX",
      jobType: "Full-time",
      experienceLevel: 0,
      position: 3,
    },
    {
      title: "Sales Representative",
      description: "Help us grow by connecting with potential clients and closing deals.",
      requirements: ["Sales experience", "CRM knowledge", "Excellent communication", "Self-motivated"],
      salary: "$70,000 - $100,000 + commission",
      location: "Remote",
      jobType: "Full-time",
      experienceLevel: 2,
      position: 2,
    },
    {
      title: "Content Writer",
      description: "Create engaging content for our blog, social media, and marketing materials.",
      requirements: ["Excellent writing skills", "SEO knowledge", "Tech industry experience", "Portfolio required"],
      salary: "$55,000 - $75,000",
      location: "Remote",
      jobType: "Full-time",
      experienceLevel: 2,
      position: 1,
    },
    {
      title: "Customer Success Manager",
      description: "Ensure our customers get maximum value from our products. Build lasting relationships.",
      requirements: ["Customer service experience", "Problem-solving skills", "Tech-savvy", "Empathy"],
      salary: "$65,000 - $90,000",
      location: "Austin, TX",
      jobType: "Full-time",
      experienceLevel: 2,
      position: 2,
    },

    // Global Solutions Jobs (7)
    {
      title: "Cloud Architect",
      description: "Design and implement cloud solutions for enterprise clients. AWS and Azure experience required.",
      requirements: ["Cloud certifications", "Enterprise architecture", "Security best practices", "10+ years experience"],
      salary: "$150,000 - $200,000",
      location: "New York, NY",
      jobType: "Full-time",
      experienceLevel: 10,
      position: 1,
    },
    {
      title: "Security Engineer",
      description: "Protect our systems and data. Implement security best practices and respond to threats.",
      requirements: ["Security certifications", "Penetration testing", "SIEM tools", "Incident response"],
      salary: "$120,000 - $160,000",
      location: "New York, NY",
      jobType: "Full-time",
      experienceLevel: 5,
      position: 2,
    },
    {
      title: "Business Analyst",
      description: "Bridge the gap between business needs and technical solutions. Work with stakeholders.",
      requirements: ["Requirements gathering", "SQL knowledge", "Documentation skills", "Agile experience"],
      salary: "$80,000 - $110,000",
      location: "New York, NY",
      jobType: "Full-time",
      experienceLevel: 3,
      position: 2,
    },
    {
      title: "Scrum Master",
      description: "Facilitate agile processes and help teams deliver high-quality products.",
      requirements: ["Scrum certification", "Agile coaching", "Team facilitation", "Jira expertise"],
      salary: "$90,000 - $120,000",
      location: "Remote",
      jobType: "Full-time",
      experienceLevel: 4,
      position: 1,
    },
    {
      title: "Database Administrator",
      description: "Manage and optimize our database systems. Ensure data integrity and performance.",
      requirements: ["PostgreSQL/MySQL", "Performance tuning", "Backup strategies", "High availability"],
      salary: "$95,000 - $130,000",
      location: "New York, NY",
      jobType: "Full-time",
      experienceLevel: 5,
      position: 1,
    },
    {
      title: "Technical Writer",
      description: "Create clear documentation for our products and APIs. Work with engineering teams.",
      requirements: ["Technical writing experience", "API documentation", "Markdown/Git", "Developer empathy"],
      salary: "$70,000 - $95,000",
      location: "Remote",
      jobType: "Full-time",
      experienceLevel: 3,
      position: 1,
    },
    {
      title: "IT Support Specialist",
      description: "Provide technical support to our employees. Troubleshoot hardware and software issues.",
      requirements: ["Help desk experience", "Windows/Mac support", "Networking basics", "Customer service"],
      salary: "$50,000 - $70,000",
      location: "New York, NY",
      jobType: "Full-time",
      experienceLevel: 2,
      position: 2,
    },

    // Innovation Labs Jobs (7)
    {
      title: "Machine Learning Engineer",
      description: "Build and deploy ML models at scale. Work on cutting-edge AI projects.",
      requirements: ["Python/TensorFlow", "ML algorithms", "Model deployment", "Research background"],
      salary: "$140,000 - $180,000",
      location: "Seattle, WA",
      jobType: "Full-time",
      experienceLevel: 4,
      position: 2,
    },
    {
      title: "Research Scientist",
      description: "Conduct research in AI/ML and publish findings. PhD preferred.",
      requirements: ["PhD in CS/ML", "Published papers", "Deep learning", "Python expertise"],
      salary: "$160,000 - $220,000",
      location: "Seattle, WA",
      jobType: "Full-time",
      experienceLevel: 6,
      position: 1,
    },
    {
      title: "Software Engineer Intern",
      description: "Summer internship program for students. Work on real projects with mentorship.",
      requirements: ["Currently enrolled", "Programming basics", "CS fundamentals", "Passion for tech"],
      salary: "$30/hour",
      location: "Seattle, WA",
      jobType: "Internship",
      experienceLevel: 0,
      position: 5,
    },
    {
      title: "React Developer",
      description: "Build modern web applications using React and TypeScript. Remote-friendly.",
      requirements: ["React expertise", "TypeScript", "State management", "Testing"],
      salary: "$100,000 - $135,000",
      location: "Remote",
      jobType: "Full-time",
      experienceLevel: 3,
      position: 3,
    },
    {
      title: "Python Developer",
      description: "Develop backend services and data pipelines using Python.",
      requirements: ["Python expertise", "Django/Flask", "SQL databases", "API design"],
      salary: "$95,000 - $130,000",
      location: "Seattle, WA",
      jobType: "Full-time",
      experienceLevel: 3,
      position: 2,
    },
    {
      title: "Engineering Manager",
      description: "Lead a team of engineers. Balance technical and people management.",
      requirements: ["5+ years engineering", "2+ years management", "Technical leadership", "Mentoring skills"],
      salary: "$150,000 - $190,000",
      location: "Seattle, WA",
      jobType: "Full-time",
      experienceLevel: 7,
      position: 1,
    },
    {
      title: "Site Reliability Engineer",
      description: "Ensure our systems are reliable, scalable, and performant.",
      requirements: ["Linux expertise", "Monitoring tools", "Automation", "On-call experience"],
      salary: "$120,000 - $160,000",
      location: "Remote",
      jobType: "Full-time",
      experienceLevel: 4,
      position: 2,
    },

    // Digital Dynamics Jobs (7)
    {
      title: "Full Stack Engineer",
      description: "Work across the entire stack. Build features from database to UI.",
      requirements: ["Full stack experience", "JavaScript/TypeScript", "SQL & NoSQL", "Cloud platforms"],
      salary: "$105,000 - $145,000",
      location: "Boston, MA",
      jobType: "Full-time",
      experienceLevel: 4,
      position: 2,
    },
    {
      title: "Android Developer",
      description: "Build native Android apps using Kotlin. Work on apps with millions of users.",
      requirements: ["Kotlin expertise", "Android SDK", "Material Design", "Play Store experience"],
      salary: "$100,000 - $140,000",
      location: "Boston, MA",
      jobType: "Full-time",
      experienceLevel: 3,
      position: 2,
    },
    {
      title: "Graphic Designer",
      description: "Create visual designs for web and mobile. Work with marketing and product teams.",
      requirements: ["Adobe Creative Suite", "UI design", "Brand design", "Portfolio required"],
      salary: "$65,000 - $90,000",
      location: "Remote",
      jobType: "Full-time",
      experienceLevel: 2,
      position: 1,
    },
    {
      title: "Project Manager",
      description: "Manage software projects from start to finish. Coordinate with stakeholders.",
      requirements: ["PM experience", "Agile/Scrum", "Risk management", "Budget management"],
      salary: "$95,000 - $130,000",
      location: "Boston, MA",
      jobType: "Full-time",
      experienceLevel: 5,
      position: 1,
    },
    {
      title: "Data Engineer",
      description: "Build data pipelines and infrastructure. Work with big data technologies.",
      requirements: ["ETL experience", "Spark/Hadoop", "Python/Scala", "Data warehousing"],
      salary: "$110,000 - $150,000",
      location: "Remote",
      jobType: "Full-time",
      experienceLevel: 4,
      position: 2,
    },
    {
      title: "Part-time Developer",
      description: "Flexible part-time position for experienced developers. 20 hours per week.",
      requirements: ["Web development", "Flexible schedule", "Self-motivated", "Remote work experience"],
      salary: "$50/hour",
      location: "Remote",
      jobType: "Part-time",
      experienceLevel: 3,
      position: 1,
    },
    {
      title: "Contract Frontend Developer",
      description: "6-month contract to build a new web application. React and TypeScript.",
      requirements: ["React expertise", "TypeScript", "6-month availability", "Portfolio required"],
      salary: "$80/hour",
      location: "Remote",
      jobType: "Contract",
      experienceLevel: 4,
      position: 1,
    },
  ];

  // Create jobs distributed among employers
  let jobIndex = 0;
  for (let i = 0; i < employers.length; i++) {
    const jobsPerEmployer = 7;
    for (let j = 0; j < jobsPerEmployer; j++) {
      if (jobIndex < jobsData.length) {
        await prisma.job.create({
          data: {
            ...jobsData[jobIndex],
            createdById: employers[i].id,
          },
        });
        jobIndex++;
      }
    }
  }

  console.log("✅ Created 35 jobs");

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📝 Login credentials:");
  console.log("Employers: hr@techcorp.com, jobs@startuphub.com, careers@globalsolutions.com, hiring@innovationlabs.com, recruit@digitaldynamics.com");
  console.log("Students: alice.j@email.com, bob.smith@email.com, carol.w@email.com, etc.");
  console.log("Password for all: password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
