import { isHttpError } from "http-errors";

export const errorHandler = (error, req, res, next) => {
    console.log(error);

    let errMsg = "Unknown error occured";
    let statusCode = 500;

    if (error instanceof Error) errMsg = error.message;
    if (isHttpError(error)) statusCode = error.status;

    res.status(statusCode).json({ success: false, message: errMsg });
}