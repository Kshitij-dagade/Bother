import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateWaitlistEmailHtml } from "@/lib/email";

// Reuse singleton pooled transporter across invocations to avoid repeated SSL/SMTP handshakes
type Transporter = ReturnType<typeof nodemailer.createTransport>;
let cachedTransporter: Transporter | null = null;

function getTransporter(gmailUser: string, gmailPass: string): Transporter {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  }
  return cachedTransporter;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source, note } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const gmailUser = (process.env.GMAIL_USER || "kshitij.dagade0907@gmail.com").trim();
    const gmailPass = (process.env.GMAIL_PASS || "lukfpowrzdozefps").trim();

    if (!gmailUser || !gmailPass) {
      console.warn("Nodemailer: GMAIL_USER or GMAIL_PASS is missing.");
      return NextResponse.json({
        error: "Gmail credentials not configured.",
      }, { status: 500 });
    }

    const transporter = getTransporter(gmailUser, gmailPass);
    const emailHtml = generateWaitlistEmailHtml(email);

    // 1. User confirmation email dispatch
    const userMailPromise = transporter.sendMail({
      from: `"BOTHER" <${gmailUser}>`,
      to: email,
      subject: "You're on the BOTHER waitlist — You're not the only one.",
      text: "You are on the BOTHER waitlist! Everyone has something they're trying to figure out. BOTHER helps you find people who've been through it and discover what actually helped.",
      html: emailHtml,
    });

    // 2. Admin alert notification dispatch (runs concurrently in parallel)
    const isAdminNotice = email.toLowerCase() !== gmailUser.toLowerCase();
    const adminMailPromise = isAdminNotice
      ? transporter.sendMail({
          from: `"BOTHER System" <${gmailUser}>`,
          to: gmailUser,
          subject: `New Waitlist Registration: ${email}`,
          text: `New user joined the waitlist!\n\nEmail: ${email}\nSource: ${source || "hero"}\nNote: ${note || "None"}\nTimestamp: ${new Date().toISOString()}`,
        }).catch((adminErr) => {
          console.warn("[Nodemailer] Admin alert notification error:", adminErr);
        })
      : Promise.resolve(null);

    // Wait for user email with concurrent admin dispatch
    const [info] = await Promise.all([userMailPromise, adminMailPromise]);

    return NextResponse.json({ success: true, messageId: (info as any)?.messageId });
  } catch (error: any) {
    console.error("[Nodemailer] Execution error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to dispatch email via Nodemailer" },
      { status: 500 }
    );
  }
}
