// ============================================================
// import libraires
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const opticalShowRoomSchema = new mongoose.Schema({
    opticalName: {
        type: String,
        required: true
    },

    storeAddress: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    openingTime: {
        type: String,
        required: true
    },
    closeTime: {
        type: String,
        required: true
    },
    landline: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'opticals must contain userId.']
    },
    partnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: [true, 'opticals must contain partner.']
    },
    hiwosrmID: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});

// ============================================================
// create model
const opticalShowroomModel = mongoose.model(
    'Opticals Showroom',
    opticalShowRoomSchema
);

// ============================================================
// export optical model
module.exports = opticalShowroomModel;
