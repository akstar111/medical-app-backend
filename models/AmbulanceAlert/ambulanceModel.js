// ============================================================
// import libraries
const mongoose = require('mongoose');
const { validate } = require('uuid');

// ============================================================
// create schema
const ambulanceSchema = new mongoose.Schema({
    driverLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    tempUserLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    verification: {
        type: String,
        required: true,
        enum: ['waiting', 'requested', 'accepted', 'rejected'],
        default: 'waiting'
    },
    userLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    destinationLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    patientImage: {
        type: String
    },
    ambulanceNumber: {
        type: String
    },
    status: {
        type: String,
        required: [true, 'Status should be included.'],
        enum: [
            'requested',
            'waiting',
            'started',
            'pickuped',
            'reached',
            'canceled'
        ],
        default: 'requested'
    },
    responseDescription: { type: String },
    previousLocations: [Object],
    hiwalbcmID: {
        type: String,
        required: true,
        unique: [true, 'Something went wrong please try again.'],
        validate: {
            validator: function (el) {
                return validate(el);
            },
            message:
                'Something went wrong while processing your requrest.Please try again.'
        }
    },
    ambulanceDriverID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ambulance Drivers'
    },
    ambulanceDriverEID: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true
    },
    driverAssignedTime: {
        type: Date
    },
    driverToPatientStartedTime: {
        type: Date
    },
    driverRequestTime: {
        type: Date
    },
    adminResponseTime: { type: Date },
    patientToHospitalStartedTime: {
        type: Date
    },
    completedTime: { type: Date },
    assignedUser: {
        type: String,
        required: true
    }
});

// ============================================================
// create model
const ambulanceModel = mongoose.model('Ambulance Alert', ambulanceSchema);

// ============================================================
// export model
module.exports = ambulanceModel;
