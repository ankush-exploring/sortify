import nodemailer from "nodemailer";

let transporter = null;
let fromAddress = "Sortify <sortify@ethereal.email>";

async function init() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false },
    });
    fromAddress = process.env.SMTP_FROM || `Sortify <${process.env.SMTP_USER}>`;
    console.log("Mailer: SMTP configured —", process.env.SMTP_HOST, process.env.SMTP_USER);
    return;
  }

  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    fromAddress = process.env.SMTP_FROM || "Sortify <sortify@ethereal.email>";
    console.log("Mailer: using Ethereal — preview at https://ethereal.email");
  } catch {
    console.log("Mailer: no SMTP configured, emails disabled");
  }
}

const ready = init();

export const sendMail = async (to, subject, text) => {
  await ready;
  if (!transporter) {
    console.log(`Email skipped: ${subject} -> ${to}`);
    return { sent: false, reason: "Mailer not configured" };
  }
  try {
    const info = await transporter.sendMail({ from: fromAddress, to, subject, text });

    if (process.env.SMTP_HOST) {
      console.log("Email sent:", info.messageId);
    } else {
      const url = nodemailer.getTestMessageUrl(info);
      console.log(`Ethereal preview: ${url}`);
    }

    return { sent: true, id: info.messageId, etherealUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error("Mail error:", error.message);
    return { sent: false, reason: error.message };
  }
};
