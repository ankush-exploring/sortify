import nodemailer from "nodemailer";

let transporter = null;
let initPromise = null;

async function initTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const testTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    try {
      await testTransporter.verify();
      transporter = testTransporter;
      console.log("SMTP connected —", process.env.SMTP_USER);
      return;
    } catch {
      console.log("SMTP verification failed, falling back to Ethereal");
    }
  }

  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  console.log("Using Ethereal email — preview at https://ethereal.email");
}

function getTransporter() {
  if (!initPromise) {
    initPromise = initTransporter();
  }
  return initPromise.then(() => transporter);
}

const fromAddress = process.env.SMTP_FROM || "Sortify <sortify@ethereal.email>";

export const sendMail = async (to, subject, text) => {
  const transport = await getTransporter();
  if (!transport) {
    console.log(`Email skipped (no transporter): ${subject} -> ${to}`);
    return { sent: false, reason: "Mailer not initialized" };
  }
  try {
    const info = await transport.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
    });

    if (process.env.SMTP_HOST) {
      console.log("Email sent:", info.messageId);
    } else {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`Ethereal preview URL: ${previewUrl}`);
    }

    return { sent: true, id: info.messageId, etherealUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error("Mail error", error.message);
    return { sent: false, reason: error.message };
  }
};
