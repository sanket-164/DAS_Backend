import express from 'express';

import { citizenLogin, getToken, setAppointment } from "../Controllers/Citizen.js";
import verifyUser from '../Middlewares/verifyUser.js';

const router = express.Router();

router.post('/login', citizenLogin);

router.post('/gettoken', getToken);

router.use(verifyUser);
router.post('/setappointment', setAppointment);

export default router;