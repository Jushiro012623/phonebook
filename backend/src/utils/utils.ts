import {randomInt} from "crypto";
import {MailService} from "@app/services/mailer.service";

export const generateString = (length: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateSecureOTP = (length = 6): string => {
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += randomInt(0, 10).toString();
  }
  return otp;
}

export const sendPasswordReset = async (service: MailService, receiver: string, otp: string, referenceNo: string) => {
  await service.send({
    to: receiver,
    subject: "Password Reset Verification",
    text: `Your verification code is ${otp}. It expires in 15 minutes.`,
    html: `
          <h2>Password Reset</h2>
          <p>Your verification code is:</p>
          <h1>${otp}</h1>
          <p>Reference No: <strong>${referenceNo}</strong></p>
          <p>This code expires in <strong>15 minutes</strong>.</p>
        `,
  });
}
