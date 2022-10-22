// ============================================================
// import libraries
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// create mongoose schema
const newRequestorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name should be included.']
        },
        hospitalName: {
            type: String,
            required: [true, 'Hospital name should be included.']
        },
        cause: {
            type: String,
            required: [true, 'Cause should be included.']
        },
        hospitalCity: {
            type: String,
            required: [true, "Hospital's City should be included"]
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
        currentAddress: {
            type: String,
            required: [true, "User's current address should be included."]
        },
        hospitalAvailableTimeFrom: {
            type: String,
            required: [true, 'Available Time shoule be included.']
        },
        hospitalAvailableTimeTo: {
            type: String,
            required: [true, 'Available Time shoule be included.']
        },

        nativeAddress: {
            type: String,
            required: [true, "User's native address should be included."]
        },

        idProof1: {
            type: String,
            required: [true, "user must be upload user's id proof 1 photo."]
        },
        idProof2: {
            type: String,
            required: [true, " user must be upload user's id proof 2 photo."]
        },
        hospitalContactNumber: {
            type: String,
            required: [true, " user must be include hospital's phone number"]
        },
        hospitalLandLine: String,
        hospitalAddress: {
            type: String,
            required: [true, " user must be include hopital's address."]
        },
        patientReportSheet: {
            type: String,
            required: [true, " user must be upload user's report sheet."]
        },
        patientMedicalCertificate: {
            type: String,
            required: [true, " user must be upload user's medical certificate."]
        },
        admitedDate: {
            type: Date,
            required: [true, ' user must be include admited date.']
        },

        amount: {
            type: Number,
            required: [true, ' Enter how much amount you need']
        },
        amountRecived: {
            type: Number,
            required: [true, 'Received amount should be included'],
            default: 0
        },
        bannerImage: {
            type: String,
            required: [true, 'banner image should be included']
        },
        donationStatus: {
            type: Boolean,
            requried: [true, 'Status should be included.'],
            default: false
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
        hiwnrrsID: {
            type: String,
            unique: true
        },
        createdAt: { type: Date }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// ============================================================
// create model
const requestorModel = mongoose.model(
    'New Donation Requestor',
    newRequestorSchema
);

// ============================================================
// export requestor model
module.exports = requestorModel;
