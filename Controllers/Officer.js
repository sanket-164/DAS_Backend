import "dotenv/config";
import { createTransport } from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import Officer from '../Models/Officer.js';
import Appointment from "../Models/Appointment.js";
import Citizen from "../Models/Citizen.js";

const email_pass = process.env.EMAIL_PASS;
const email_user = process.env.EMAIL_USER;

const transporter = createTransport({
    service: "gmail",
    auth: {
        user: email_user,
        pass: email_pass,
    },
});

export const officerLogin = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        if (!(password && email)) throw createHttpError(400, "Required credentials are not provided");

        const existingOfficer = await Officer.findOne({ o_email: email });

        if (!existingOfficer) throw createHttpError(400, "Invalid credentials");

        const isPasswordCorrect = await bcrypt.compare(password, existingOfficer.o_password);

        if (!isPasswordCorrect) throw createHttpError(400, "Invalid credentials");

        const token = jwt.sign({ id: existingOfficer._id }, "12345678");

        res.status(200).json({ success: true, token: token });
    } catch (error) {
        next(error);
    }
}

export const getProfile = async (req, res, next) => {

    try {

        const existingOfficer = await Officer.findById(req.user.id);

        if (!existingOfficer) throw createHttpError(400, "Officer does not exist");

        res.status(200).json({ success: true, officer: existingOfficer });
    } catch (error) {
        next(error);
    }
}

export const setProfile = async (req, res, next) => {

    try {

        const { o_name, o_email, o_mobile } = req.body;

        const emailExist = await Officer.countDocuments({ o_email: o_email });
        const mobileExist = await Officer.countDocuments({ o_mobile: o_mobile });

        if (emailExist > 1) throw createHttpError(400, "Email is already used");
        if (mobileExist > 1) throw createHttpError(400, "Mobile Number is already used");

        const existingOfficer = await Officer.findById(req.user.id);

        if (!existingOfficer) throw createHttpError(400, "Officer does not exist");

        existingOfficer.o_name = o_name ? o_name : existingOfficer.o_name;
        existingOfficer.o_email = o_email ? o_email : existingOfficer.o_email;
        existingOfficer.o_mobile = o_mobile ? o_mobile : existingOfficer.o_mobile;

        existingOfficer.save();

        res.status(200).json({ success: true, officer: existingOfficer });
    } catch (error) {
        next(error);
    }
}

export const getAppointments = async (req, res, next) => {

    try {
        const existingAppointments = await Appointment.find();

        res.status(200).json({ success: true, appointments: existingAppointments });

    } catch (error) {
        next(error);
    }
}

export const scheduleAppointment = async (req, res, next) => {

    try {
        const { ap_id, datetime } = req.body;

        const existingAppointment = await Appointment.findById(ap_id);

        const citizenEmail = await Citizen.findOne({ adharcard: existingAppointment.c_adharcard }).select('c_email');

        existingAppointment.o_id = req.user.id;
        existingAppointment.ap_status = 'Scheduled';
        existingAppointment.ap_starts = datetime;

        const mailOptions = {
            from: email_user,
            to: citizenEmail,
            subject: "Appointment Time",
            html: `
                  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                      <div style="border-bottom:1px solid #eee">
                        <a href="#" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Digital Appointment</a>
                      </div>
                      <p style="font-size:1.1em"></p>
                      <p>Your appointment has been scheduled at time given below make sure to reach on given time.</p>
                      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</h2>
                      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>Junagadh District</p>
                        <p>Gujarat</p>
                      </div>
                      </div>
                      </div>
                      `,
        };

        existingAppointment.save();

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.json({ success: false });
            } else if (info) {
                res.status(200).json({ success: true, appointment: existingAppointment });
            }
        });

    } catch (error) {
        next(error);
    }
}

export const completeAppointment = async (req, res, next) => {

    try {

        const { ap_id, datetime } = req.body;

        const existingAppointment = await Appointment.findById(ap_id);

        existingAppointment.ap_status = 'Completed';
        existingAppointment.ap_end = datetime;

        existingAppointment.save();

        res.status(200).json({ success: true, appointment: existingAppointment });

    } catch (error) {
        next(error);
    }
}