// ============================================================
// import libraries
const mongoose = require('mongoose');
const { validate } = require('uuid');

// ============================================================
// create schema
const bloodRequestorSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: [true, 'Patient name should be included.']
    },
    contactName: {
        type: String,
        required: [true, 'Contact name should be included.']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number should be included.']
    },
    bloodGroup: {
        type: String,
        required: [true, 'Donner blood group should be included.'],
        enum: ['o+', 'b+', 'o-', 'ab+']
    },
    unitsRequird: {
        type: String,
        required: [true, 'Units should be included.'],
        max: 4
    },
    requriedDate: {
        type: Date,
        required: [true, 'Required date should be included.']
    },
    hospitalName: {
        type: String,
        required: [true, 'Hospital name should be included.']
    },
    hospitalAddress: {
        type: String,
        required: [true, 'Hospital Address should be included.']
    },
    opertionType: {
        type: String,
        required: [true, 'operation type should be include.']
    },
    description: {
        type: String,
        required: [true, 'Description should be included.']
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    hiwnbrID: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (el) {
                return validate(el);
            },
            message:
                'Something went wrong while processing your requrest.Please try again.'
        }
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inActive', 'completed'],
        default: 'active'
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true]
    },

    createdAt: {
        type: Date,
        required: true
    }
});

// ============================================================
// crate model
const bloodRequestorModel = mongoose.model(
    'Blood Donation blood requester',
    bloodRequestorSchema
);

// ============================================================
// export model
module.exports = bloodRequestorModel;
