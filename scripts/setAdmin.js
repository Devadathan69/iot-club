import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFile } from 'fs/promises';

// Usage: node scripts/setAdmin.js <email>

async function setAdmin() {
    const email = process.argv[2];
    if (!email) {
        console.error('Please provide an email address.');
        process.exit(1);
    }

    try {
        // Read service account key
        const serviceAccount = JSON.parse(
            await readFile(new URL('./serviceAccountKey.json', import.meta.url))
        );

        initializeApp({
            credential: cert(serviceAccount)
        });

        const user = await getAuth().getUserByEmail(email);

        // Set admin claim
        await getAuth().setCustomUserClaims(user.uid, { admin: true });

        console.log(`Successfully promoted ${email} to ADMIN.`);
        console.log('User needs to sign out and sign in again for changes to take effect.');
        process.exit(0);

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('Error: "scripts/serviceAccountKey.json" not found.');
            console.error('Please download it from Firebase Console > Project Settings > Service accounts.');
        } else {
            console.error('Error setting admin claim:', error);
        }
        process.exit(1);
    }
}

setAdmin();
