/**
 * CLOUD FUNCTION FOR EMAIL AUTOMATION
 * ===================================
 * This function triggers when a member document is updated in Firestore.
 * If status changes to 'approved', it sends a welcome email with the IOT ID.
 * 
 * SETUP:
 * 1. Initialize Firebase Functions: `firebase init functions`
 * 2. Install Nodemailer: `npm install nodemailer`
 * 3. Configure Gmail/SMTP: Enable "App Passwords" in Google Account.
 * 
 * DEPLOY: `firebase deploy --only functions`
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure Transporter (Use Environment Variables in Production!)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // REPLACE WITH CLUB EMAIL
        pass: 'your-app-password'      // REPLACE WITH APP PASSWORD
    }
});

exports.sendMembershipEmail = functions.firestore
    .document('members/{memberId}')
    .onUpdate(async (change, context) => {
        const newValue = change.after.data();
        const previousValue = change.before.data();

        // Check if status changed to 'approved'
        if (newValue.status === 'approved' && previousValue.status !== 'approved') {
            const email = newValue.email;
            const name = newValue.fullName;
            const membershipId = newValue.membershipId;

            const mailOptions = {
                from: 'IoT Club <admin@iotclub.com>',
                to: email,
                subject: 'Welcome to IoT Club - Membership Approved!',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h1 style="color: #00f3ff;">Welcome to the IoT Club! 🚀</h1>
                        <p>Hi <strong>${name}</strong>,</p>
                        <p>Your membership validation is complete. We are excited to have you on board.</p>
                        
                        <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Membership ID:</strong> <span style="font-size: 1.2em; color: #000;">${membershipId}</span></p>
                        </div>
                        
                        <p>You can now log in to the lending platform and access our resources.</p>
                        <p>Best Regards,<br>IoT Club Execom</p>
                    </div>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${email}`);
                // Optional: Update doc to say email sent
            } catch (error) {
                console.error('Error sending email:', error);
            }
        }
    });
