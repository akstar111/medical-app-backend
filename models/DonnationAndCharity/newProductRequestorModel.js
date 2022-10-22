// ============================================================
// import libraries
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// create mongoose schema
const newProductRequestorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name should be included.']
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please Enter the valide Email.']
        },
        description: {
            type: String,
            required: [true, 'Please brief about your problem.']
        },
        phone1: {
            type: String,
            required: [true, 'Contact number 1 should be included.']
        },
        phone2: {
            type: String,
            required: [true, 'Contact number 2 should be included']
        },

        address: {
            type: String,
            required: [true, 'Please enter your full address.']
        },

        currentLocation: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number]
        },
        productType: {
            type: String,
            required: [true, 'Product type should be included.'],
            enum: ['wheelchar', 'leg', 'hand', 'support-stick']
        },
        fitType: {
            type: String,
            enum: ['left', 'right']
        },
        aadhaar: {
            type: String,
            required: [true, "user must be upload user's aadhaar  photo."]
        },
        disablityProof: {
            type: String,
            required: [
                true,
                ' user must be upload disablityProof proof  photo.'
            ]
        },
        donationStatus: {
            type: Boolean,
            required: true,
            default: false
        },
        productStatus: {
            type: String,
            enum: [
                'waiting',
                'accepted',
                'outofdelivery',
                'received',
                'canceled'
            ],
            default: 'waiting'
        },
        acceptedDate: { type: Date },
        outOfDeliveryDate: { type: Date },
        receivedDate: { type: Date },
        profileImage: {
            type: String,
            required: [true, 'banner image should be included']
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'Donor must contain userId.']
        },
        verified: {
            type: Boolean,
            required: [true],
            default: false
        },
        hiwdcnprmID: {
            type: String,
            unique: true
        },

        createdAt: { type: Date, required: true }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// ============================================================
// create model
const productRequestorModel = mongoose.model(
    'New Product Donation Requestor',
    newProductRequestorSchema
);

// ============================================================
// export requestor model
module.exports = productRequestorModel;
