// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const orgaonDonationSchema = mongoose.Schema({
    organName: {
        type: String,
        required: [true, 'Please enter the organ name']
    },
    hospitalName: {
        type: String,
        required: [true, 'Please enter your hospital name']
    },
    address: {
        type: String,
        required: [true, 'Address should be included']
    },
    description: {
        type: String
    },
    bannerImage: {
        type: String,
        required: [true, 'Banner image should be included']
    },
    createdAt: {
        type: Date,
        required: [true, 'Please select created date']
    },
    availablity: {
        type: Boolean,
        required: [true, 'Availablity should be included.'],
        default: true
    },
    phone: {
        type: String,
        requied: [true, 'Phone number should be included.']
    },
    partnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: [true, 'de-addiction must contain partner.']
    }
});

// ============================================================
// create mongoose model
const orgaonModel = mongoose.model('Organ Donation', orgaonDonationSchema);

// ============================================================
// cexoirt model
module.exports = orgaonModel;
