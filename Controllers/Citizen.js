import "dotenv/config";
import { createTransport } from "nodemailer";
import createHttpError from "http-errors";
import Citizen from '../Models/Citizen.js';
import Appointment from "../Models/Appointment.js";
import jwt from "jsonwebtoken";

const email_pass = process.env.EMAIL_PASS;
const email_user = process.env.EMAIL_USER;

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: email_user,
    pass: email_pass,
  },
});

export const citizenLogin = async (req, res, next) => {

  try {
    const { adharcard } = req.body;
    const otp = Math.floor(Math.random() * 1000000 + 1);

    if (!(adharcard)) throw createHttpError(400, "Required credentials are not provided");

    const existingCitizen = await Citizen.findOne({ adharcard: adharcard });

    if (!existingCitizen) throw createHttpError(400, "Adharcard Number does not exist");

    const mailOptions = {
      from: email_user,
      to: existingCitizen.c_email,
      subject: "OTP For Login",
      html: `
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
              <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                  <a href="#" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Digital Appointment</a>
                </div>
                <p style="font-size:1.1em"></p>
                <p>Use the following OTP to complete your authentication procedure.</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp.toString()}</h2>
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                  <p>Junagadh District</p>
                  <p>Gujarat</p>
                </div>
              </div>
            </div>
            `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.json({ success: false });
      } else if (info) {
        let emailadd = existingCitizen.c_email;

        let i,
          str = "";
        for (
          i = 0;
          emailadd.slice(2, emailadd.indexOf("@") - 4).length > i;
          i++
        ) {
          str += "*";
        }

        emailadd = emailadd.replace(
          emailadd.slice(2, emailadd.indexOf("@") - 4),
          str
        );

        res.status(200).json({ success: true, otp: otp, message: `OTP sent to ${emailadd}` });
      }
    });

  } catch (error) {
    next(error);
  }
}

export const getToken = async (req, res, next) => {

  try {
    const { adharcard } = req.body;

    if (!(adharcard)) throw createHttpError(400, "Required credentials are not provided");

    const existingCitizen = await Citizen.findOne({ adharcard: adharcard });

    if (!existingCitizen) throw createHttpError(400, "Adharcard Number does not exist");

    const token = jwt.sign({ id: adharcard }, "12345678");

    res.status(200).json({ success: true, token: token });

  } catch (error) {
    next(error);
  }

}

export const setAppointment = async (req, res, next) => {

  try {

    const { ap_purpose } = req.body;

    console.log(req.user);

    const existingCitizen = await Citizen.findOne({ adharcard: req.user.id });
    const newAppointment = await Appointment.create({ c_adharcard: req.user.id, ap_purpose: ap_purpose, name: existingCitizen.c_name, image: existingCitizen.c_image });

    res.status(200).json({ success: true, appointment: newAppointment });

  } catch (error) {
    next(error);
  }
}