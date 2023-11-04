import mongoose from "mongoose";

const Citizen = mongoose.Schema({
    adharcard: {
        type: Number,
        required: true,
    },
    c_name: {
        type: String,
        required: true
    },
    c_email: {
        type: String,
        required: true,
        unique: true,
    },
    c_mobile: {
        type: String,
        required: true,
        unique: true,
    },
    c_image: {
        type: String,
        required: true
    },
    c_address: {
        type: String,
        required: true
    },
    c_dob: {
        type: Date,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Citizen', Citizen);