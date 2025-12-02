import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearAndSeedJobs() {
    try {
        console.log('Clearing existing jobs...');

        await prisma.application.deleteMany({});
        console.log('Cleared applications');

        await prisma.job.deleteMany({});
        console.log('Cleared jobs');

        console.log('\n Creating 20 diverse job postings...\n');

        const employer = await prisma.user.findFirst({
            where: { role: 'Employer' }
        });
 if (!employer) {
            console.log(' No employer found. Please create an employer account first.');
            return;
        }

        console.log(`Using employer: ${employer.fullName} (${employer.email})`);

        const jobsData = [
            {
                title: "Senior Full Stack Developer",
                description: "We're looking for an experienced Full Stack Developer to join our growing engineering team. You'll work on cutting-edge web applications using React, Node.js, and cloud technologies. This role offers the opportunity to architect scalable solutions and mentor junior developers.",
                requirements: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
                salary: "₹15,00,000 - ₹25,00,000 per year",
                location: "Bangalore",
                jobType: "Full-time",
                experienceLevel: 5,
                position: 2,
                created_by: {
                    connect: { id: employer.id }
                }
            },
            {
                title: "Machine Learning Engineer",
                description: "Join our AI team to build and deploy machine learning models at scale. You'll work on computer vision, NLP, and recommendation systems. Experience with TensorFlow/PyTorch and cloud ML platforms required.",
                requirements: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Data Science"],
                salary: "₹18,00,000 - ₹30,00,000 per year",
                location: "Hyderabad",
                jobType: "Full-time",
                experienceLevel: 4,
                position: 1,
                created_by: {
                    connect: { id: employer.id }
                }
            },
            {
                title: "DevOps Engineer",
                description: "Seeking a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. You'll work with Kubernetes, Docker, and modern DevOps tools to ensure high availability and performance.",
                requirements: ["Kubernetes", "Docker", "AWS", "Jenkins", "Terraform"],
                salary: "₹12,00,000 - ₹20,00,000 per year",
                location: "Pune",
                jobType: "Full-time",
                experienceLevel: 3,
                position: 2,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Frontend Developer (React)",
                description: "We need a talented Frontend Developer to create beautiful, responsive user interfaces. You'll collaborate with designers and backend teams to deliver exceptional user experiences.",
                requirements: ["React", "JavaScript", "CSS", "Redux", "Responsive Design"],
                salary: "₹8,00,000 - ₹15,00,000 per year",
                location: "Remote",
                jobType: "Full-time",
                experienceLevel: 2,
                position: 3,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Mobile App Developer (React Native)",
                description: "Build cross-platform mobile applications for iOS and Android. You'll work on consumer-facing apps with millions of users, focusing on performance and user experience.",
                requirements: ["React Native", "JavaScript", "iOS", "Android", "REST APIs"],
                salary: "₹10,00,000 - ₹18,00,000 per year",
                location: "Mumbai",
                jobType: "Full-time",
                experienceLevel: 3,
                position: 2,
                created_by: { connect: { id: employer.id } }
            },


            {
                title: "Data Analyst",
                description: "Analyze business data to drive decision-making. You'll create dashboards, conduct A/B tests, and work with stakeholders to identify growth opportunities.",
                requirements: ["SQL", "Python", "Tableau", "Excel", "Statistics"],
                salary: "₹6,00,000 - ₹12,00,000 per year",
                location: "Bangalore",
                jobType: "Full-time",
                experienceLevel: 2,
                position: 2,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Data Scientist",
                description: "Apply statistical analysis and machine learning to solve complex business problems. You'll work with large datasets and present insights to senior leadership.",
                requirements: ["Python", "R", "Machine Learning", "SQL", "Statistics"],
                salary: "₹14,00,000 - ₹22,00,000 per year",
                location: "Delhi",
                jobType: "Full-time",
                experienceLevel: 4,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },


            {
                title: "UI/UX Designer",
                description: "Design intuitive and beautiful user interfaces for web and mobile applications. You'll conduct user research, create wireframes, and collaborate with development teams.",
                requirements: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
                salary: "₹7,00,000 - ₹14,00,000 per year",
                location: "Bangalore",
                jobType: "Full-time",
                experienceLevel: 3,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Product Designer",
                description: "Own the end-to-end design process for our product suite. You'll work closely with product managers and engineers to ship features that delight users.",
                requirements: ["Figma", "User Research", "Prototyping", "Design Thinking", "HTML/CSS"],
                salary: "₹12,00,000 - ₹20,00,000 per year",
                location: "Mumbai",
                jobType: "Full-time",
                experienceLevel: 4,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },


            {
                title: "Product Manager",
                description: "Drive product strategy and roadmap for our core products. You'll work with engineering, design, and business teams to build products users love.",
                requirements: ["Product Strategy", "Agile", "Analytics", "Stakeholder Management", "Technical Background"],
                salary: "₹18,00,000 - ₹30,00,000 per year",
                location: "Bangalore",
                jobType: "Full-time",
                experienceLevel: 5,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Technical Project Manager",
                description: "Manage complex technical projects from conception to delivery. You'll coordinate with cross-functional teams and ensure projects are delivered on time and within budget.",
                requirements: ["Project Management", "Agile", "Jira", "Technical Knowledge", "Communication"],
                salary: "₹14,00,000 - ₹22,00,000 per year",
                location: "Hyderabad",
                jobType: "Full-time",
                experienceLevel: 4,
                position: 2,
                created_by: { connect: { id: employer.id } }
            },


            {
                title: "Digital Marketing Manager",
                description: "Lead our digital marketing efforts including SEO, SEM, social media, and content marketing. You'll drive growth and brand awareness across digital channels.",
                requirements: ["SEO", "Google Ads", "Social Media Marketing", "Analytics", "Content Strategy"],
                salary: "₹10,00,000 - ₹18,00,000 per year",
                location: "Mumbai",
                jobType: "Full-time",
                experienceLevel: 4,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Content Writer",
                description: "Create compelling content for our blog, website, and marketing materials. You'll research topics, write SEO-optimized articles, and maintain our brand voice.",
                requirements: ["Content Writing", "SEO", "Research", "WordPress", "Communication"],
                salary: "₹4,00,000 - ₹8,00,000 per year",
                location: "Remote",
                jobType: "Full-time",
                experienceLevel: 1,
                position: 2,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Business Development Executive",
                description: "Identify and pursue new business opportunities. You'll build relationships with potential clients, conduct presentations, and close deals.",
                requirements: ["Sales", "Communication", "Negotiation", "CRM", "Business Acumen"],
                salary: "₹5,00,000 - ₹12,00,000 per year",
                location: "Delhi",
                jobType: "Full-time",
                experienceLevel: 2,
                position: 3,
                created_by: { connect: { id: employer.id } }
            },


            {
                title: "HR Manager",
                description: "Oversee all aspects of human resources including recruitment, onboarding, performance management, and employee relations. You'll build a positive workplace culture.",
                requirements: ["HR Management", "Recruitment", "Employee Relations", "Labor Laws", "Communication"],
                salary: "₹8,00,000 - ₹15,00,000 per year",
                location: "Bangalore",
                jobType: "Full-time",
                experienceLevel: 5,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Operations Manager",
                description: "Manage day-to-day operations and optimize business processes. You'll work with multiple teams to improve efficiency and reduce costs.",
                requirements: ["Operations Management", "Process Optimization", "Analytics", "Leadership", "Problem Solving"],
                salary: "₹12,00,000 - ₹20,00,000 per year",
                location: "Pune",
                jobType: "Full-time",
                experienceLevel: 6,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },


            {
                title: "Financial Analyst",
                description: "Analyze financial data, create forecasts, and provide insights to support business decisions. You'll work with senior management on budgeting and planning.",
                requirements: ["Financial Analysis", "Excel", "Financial Modeling", "SQL", "Communication"],
                salary: "₹7,00,000 - ₹14,00,000 per year",
                location: "Mumbai",
                jobType: "Full-time",
                experienceLevel: 3,
                position: 2,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Accountant",
                description: "Handle bookkeeping, financial reporting, and compliance. You'll ensure accurate financial records and assist with audits and tax filings.",
                requirements: ["Accounting", "Tally", "GST", "Financial Reporting", "Excel"],
                salary: "₹4,00,000 - ₹8,00,000 per year",
                location: "Delhi",
                jobType: "Full-time",
                experienceLevel: 2,
                position: 2,
                created_by: { connect: { id: employer.id } }
            },


            {
                title: "Software Engineering Intern",
                description: "6-month internship opportunity to work on real projects with our engineering team. You'll learn modern web development practices and work with experienced mentors.",
                requirements: ["Programming", "JavaScript", "Problem Solving", "Git", "Eagerness to Learn"],
                salary: "₹20,000 - ₹30,000 per month",
                location: "Bangalore",
                jobType: "Internship",
                experienceLevel: 0,
                position: 5,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Marketing Intern",
                description: "Join our marketing team for a 3-month internship. You'll assist with campaigns, content creation, and social media management while learning digital marketing.",
                requirements: ["Marketing", "Social Media", "Content Creation", "Communication", "Creativity"],
                salary: "₹15,000 - ₹25,000 per month",
                location: "Remote",
                jobType: "Internship",
                experienceLevel: 0,
                position: 3,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Backend Developer (Node.js)",
                description: "Build scalable backend services and REST APIs using Node.js and Express. Work closely with the frontend team to deliver end-to-end features.",
                requirements: ["Node.js", "Express", "MongoDB", "REST APIs", "Git"],
                salary: "₹10,00,000 - ₹18,00,000 per year",
                location: "Chennai",
                jobType: "Full-time",
                experienceLevel: 3,
                position: 2,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Cloud Engineer",
                description: "Deploy, monitor, and optimize cloud infrastructure across AWS and Azure. Manage autoscaling, security groups, and cost optimization.",
                requirements: ["AWS", "Azure", "Linux", "Cloud Networking", "Terraform"],
                salary: "₹12,00,000 - ₹22,00,000 per year",
                location: "Bangalore",
                jobType: "Full-time",
                experienceLevel: 3,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Cybersecurity Engineer",
                description: "Monitor and protect enterprise systems from cyber threats. Conduct penetration testing, risk assessment, and security audits.",
                requirements: ["Security", "Firewalls", "Penetration Testing", "Linux", "SIEM"],
                salary: "₹15,00,000 - ₹28,00,000 per year",
                location: "Delhi",
                jobType: "Full-time",
                experienceLevel: 4,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Blockchain Developer",
                description: "Develop smart contracts and decentralized applications using Ethereum and Solidity. Improve blockchain infrastructure and scalability.",
                requirements: ["Solidity", "Ethereum", "Smart Contracts", "Web3.js", "Cryptography"],
                salary: "₹18,00,000 - ₹32,00,000 per year",
                location: "Remote",
                jobType: "Full-time",
                experienceLevel: 4,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Game Developer",
                description: "Create 2D and 3D games using Unity. Work with designers and artists to bring immersive game experiences to life.",
                requirements: ["Unity", "C#", "Game Physics", "3D Modeling", "Animation"],
                salary: "₹8,00,000 - ₹16,00,000 per year",
                location: "Hyderabad",
                jobType: "Full-time",
                experienceLevel: 2,
                position: 3,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "System Administrator",
                description: "Manage enterprise servers, backups, monitoring systems, and automate administrative tasks.",
                requirements: ["Linux", "Windows Server", "Networking", "Shell Scripting", "Monitoring Tools"],
                salary: "₹6,00,000 - ₹12,00,000 per year",
                location: "Pune",
                jobType: "Full-time",
                experienceLevel: 3,
                position: 2,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Technical Support Engineer",
                description: "Provide support for software products, troubleshoot issues, and interact with clients for resolutions.",
                requirements: ["Troubleshooting", "Networking", "Customer Support", "Linux", "Ticketing Systems"],
                salary: "₹4,00,000 - ₹7,00,000 per year",
                location: "Gurgaon",
                jobType: "Full-time",
                experienceLevel: 1,
                position: 4,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "QA Engineer",
                description: "Perform manual and automated testing for web and mobile applications. Ensure high-quality product releases.",
                requirements: ["Selenium", "Manual Testing", "Automation", "Jira", "API Testing"],
                salary: "₹6,00,000 - ₹12,00,000 per year",
                location: "Bangalore",
                jobType: "Full-time",
                experienceLevel: 2,
                position: 2,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Automation Tester",
                description: "Develop and maintain automated test scripts for frontend and backend applications.",
                requirements: ["Selenium", "Python", "TestNG", "Postman", "CI/CD"],
                salary: "₹8,00,000 - ₹14,00,000 per year",
                location: "Chennai",
                jobType: "Full-time",
                experienceLevel: 3,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "IT Support Executive",
                description: "Resolve technical issues, install software, and maintain IT assets across the organization.",
                requirements: ["Hardware Support", "Windows", "Networking", "Troubleshooting", "ITIL"],
                salary: "₹3,50,000 - ₹6,00,000 per year",
                location: "Mumbai",
                jobType: "Full-time",
                experienceLevel: 1,
                position: 2,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Research Analyst",
                description: "Conduct market research, gather insights, analyze competition, and prepare detailed reports.",
                requirements: ["Research", "Excel", "PowerPoint", "Data Analysis", "Communication"],
                salary: "₹5,00,000 - ₹9,00,000 per year",
                location: "Delhi",
                jobType: "Full-time",
                experienceLevel: 1,
                position: 3,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Supply Chain Manager",
                description: "Optimize logistics, vendor management, procurement, and inventory operations.",
                requirements: ["Supply Chain", "Logistics", "Vendor Management", "Forecasting", "SAP"],
                salary: "₹10,00,000 - ₹18,00,000 per year",
                location: "Pune",
                jobType: "Full-time",
                experienceLevel: 5,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Business Analyst",
                description: "Bridge the gap between technical and business teams. Collect requirements and propose effective solutions.",
                requirements: ["Business Analysis", "SQL", "Documentation", "Communication", "Agile"],
                salary: "₹7,00,000 - ₹14,00,000 per year",
                location: "Bangalore",
                jobType: "Full-time",
                experienceLevel: 3,
                position: 2,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Scrum Master",
                description: "Lead agile ceremonies, remove blockers, and ensure smooth delivery of sprints.",
                requirements: ["Scrum", "Agile", "Jira", "Leadership", "Communication"],
                salary: "₹12,00,000 - ₹20,00,000 per year",
                location: "Hyderabad",
                jobType: "Full-time",
                experienceLevel: 4,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Database Administrator",
                description: "Manage MySQL and MongoDB databases, ensure performance, backups, and security.",
                requirements: ["MySQL", "MongoDB", "Backup", "Optimization", "Linux"],
                salary: "₹10,00,000 - ₹18,00,000 per year",
                location: "Chennai",
                jobType: "Full-time",
                experienceLevel: 4,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Network Engineer",
                description: "Manage routers, switches, firewalls, and enterprise network configurations.",
                requirements: ["Networking", "Cisco", "LAN/WAN", "Firewall", "VPN"],
                salary: "₹6,00,000 - ₹12,00,000 per year",
                location: "Mumbai",
                jobType: "Full-time",
                experienceLevel: 2,
                position: 2,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Social Media Manager",
                description: "Manage social media campaigns, strategy, branding, and analytics across all platforms.",
                requirements: ["Social Media", "Branding", "Content Strategy", "Analytics", "Communication"],
                salary: "₹6,00,000 - ₹12,00,000 per year",
                location: "Remote",
                jobType: "Full-time",
                experienceLevel: 2,
                position: 1,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Copywriter",
                description: "Write compelling ad copy, website content, and marketing materials for various campaigns.",
                requirements: ["Copywriting", "Creative Writing", "SEO", "Grammar", "Storytelling"],
                salary: "₹4,00,000 - ₹7,00,000 per year",
                location: "Delhi",
                jobType: "Full-time",
                experienceLevel: 1,
                position: 2,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Video Editor",
                description: "Edit videos for marketing campaigns, YouTube, and brand promotions using advanced editing tools.",
                requirements: ["Premiere Pro", "After Effects", "Editing", "Color Grading", "Motion Graphics"],
                salary: "₹5,00,000 - ₹10,00,000 per year",
                location: "Mumbai",
                jobType: "Full-time",
                experienceLevel: 2,
                position: 3,
                created_by: { connect: { id: employer.id } }
            },
            {
                title: "Office Administrator",
                description: "Handle office operations, vendor coordination, scheduling, and administrative tasks.",
                requirements: ["Administration", "Coordination", "Communication", "MS Office", "Organization"],
                salary: "₹3,00,000 - ₹5,00,000 per year",
                location: "Bangalore",
                jobType: "Full-time",
                experienceLevel: 1,
                position: 2,
                created_by: { connect: { id: employer.id } }
            }

        ];

        for (const jobData of jobsData) {
            const job = await prisma.job.create({
                data: jobData
            });
            console.log(`Created: ${job.title} (${job.location})`);
        }

        console.log(`\n✨ Successfully created ${jobsData.length} jobs!`);

    } catch (error) {
        console.error(' Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearAndSeedJobs();
