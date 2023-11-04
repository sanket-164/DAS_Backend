import express from 'express';

import { citizenLogin, setAppointment } from "../Controllers/Citizen.js";

const router = express.Router();

router.post('/login', citizenLogin);

router.post('/setappointment', setAppointment);

export default router;