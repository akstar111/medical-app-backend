// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create schema
const ambulanceDriverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    },
    driverEId: {
        type: String,
        required: true
    },
    partnerID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: [true, 'quotes must contain partner.'],
        select: false
    },
    partnerEID: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    assignedDate: {
        type: Date,
        required: true
    },
    assignedTime: {
        type: String,
        required: true
    },
    quoteId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ambulance Service Quotes',
        required: [true, 'quotes must contain partner.'],
        select: false
    },
    quoteEId: {
        type: String,
        required: true
    },
    userStartLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    userDestinationLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    hiwadshsID: {
        type: String,
        unique: true
    },
    ambulaneDetails: {
        ambulanceNumber: {
            type: String,
            required: [true, 'Ambulance numbers hould be included.']
        },
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number]
        },
        services: [String],
        id: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        required: [true, 'Status should be included.'],
        enum: ['assigned', 'started', 'canceled', 'completed'],
        default: 'assigned'
    },
    startedTime: {
        type: Date
    },
    startedLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    canceledTime: {
        type: Date
    },
    canceledDescription: {
        type: String
    },
    completedTime: {
        type: Date
    },
    completedLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    }
});

// ============================================================
// create schema
const privateAmbulanceAssignModel = mongoose.model(
    'Ambulance Booking Drivers',
    ambulanceDriverSchema
);

// ============================================================
// export model
module.exports = privateAmbulanceAssignModel;
