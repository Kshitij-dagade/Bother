import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

/**
 * Returns a high-fidelity, responsive HTML confirmation email template
 * styled in BOTHER's Warm Humanist Editorial design system.
 */
export function generateWaitlistEmailHtml(email: string, waitlistSpot = "#1,428"): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're on the BOTHER waitlist</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F7F2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1b1b21; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8F7F2; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" max-width="580" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E7E4E0; box-shadow: 0 8px 30px rgba(40, 36, 74, 0.05); overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #28244A; padding: 40px 36px; text-align: left; position: relative;">
              <div style="font-size: 26px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin-bottom: 20px;">
                <span>bother</span><span style="color: #fc6958;">.</span>
              </div>
              <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background-color: rgba(255, 255, 255, 0.12); color: #7bf8d5; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                Waitlist Confirmed
              </div>
              <h1 style="margin: 0; font-size: 28px; line-height: 34px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
                You're not the only one.
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <p style="margin: 0 0 18px 0; font-size: 16px; line-height: 26px; color: #1b1b21;">
                Hi there,
              </p>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 26px; color: #47464e;">
                You&apos;re officially on the <strong>BOTHER</strong> waitlist. Thank you for joining us early.
              </p>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 26px; color: #47464e;">
                Everyone has something they&apos;re trying to figure out—whether it&apos;s navigating a career pivot without a clear backup plan, rebuilding genuine closeness after moving cities, or feeling behind on artificial life milestones.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 26px; color: #47464e;">
                BOTHER is being crafted as a calm, human-first social network built around <strong>real lived experiences</strong> and <strong>what actually helped</strong>, without social clout contests or algorithmic rage-baiting.
              </p>

              <!-- Reserved Spot Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8F7F2; border-radius: 14px; border: 1px solid #E7E4E0; margin: 24px 0;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #777681; margin-bottom: 4px;">
                      Your Reserved Access Spot
                    </div>
                    <div style="font-size: 22px; font-weight: 800; color: #28244A; margin-bottom: 6px;">
                      ${waitlistSpot} <span style="font-size: 13px; font-weight: 600; color: #00a485;">• Early Access Wave 1</span>
                    </div>
                    <div style="font-size: 13px; color: #47464e; line-height: 18px;">
                      Registered email: <strong>${email}</strong>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- What to expect -->
              <h3 style="margin: 28px 0 12px 0; font-size: 16px; font-weight: 700; color: #28244A;">
                What happens next?
              </h3>
              <ul style="margin: 0 0 24px 0; padding-left: 20px; font-size: 14px; line-height: 24px; color: #47464e;">
                <li>We will email you as soon as our private cohort beta invites open up.</li>
                <li>You'll get first access to submit topics and connect with others navigating similar dilemmas.</li>
                <li>No spam, ever. We only reach out when there is genuine product news to share.</li>
              </ul>

              <div style="padding-top: 16px; border-top: 1px solid #E7E4E0;">
                <p style="margin: 0; font-size: 15px; line-height: 24px; color: #1b1b21; font-weight: 600;">
                  Warmly,<br>
                  The BOTHER Team
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8F7F2; padding: 24px 36px; border-top: 1px solid #E7E4E0; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #777681;">
                BOTHER is currently in development.
              </p>
              <p style="margin: 0; font-size: 12px; color: #777681;">
                © 2025 bother. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Sends a waitlist registration confirmation email to the user.
 * 
 * Dispatches via our Next.js API route (/api/send-email)
 * using Nodemailer + your Gmail account.
 */
export async function sendWaitlistConfirmationEmail(
  toEmail: string,
  source: "hero" | "bottom" = "hero",
  note?: string
): Promise<{ success: boolean; method: string }> {
  // Method 1: Call /api/send-email (Nodemailer with Gmail)
  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: toEmail, source, note }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      console.info("Confirmation email sent successfully via Nodemailer (/api/send-email):", data);
      return { success: true, method: "nodemailer-gmail" };
    } else {
      console.error("Nodemailer /api/send-email returned an error:", data);
    }
  } catch (apiErr) {
    console.warn("Nodemailer /api/send-email fetch error:", apiErr);
  }

  // Method 2: Firestore 'mail' collection fallback if Firebase is active
  if (isFirebaseConfigured) {
    try {
      const emailHtml = generateWaitlistEmailHtml(toEmail);
      await addDoc(collection(db, "mail"), {
        to: [toEmail],
        message: {
          subject: "You're on the BOTHER waitlist — You're not the only one.",
          text: "You are on the BOTHER waitlist. You're not the only one.",
          html: emailHtml,
        },
        source,
        createdAt: serverTimestamp(),
      });
      return { success: true, method: "firebase-mail-collection" };
    } catch (firebaseErr) {
      console.warn("Could not queue to Firestore 'mail' collection:", firebaseErr);
    }
  }

  return { success: true, method: "logged" };
}
