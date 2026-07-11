import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export function getEmailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP configuration (SMTP_HOST, SMTP_USER, SMTP_PASS) is missing. Email delivery will run in high-fidelity sandbox simulation mode.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
}

export async function sendEmail({ to, subject, text, html }: MailOptions): Promise<boolean> {
  const transporter = getEmailTransporter();
  const from = process.env.SMTP_FROM || "Void Compliance <noreply@voidcoding.com>";

  if (!transporter) {
    console.log(`[SIMULATION EMAIL SEND]
To: ${to}
Subject: ${subject}
Text: ${text}
--------------------------------------------`);
    return true; // Return true as simulation succeeds
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent successfully. Message ID:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send real email via SMTP transporter:", error);
    return false;
  }
}

/**
 * Sends a Welcome Email to new user.
 */
export async function sendWelcomeEmail(toEmail: string, fullName: string): Promise<boolean> {
  const subject = "Welcome to Void - Start Your Advanced CS Track!";
  const text = `Hi ${fullName || "Student"}, Welcome to Void! Your account has been provisioned successfully. You now have unrestricted sandbox access to real-time compilation, AI coding mentors, and system architecture analyzers. Begin your track today!`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #1a1a24; background-color: #09090b; color: #fafafa; border-radius: 12px;">
      <h2 style="color: #a855f7; border-bottom: 2px solid #1a1a24; padding-bottom: 10px;">Void Coding Academy</h2>
      <p>Hi <strong>${fullName || "Student"}</strong>,</p>
      <p>Welcome to <strong>Void</strong>! Your developer account is successfully provisioned and ready for action.</p>
      <div style="background-color: #121217; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #27272a;">
        <h3 style="margin-top: 0; color: #e4e4e7;">What's Included In Your Sandbox:</h3>
        <ul style="padding-left: 20px; line-height: 1.6;">
          <li>Real-time Code Audits & Optimizers</li>
          <li>Interactive AI Mentors trained on elite CS principles</li>
          <li>Full Sandbox Project Workspace with persistent logs</li>
        </ul>
      </div>
      <p>Need assistance or ready to launch your first compiler query? Your path is open.</p>
      <p style="margin-top: 30px; border-top: 1px solid #1a1a24; padding-top: 15px; font-size: 11px; color: #71717a;">
        Void Coding Ltd. • Nehru Place IT Hub • New Delhi, India
      </p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, text, html });
}

/**
 * Sends a Verification Email with OTP.
 */
export async function sendVerificationEmail(toEmail: string, otpCode: string): Promise<boolean> {
  const subject = "Verify Your Void Developer Identity";
  const text = `Your verification code is: ${otpCode}. Enter this code in your browser dashboard to secure your account.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #1a1a24; background-color: #09090b; color: #fafafa; border-radius: 12px;">
      <h2 style="color: #a855f7; border-bottom: 2px solid #1a1a24; padding-bottom: 10px;">Void Identity Verification</h2>
      <p>Please use the following verification code to authenticate your developer credentials:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #a855f7; background-color: #121217; padding: 10px 24px; border-radius: 8px; border: 1px solid #27272a;">${otpCode}</span>
      </div>
      <p style="font-size: 13px; color: #a1a1aa;">This verification token will expire in 15 minutes. If you did not request this, please disregard this email.</p>
      <p style="margin-top: 30px; border-top: 1px solid #1a1a24; padding-top: 15px; font-size: 11px; color: #71717a;">
        Void Coding Ltd. • Security Center
      </p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, text, html });
}

/**
 * Sends a Password Reset Email.
 */
export async function sendPasswordResetEmail(toEmail: string, resetToken: string): Promise<boolean> {
  const subject = "Reset Your Void Account Password";
  const text = `Use the following token to reset your password: ${resetToken}. If you did not initiate this request, contact support immediately.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #1a1a24; background-color: #09090b; color: #fafafa; border-radius: 12px;">
      <h2 style="color: #e11d48; border-bottom: 2px solid #1a1a24; padding-bottom: 10px;">Password Reset Request</h2>
      <p>A request was received to reset the password for your Void account. Use the token code below to complete the reset flow:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-family: monospace; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #e11d48; background-color: #121217; padding: 10px 20px; border-radius: 8px; border: 1px solid #27272a;">${resetToken}</span>
      </div>
      <p style="font-size: 13px; color: #a1a1aa;">For security, this token is single-use and valid for only 30 minutes.</p>
      <p style="margin-top: 30px; border-top: 1px solid #1a1a24; padding-top: 15px; font-size: 11px; color: #71717a;">
        Void Coding Ltd. • Security Team
      </p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, text, html });
}

/**
 * Sends a Trial Expiration / Reminder Email.
 */
export async function sendTrialReminderEmail(toEmail: string, fullName: string, daysRemaining: number): Promise<boolean> {
  const subject = `Urgent: ${daysRemaining} Days Remaining on Your Void Free Trial`;
  const text = `Hi ${fullName || "Student"}, your free trial of Void Pro is expiring in ${daysRemaining} days. Keep your advanced compiler audits, high-performance optimization modules, and private expert workspaces online by upgrading to Pro.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #1a1a24; background-color: #09090b; color: #fafafa; border-radius: 12px;">
      <h2 style="color: #fb923c; border-bottom: 2px solid #1a1a24; padding-bottom: 10px;">Free Trial Status Update</h2>
      <p>Hi <strong>${fullName || "Student"}</strong>,</p>
      <p>Your free trial of <strong>Void Pro</strong> is active and has exactly <strong>${daysRemaining} days remaining</strong>.</p>
      <div style="background-color: #1c1917; border: 1px solid #78350f; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #fdba74; font-weight: bold;">Avoid service disruption after trial expiration.</p>
        <p style="margin: 5px 0 0 0; color: #d6d3d1; font-size: 13px;">Upon expiration, your workspace limits will return to our Free Tier. Your existing sandboxes and custom progress tables will remain safe, but advanced audits will require subscription verification.</p>
      </div>
      <p>Ready to upgrade or unlock annual discount packages? Proceed to your billing settings.</p>
      <p style="margin-top: 30px; border-top: 1px solid #1a1a24; padding-top: 15px; font-size: 11px; color: #71717a;">
        Void Coding Ltd. • Billing & Operations
      </p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, text, html });
}

/**
 * Sends a Subscription Payment Successful Receipt.
 */
export async function sendPaymentReceiptEmail(toEmail: string, fullName: string, amount: number, invoiceId: string, plan: string): Promise<boolean> {
  const subject = `Your Void Invoice & Payment Receipt [${invoiceId}]`;
  const text = `Hi ${fullName || "Student"}, we successfully processed your payment of INR ${amount} for the ${plan}. Your invoice ID is ${invoiceId}. Your Pro credentials are fully loaded.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #1a1a24; background-color: #09090b; color: #fafafa; border-radius: 12px;">
      <h2 style="color: #22c55e; border-bottom: 2px solid #1a1a24; padding-bottom: 10px;">Payment Receipt & Invoice</h2>
      <p>Hi <strong>${fullName || "Student"}</strong>,</p>
      <p>Thank you for your purchase! We have successfully processed your payment for <strong>Void Pro</strong>.</p>
      <table style="width: 100%; text-align: left; margin: 20px 0; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #1a1a24;">
          <th style="padding: 10px 0; color: #a1a1aa;">Invoice ID</th>
          <td style="padding: 10px 0; font-family: monospace; text-align: right; color: #fafafa;">${invoiceId}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1a1a24;">
          <th style="padding: 10px 0; color: #a1a1aa;">Product</th>
          <td style="padding: 10px 0; text-align: right; color: #fafafa;">${plan}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1a1a24;">
          <th style="padding: 10px 0; color: #a1a1aa;">Amount Paid</th>
          <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #22c55e;">INR ${amount}.00</td>
        </tr>
        <tr style="border-bottom: 1px solid #1a1a24;">
          <th style="padding: 10px 0; color: #a1a1aa;">Status</th>
          <td style="padding: 10px 0; text-align: right; color: #22c55e; font-weight: bold;">PAID / SETTLED</td>
        </tr>
      </table>
      <p>This invoice serves as tax-compliant proof of transaction. Your subscription has been automatically extended.</p>
      <p style="margin-top: 30px; border-top: 1px solid #1a1a24; padding-top: 15px; font-size: 11px; color: #71717a;">
        Void Coding Ltd. • Tax & Invoicing Desk • Nehru Place, New Delhi
      </p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, text, html });
}

/**
 * Sends a Subscription Cancellation Confirmation Email.
 */
export async function sendSubscriptionCancellationEmail(toEmail: string, fullName: string): Promise<boolean> {
  const subject = "Void Subscription Cancelled Successfully";
  const text = `Hi ${fullName || "Student"}, your Void Pro subscription has been cancelled at your request. Your access will remain active until the end of your current billing period.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #1a1a24; background-color: #09090b; color: #fafafa; border-radius: 12px;">
      <h2 style="color: #ef4444; border-bottom: 2px solid #1a1a24; padding-bottom: 10px;">Subscription Cancelled</h2>
      <p>Hi <strong>${fullName || "Student"}</strong>,</p>
      <p>Your subscription to <strong>Void Pro</strong> has been cancelled at your request.</p>
      <div style="background-color: #180f0f; border: 1px solid #991b1b; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #fca5a5; font-weight: bold;">Subscription status: Active Pending Expiration.</p>
        <p style="margin: 5px 0 0 0; color: #e2e8f0; font-size: 13px;">Your advanced access to high-performance compiler auditors, priority AI chat lines, and custom settings remains open until the end of your current billing cycle. No further recurring payments will be charged.</p>
      </div>
      <p>We are sorry to see you go! Feel free to reconnect with Pro features anytime.</p>
      <p style="margin-top: 30px; border-top: 1px solid #1a1a24; padding-top: 15px; font-size: 11px; color: #71717a;">
        Void Coding Ltd. • Billing Support
      </p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, text, html });
}

/**
 * Sends an Account Deletion Confirmation Email.
 */
export async function sendAccountDeletionEmail(toEmail: string, fullName: string): Promise<boolean> {
  const subject = "Void Account Deletion Request Scheduled";
  const text = `Hi ${fullName || "Student"}, your Void account and all related project, chat, and profile datasets are scheduled for permanent deletion in compliance with local privacy frameworks. All systems have purged personal markers.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #1a1a24; background-color: #09090b; color: #fafafa; border-radius: 12px;">
      <h2 style="color: #ef4444; border-bottom: 2px solid #1a1a24; padding-bottom: 10px;">Account Purged Successfully</h2>
      <p>Hi <strong>${fullName || "Student"}</strong>,</p>
      <p>Your Void developer account and all associated datasets are being permanently deleted from our primary servers.</p>
      <div style="background-color: #121217; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ef4444/30;">
        <h3 style="margin-top: 0; color: #ef4444;">Compliance Purge Audit Summary:</h3>
        <ul style="padding-left: 20px; line-height: 1.6; font-size: 13px;">
          <li>User profile records: Purged</li>
          <li>Workspace project file lines: Cleared</li>
          <li>AI Chat log entries: Overwritten</li>
          <li>Billing references: Redacted (except for statutory financial tax audits)</li>
        </ul>
      </div>
      <p>All transfers to external backup snapshots are scheduled for completion within standard 30-day clearing windows.</p>
      <p style="margin-top: 30px; border-top: 1px solid #1a1a24; padding-top: 15px; font-size: 11px; color: #71717a;">
        Void Coding Ltd. • Privacy Office • GDPR / CCPA Compliance
      </p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, text, html });
}
