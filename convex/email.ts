"use node";
import { Resend } from "resend";
import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Initialize Resend with API Key from Env
// Make sure to set RESEND_API_KEY in Convex Dashboard
const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "sab.mma.org.my@gmail.com"; // Replace with actual admin email
const FROM_EMAIL = "SAB2026 Support <onboarding@resend.dev>"; // Update with your verified domain later

// 1. Send Thank You Email to Donor (HitPay Success)
export const sendThankYou = internalAction({
    args: {
        email: v.string(),
        name: v.string(),
        amount: v.number(),
        ref: v.string(),
    },
    handler: async (ctx, args) => {
        if (!process.env.RESEND_API_KEY) {
            console.log("Skipping email: No RESEND_API_KEY set");
            return;
        }

        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: args.email,
                subject: `Thank You for Your Donation to SAB2026! (Ref: ${args.ref})`,
                html: `
                    <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
                        <h1 style="color: #0F172A;">Thank You, ${args.name}!</h1>
                        <p style="font-size: 16px; color: #334155;">
                            We successfully received your donation of <strong>RM ${args.amount.toFixed(2)}</strong>.
                        </p>
                        <p style="font-size: 16px; color: #334155;">
                            Your contribution directly funds life-saving surgeries for children in Borneo. 
                            An official tax-exemption receipt will be issued within 24 hours.
                        </p>
                        <div style="background: #F1F5F9; padding: 20px; border-radius: 12px; margin: 24px 0;">
                            <p style="margin: 0; font-size: 14px; color: #64748B;">Reference ID:</p>
                            <p style="margin: 4px 0 0; font-family: monospace; font-size: 18px; color: #0F172A;">${args.ref}</p>
                        </div>
                        <p style="font-size: 14px; color: #94A3B8;">
                            Semparuh Amal Borneo 2026<br/>
                            Malaysian Medical Association Foundation
                        </p>
                    </div>
                `,
            });
            console.log(`Email sent to ${args.email}`);
        } catch (error) {
            console.error("Failed to send thank you email:", error);
        }
    },
});

// 2. Send Admin Notification (HitPay Success)
export const sendAdminHitPayNotification = internalAction({
    args: {
        name: v.string(),
        amount: v.number(),
        ref: v.string(),
        email: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        if (!process.env.RESEND_API_KEY) return;

        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: ADMIN_EMAIL,
                subject: `[SAB2026] New HitPay Donation: RM ${args.amount.toFixed(2)}`,
                html: `
                    <h3>New Donation Received</h3>
                    <ul>
                        <li><strong>Amount:</strong> RM ${args.amount.toFixed(2)}</li>
                        <li><strong>Donor:</strong> ${args.name}</li>
                        <li><strong>Email:</strong> ${args.email || 'N/A'}</li>
                        <li><strong>Ref ID:</strong> ${args.ref}</li>
                        <li><strong>Status:</strong> <span style="color: green;">PAID</span></li>
                    </ul>
                `
            });
        } catch (e) {
            console.error("Failed to notify admin:", e);
        }
    }
});

// 3. Send Admin Notification (Manual Transfer)
export const sendAdminManualNotification = internalAction({
    args: {
        name: v.string(),
        amount: v.number(),
        phone: v.string(),
        ref: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        if (!process.env.RESEND_API_KEY) return;

        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: ADMIN_EMAIL,
                subject: `[SAB2026] ⚠️ Manual Transfer Pending: RM ${args.amount.toFixed(2)}`,
                html: `
                    <h3>New Manual Donation (Pending verification)</h3>
                    <ul>
                        <li><strong>Amount:</strong> RM ${args.amount.toFixed(2)}</li>
                        <li><strong>Donor:</strong> ${args.name}</li>
                        <li><strong>Phone:</strong> <a href="https://wa.me/${args.phone.replace(/[^0-9]/g, '')}">${args.phone}</a></li>
                        <li><strong>Ref:</strong> ${args.ref || 'N/A'}</li>
                    </ul>
                    <p style="background: #FFF7ED; padding: 15px; border-left: 4px solid #F97316;">
                        <strong>Action Required:</strong><br/>
                        Donor instructed to send receipt via WhatsApp.<br/>
                        1. Check Bank Account.<br/>
                        2. Verify Receipt.<br/>
                        3. Issue Tax Receipt manually.
                    </p>
                `
            });
        } catch (e) {
            console.error("Failed to notify admin (manual):", e);
        }
    }
});
