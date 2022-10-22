// ============================================================
// import libreries
const mongoose = require('mongoose');

// ============================================================
// create schema
const meetExpertServiceApplicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'Application must contain userId.']
        },
        serviceDetails: {
            type: Object,
            required: [true, 'Homecare service details should be included.']
        },
        addressDetails: {
            type: Object,
            required: [true]
        },
        partnerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner',
            required: [true, 'Application must contain partner id.']
        },
        meetTheExpertId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Meet The Expert',
            required: [
                true,
                'Application must contain home care expert serviceid.'
            ]
        },
        paymentMethod: {
            type: String,
            default: 'payment'
        },
        createdAt: {
            type: Date
        },
        expertEID: {
            type: String,
            required: true
        },
        userDescription: {
            type: String
        },
        userRespondBy: {
            type: String,
            default: 'user',
            enum: ['user', 'admin']
        },
        userActionDate: { type: Date },
        vendorDescription: {
            type: String
        },
        vendorRespondBy: {
            type: String,
            default: 'vendor',
            enum: ['vendor', 'admin']
        },
        vendorActionDate: { type: Date },
        hiwmthebsID: {
            type: String,
            required: true
        },
        userActioniDate: {
            type: Date
        },

        status: {
            type: String,
            default: 'pending',
            enum: ['pending', 'accepted', 'rejected', 'canceled', 'completed'],
            required: true
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// ============================================================
// create model
const bookExpertModel = mongoose.model(
    'Book Meet The Expert',
    meetExpertServiceApplicationSchema
);

module.exports = bookExpertModel;
