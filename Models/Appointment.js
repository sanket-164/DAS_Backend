import mongoose from "mongoose";

const Appointment = mongoose.Schema({
    c_adharcard: {
        type: String,
        required: true,
    },
    o_id: {
        type: String,
        required: true,
    },
    ap_starts: {
        type: Date,
        required: true,
    },
    ap_ends: {
        type: Date,
        required: true
    },
    ap_status: {
        type: String,
        default: 'Pending',
    },
    ap_purpose: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Appointment', Appointment);