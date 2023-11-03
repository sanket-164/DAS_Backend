import express from 'express';

import { OfficerLogin } from "../Controllers/Officer.js";

const router = express.Router();

router.post('/login', OfficerLogin);

export default router;