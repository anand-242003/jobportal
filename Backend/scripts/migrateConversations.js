import prisma from "../src/config/db.js";

/**
 * Migration script to add initiatedBy field to existing conversations
 * This sets the initiatedBy to user1Id for all existing conversations
 */
async function migrateConversations() {
    try {
        console.log("🔄 Starting conversation migration...");

        // Find all conversations without initiatedBy
        const conversations = await prisma.conversation.findMany({
            where: {
                initiatedBy: null
            },
            include: {
                user1: { select: { role: true } },
                user2: { select: { role: true } }
            }
        });

        console.log(`📊 Found ${conversations.length} conversations to migrate`);

        let updated = 0;
        for (const conv of conversations) {
            // Set initiatedBy to the employer/admin if one exists, otherwise user1
            let initiator = conv.user1Id;
            
            if (conv.user1.role === 'Employer' || conv.user1.role === 'Admin') {
                initiator = conv.user1Id;
            } else if (conv.user2.role === 'Employer' || conv.user2.role === 'Admin') {
                initiator = conv.user2Id;
            }

            await prisma.conversation.update({
                where: { id: conv.id },
                data: { initiatedBy: initiator }
            });

            updated++;
            console.log(`✅ Updated conversation ${conv.id} (${updated}/${conversations.length})`);
        }

        console.log(`\n✨ Migration complete! Updated ${updated} conversations.`);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run migration
migrateConversations()
    .then(() => {
        console.log("✅ Migration script completed successfully");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Migration script failed:", error);
        process.exit(1);
    });
