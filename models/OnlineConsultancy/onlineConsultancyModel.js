// ============================================================
// import libraries
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// create mongoose schema
const onlineConsultanationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            trim: true,
            unique: [true, 'This email already used. please try new email.'],
            lowercase: true,
            required: [true, 'Email should be included'],
            validate: [validator.isEmail, 'Please Enter the valide Email.']
        },
        profileImage: {
            type: String,
            default:
                'https://medi-app360.s3.amazonaws.com/1652723237848-cover.jpg'
        },
        addressProof: {
            type: String,
            required: true
        },
        clinicName: {
            type: String
        },
        clinicNumber: {
            type: String
        },
        counselingNumber: {
            type: String
        },
        website: {
            type: String
        },
        location: [Number],
        clinicAddress: {
            type: String
        },
        clinicPhotos: [String],
        clinicLicence: {
            type: String
        },
        GST: {
            type: String
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'speaktous must contain userId.']
        },
        createAt: {
            type: Date,
            required: true
        },
        partnerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner',
            required: [true, 'Application must contain partner id.']
        },
        hiwocmmID: {
            type: String,
            required: true
        },
        availablity: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// ============================================================
// create speak to us model
const onlineConsultancyModel = mongoose.model(
    'Doctor Online Consultancy',
    onlineConsultanationSchema
);

// ============================================================
// exports speakto us schema
module.exports = onlineConsultancyModel;
