import {Injectable} from "@app/decorators";
import config from "@app/config/config";
import nodemailer from 'nodemailer';

interface SendMailOptions {
  from?: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

@Injectable()
export class MailService {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.secure,
      auth: {
        user: config.mail.username,
        pass: config.mail.password,
      },
    });

    this.transporter.verify().catch((err) => {
      console.error('Error verifying nodemailer transporter:', err);
      throw err;
    });
  }

  async send(options: SendMailOptions) {
    const info = await this.transporter.sendMail({
      from: options.from ?? config.mail.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    return info;
  }
}
