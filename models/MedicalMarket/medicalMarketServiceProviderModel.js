// ============================================================
// import package
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// crete mongoose schema
const medicalMarketServiceProviderSchema = new mongoose.Schema({
    contactPersonName: {
        type: String,
        required: [true, 'Contact person name should be inlcuded.']
    },
    contactPersonPhone: {
        type: String,
        required: [true, 'contact person phone numbers hould be included.']
    },
    storeName: {
        type: String,
        required: [true, 'Store name should be inlcluded.']
    },
    storePhone: {
        type: String,
        required: [true, 'Store phone should be included.']
    },
    landline: {
        type: String
    },
    storeEmail: {
        type: String,
        trim: true,
        unique: [true, 'This email already used. please try new email.'],
        lowercase: true,
        validate: [validator.isEmail, 'Please Enter the valid Email.']
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    openTime: {
        type: String,
        required: [true, 'Open time should be included.']
    },
    closeTime: {
        type: String,
        required: [true, 'Close time should be included.']
    },
    address: {
        type: String,
        required: [true, 'Address should be included.']
    },
    createdAt: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true]
    },
    partnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: [true, 'Application must contain partner id.']
    },
    hiwmmspmID: {
        type: String,
        unique: [true, 'Something went wrong please try again.'],
        required: true
    }
});

// ============================================================
// create shcmea
const medicalMarketServiceProviderModel = mongoose.model(
    'Medical Market Service Provider',
    medicalMarketServiceProviderSchema
);

// ============================================================
// export model
module.exports = medicalMarketServiceProviderModel;
