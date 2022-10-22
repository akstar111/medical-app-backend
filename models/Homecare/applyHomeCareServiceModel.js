// ============================================================
// import libreries
const mongoose = require('mongoose');

// ============================================================
// create schema
const homecareServiceApplicationSchema = new mongoose.Schema(
    {
        serviceDetails: {
            type: Object,
            required: [true, 'Homecare service details should be included.']
        },
        addressDetails: {
            type: Object,
            required: [true, 'Address details should be included.']
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
        status: {
            type: String,
            default: 'pending',
            enum: ['pending', 'accepted', 'rejected', 'canceled', 'completed'],
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
        hoemcareEID: {
            type: String,
            required: true
        },
        homecareID: {
            type: mongoose.Schema.ObjectId,
            ref: 'Homecare Services',
            required: true
        },
        createdAt: {
            type: Date,
            required: true
        },
        hiwhcssID: {
            type: String,
            required: true
        },
        fulfilId: {
            type: String,
            select: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// ============================================================
// create model
const applyHomeCareServiceModel = mongoose.model(
    'Home care Service Applications',
    homecareServiceApplicationSchema
);

module.exports = applyHomeCareServiceModel;
