// ============================================================
// import libraries
const mongoose = require('mongoose');
const validator = require('validator');

function arrayLimit(val) {
    if (val.length > 3) {
        return true;
    }
    return false;
}
// ============================================================
// create mongoose schema
const hospitalDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hospital name should be included.']
    },
    serviceName: {
        type: String,
        required: [true, 'Service name should be included.']
    },
    description: {
        type: String,
        required: [true, 'Description schould be included.']
    },
    bannerImage: {
        type: String,
        required: [true, 'Banner Image should be included.']
    },
    address: {
        type: String,
        required: [true, 'Please enter your address']
    },
    phone: {
        type: String,
        required: [true, 'Please enter your phone number']
    },

    email: {
        type: String,
        trim: true,
        unique: [true, 'This email already used. please try new email.'],
        lowercase: true,
        required: [true, 'Email should be included'],
        validate: [validator.isEmail, 'Please Enter the valide Email.']
    },
    landLineNumber: {
        type: String
    },
    whatsappNumber: {
        type: String
    },
    hospitalImages: {
        type: Array,
        minlength: 4,

        validate: [arrayLimit, '{PATH} upload atleast 4 images.'],
        required: [true, 'Service images should be included']
    },
    hospitalServices: {
        type: Array,
        required: [
            true,
            'Please Fill atleast fill one hospital service details.'
        ]
    },
    city: {
        type: String,
        required: [true, 'city should be included.']
    },
    hospitalFecilities: {
        type: Array,
        required: [
            true,
            'Please Fill atleast fill one hospital feclities details.'
        ]
    },
    speciliest: {
        type: Array,
        required: [true, 'Please Fill atleast fill one specilities details.']
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'hospital details must contain userId.']
    },

    partnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: [true, 'hospital details must contain partner.']
    },
    hiwhdsID: {
        type: String,
        required: true
    }
});

// ============================================================
// create model
const hospitalDetailsModel = mongoose.model(
    'Hospital Details',
    hospitalDetailsSchema
);

// ============================================================
// export hosptial tourism
module.exports = hospitalDetailsModel;
