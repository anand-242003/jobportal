// Script to find and remove duplicate users by email
import prisma from '../src/config/db.js';

async function findDuplicates() {
    try {
        const users = await prisma.user.findMany();

        const emailMap = new Map();
        const duplicates = [];

        users.forEach(user => {
            if (emailMap.has(user.email)) {
                duplicates.push({
                    email: user.email,
                    ids: [emailMap.get(user.email), user.id]
                });
            } else {
                emailMap.set(user.email, user.id);
            }
        });

        console.log('Duplicate users found:', duplicates);

        // List all users with the duplicate email
        if (duplicates.length > 0) {
            for (const dup of duplicates) {
                const users = await prisma.user.findMany({
                    where: { email: dup.email }
                });
                console.log(`\nUsers with email ${dup.email}:`);
                users.forEach(u => {
                    console.log(`  ID: ${u.id}, Name: ${u.fullName}, Created: ${u.createdAt}`);
                });
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

findDuplicates();
