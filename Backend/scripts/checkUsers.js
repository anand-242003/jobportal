import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log("🔍 Checking users in database...\n");
    
    const testEmails = [
      "hr@techcorp.com",
      "john.developer@email.com"
    ];
    
    for (const email of testEmails) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          password: true
        }
      });
      
      if (user) {
        console.log(`✅ Found: ${email}`);
        console.log(`   Name: ${user.fullName}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Has password: ${user.password ? 'Yes' : 'No'}`);
        console.log(`   Password hash length: ${user.password?.length || 0}\n`);
      } else {
        console.log(`❌ Not found: ${email}\n`);
      }
    }
    
    const totalUsers = await prisma.user.count();
    console.log(`📊 Total users in database: ${totalUsers}`);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
