// ============================================================
// import libraries
const mongoose = require('mongoose');
const validator = require('validator');
const { validate } = require('uuid');

// ============================================================
// create mongoose schema
const productDonnerSchema = new mongoose.Schema(
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
            type: String,
            required: [true, 'Phone number should be included.']
        },
        address: String,
        producQuantity: {
            type: Number,
            required: [true, 'Please enter the quntity of product.']
        },
        product: {
            type: String,
            required: [true, 'Please enter the name of product.']
        },
        view: {
            type: Boolean,
            required: [true, 'Please select status of your donation.']
        },
        description: {
            type: String,
            required: [true, 'Please breif about yourself.']
        },
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
        receivedToAdmin: {
            type: String,
            enum: ['waiting', 'not-received', 'received'],
            default: 'waiting'
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
        hiwpdsID: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (el) {
                    return validate(el);
                },
                message: 'Something went wrong while processing your requrest.'
            }
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// ============================================================
// create donner model
const proudctDonnerModel = mongoose.model(
    'new Product Donner',
    productDonnerSchema
);

// ============================================================
// export donner model
module.exports = proudctDonnerModel;
