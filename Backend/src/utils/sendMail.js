import nodemailer from "nodemailer";

const sendMailNotification = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    server: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GOOGLE_USER,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  const mailSent = await transporter.sendMail(mailOptions);
  if (mailSent) {
    return true;
  } else {
    return false;
  }
};

export { sendMailNotification };