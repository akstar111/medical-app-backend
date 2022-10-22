// ============================================================
// import libraries
const mongoose = require('mongoose');
const { validate } = require('uuid');

// ============================================================
// create schema
const assignAmbulanceDriverSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ambulance Drivers',
        required: true
    },
    driverEID: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true,
        enum: ['pending', 'started'],
        default: 'pending'
    },
    userLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    diverLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    createdAt: {
        type: Date,
        required: true
    },
    naahiwabdsID: {
        required: true,
        type: String
    }
});

// ============================================================
// create schema
const assignAmbulanceModel = mongoose.model(
    'Ambulance Service Assign Drivers',
    assignAmbulanceDriverSchema
);

// ============================================================
// export modeule
module.exports = assignAmbulanceModel;
