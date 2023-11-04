import express from 'express';

import { completeAppointment, getAppointments, getProfile, officerLogin, scheduleAppointment, setProfile } from "../Controllers/Officer.js";
import verifyUser from "../Middlewares/verifyUser.js";

const router = express.Router();

router.post('/login', officerLogin);

router.use(verifyUser);
router.get('/getprofile', getProfile);
router.get('/getappointments', getAppointments);

router.put('/setprofile', setProfile);
router.put('/schedule', scheduleAppointment);
router.put('/completeappointment', completeAppointment);

export default router;