// ============================================================
// import libraires
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const opticalSBookingchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'opticals must contain userId.']
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    scheduledTime: {
        type: String
    },
    status: {
        type: String,
        enum: [
            'pending',
            'accepted',
            'rejected',
            'completed',
            'not-arrived',
            'canceled'
        ],
        default: 'pending'
    },
    partnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: [true, 'opticals must contain partner.']
    },
    hiwosopsID: {
        type: String,
        required: true
    },
    vendorAcceptedDate: Date,
    vendorAcceptedDescription: String,
    VendorRejectedDate: Date,
    VendorRejectedDescription: String,
    vendorStatusResponseDate: Date,
    vendorStatusResponseDescription: String,
    userResponseDate: Date,
    userResponseDescription: String,
    createdAt: {
        type: Date,
        required: true
    }
});

// ============================================================
// create model
const opticalModel = mongoose.model('Optical Booking', opticalSBookingchema);

// ============================================================
// export optical model
module.exports = opticalModel;
