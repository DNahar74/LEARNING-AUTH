// We are using nodemailer to send mails for various things

import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

import Users from '@/models/user.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendEmail = async ({email, emailType, userId}: any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    switch (emailType) {
      case "VERIFICATION":
        await Users.findByIdAndUpdate(userId, {$set:{
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000                            // 1 hour from now
        }});
        break;
      case "PASSWORD_RESET":
        await Users.findByIdAndUpdate(userId, {$set:{
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000                    // 1 hour from now
        }});
        break;
      default:
        break;
    }

    const transporter = nodemailer.createTransport({
      //! These details should not be in the public, they should be in the env variables
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "2b22e88a237099",
        pass: "7ccd5ba355a70b"
      }
    });

    let subject = '';

    switch (emailType) {
      case "VERIFICATION":
        subject = "Verify your email";
        break;
      case "PASSWORD_RESET":
        subject = "Reset your password";
        break;
      default:
        break;
    }

    console.log(userId);                                          // todo: Just added to remove eslint-error, if not needed remove

    const mailOptions = {
      from: "myMail@gmail.com",
      to: email,
      subject: subject,
      // text: "Hello world?",
      html: `<p>Click <a href="${process.env.DOMAIN_URI}/verifyemail?token=${hashedToken}">Here</a> 
      to ${subject} or copy and paste the link in your browser.
      <br>
      ${process.env.DOMAIN_URI}/verifyemail?token=${hashedToken}</p>`,
    }

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in sending Email :: \n" + error);
    throw new Error(error.message);
  }
}