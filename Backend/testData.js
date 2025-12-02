import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkData() {
  console.log("🔍 Checking database data...\n");

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: "employer1@company.com" },
        { email: "john.doe@student.com" },
        { email: "jane.smith@student.com" },
      ],
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
    },
  });

  console.log("👥 Users:");
  users.forEach((u) => console.log(`   - ${u.email} (${u.role})`));

  const jobs = await prisma.job.findMany({
    where: {
      createdById: users.find((u) => u.role === "Employer")?.id,
    },
    select: {
      id: true,
      title: true,
      createdById: true,
    },
  });

  console.log("\n💼 Jobs:");
  jobs.forEach((j) => console.log(`   - ${j.title} (ID: ${j.id})`));

  const applications = await prisma.application.findMany({
    where: {
      jobId: { in: jobs.map((j) => j.id) },
    },
    include: {
      applicant: {
        select: { fullName: true, email: true },
      },
      job: {
        select: { title: true },
      },
    },
  });

  console.log("\n📝 Applications:");
  applications.forEach((a) =>
    console.log(
      `   - ${a.applicant.fullName} → ${a.job.title} [${a.status}] (ID: ${a.id})`
    )
  );

  console.log("\n✅ Data check complete!");
  console.log(
    `\n📊 Summary: ${users.length} users, ${jobs.length} jobs, ${applications.length} applications`
  );

  await prisma.$disconnect();
}

checkData().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
