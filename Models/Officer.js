import mongoose from "mongoose";

const Officer = mongoose.Schema({
    o_name: {
        type: String,
        required: true,
    },
    o_email: {
        type: String,
        required: true,
        unique: true,
    },
    o_mobile: {
        type: String,
        required: true,
        unique: true,
    },
    o_password: {
        type: String,
        required: true
    },
    o_image: {
        type: String,
        required: true
    },
    o_designation: {
        type: String,
        required: true
    },
    o_address: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Officer', Officer);