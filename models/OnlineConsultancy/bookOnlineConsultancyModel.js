// ============================================================
// import packages
const mongoose = require('mongoose');

// ============================================================
// create schema
const bookDoctorOnlineConsultancyShema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'speaktous must contain userId.']
    },
    hiwdocboEID: {
        type: String,
        required: true
    },
    doctorEID: {
        type: String,
        required: true
    },
    slotEID: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    via: {
        type: String,
        enum: ['online', 'opd'],
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['requested', 'accepted', 'rejected', 'canceled', 'completed'],
        default: 'requested'
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true
    },
    cancelTime: {
        type: Date
    },
    bookType: {
        type: String,
        required: true
    }
});

// ============================================================
// create model
const bookDoctorOnlineConsultancyModel = mongoose.model(
    'Doctor Online Consultant Slot Booking',
    bookDoctorOnlineConsultancyShema
);

// ============================================================
// export model
module.exports = bookDoctorOnlineConsultancyModel;
