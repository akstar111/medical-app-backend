// ============================================================
// import packages
const mongoose = require('mongoose');
const { validate } = require('uuid');

// ============================================================
// mongoose model
const ambulanceQuotesSchema = new mongoose.Schema({
    bookingDate: {
        type: Date,
        required: [true, 'Booking date should be included.']
    },
    bookingTime: {
        type: String,
        required: [true, 'Booking Time should be included.']
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'quotes must contain userId.']
    },
    requestedService: {
        type: Array,
        required: [true, 'Requested Services should be included.']
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

    createdAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: [
            'requested',
            'responded',
            'accepted',

            'rejected',
            'canceled',
            'completed'
        ],
        default: 'requested'
    },
    providerResponstTime: {
        type: Date
    },
    respondedBy: {
        type: String,
        default: 'partner',
        enum: ['admin', 'partner']
    },
    vendorRespondDescription: {
        type: String
    },
    userRespondTime: {
        type: Date
    },
    userRespondedBy: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    },
    userRespondDescription: {
        type: String
    },
    canceledBy: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    },
    cancelDescription: {
        type: String
    },
    completedTime: {
        type: Date
    },
    fulfillDescription: {
        type: String
    },
    completedBy: {
        type: String,
        default: 'partner',
        enum: ['admin', 'partner']
    },
    canceledTime: {
        type: Date
    },
    hiwnrqID: {
        type: String,
        required: [true],
        unique: true,
        validate: {
            validator: function (el) {
                return validate(el);
            },
            message:
                'Something went wrong while processing your requrest.Please try again.'
        }
    },
    providerUserId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true]
    },
    providerEID: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    quoteAmount: {
        type: Number
    },
    assignedAmbulanceDriver: {
        name: String,
        phone: String,
        driverProfile: String,
        _id: String
    },
    assignedAmbulance: {
        ambulanceNumber: String,
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number]
        },
        services: String,
        id: String
    },
    ambulanceAssignedTime: {
        type: Date
    }
});

// ============================================================
// create mongoose model
const ambulanceQuotesModel = mongoose.model(
    'Ambulance Service Quotes',
    ambulanceQuotesSchema
);

// ============================================================
// export model
module.exports = ambulanceQuotesModel;
