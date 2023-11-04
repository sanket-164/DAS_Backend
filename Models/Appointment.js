import mongoose from "mongoose";

const Appointment = mongoose.Schema({
    c_adharcard: {
        type: Number,
        required: true,
    },
    name:{
        type: String,
    },
    image:{
        type: String,
    },
    o_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Officer"
    },
    ap_starts: {
        type: Date,
    },
    ap_end: {
        type: Date,
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