// import emailjs from "emailjs-com";

// const sendEmail = async (otp, email, name = "User") => {
//   try {
//     if (!otp || !email) {
//       return next({ status: 400, message: "All fields required" });
//     }
//     const res = emailjs.send(
//       process.env.EMAILJS_SERVICE_ID,
//       process.env.EMAILJS_TEMPLATE_ID,
//       {
//         otp,
//         email,
//       },
//       process.env.EMAILJS_PUBLIC_KEY
//     );
//     console.log("Email sent successfully");
//     return res;
//   } catch (error) {
//     console.log("Error in Sending email: ", error);
//     next(error);
//   }
// };

// export default sendEmail;

import nodemailer from "nodemailer";

const sendOtp = async (to, otp, name = "User") => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "idioticminds0@gmail.com",
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"IdioticMinds" <idioticminds0@gmail.com>`,
      to,
      subject: "Your OTP – IdioticMinds",
      html: `
      <div style="font-family:Arial;padding:20px;">
        <h2>IdioticMinds</h2>
        <p>Hii, <strong>${name}</strong></p>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Do not share this code.</p>
      </div>
    `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error in sending email: ", error);
  }
};

export default sendOtp;
