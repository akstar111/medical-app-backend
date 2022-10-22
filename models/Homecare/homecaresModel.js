// ============================================================
// import mongoose
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const homecareSchema = new mongoose.Schema({
    bannerImage: {
        type: String,
        required: [true, 'Banner image should be included.'],
        default:
            'https://medi-app360.s3.ap-south-1.amazonaws.com/photo_2022-09-07_00-38-23.jpg'
    },
    serviceName: {
        type: String,
        required: [true, 'Service name should be included.']
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['company', 'individual']
    },

    city: {
        type: String,
        required: [true, 'City should be included.']
    },

    description: {
        type: String,
        required: [true, 'Description should be included.']
    },
    priceFrom: {
        type: Number,
        required: true
    },
    priceTo: {
        type: Number,
        required: true
    },
    serviceImages: [String],
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    hiwhcssms: {
        type: String,
        unique: [true, 'Something went wrong please try again.'],
        required: true
    },
    cause: { type: String },
    actionDate: { type: Date },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true]
    },
    createdAt: {
        type: Date,
        required: true
    },
    partnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: [true, 'Application must contain partner id.']
    },
    createdBy: {
        type: String,
        required: true,
        enum: ['vendor', 'admin'],
        default: 'vendor'
    }
});

// ============================================================
// ============================================================
// create mongoose model
const homecareModel = mongoose.model('Homecare Services', homecareSchema);

// ============================================================
// export model
module.exports = homecareModel;
