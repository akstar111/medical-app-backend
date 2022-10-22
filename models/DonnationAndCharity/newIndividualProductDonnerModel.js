// ============================================================
// import libraries
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// create mongoose schema
const newDonnerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name should be included']
        },
        organization: String,
        email: {
            type: String,
            trim: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please Enter the valide Email.']
        },
        phone: {
            type: String
        },
        address: String,

        view: {
            type: Boolean,
            required: [true, 'view should be included.']
        },
        about: {
            type: String
        },
        deliveryProductStatus: {
            type: String,
            required: true,
            default: 'accepted',
            enum: ['accepted', 'outofdelivery', 'delivered']
        },
        outOfDeliveryDate: { type: Date },
        deliverdDate: { type: Date },
        bannerImage: {
            type: String,
            default:
                'https://medi-app360.s3.amazonaws.com/1652723237848-cover.jpg'
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'Donor must contain userId.']
        },
        patientId: {
            type: mongoose.Schema.ObjectId,
            ref: 'New Product Donation Requestor'
        },
        patientEId: {
            type: String
        },
        donationStatus: {
            type: Boolean,
            default: false,
            required: [true, 'Please select the donation status.']
        },
        createdAt: {
            type: Date,
            required: true
        },
        hiwdcipdsID: {
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
// create donner model
const donnerModel = mongoose.model(
    'new Request Product Donner',
    newDonnerSchema
);

// ============================================================
// export donner model
module.exports = donnerModel;
