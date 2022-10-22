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
            type: String,
            required: [true, 'Phone number should be included.']
        },
        address: String,
        amount: {
            type: Number,
            required: [true, 'Please enter how much you are going to donate.']
        },
        view: {
            type: Boolean,
            required: [true, 'Please select status of your donation.']
        },
        about: {
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
        patientId: {
            type: mongoose.Schema.ObjectId,
            ref: 'New Donation Requestor'
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
            type: Date
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// virtual populate

newDonnerSchema.virtual('patient', {
    ref: 'New Donation Requestor',
    localField: 'patientId',
    foreignField: '_id'
});

// ============================================================
// create donner model
const donnerModel = mongoose.model('new Donner', newDonnerSchema);

// ============================================================
// export donner model
module.exports = donnerModel;
