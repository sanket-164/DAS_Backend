import Officer from '../Models/Officer.js';
import createHttpError from "http-errors";

export const OfficerLogin = (req, res, next) => {

    try {
        const { email, password } = req;

        if(!email && !password){
            throw createHttpError(400, "Parameters are not provided");
        }

        

    } catch (error) {
        next(error);
    }
}