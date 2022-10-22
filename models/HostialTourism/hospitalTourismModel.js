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
const tourismSchema = new mongoose.Schema({
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
    workingTimeFrom: {
        type: String,
        required: [true, 'Service should be include starts when']
    },
    workingTimeTo: {
        type: String,
        required: [true, 'Service should be include end when']
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
    hospitalRoomImages: {
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
    transPortDetails: {
        type: Array,
        required: [true, 'Please Fill atleast fill one transport details.']
    },
    hotelDetails: Array,
    restorentDetails: Array,
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'Home care must contain userId.']
    },

    partnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: [true, 'homecare must contain partner.']
    },
    parentHospitalTourismEID: {
        type: String,
        required: true
    },
    hiwhmtmsID: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});

// ============================================================
// create model
const tourismModel = mongoose.model('Hospital Tourism', tourismSchema);

// ============================================================
// export hosptial tourism
module.exports = tourismModel;
