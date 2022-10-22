// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const medicalMarketProductWhislit = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'User id should be included.']
    },
    productEID: {
        type: String,
        required: [true, 'Product E-id should be included.']
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Medical Market Products',
        required: [true, 'product id should be included.']
    },
    hiwmmpwlID: {
        required: true,
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

// ============================================================
// create model
const medicalMarketProductWishtlistModel = mongoose.model(
    'Medical Market Product Wishlist',
    medicalMarketProductWhislit
);

// ============================================================
// export model
module.exports = medicalMarketProductWishtlistModel;
