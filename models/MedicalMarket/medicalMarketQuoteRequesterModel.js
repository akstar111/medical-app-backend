// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const medicalMarketQuoteSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        lowercase: true
    },
    proposalDate: {
        type: Date,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'User id should be included.']
    },
    hiwmmqrrsID: {
        type: String,
        required: true,
        unique: true
    },
    for: {
        type: String,
        required: true
    },
    estimateCost: {
        type: Number
    },
    limit: {
        type: Number
    },
    from: {
        type: String,
        required: true,
        default: 'Medical Market'
    },
    proposeStatus: {
        type: String,
        required: true,
        enum: [
            'requested',
            'proposal-submited',
            'accepted',
            'rejected-by-user',
            'rejected-by-vendor',
            'canceled',
            'completed'
        ],
        default: 'requested'
    },
    requestdescription: {
        type: String
    },
    userDescription: {
        type: String
    },
    requestPartnerID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: [true, 'product must contain partner.']
    },
    requestedPartnerEID: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    sampleImage: [String],
    vendorActionDate: {
        type: Date
    },
    userActionDate: {
        type: Date
    }
});

// ============================================================
// create model
const medicalMarketQuoteRequestorModel = mongoose.model(
    'Medical Market Quote Request',
    medicalMarketQuoteSchema
);

// ============================================================
// export model
module.exports = medicalMarketQuoteRequestorModel;
