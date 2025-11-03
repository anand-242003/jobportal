import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const newUser = await prisma.user.create({
    data: {
      fullName: "Anand Mishra",
      email: "Anandmishra1212@gamil.com",
      password: "aandmoshra@12345",
      phoneNumber: "9137612984",
      role: "Seeker",
      skills: ["react", "js", "node", "prisma"],
    },
  });
  console.log("Created User:", newUser);
}
main().catch(console.error()).finally(()=>prisma.$disconnect())
