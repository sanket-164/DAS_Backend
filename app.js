import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import createHttpError from 'http-errors';
import morgan from 'morgan';

import { errorHandler } from './Middlewares/errorHandler.js';
import officerRoutes from './Routes/Officer.js';
import citizenRoutes from './Routes/Citizen.js';
import Officer from './Models/Officer.js';

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Hello World!" });
});

app.get('/getofficer', async (req, res) => {
    const officer = await Officer.findOne();
    console.log(officer);
    res.json({ officer: officer });
});

app.use('/officer', officerRoutes);
app.use('/citizen', citizenRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, req.url + " URL not found"));
});

app.use(errorHandler);

export default app;