import type { NextApiRequest, NextApiResponse } from "next";
const nodemailer = require("nodemailer");

//setting up auth: https://miracleio.me/snippets/use-gmail-with-nodemailer/
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("log: body", req.body.email);

  if (req.method === "POST") {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        ...req.body,
        from: process.env.EMAIL_USERNAME,
        to: req.body.email,
        subject: `Contact Us - ${req.body.subject}`,
        text: `
        
        Subject: ${req.body.subject}

        Dear ${req.body.name},

        Thank you for reaching out to us. We appreciate your interest in our company and the time you've taken to fill out our contact form.
        
        ----------------------------------
        name: ${req.body.name}
        email: ${req.body.email}
        subject: ${req.body.subject}
        message: ${req.body.message}
        ----------------------------------

        Best regards,
        John
        SpamCntrl
        `,
      };

      transporter.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
          console.log(error);
          res.status(500).send({
            message: error,
          });
        } else {
          console.log("Email sent: " + info.response);
          // do something useful
          res.status(200).end();
        }
      });
    } catch (err) {
      res.status(500).send({
        message: err,
      });
    }
  } else {
    res.status(405).end();
  }
}
