// ============================================================
// import libraries
const mongoose = require('mongoose');

// create schema
const deaddtictionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name should be included']
        },
        phone: {
            type: String,
            required: [true, 'Phone should be included']
        },
        problem: {
            type: String,
            required: [true, 'Problem should be included']
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'Application must contain userId.']
        },
        partnerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner',
            required: [true, 'Application must contain partner id.']
        },
        deAddictionId: {
            type: mongoose.Schema.ObjectId,
            ref: 'De-Addiction Center',
            required: [
                true,
                'Application must contain home care expert serviceid.'
            ]
        },
        deaddictionCenterDetails: {
            type: Object,
            required: true
        },
        paymentMethod: {
            type: String
        },
        scheduledDate: {
            type: String
        },
        scheduledTime: {
            type: String
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
        createdAt: {
            type: Date,
            required: true
        },

        deaddictionEId: {
            required: true,
            type: String
        },

        status: {
            type: String,
            default: 'pending',
            enum: ['pending', 'accepted', 'canceled', 'rejected', 'completed'],
            required: true
        },
        hiwbdacns: {
            type: String,
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
const deaddtictionModel = mongoose.model(
    'Book De-Addiction Center',
    deaddtictionSchema
);

// ============================================================
// export de-addiction center
module.exports = deaddtictionModel;
