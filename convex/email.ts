"use node";
import { internalAction, action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";


const ADMIN_EMAIL = "mmafoundation1976@gmail.com";
const FROM_EMAIL  = "mmafoundation1976@gmail.com";
const FROM_NAME   = "SAB2026 — MMA Foundation";
const SITE_URL    = "https://sab.mma.org.my";

const ENGINEMAILER_ENDPOINT =
    "https://api.enginemailer.com/RESTAPI/V2/Submission/SendEmail";

// ─── EngineMailer HTTP client ──────────────────────────────────────────────────

async function sendEmail({
    toEmail,
    subject,
    htmlContent,
    tags = [],
    ccEmails,
    templateId,
}: {
    toEmail: string;
    subject: string;
    htmlContent: string;
    tags?: Array<{ Key: string; Value: string }>;
    ccEmails?: string[];
    templateId?: string;
}): Promise<void> {
    const apiKey = process.env.ENGINEMAILER_API_KEY;
    console.log(
        `[Email] Auth: Source=ENGINEMAILER_API_KEY, Length=${apiKey ? apiKey.length : 0}, Masked=${apiKey ? apiKey.slice(0, 4) + "..." + apiKey.slice(-4) : "none"}`
    );
    if (!apiKey) {
        console.log("[Email] Skipped — no ENGINEMAILER_API_KEY set");
        return;
    }

    const payload: Record<string, unknown> = {
        CampaignName:    `SAB2026 Transactional`,
        ToEmail:         toEmail,
        SenderEmail:     FROM_EMAIL,
        SubstitutionTags: tags || [],
        Attachments:      [],
    };

    if (templateId) {
        payload.TemplateId = templateId;
    } else {
        payload.Subject = subject;
        payload.SenderName = FROM_NAME;
        payload.SubmittedContent = htmlContent;
    }

    if (ccEmails && ccEmails.length > 0) {
        payload.CCEmails = ccEmails;
    }

    const res = await fetch(ENGINEMAILER_ENDPOINT, {
        method:  "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "APIKey": apiKey,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`[Email] HTTP error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
        Result?: {
            Status?: string;
            StatusCode?: string;
            ErrorMessage?: string;
            TransactionID?: string;
        };
    };

    const status = data?.Result?.Status;
    const statusCode = data?.Result?.StatusCode;
    const errorMessage = data?.Result?.ErrorMessage;

    if (statusCode !== "200" || status !== "OK") {
        throw new Error(
            `[Email] EngineMailer failure: Status=${status}, StatusCode=${statusCode}, Error=${errorMessage || "Unknown error"}`
        );
    }

    console.log(`[Email] Sent to ${toEmail} — ${subject} (TxID: ${data.Result?.TransactionID})`);
}

// Same as sendEmail but returns { transactionId } for logging
async function sendEmailWithTxId(args: {
    toEmail: string;
    subject: string;
    htmlContent: string;
    tags?: Array<{ Key: string; Value: string }>;
    ccEmails?: string[];
    templateId?: string;
}): Promise<{ transactionId?: string }> {
    const apiKey = process.env.ENGINEMAILER_API_KEY;
    if (!apiKey) {
        console.log("[Email] Skipped — no ENGINEMAILER_API_KEY set");
        return {};
    }

    const payload: Record<string, unknown> = {
        CampaignName:    `SAB2026 Transactional`,
        ToEmail:         args.toEmail,
        SenderEmail:     FROM_EMAIL,
        SubstitutionTags: args.tags || [],
        Attachments:      [],
    };

    if (args.templateId) {
        payload.TemplateId = args.templateId;
    } else {
        payload.Subject = args.subject;
        payload.SenderName = FROM_NAME;
        payload.SubmittedContent = args.htmlContent;
    }

    if (args.ccEmails && args.ccEmails.length > 0) {
        payload.CCEmails = args.ccEmails;
    }

    const res = await fetch(ENGINEMAILER_ENDPOINT, {
        method:  "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "APIKey": apiKey,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`[Email] HTTP error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
        Result?: {
            Status?: string;
            StatusCode?: string;
            ErrorMessage?: string;
            TransactionID?: string;
        };
    };

    const status = data?.Result?.Status;
    const statusCode = data?.Result?.StatusCode;
    const errorMessage = data?.Result?.ErrorMessage;

    if (statusCode !== "200" || status !== "OK") {
        throw new Error(
            `[Email] EngineMailer failure: Status=${status}, StatusCode=${statusCode}, Error=${errorMessage || "Unknown error"}`
        );
    }

    const txId = data.Result?.TransactionID;
    console.log(`[Email] Sent to ${args.toEmail} — ${args.subject} (TxID: ${txId})`);
    return { transactionId: txId };
}

async function sendRawEmail({
    toEmail,
    subject,
    html,
    apiKey,
    templateId,
}: {
    toEmail: string;
    subject: string;
    html: string;
    apiKey: string;
    templateId?: string;
}): Promise<void> {
    const payload: Record<string, unknown> = {
        CampaignName: "SAB2026 Transactional",
        ToEmail: toEmail,
        SenderEmail: FROM_EMAIL,
        SubstitutionTags: [],
        Attachments: [],
    };

    if (templateId) {
        payload.TemplateId = templateId;
    } else {
        payload.Subject = subject;
        payload.SenderName = FROM_NAME;
        payload.SubmittedContent = html;
    }

    const res = await fetch(ENGINEMAILER_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "APIKey": apiKey,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`[Email] HTTP error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
        Result?: {
            Status?: string;
            StatusCode?: string;
            ErrorMessage?: string;
            TransactionID?: string;
        };
    };

    const status = data?.Result?.Status;
    const statusCode = data?.Result?.StatusCode;
    const errorMessage = data?.Result?.ErrorMessage;

    if (statusCode !== "200" || status !== "OK") {
        throw new Error(
            `[Email] EngineMailer failure: Status=${status}, StatusCode=${statusCode}, Error=${errorMessage || "Unknown error"}`
        );
    }

    console.log(`[Email] Sent raw to ${toEmail} — ${subject} (TxID: ${data.Result?.TransactionID})`);
}

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
                SEPEDA AMAL<br/>
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
                Sepeda Amal Borneo 2026
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
        donationId: v.optional(v.string()),
        email:  v.string(),
        name:   v.string(),
        amount: v.number(),
        ref:    v.string(),
    },
    handler: async (ctx, args) => {
        const publicSettings = await ctx.runQuery(api.admin.getPublicSettings);
        const subjectSetting = publicSettings.find((s: any) => s.key === "email_subject_thank_you");
        const bodySetting    = publicSettings.find((s: any) => s.key === "email_body_thank_you");
        const templateIdSetting = publicSettings.find((s: any) => s.key === "email_template_id_thank_you");
        const templateId = templateIdSetting?.value || undefined;

        const fmtAmount = `RM ${args.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;

        let subject = subjectSetting?.value || "✅ Donation Confirmed — {amount} | SAB2026 (Ref: {ref})";
        subject = subject.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", args.ref).replaceAll("{name}", args.name);

        let message = bodySetting?.value || `Your generous contribution directly helps fund <strong>life-saving surgeries for children in Borneo</strong> through the Sepeda Amal Borneo 2026 cycling initiative.<br/><br/>An official <strong>tax-exemption receipt</strong> will be issued within <strong>30 days of verification</strong>. Please keep this email as proof of your donation.`;
        message = message.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", args.ref).replaceAll("{name}", args.name);

        const html = `
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

          <div style="margin:28px 0 24px;font-size:15px;color:#334155;line-height:1.7;">
            ${message}
          </div>

          ${ctaButton("Visit SAB2026", SITE_URL)}

          <p style="margin:16px 0 0;font-size:13px;color:#94A3B8;">
            Share this mission with your network and help us go further — every contribution counts. 🚴
          </p>
        `;

        let txId: string | undefined;
        try {
            const res = await sendEmailWithTxId({
                toEmail:     args.email,
                subject,
                htmlContent: layout(html),
                templateId,
                tags: [
                    { Key: "donor_name",  Value: args.name },
                    { Key: "amount",      Value: fmtAmount },
                    { Key: "ref",         Value: args.ref },
                ],
            });
            txId = res.transactionId;
            await ctx.runMutation(internal.emailLogs.logEmail, {
                donationId: args.donationId, templateId: "thank_you",
                toEmail: args.email, subject, status: "sent", transactionId: txId,
            });
        } catch (err: any) {
            console.error("[Email] Failed sendThankYou:", err);
            await ctx.runMutation(internal.emailLogs.logEmail, {
                donationId: args.donationId, templateId: "thank_you",
                toEmail: args.email, subject, status: "failed", errorMessage: String(err),
            });
        }
    },
});

// ─── Template 2: Donor Manual Submission Received ─────────────────────────────

export const sendManualSubmissionConfirmation = internalAction({
    args: {
        donationId:  v.optional(v.string()),
        email:       v.string(),
        name:        v.string(),
        amount:      v.number(),
        ref:         v.string(),
        beneficiary: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const publicSettings = await ctx.runQuery(api.admin.getPublicSettings);
        const subjectSetting = publicSettings.find((s: any) => s.key === "email_subject_manual_submitted");
        const bodySetting    = publicSettings.find((s: any) => s.key === "email_body_manual_submitted");
        const templateIdSetting = publicSettings.find((s: any) => s.key === "email_template_id_manual_submitted");
        const templateId = templateIdSetting?.value || undefined;

        const fmtAmount   = `RM ${args.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;
        const beneficiary = args.beneficiary || "General Fund (SAB2026)";

        let subject = subjectSetting?.value || "⏳ Manual Donation Received — {amount} | SAB2026 (Ref: {ref})";
        subject = subject.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", args.ref).replaceAll("{name}", args.name);

        let message = bodySetting?.value || `To complete your manual bank transfer donation, please make a transfer of <strong>{amount}</strong> to the MMA Foundation account:<br/><br/><strong>Bank Name:</strong> UOB Malaysia<br/><strong>Account Name:</strong> MMA Foundation<br/><strong>Account Number:</strong> 240305 7985<br/><br/>Once done, please reply to this email or send your receipt proof via WhatsApp.`;
        message = message.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", args.ref).replaceAll("{name}", args.name);

        const html = `
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

          <div style="margin:20px 0 24px;font-size:15px;color:#334155;line-height:1.7;">
            ${message}
          </div>

          <p style="margin:20px 0 12px;font-size:15px;color:#334155;line-height:1.7;font-weight:700;">
            Next Steps:
          </p>
          <ol style="margin:0;padding-left:20px;font-size:14px;color:#334155;line-height:2;">
            <li>Complete your bank transfer to <strong>UOB Malaysia, MMA Foundation (Acc: 2403057985)</strong>.</li>
            <li>Send your payment receipt to our team via WhatsApp or email it to <a href="mailto:${ADMIN_EMAIL}" style="color:#00AEEF;">${ADMIN_EMAIL}</a> with the subject <em>"SAB2026 Manual Receipt — ${args.ref}"</em>.</li>
            <li>Our team will verify and send you an official tax-exemption receipt within 30 days of verification.</li>
          </ol>

          ${ctaButton("View SAB2026", SITE_URL)}

          <p style="margin:16px 0 0;font-size:12px;color:#94A3B8;">
            If you believe this was submitted in error, please contact us at
            <a href="mailto:${ADMIN_EMAIL}" style="color:#00AEEF;">${ADMIN_EMAIL}</a>.
          </p>
        `;

        try {
            const res = await sendEmailWithTxId({
                toEmail:     args.email,
                subject,
                htmlContent: layout(html),
                templateId,
                tags: [
                    { Key: "donor_name",  Value: args.name },
                    { Key: "amount",      Value: fmtAmount },
                    { Key: "beneficiary", Value: beneficiary },
                    { Key: "ref",         Value: args.ref },
                ],
            });
            await ctx.runMutation(internal.emailLogs.logEmail, {
                donationId: args.donationId, templateId: "manual_submitted",
                toEmail: args.email, subject, status: "sent", transactionId: res.transactionId,
            });
        } catch (err: any) {
            console.error("[Email] Failed sendManualSubmissionConfirmation:", err);
            await ctx.runMutation(internal.emailLogs.logEmail, {
                donationId: args.donationId, templateId: "manual_submitted",
                toEmail: args.email, subject, status: "failed", errorMessage: String(err),
            });
        }
    },
});

// ─── Template 3: Donor Manual Approved ───────────────────────────────────────

export const sendManualApproved = internalAction({
    args: {
        donationId:  v.optional(v.string()),
        email:       v.string(),
        name:        v.string(),
        amount:      v.number(),
        ref:         v.string(),
        beneficiary: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const publicSettings = await ctx.runQuery(api.admin.getPublicSettings);
        const subjectSetting = publicSettings.find((s: any) => s.key === "email_subject_manual_approved");
        const bodySetting    = publicSettings.find((s: any) => s.key === "email_body_manual_approved");
        const templateIdSetting = publicSettings.find((s: any) => s.key === "email_template_id_manual_approved");
        const templateId = templateIdSetting?.value || undefined;

        const fmtAmount   = `RM ${args.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;
        const beneficiary = args.beneficiary || "General Fund (SAB2026)";

        let subject = subjectSetting?.value || "✅ Bank Transfer Approved — {amount} | SAB2026 Thank You!";
        subject = subject.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", args.ref).replaceAll("{name}", args.name);

        let message = bodySetting?.value || `Your bank transfer has been verified and approved by our team. Your contribution has now been counted towards the live fundraising progress thermometer.<br/><br/>An official tax-exemption receipt will follow within 30 days of verification.`;
        message = message.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", args.ref).replaceAll("{name}", args.name);

        const html = `
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

          <div style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7;">
            ${message}
          </div>

          ${ctaButton("See the Live Progress", SITE_URL)}
        `;

        try {
            const res = await sendEmailWithTxId({
                toEmail:     args.email,
                subject,
                htmlContent: layout(html),
                templateId,
                tags: [
                    { Key: "donor_name",  Value: args.name },
                    { Key: "amount",      Value: fmtAmount },
                    { Key: "beneficiary", Value: beneficiary },
                    { Key: "ref",         Value: args.ref },
                ],
            });
            await ctx.runMutation(internal.emailLogs.logEmail, {
                donationId: args.donationId, templateId: "manual_approved",
                toEmail: args.email, subject, status: "sent", transactionId: res.transactionId,
            });
        } catch (err: any) {
            console.error("[Email] Failed sendManualApproved:", err);
            await ctx.runMutation(internal.emailLogs.logEmail, {
                donationId: args.donationId, templateId: "manual_approved",
                toEmail: args.email, subject, status: "failed", errorMessage: String(err),
            });
        }
    },
});

// ─── Template 4: Admin — New HitPay Donation ──────────────────────────────────

export const sendAdminHitPayNotification = internalAction({
    args: {
        donationId: v.optional(v.string()),
        name:   v.string(),
        amount: v.number(),
        ref:    v.string(),
        email:  v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const publicSettings = await ctx.runQuery(api.admin.getPublicSettings);
        const subjectSetting = publicSettings.find((s: any) => s.key === "email_subject_admin_hitpay");
        const bodySetting    = publicSettings.find((s: any) => s.key === "email_body_admin_hitpay");
        const templateIdSetting = publicSettings.find((s: any) => s.key === "email_template_id_admin_hitpay");
        const templateId = templateIdSetting?.value || undefined;

        const fmtAmount = `RM ${args.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;

        let subject = subjectSetting?.value || "[SAB2026] 💳 New HitPay Donation — {amount} from {name}";
        subject = subject.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", args.ref).replaceAll("{name}", args.name);

        let message = bodySetting?.value || `A new donation has been confirmed via HitPay. The amount has been credited to the MMA Foundation account automatically.`;
        message = message.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", args.ref).replaceAll("{name}", args.name);

        const html = `
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

          <div style="margin:24px 0 16px;font-size:14px;color:#334155;line-height:1.6;">
            ${message}
          </div>

          <p style="margin:24px 0 8px;font-size:13px;color:#94A3B8;">
            This donation has been automatically recorded and is included in the live fundraising total.
            No admin action required.
          </p>
          ${ctaButton("Open Admin Dashboard", "https://sab.mma.org.my/nadi-sab/donations")}
        `;

        try {
            const res = await sendEmailWithTxId({
                toEmail:     ADMIN_EMAIL,
                subject,
                htmlContent: layout(html),
                templateId,
                tags: [
                    { Key: "donor_name",  Value: args.name },
                    { Key: "amount",      Value: fmtAmount },
                    { Key: "ref",         Value: args.ref },
                ],
            });
            await ctx.runMutation(internal.emailLogs.logEmail, {
                donationId: args.donationId, templateId: "admin_hitpay",
                toEmail: ADMIN_EMAIL, subject, status: "sent", transactionId: res.transactionId,
            });
        } catch (err: any) {
            console.error("[Email] Failed sendAdminHitPayNotification:", err);
            await ctx.runMutation(internal.emailLogs.logEmail, {
                donationId: args.donationId, templateId: "admin_hitpay",
                toEmail: ADMIN_EMAIL, subject, status: "failed", errorMessage: String(err),
            });
        }
    },
});

// ─── Template 5: Admin — Manual Transfer Pending Verification ─────────────────

export const sendAdminManualNotification = internalAction({
    args: {
        donationId: v.optional(v.string()),
        name:   v.string(),
        amount: v.number(),
        phone:  v.string(),
        ref:    v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const publicSettings = await ctx.runQuery(api.admin.getPublicSettings);
        const subjectSetting = publicSettings.find((s: any) => s.key === "email_subject_admin_manual");
        const bodySetting    = publicSettings.find((s: any) => s.key === "email_body_admin_manual");
        const templateIdSetting = publicSettings.find((s: any) => s.key === "email_template_id_admin_manual");
        const templateId = templateIdSetting?.value || undefined;

        const fmtAmount = `RM ${args.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;
        const waNumber  = args.phone.replace(/[^0-9]/g, "");
        const waUrl     = `https://wa.me/${waNumber}`;
        const adminUrl  = "https://sab.mma.org.my/nadi-sab/donations";
        const cleanRef  = args.ref || "Not provided";

        let subject = subjectSetting?.value || "[SAB2026] ⚠️ Manual Transfer Pending — {amount} from {name}";
        subject = subject.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", cleanRef).replaceAll("{name}", args.name);

        let message = bodySetting?.value || `A donor has selected manual bank transfer. Please check the UOB bank account and verify if the payment has been received, then approve or reject the request in the admin dashboard.`;
        message = message.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", cleanRef).replaceAll("{name}", args.name);

        const html = `
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
            ${infoRow("Reference", cleanRef)}
            ${infoRow("Status", "⏳ Awaiting Bank Verification")}
          </table>

          <div style="margin:24px 0 16px;font-size:14px;color:#334155;line-height:1.6;">
            ${message}
          </div>

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
            const res = await sendEmailWithTxId({
                toEmail:     ADMIN_EMAIL,
                subject,
                htmlContent: layout(html),
                templateId,
                tags: [
                    { Key: "donor_name", Value: args.name },
                    { Key: "amount",     Value: fmtAmount },
                    { Key: "phone",      Value: args.phone },
                ],
            });
            await ctx.runMutation(internal.emailLogs.logEmail, {
                donationId: args.donationId, templateId: "admin_manual",
                toEmail: ADMIN_EMAIL, subject, status: "sent", transactionId: res.transactionId,
            });
        } catch (err: any) {
            console.error("[Email] Failed sendAdminManualNotification:", err);
            await ctx.runMutation(internal.emailLogs.logEmail, {
                donationId: args.donationId, templateId: "admin_manual",
                toEmail: ADMIN_EMAIL, subject, status: "failed", errorMessage: String(err),
            });
        }
    },
});

// ─── Template 6: Receipt Request (to both admin Gmail addresses) ──────────────

export const sendReceiptRequest = internalAction({
    args: {
        donorName:         v.string(),
        donorEmail:        v.string(),
        donorPhone:        v.string(),
        amount:            v.number(),
        ref:               v.string(),
        receiptType:       v.string(),
        receiptName:       v.optional(v.string()),
        receiptIC:         v.optional(v.string()),
        receiptPhone:      v.optional(v.string()),
        receiptAddress:    v.optional(v.string()),
        receiptCompany:    v.optional(v.string()),
        receiptRegNo:      v.optional(v.string()),
        receiptBizAddress: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.ENGINEMAILER_API_KEY;
        if (!apiKey) { console.warn("[Email] ENGINEMAILER_API_KEY not set"); return; }

        const publicSettings = await ctx.runQuery(api.admin.getPublicSettings);
        const subjectSetting = publicSettings.find((s: any) => s.key === "email_subject_receipt_request");
        const bodySetting    = publicSettings.find((s: any) => s.key === "email_body_receipt_request");
        const templateIdSetting = publicSettings.find((s: any) => s.key === "email_template_id_receipt_request");
        const templateId = templateIdSetting?.value || undefined;

        const fmtAmount = `RM ${args.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;

        let subject = subjectSetting?.value || "[SAB2026] Tax Receipt Request — {name} | {amount}";
        subject = subject.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", args.ref).replaceAll("{name}", args.donorName);

        let message = bodySetting?.value || `A donor has requested an official LHDN tax-exempt receipt. Please review the details below.`;
        message = message.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", args.ref).replaceAll("{name}", args.donorName);

        const isPersonal = args.receiptType === "personal";
        const typeLabel  = isPersonal ? "Personal (Individual)" : "Corporate";
        const receiptRows = isPersonal
            ? `<tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Full Name</td><td style="padding:6px 0;font-weight:700;font-size:13px;">${args.receiptName || "—"}</td></tr>
               <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">NRIC</td><td style="padding:6px 0;font-weight:700;font-size:13px;">${args.receiptIC || "—"}</td></tr>
               <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Phone</td><td style="padding:6px 0;font-weight:700;font-size:13px;">${args.receiptPhone || "—"}</td></tr>
               <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Postal Address</td><td style="padding:6px 0;font-weight:700;font-size:13px;">${args.receiptAddress || "—"}</td></tr>`
            : `<tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Company Name</td><td style="padding:6px 0;font-weight:700;font-size:13px;">${args.receiptCompany || "—"}</td></tr>
               <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Reg. No.</td><td style="padding:6px 0;font-weight:700;font-size:13px;">${args.receiptRegNo || "—"}</td></tr>
               <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Business Address</td><td style="padding:6px 0;font-weight:700;font-size:13px;">${args.receiptBizAddress || "—"}</td></tr>
               <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Contact Person</td><td style="padding:6px 0;font-weight:700;font-size:13px;">${args.donorName}</td></tr>
               <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Contact Email</td><td style="padding:6px 0;font-weight:700;font-size:13px;">${args.donorEmail}</td></tr>
               <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Contact Phone</td><td style="padding:6px 0;font-weight:700;font-size:13px;">${args.donorPhone}</td></tr>`;

        const html = `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
            <div style="background:#1e3a5f;padding:28px 32px;"><p style="color:#00aeef;font-size:11px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">SAB2026 — MMA Foundation</p><h1 style="color:#fff;font-size:22px;font-weight:900;margin:0;">🧾 Tax Receipt Request</h1></div>
            <div style="padding:28px 32px;">
              <p style="color:#334155;font-size:14px;margin:0 0 20px;">${message}</p>
              
              <div style="background:#f8fafc;border-radius:12px;padding:16px 20px;margin-bottom:20px;border:1px solid #e2e8f0;">
                <p style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;color:#94a3b8;margin:0 0 12px;">Donation Summary</p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Donor</td><td style="padding:6px 0;font-weight:700;font-size:13px;">${args.donorName}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Email</td><td style="padding:6px 0;font-weight:700;font-size:13px;">${args.donorEmail}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Amount</td><td style="padding:6px 0;font-weight:900;font-size:16px;color:#1e3a5f;">${fmtAmount}</td></tr>
                  <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Payment Ref</td><td style="padding:6px 0;font-weight:700;font-size:13px;font-family:monospace;">${args.ref}</td></tr>
                </table>
              </div>
              
              <div style="background:#f0f9ff;border-radius:12px;padding:16px 20px;margin-bottom:24px;border:1px solid #bae6fd;">
                <p style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;color:#0284c7;margin:0 0 4px;">Receipt Type</p>
                <p style="font-size:18px;font-weight:900;color:#1e3a5f;margin:0 0 12px;">${typeLabel}</p>
                <table style="width:100%;border-collapse:collapse;">${receiptRows}</table>
              </div>
              
              <a href="${SITE_URL}/nadi-sab/donations" style="display:inline-block;background:#1e3a5f;color:#fff;font-weight:900;font-size:13px;padding:14px 28px;border-radius:10px;text-decoration:none;">View in Admin Dashboard →</a>
              <p style="color:#94a3b8;font-size:11px;margin-top:24px;">Weekly reminders will continue until this receipt is marked as Sent in the dashboard.</p>
            </div>
          </div>
        `;

        for (const toEmail of ["mmafoundation1976@gmail.com"]) {
            await sendRawEmail({
                toEmail,
                subject,
                html,
                apiKey,
                templateId,
            });
        }
    },
});

// ─── Template 7: Weekly Reminder ─────────────────────────────────────────────

export const sendReceiptReminder = internalAction({
    args: {
        pendingReceipts: v.array(v.object({
            name:        v.string(),
            amount:      v.number(),
            ref:         v.string(),
            receiptType: v.string(),
            requestedAt: v.number(),
        })),
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.ENGINEMAILER_API_KEY;
        if (!apiKey) { console.warn("[Email] ENGINEMAILER_API_KEY not set"); return; }
        if (args.pendingReceipts.length === 0) return;

        const publicSettings = await ctx.runQuery(api.admin.getPublicSettings);
        const subjectSetting = publicSettings.find((s: any) => s.key === "email_subject_receipt_reminder");
        const bodySetting    = publicSettings.find((s: any) => s.key === "email_body_receipt_reminder");
        const templateIdSetting = publicSettings.find((s: any) => s.key === "email_template_id_receipt_reminder");
        const templateId = templateIdSetting?.value || undefined;

        const n = args.pendingReceipts.length;

        let subject = subjectSetting?.value || "[SAB2026] REMINDER — {count} outstanding tax receipt{plural}";
        subject = subject.replaceAll("{count}", n.toString()).replaceAll("{plural}", n > 1 ? "s" : "");

        let message = bodySetting?.value || `This is your weekly reminder that there are {count} outstanding LHDN tax receipt request{plural} waiting for your verification. Please log into the dashboard and mark them as sent.`;
        message = message.replaceAll("{count}", n.toString()).replaceAll("{plural}", n > 1 ? "s" : "");

        const rows = args.pendingReceipts.map(r => {
            const daysAgo = Math.floor((Date.now() - r.requestedAt) / 86400000);
            return [
                `<tr>`,
                `<td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:700;font-size:13px;">${r.name}</td>`,
                `<td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:900;font-size:13px;color:#1e3a5f;">RM ${r.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}</td>`,
                `<td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;">${r.receiptType === "corporate" ? "Corporate" : "Personal"}</td>`,
                `<td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-family:monospace;font-size:11px;color:#64748b;">${r.ref}</td>`,
                `<td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#f59e0b;font-weight:700;">${daysAgo}d</td>`,
                `</tr>`,
            ].join("");
        }).join("");

        const html = `
          <div style="font-family:Inter,sans-serif;max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
            <div style="background:#f59e0b;padding:28px 32px;"><p style="color:#fff;font-size:11px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">Weekly Reminder — SAB2026</p>
            <h1 style="color:#fff;font-size:22px;font-weight:900;margin:0;">⏰ ${n} Outstanding Tax Receipt${n > 1 ? "s" : ""}</h1></div>
            <div style="padding:28px 32px;">
              <p style="color:#334155;font-size:14px;margin:0 0 20px;">${message}</p>
              <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                <thead><tr style="background:#1e3a5f;">
                <th style="padding:10px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;">Donor</th>
                <th style="padding:10px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;">Amount</th>
                <th style="padding:10px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;">Type</th>
                <th style="padding:10px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;">Reference</th>
                <th style="padding:10px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;">Waiting</th>
                </tr></thead><tbody>${rows}</tbody></table>
              <div style="margin-top:24px;"><a href="${SITE_URL}/nadi-sab/donations" style="display:inline-block;background:#1e3a5f;color:#fff;font-weight:900;font-size:13px;padding:14px 28px;border-radius:10px;text-decoration:none;">Go to Admin Dashboard →</a></div>
              <p style="color:#94a3b8;font-size:11px;margin-top:24px;">Log in and click "Mark Sent" on each receipt row to stop these reminders.</p>
            </div>
          </div>
        `;

        for (const toEmail of ["mmafoundation1976@gmail.com"]) {
            await sendRawEmail({
                toEmail,
                subject,
                html,
                apiKey,
                templateId,
            });
        }
    },
});

// ─── Test Email Action (callable from admin panel) ────────────────────────────

export const sendTestEmail = action({
    args: {
        token:      v.string(),
        templateId: v.string(), // "thank_you" | "manual_submitted" | "manual_approved" | "admin_hitpay" | "admin_manual" | "receipt_request" | "receipt_reminder"
        toEmail:    v.string(),
    },
    handler: async (ctx, args) => {
        const ADMIN_SECRET = process.env.ADMIN_SECRET || "nadi-sab-2026-admin";
        if (args.token !== ADMIN_SECRET) throw new Error("Unauthorized");

        const userKey = process.env.USERID || process.env.ENGINEMAILER_API_KEY;
        if (!userKey) {
            throw new Error("USERID or ENGINEMAILER_API_KEY is not configured. Add it in the Convex Dashboard → Settings → Environment Variables.");
        }

        const publicSettings = await ctx.runQuery(api.admin.getPublicSettings);
        const subjectSetting = publicSettings.find((s: any) => s.key === `email_subject_${args.templateId}`);
        const bodySetting    = publicSettings.find((s: any) => s.key === `email_body_${args.templateId}`);

        const demoName   = "Test Donor";
        const demoAmount = 500;
        const demoRef    = "TEST-" + Date.now().toString().slice(-6);
        const fmtAmount  = `RM ${demoAmount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;

        let subject  = "";
        let body     = "";

        switch (args.templateId) {
            case "thank_you":
                subject = subjectSetting?.value || "✅ [TEST] Donation Confirmed — {amount} | SAB2026";
                subject = subject.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", demoRef).replaceAll("{name}", demoName);

                body = bodySetting?.value || `Your generous contribution directly helps fund <strong>life-saving surgeries for children in Borneo</strong> through the Sepeda Amal Borneo 2026 cycling initiative.<br/><br/>An official <strong>tax-exemption receipt</strong> will be issued within <strong>30 days of verification</strong>. Please keep this email as proof of your donation.`;
                body = body.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", demoRef).replaceAll("{name}", demoName);

                body = `
                  <h2 style="margin:0 0 4px;font-size:28px;font-weight:900;color:#0F172A;">Thank You,<br/>${demoName}! (TEST)</h2>
                  <p style="margin:8px 0 28px;font-size:14px;color:#64748B;">This is a <strong>test email</strong> for the Donation Thank You template.</p>
                  <div style="background:linear-gradient(135deg,#0F172A,#1E293B);border-radius:16px;padding:28px 32px;margin-bottom:28px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:2px;font-weight:700;">Confirmed Donation</p>
                    <p style="margin:0;font-size:42px;font-weight:900;color:#00AEEF;">${fmtAmount}</p>
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${infoRow("Donor Name", demoName)}
                    ${infoRow("Reference ID", demoRef)}
                    ${infoRow("Status", "✅ Payment Confirmed")}
                  </table>
                  <div style="margin:28px 0 24px;font-size:15px;color:#334155;line-height:1.7;">
                    ${body}
                  </div>
                  ${ctaButton("Visit SAB2026", SITE_URL)}
                `;
                break;

            case "manual_submitted":
                subject = subjectSetting?.value || "⏳ [TEST] Manual Donation Received — {amount} | SAB2026";
                subject = subject.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", demoRef).replaceAll("{name}", demoName);

                body = bodySetting?.value || `To complete your manual bank transfer donation, please make a transfer of <strong>{amount}</strong> to the MMA Foundation account:<br/><br/><strong>Bank Name:</strong> UOB Malaysia<br/><strong>Account Name:</strong> MMA Foundation<br/><strong>Account Number:</strong> 240305 7985<br/><br/>Once done, please reply to this email or send your receipt proof via WhatsApp.`;
                body = body.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", demoRef).replaceAll("{name}", demoName);

                body = `
                  <h2 style="margin:0 0 4px;font-size:28px;font-weight:900;color:#0F172A;">We've Received<br/>Your Transfer Details (TEST)</h2>
                  <p style="margin:8px 0 28px;font-size:14px;color:#64748B;">This is a <strong>test email</strong> for the Manual Submission template.</p>
                  ${alertBox("⏳ <strong>Pending Verification</strong> — Our team will verify your bank transfer within 1–2 working days.")}
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                    ${infoRow("Donor Name", demoName)}
                    ${infoRow("Donation Amount", fmtAmount)}
                    ${infoRow("Supporting", "General Fund (SAB2026)")}
                    ${infoRow("Reference ID", demoRef)}
                    ${infoRow("Transfer To", "UOB Malaysia — MMA Foundation (2403057985)")}
                  </table>
                  <div style="margin:20px 0 24px;font-size:15px;color:#334155;line-height:1.7;">
                    ${body}
                  </div>
                  ${ctaButton("View SAB2026", SITE_URL)}
                `;
                break;

            case "manual_approved":
                subject = subjectSetting?.value || "✅ [TEST] Bank Transfer Approved — {amount} | SAB2026";
                subject = subject.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", demoRef).replaceAll("{name}", demoName);

                body = bodySetting?.value || `Your bank transfer has been verified and approved by our team. Your contribution has now been counted towards the live fundraising progress thermometer.<br/><br/>An official tax-exemption receipt will follow within 30 days of verification.`;
                body = body.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", demoRef).replaceAll("{name}", demoName);

                body = `
                  <h2 style="margin:0 0 4px;font-size:28px;font-weight:900;color:#0F172A;">Donation Approved!<br/>Thank You, ${demoName}! (TEST)</h2>
                  <p style="margin:8px 0 28px;font-size:14px;color:#64748B;">This is a <strong>test email</strong> for the Manual Approved template.</p>
                  <div style="background:linear-gradient(135deg,#0F172A,#1E293B);border-radius:16px;padding:28px 32px;margin-bottom:28px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:2px;font-weight:700;">Verified Donation</p>
                    <p style="margin:0;font-size:42px;font-weight:900;color:#00AEEF;">${fmtAmount}</p>
                    <p style="margin:8px 0 0;font-size:13px;color:#F97316;font-weight:700;text-transform:uppercase;letter-spacing:1px;">✅ Approved</p>
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                    ${infoRow("Donor Name", demoName)}
                    ${infoRow("Supporting", "General Fund (SAB2026)")}
                    ${infoRow("Reference ID", demoRef)}
                    ${infoRow("Status", "✅ Verified & Approved")}
                  </table>
                  <div style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7;">
                    ${body}
                  </div>
                  ${ctaButton("See the Live Progress", SITE_URL)}
                `;
                break;

            case "admin_hitpay":
                subject = subjectSetting?.value || `[SAB2026] [TEST] 💳 New HitPay Donation — {amount} from {name}`;
                subject = subject.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", demoRef).replaceAll("{name}", demoName);

                body = bodySetting?.value || `A new donation has been confirmed via HitPay. The amount has been credited to the MMA Foundation account automatically.`;
                body = body.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", demoRef).replaceAll("{name}", demoName);

                body = `
                  <h2 style="margin:0 0 4px;font-size:24px;font-weight:900;color:#0F172A;">💳 New Online Donation Received (TEST)</h2>
                  <p style="margin:8px 0 24px;font-size:14px;color:#64748B;">This is a <strong>test email</strong> for the Admin HitPay Notification template.</p>
                  <div style="background:#ECFDF5;border:1px solid #6EE7B7;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#065F46;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Amount Received</p>
                    <p style="margin:0;font-size:36px;font-weight:900;color:#065F46;">${fmtAmount}</p>
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${infoRow("Donor Name", demoName)}
                    ${infoRow("Donor Email", "test@example.com")}
                    ${infoRow("HitPay Reference", demoRef)}
                    ${infoRow("Status", "✅ Paid & Confirmed (Webhook)")}
                  </table>
                  <div style="margin:24px 0 16px;font-size:14px;color:#334155;line-height:1.6;">
                    ${body}
                  </div>
                  ${ctaButton("Open Admin Dashboard", "https://sab.mma.org.my/nadi-sab/donations")}
                `;
                break;

            case "admin_manual":
                subject = subjectSetting?.value || `[SAB2026] [TEST] ⚠️ Manual Transfer Pending — {amount} from {name}`;
                subject = subject.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", demoRef).replaceAll("{name}", demoName);

                body = bodySetting?.value || `A donor has selected manual bank transfer. Please check the UOB bank account and verify if the payment has been received, then approve or reject the request in the admin dashboard.`;
                body = body.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", demoRef).replaceAll("{name}", demoName);

                body = `
                  <h2 style="margin:0 0 4px;font-size:24px;font-weight:900;color:#0F172A;">⏳ Manual Transfer — Action Required (TEST)</h2>
                  <p style="margin:8px 0 24px;font-size:14px;color:#64748B;">This is a <strong>test email</strong> for the Admin Manual Notification template.</p>
                  <div style="background:#FFF7ED;border:1px solid #FCD34D;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#92400E;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Pending Verification</p>
                    <p style="margin:0;font-size:36px;font-weight:900;color:#92400E;">${fmtAmount}</p>
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${infoRow("Donor Name", demoName)}
                    ${infoRow("Phone / WhatsApp", "+60 12-345 6789")}
                    ${infoRow("Reference", demoRef)}
                    ${infoRow("Status", "⏳ Awaiting Bank Verification")}
                  </table>
                  <div style="margin:24px 0 16px;font-size:14px;color:#334155;line-height:1.6;">
                    ${body}
                  </div>
                  ${alertBox(`<strong>Action Required (TEST):</strong><br/>1. Check UOB account.<br/>2. Approve or Reject in dashboard.`)}
                `;
                break;

            case "receipt_request":
                subject = subjectSetting?.value || `[SAB2026] Tax Receipt Request — {name} | {amount} (TEST)`;
                subject = subject.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", demoRef).replaceAll("{name}", demoName);

                body = bodySetting?.value || `A donor has requested an official LHDN tax-exempt receipt. Please review the details below.`;
                body = body.replaceAll("{amount}", fmtAmount).replaceAll("{ref}", demoRef).replaceAll("{name}", demoName);

                body = `
                  <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
                    <div style="background:#1e3a5f;padding:28px 32px;"><p style="color:#00aeef;font-size:11px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">SAB2026 — MMA Foundation</p><h1 style="color:#fff;font-size:22px;font-weight:900;margin:0;">🧾 Tax Receipt Request (TEST)</h1></div>
                    <div style="padding:28px 32px;">
                      <p style="color:#334155;font-size:14px;margin:0 0 20px;">${body}</p>
                      
                      <div style="background:#f8fafc;border-radius:12px;padding:16px 20px;margin-bottom:20px;border:1px solid #e2e8f0;">
                        <p style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;color:#94a3b8;margin:0 0 12px;">Donation Summary</p>
                        <table style="width:100%;border-collapse:collapse;">
                          <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Donor</td><td style="padding:6px 0;font-weight:700;font-size:13px;">${demoName}</td></tr>
                          <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Email</td><td style="padding:6px 0;font-weight:700;font-size:13px;">test@example.com</td></tr>
                          <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Amount</td><td style="padding:6px 0;font-weight:900;font-size:16px;color:#1e3a5f;">${fmtAmount}</td></tr>
                          <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Payment Ref</td><td style="padding:6px 0;font-weight:700;font-size:13px;font-family:monospace;">${demoRef}</td></tr>
                        </table>
                      </div>
                      
                      <div style="background:#f0f9ff;border-radius:12px;padding:16px 20px;margin-bottom:24px;border:1px solid #bae6fd;">
                        <p style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;color:#0284c7;margin:0 0 4px;">Receipt Type</p>
                        <p style="font-size:18px;font-weight:900;color:#1e3a5f;margin:0 0 12px;">Personal (Individual)</p>
                        <table style="width:100%;border-collapse:collapse;">
                          <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Full Name</td><td style="padding:6px 0;font-weight:700;font-size:13px;">${demoName}</td></tr>
                          <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">NRIC</td><td style="padding:6px 0;font-weight:700;font-size:13px;">800101-14-5000</td></tr>
                          <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Phone</td><td style="padding:6px 0;font-weight:700;font-size:13px;">+60123456789</td></tr>
                          <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Postal Address</td><td style="padding:6px 0;font-weight:700;font-size:13px;">123, Jalan Ampang, Kuala Lumpur, Malaysia</td></tr>
                        </table>
                      </div>
                      
                      <a href="${SITE_URL}/nadi-sab/donations" style="display:inline-block;background:#1e3a5f;color:#fff;font-weight:900;font-size:13px;padding:14px 28px;border-radius:10px;text-decoration:none;">View in Admin Dashboard →</a>
                    </div>
                  </div>
                `;
                break;

            case "receipt_reminder":
                subject = subjectSetting?.value || `[SAB2026] REMINDER — {count} outstanding tax receipt{plural} (TEST)`;
                subject = subject.replaceAll("{count}", "3").replaceAll("{plural}", "s");

                body = bodySetting?.value || `This is your weekly reminder that there are {count} outstanding LHDN tax receipt request{plural} waiting for your verification. Please log into the dashboard and mark them as sent.`;
                body = body.replaceAll("{count}", "3").replaceAll("{plural}", "s");

                body = `
                  <div style="font-family:Inter,sans-serif;max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
                    <div style="background:#f59e0b;padding:28px 32px;"><p style="color:#fff;font-size:11px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">Weekly Reminder — SAB2026</p>
                    <h1 style="color:#fff;font-size:22px;font-weight:900;margin:0;">⏰ 3 Outstanding Tax Receipts (TEST)</h1></div>
                    <div style="padding:28px 32px;">
                      <p style="color:#334155;font-size:14px;margin:0 0 20px;">${body}</p>
                      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                        <thead><tr style="background:#1e3a5f;">
                        <th style="padding:10px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;">Donor</th>
                        <th style="padding:10px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;">Amount</th>
                        <th style="padding:10px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;">Type</th>
                        <th style="padding:10px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;">Reference</th>
                        <th style="padding:10px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;">Waiting</th>
                        </tr></thead><tbody>
                          <tr>
                            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:700;font-size:13px;">Alice Tan</td>
                            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:900;font-size:13px;color:#1e3a5f;">RM 1,000.00</td>
                            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;">Personal</td>
                            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-family:monospace;font-size:11px;color:#64748b;">SAB-1718928</td>
                            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#f59e0b;font-weight:700;">4d</td>
                          </tr>
                          <tr>
                            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:700;font-size:13px;">Bob Capital Sdn Bhd</td>
                            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-weight:900;font-size:13px;color:#1e3a5f;">RM 5,000.00</td>
                            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;">Corporate</td>
                            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-family:monospace;font-size:11px;color:#64748b;">SAB-1718940</td>
                            <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#f59e0b;font-weight:700;">2d</td>
                          </tr>
                        </tbody></table>
                      <div style="margin-top:24px;"><a href="${SITE_URL}/nadi-sab/donations" style="display:inline-block;background:#1e3a5f;color:#fff;font-weight:900;font-size:13px;padding:14px 28px;border-radius:10px;text-decoration:none;">Go to Admin Dashboard →</a></div>
                    </div>
                  </div>
                `;
                break;

            default:
                throw new Error(`Unknown templateId: ${args.templateId}`);
        }

        // If template was one of the boxed layouts (like receipt_request/reminder), 
        // it doesn't need to be wrapped by the standard thank you layout. Otherwise wrap it.
        const isBoxed = args.templateId === "receipt_request" || args.templateId === "receipt_reminder";
        const finalHtml = isBoxed ? body : layout(body);

        await sendEmail({
            toEmail:     args.toEmail,
            subject,
            htmlContent: finalHtml,
        });

        return { success: true, sentTo: args.toEmail };
    },
});

// ─── Public query: Get email logs for a donation (Admin panel) ────────────────

export const listEmailLogsForDonation = action({
    args: { token: v.string(), donationId: v.string() },
    handler: async (ctx, args): Promise<any[]> => {
        const ADMIN_SECRET = process.env.ADMIN_SECRET || "nadi-sab-2026-admin";
        if (args.token !== ADMIN_SECRET) throw new Error("Unauthorized");
        return ctx.runQuery(internal.emailLogs.getEmailLogs, { donationId: args.donationId });
    },
});

export const resendDonationEmail = action({
    args: { token: v.string(), logId: v.string() },
    handler: async (ctx, args): Promise<{ success: boolean; message: string }> => {
        const ADMIN_SECRET = process.env.ADMIN_SECRET || "nadi-sab-2026-admin";
        if (args.token !== ADMIN_SECRET) throw new Error("Unauthorized");

        const log = (await ctx.runQuery(internal.emailLogs.getLogById, { logId: args.logId })) as any;
        if (!log) throw new Error("Email log entry not found");

        const userKey = process.env.USERID || process.env.ENGINEMAILER_API_KEY;
        if (!userKey) throw new Error("ENGINEMAILER_API_KEY not configured");

        const resendSubject = `[RESEND] ${log.subject}`;
        const resendHtml = `
          <div style="background:#FEF9C3;padding:12px 20px;border-radius:8px;margin-bottom:16px;font-family:sans-serif;border:1px solid #FCD34D;">
            <strong style="color:#92400E;">⚠️ Resent by Admin</strong><br/>
            <span style="font-size:12px;color:#78350F;">
              Originally sent: ${new Date(log.sentAt).toLocaleString('en-MY')} |
              Template: ${log.templateId}
            </span>
          </div>
          <p style="font-family:sans-serif;color:#334155;font-size:14px;">
            This is a resent copy of the original transactional email.
            If you have any questions, contact <a href="mailto:mmafoundation1976@gmail.com">mmafoundation1976@gmail.com</a>.
          </p>`;

        try {
            const res = await sendEmailWithTxId({ toEmail: log.toEmail, subject: resendSubject, htmlContent: resendHtml });
            await ctx.runMutation(internal.emailLogs.logEmail, {
                donationId: log.donationId, templateId: log.templateId + "_resent",
                toEmail: log.toEmail, subject: resendSubject, status: "sent", transactionId: res.transactionId,
            });
            return { success: true, message: `Resent to ${log.toEmail}` };
        } catch (err: any) {
            await ctx.runMutation(internal.emailLogs.logEmail, {
                donationId: log.donationId, templateId: log.templateId + "_resent",
                toEmail: log.toEmail, subject: resendSubject, status: "failed", errorMessage: String(err),
            });
            return { success: false, message: String(err) };
        }
    },
});
