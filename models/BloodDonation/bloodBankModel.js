// ============================================================
// import package
const mongoose = require('mongoose');
const validator = require('validator');
// ============================================================
// create new mongoose schema
const blookBankSchema = new mongoose.Schema({
    contactPersonName: {
        type: String,
        required: [true, 'Contact person name should be included.']
    },
    contactPersonPhone: {
        type: String,
        required: [true, 'Contact person phone should be included.']
    },
    email: {
        type: String,
        trim: true,
        unique: [true, 'This email already used. please try new email.'],
        lowercase: true,
        required: [true, 'Email should be included'],
        validate: [validator.isEmail, 'Please Enter the valide Email.']
    },
    bloodBankName: {
        type: String,
        required: [true, 'Blood bank name should be included.']
    },
    bloodBankPhone: {
        type: String,
        required: [true, 'Landline number should be included.']
    },
    landline: {
        type: String,
        required: [true, 'Landline number should be included.']
    },
    openTime: {
        type: String,
        required: [true, 'Blood bank name should b']
    },
    closeTime: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    address: {
        type: String,
        required: true
    },
    bloodDetails: [
        {
            bloodType: {
                type: String,
                requried: [true, 'Blood Details should be included.']
            },
            availableUnits: {
                type: Number,
                required: [true, 'Unites should be included.']
            },
            lastUpdate: {
                type: Date,
                required: true
            },
            hiwbbbdID: {
                type: String,
                required: true
            }
        }
    ],
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
    hiwbdbbmID: {
        type: String,
        unique: [true, 'Something went wrong please try again.'],
        required: true
    }
});

// ============================================================
// create mongoose model
const bloodbankModel = mongoose.model('Blood Bank', blookBankSchema);

// ============================================================
// export blood bank
module.exports = bloodbankModel;
