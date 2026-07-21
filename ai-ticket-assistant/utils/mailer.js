import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromAddress =
  process.env.RESEND_FROM || "Sortify <onboarding@resend.dev>";

export const sendMail = async (to, subject, text) => {
  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text,
    });

    if (error) {
      console.error("Resend error", error);
      throw error;
    }

    console.log("Email sent:", data?.id);
    return data;
  } catch (error) {
    console.error("Mail error", error.message);
    throw error;
  }
};
