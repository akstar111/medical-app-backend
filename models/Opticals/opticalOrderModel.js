// ============================================================
// import libraires
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const opticalOrderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    glassType: {
        type: String,
        required: true,
        enum: ['sun', 'power', 'read', 'computer']
    },
    glassGenderType: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    glassFrameType: {
        type: String,
        required: true,
        enum: ['full-rim', 'semi-rimless', 'rimless', 'low-brideg', 'wire']
    },
    frameType: {
        type: String,
        required: true,
        enum: [
            'rectangle',
            'oval',
            'round',
            'quare',
            'large',
            'horn',
            'browline',
            'aviator',
            'cateye',
            'oversized',
            'geomateric'
        ]
    },
    color: {
        type: String,
        required: true
    },
    availableSize: {
        type: String,
        required: true,
        enum: ['small', 'medium', 'large']
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    opticalPrice: {
        type: Number,
        required: true
    },
    opticalDiscountPrice: {
        type: Number
    },
    materiralType: {
        type: String,
        required: true,
        enum: ['plastic', 'acetate', 'wood', 'metal', 'taitanium']
    },
    addressDetails: {
        type: Object,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    productImageGallery: {
        type: Array
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'opticals must contain userId.']
    },
    partnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: [true, 'opticals must contain partner.']
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['placed', 'accepted', 'shipped', 'outofdelivery', 'delivered'],
        default: 'placed'
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'delivered', 'canceled'],
        default: 'pending'
    },
    cause: String,
    hiwonsmID: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    acceptedDate: Date,
    shippedDate: Date,
    outOfDeliveryDate: Date,
    canceledDate: Date,
    deliveredDate: {
        type: Date
    }
});

// ============================================================
// create model
const opticalOrderModel = mongoose.model('Optical Orders', opticalOrderSchema);

// ============================================================
// export model
module.exports = opticalOrderModel;
