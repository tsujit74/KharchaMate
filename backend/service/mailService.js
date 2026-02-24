import nodemailer from "nodemailer";
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT == 465, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


export const verifyMailConnection = async () => {
  try {
    await transporter.verify();
    console.log("SMTP Server is ready");
  } catch (error) {
    console.error("SMTP connection failed:", error.message);
  }
};


export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!to || !subject || !html) {
      throw new Error("Missing email parameters");
    }

    const info = await transporter.sendMail({
      from: `"KharchaMate" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error("Email sending failed:", error.message);
    return { success: false };
  }
};