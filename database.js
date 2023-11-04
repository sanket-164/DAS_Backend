import mongoose from "mongoose";
import "dotenv/config";

const CON_STRING = "mongodb://0.0.0.0:27017/DAS";

const connectToDatabase = () => {
    return mongoose.connect(process.env.CONNECTION_STRING);
    // return mongoose.connect(CON_STRING);
}

export default connectToDatabase;