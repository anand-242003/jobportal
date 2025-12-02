// Script to remove duplicate users, keeping the oldest one
import prisma from '../src/config/db.js';

async function removeDuplicates() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'asc' }
        });

        const emailMap = new Map();
        const phoneMap = new Map();
        const toDelete = [];

        users.forEach(user => {
            // Check email duplicates
            if (emailMap.has(user.email)) {
                // This is a duplicate, mark for deletion
                toDelete.push(user.id);
                console.log(`Marking duplicate for deletion: ${user.id} (email: ${user.email})`);
            } else {
                emailMap.set(user.email, user.id);
            }

            // Check phone duplicates
            if (phoneMap.has(user.phoneNumber)) {
                if (!toDelete.includes(user.id)) {
                    toDelete.push(user.id);
                    console.log(`Marking duplicate for deletion: ${user.id} (phone: ${user.phoneNumber})`);
                }
            } else {
                phoneMap.set(user.phoneNumber, user.id);
            }
        });

        console.log(`\nFound ${toDelete.length} duplicate users to delete`);

        if (toDelete.length > 0) {
            // Delete duplicates
            const result = await prisma.user.deleteMany({
                where: {
                    id: { in: toDelete }
                }
            });

            console.log(`\nDeleted ${result.count} duplicate users`);
        }

        console.log('Cleanup complete!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

removeDuplicates();
