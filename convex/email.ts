"use node";
import { Resend } from "resend";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";

const ADMIN_EMAIL = "sab2026@mma.org.my";
const FROM_EMAIL  = "SAB2026 <noreply@sab.mma.org.my>";
const SITE_URL    = "https://sab.mma.org.my";

// ─── Shared layout wrapper ─────────────────────────────────────────────────────
function layout(body: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SAB2026</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0F172A;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:26px;font-weight:900;letter-spacing:-0.5px;color:#FFFFFF;">
                SEMPARUH AMAL<br/>
                <span style="color:#00AEEF;">BORNEO 2026</span>
              </h1>
              <p style="margin:6px 0 0;font-size:11px;letter-spacing:3px;color:rgba(255,255,255,0.4);text-transform:uppercase;">Malaysian Medical Association Foundation</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F1F5F9;padding:24px 40px;text-align:center;border-top:1px solid #E2E8F0;">
              <p style="margin:0 0 6px;font-size:12px;color:#94A3B8;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                Semparuh Amal Borneo 2026
              </p>
              <p style="margin:0;font-size:11px;color:#CBD5E1;">
                Malaysian Medical Association Foundation &nbsp;·&nbsp;
                <a href="${SITE_URL}" style="color:#00AEEF;text-decoration:none;">${SITE_URL}</a>
              </p>
              <p style="margin:8px 0 0;font-size:10px;color:#CBD5E1;">
                This email was sent automatically. Please do not reply directly to this message.<br/>
                For enquiries, contact <a href="mailto:${ADMIN_EMAIL}" style="color:#00AEEF;">${ADMIN_EMAIL}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Reusable UI blocks ────────────────────────────────────────────────────────

function infoRow(label: string, value: string): string {
    return `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;">
        <span style="font-size:11px;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;font-weight:700;">${label}</span><br/>
        <span style="font-size:15px;color:#0F172A;font-weight:700;">${value}</span>
      </td>
    </tr>`;
}

function ctaButton(label: string, url: string): string {
    return `<table cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr>
        <td style="background:#00AEEF;border-radius:12px;padding:14px 32px;">
          <a href="${url}" style="color:#0F172A;font-size:15px;font-weight:900;text-decoration:none;letter-spacing:0.5px;text-transform:uppercase;">${label}</a>
        </td>
      </tr>
    </table>`;
}

function alertBox(text: string, color = "#F97316"): string {
    return `<div style="background:#FFF7ED;border-left:4px solid ${color};border-radius:0 12px 12px 0;padding:16px 20px;margin:20px 0;">
      <p style="margin:0;font-size:13px;color:#7C3D00;font-weight:700;line-height:1.6;">${text}</p>
    </div>`;
}

// ─── Template 1: Donor Thank You (HitPay – Online) ────────────────────────────

export const sendThankYou = internalAction({
    args: {
        email:  v.string(),
        name:   v.string(),
        amount: v.number(),
        ref:    v.string(),
    },
    handler: async (_, args) => {
        if (!process.env.RESEND_API_KEY) {
            console.log("[Email] Skipped sendThankYou — no RESEND_API_KEY");
            return;
        }
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fmtAmount = `RM ${args.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;

        const body = `
          <h2 style="margin:0 0 4px;font-size:28px;font-weight:900;color:#0F172A;letter-spacing:-0.5px;">
            Thank You,<br/>${args.name}!
          </h2>
          <p style="margin:8px 0 28px;font-size:14px;color:#64748B;">Your donation has been received and confirmed.</p>

          <!-- Amount highlight -->
          <div style="background:linear-gradient(135deg,#0F172A,#1E293B);border-radius:16px;padding:28px 32px;margin-bottom:28px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:2px;font-weight:700;">Confirmed Donation</p>
            <p style="margin:0;font-size:42px;font-weight:900;color:#00AEEF;letter-spacing:-1px;">${fmtAmount}</p>
          </div>

          <!-- Details table -->
          <table width="100%" cellpadding="0" cellspacing="0">
            ${infoRow("Donor Name", args.name)}
            ${infoRow("Reference ID", args.ref)}
            ${infoRow("Status", "✅ Payment Confirmed")}
          </table>

          <p style="margin:28px 0 12px;font-size:15px;color:#334155;line-height:1.7;">
            Your generous contribution directly helps fund <strong>life-saving surgeries for children in Borneo</strong>
            through the Semparuh Amal Borneo 2026 cycling initiative.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7;">
            An official <strong>tax-exemption receipt</strong> will be issued within <strong>3–5 working days</strong>.
            Please keep this email as proof of your donation.
          </p>

          ${ctaButton("Visit SAB2026", SITE_URL)}

          <p style="margin:16px 0 0;font-size:13px;color:#94A3B8;">
            Share this mission with your network and help us go further — every contribution counts. 🚴
          </p>
        `;

        try {
            await resend.emails.send({
                from:    FROM_EMAIL,
                to:      args.email,
                subject: `✅ Donation Confirmed — ${fmtAmount} | SAB2026 (Ref: ${args.ref})`,
                html:    layout(body),
            });
            console.log(`[Email] Thank you sent to ${args.email}`);
        } catch (err) {
            console.error("[Email] Failed sendThankYou:", err);
        }
    },
});

// ─── Template 2: Donor Manual Submission Received ─────────────────────────────

export const sendManualSubmissionConfirmation = internalAction({
    args: {
        email:     v.string(),
        name:      v.string(),
        amount:    v.number(),
        ref:       v.string(),
        beneficiary: v.optional(v.string()), // cyclist name or 'General Fund'
    },
    handler: async (_, args) => {
        if (!process.env.RESEND_API_KEY) {
            console.log("[Email] Skipped sendManualSubmissionConfirmation — no RESEND_API_KEY");
            return;
        }
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fmtAmount  = `RM ${args.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;
        const beneficiary = args.beneficiary || "General Fund (SAB2026)";

        const body = `
          <h2 style="margin:0 0 4px;font-size:28px;font-weight:900;color:#0F172A;letter-spacing:-0.5px;">
            We've Received<br/>Your Transfer Details
          </h2>
          <p style="margin:8px 0 28px;font-size:14px;color:#64748B;">
            Your manual bank transfer donation is now <strong>pending verification</strong>.
          </p>

          ${alertBox("⏳ <strong>Pending Verification</strong> — Our team will verify your bank transfer within 1–2 working days. You will receive a confirmation email once approved.")}

          <!-- Details table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
            ${infoRow("Donor Name", args.name)}
            ${infoRow("Donation Amount", fmtAmount)}
            ${infoRow("Supporting", beneficiary)}
            ${infoRow("Reference ID", args.ref)}
            ${infoRow("Transfer To", "UOB Malaysia — MMA Foundation (2403057985)")}
          </table>

          <p style="margin:20px 0 12px;font-size:15px;color:#334155;line-height:1.7;">
            <strong>Next Steps:</strong>
          </p>
          <ol style="margin:0;padding-left:20px;font-size:14px;color:#334155;line-height:2;">
            <li>Complete your bank transfer to <strong>UOB Malaysia, MMA Foundation (Acc: 2403057985)</strong>.</li>
            <li>Send your payment receipt to our team via WhatsApp or email it to <a href="mailto:${ADMIN_EMAIL}" style="color:#00AEEF;">${ADMIN_EMAIL}</a> with the subject <em>"SAB2026 Manual Receipt — ${args.ref}"</em>.</li>
            <li>Our team will verify and send you an official tax-exemption receipt within 3–5 working days of approval.</li>
          </ol>

          ${ctaButton("View SAB2026", SITE_URL)}

          <p style="margin:16px 0 0;font-size:12px;color:#94A3B8;">
            If you believe this was submitted in error, please contact us at
            <a href="mailto:${ADMIN_EMAIL}" style="color:#00AEEF;">${ADMIN_EMAIL}</a>.
          </p>
        `;

        try {
            await resend.emails.send({
                from:    FROM_EMAIL,
                to:      args.email,
                subject: `⏳ Manual Donation Received — ${fmtAmount} | SAB2026 (Ref: ${args.ref})`,
                html:    layout(body),
            });
            console.log(`[Email] Manual submission confirmation sent to ${args.email}`);
        } catch (err) {
            console.error("[Email] Failed sendManualSubmissionConfirmation:", err);
        }
    },
});

// ─── Template 3: Donor Manual Approved ───────────────────────────────────────

export const sendManualApproved = internalAction({
    args: {
        email:   v.string(),
        name:    v.string(),
        amount:  v.number(),
        ref:     v.string(),
        beneficiary: v.optional(v.string()),
    },
    handler: async (_, args) => {
        if (!process.env.RESEND_API_KEY) {
            console.log("[Email] Skipped sendManualApproved — no RESEND_API_KEY");
            return;
        }
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fmtAmount  = `RM ${args.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;
        const beneficiary = args.beneficiary || "General Fund (SAB2026)";

        const body = `
          <h2 style="margin:0 0 4px;font-size:28px;font-weight:900;color:#0F172A;letter-spacing:-0.5px;">
            Donation Approved!<br/>Thank You, ${args.name}!
          </h2>
          <p style="margin:8px 0 28px;font-size:14px;color:#64748B;">
            Your bank transfer has been verified and your donation is now confirmed.
          </p>

          <!-- Amount highlight -->
          <div style="background:linear-gradient(135deg,#0F172A,#1E293B);border-radius:16px;padding:28px 32px;margin-bottom:28px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:2px;font-weight:700;">Verified Donation</p>
            <p style="margin:0;font-size:42px;font-weight:900;color:#00AEEF;letter-spacing:-1px;">${fmtAmount}</p>
            <p style="margin:8px 0 0;font-size:13px;color:#F97316;font-weight:700;text-transform:uppercase;letter-spacing:1px;">✅ Approved</p>
          </div>

          <!-- Details table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            ${infoRow("Donor Name", args.name)}
            ${infoRow("Supporting", beneficiary)}
            ${infoRow("Reference ID", args.ref)}
            ${infoRow("Status", "✅ Verified & Approved")}
          </table>

          <p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.7;">
            Your contribution is now reflected in the <strong>SAB2026 fundraising total</strong>
            and will directly support life-saving surgeries for children in Borneo.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7;">
            An official <strong>tax-exemption receipt</strong> will be issued within <strong>3–5 working days</strong>.
          </p>

          ${ctaButton("See the Live Progress", SITE_URL)}
        `;

        try {
            await resend.emails.send({
                from:    FROM_EMAIL,
                to:      args.email,
                subject: `✅ Bank Transfer Approved — ${fmtAmount} | SAB2026 Thank You!`,
                html:    layout(body),
            });
            console.log(`[Email] Approval confirmation sent to ${args.email}`);
        } catch (err) {
            console.error("[Email] Failed sendManualApproved:", err);
        }
    },
});

// ─── Template 4: Admin — New HitPay Donation ──────────────────────────────────

export const sendAdminHitPayNotification = internalAction({
    args: {
        name:   v.string(),
        amount: v.number(),
        ref:    v.string(),
        email:  v.optional(v.string()),
    },
    handler: async (_, args) => {
        if (!process.env.RESEND_API_KEY) return;
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fmtAmount = `RM ${args.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;

        const body = `
          <h2 style="margin:0 0 4px;font-size:24px;font-weight:900;color:#0F172A;">
            💳 New Online Donation Received
          </h2>
          <p style="margin:8px 0 24px;font-size:14px;color:#64748B;">A HitPay payment has been confirmed via webhook.</p>

          <div style="background:#ECFDF5;border:1px solid #6EE7B7;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
            <p style="margin:0 0 4px;font-size:12px;color:#065F46;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Amount Received</p>
            <p style="margin:0;font-size:36px;font-weight:900;color:#065F46;">${fmtAmount}</p>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0">
            ${infoRow("Donor Name", args.name)}
            ${infoRow("Donor Email", args.email || "Not provided")}
            ${infoRow("HitPay Reference", args.ref)}
            ${infoRow("Status", "✅ Paid & Confirmed (Webhook)")}
          </table>

          <p style="margin:24px 0 8px;font-size:13px;color:#94A3B8;">
            This donation has been automatically recorded and is included in the live fundraising total.
            No admin action required.
          </p>
          ${ctaButton("Open Admin Dashboard", "https://sab.mma.org.my/nadi-sab/donations")}
        `;

        try {
            await resend.emails.send({
                from:    FROM_EMAIL,
                to:      ADMIN_EMAIL,
                subject: `[SAB2026] 💳 New HitPay Donation — ${fmtAmount} from ${args.name}`,
                html:    layout(body),
            });
        } catch (err) {
            console.error("[Email] Failed sendAdminHitPayNotification:", err);
        }
    },
});

// ─── Template 5: Admin — Manual Transfer Pending Verification ─────────────────

export const sendAdminManualNotification = internalAction({
    args: {
        name:   v.string(),
        amount: v.number(),
        phone:  v.string(),
        ref:    v.optional(v.string()),
    },
    handler: async (_, args) => {
        if (!process.env.RESEND_API_KEY) return;
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fmtAmount  = `RM ${args.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;
        const waNumber   = args.phone.replace(/[^0-9]/g, "");
        const waUrl      = `https://wa.me/${waNumber}`;
        const adminUrl   = "https://sab.mma.org.my/nadi-sab/donations";

        const body = `
          <h2 style="margin:0 0 4px;font-size:24px;font-weight:900;color:#0F172A;">
            ⏳ Manual Transfer — Action Required
          </h2>
          <p style="margin:8px 0 24px;font-size:14px;color:#64748B;">
            A donor has submitted a manual bank transfer and is sending their receipt.
          </p>

          <div style="background:#FFF7ED;border:1px solid #FCD34D;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
            <p style="margin:0 0 4px;font-size:12px;color:#92400E;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Pending Verification</p>
            <p style="margin:0;font-size:36px;font-weight:900;color:#92400E;">${fmtAmount}</p>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0">
            ${infoRow("Donor Name", args.name)}
            ${infoRow("Phone / WhatsApp", args.phone)}
            ${infoRow("Reference", args.ref || "Not provided")}
            ${infoRow("Status", "⏳ Awaiting Bank Verification")}
          </table>

          ${alertBox(`
            <strong>Action Required:</strong><br/>
            1. Check UOB Malaysia account (Acc: 2403057985) for a RM ${args.amount.toFixed(2)} transfer.<br/>
            2. Confirm receipt matches the donor's details.<br/>
            3. Approve or Reject the donation in the admin dashboard.<br/>
            4. Issue tax-exemption receipt manually once approved.
          `)}

          <table cellpadding="0" cellspacing="0" style="margin:16px 0 8px;">
            <tr>
              <td style="padding-right:12px;">
                <a href="${waUrl}" style="display:inline-block;background:#25D366;color:#FFFFFF;font-size:13px;font-weight:900;text-decoration:none;padding:12px 24px;border-radius:10px;letter-spacing:0.5px;">
                  💬 WhatsApp ${args.name}
                </a>
              </td>
              <td>
                <a href="${adminUrl}" style="display:inline-block;background:#0F172A;color:#00AEEF;font-size:13px;font-weight:900;text-decoration:none;padding:12px 24px;border-radius:10px;letter-spacing:0.5px;">
                  Open Admin Dashboard →
                </a>
              </td>
            </tr>
          </table>
        `;

        try {
            await resend.emails.send({
                from:    FROM_EMAIL,
                to:      ADMIN_EMAIL,
                subject: `[SAB2026] ⚠️ Manual Transfer Pending — ${fmtAmount} from ${args.name}`,
                html:    layout(body),
            });
        } catch (err) {
            console.error("[Email] Failed sendAdminManualNotification:", err);
        }
    },
});
