// ============================================================
// import packages
const mongoose = require('mongoose');
const { validate } = require('uuid');

// ============================================================
// create mongoose schema
const differentlyabledProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Product name should be included.']
    },
    bannerImage: {
        type: String,
        required: [true, 'cover image should be included.']
    },
    imageGallery: {
        type: Array
    },
    meterialType: {
        type: String,
        required: [true, 'Material type should be included.']
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    productType: {
        type: String,
        required: [true, 'Product type should be included.'],
        enum: ['wheelchar', 'leg', 'hand', 'support-stick']
    },
    fitType: {
        type: String,
        enum: ['left', 'right']
    },
    productDescription: {
        type: String,
        required: [true, 'Product Description should be included.']
    },
    hiwhapdpID: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (el) {
                return validate(el);
            },
            message: 'Something went wrong.Please try again.'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 0,
        max: 5,
        set: (val) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'hearing aid must contain userId.']
    },
    partnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: [true, 'hearing must contain partner.']
    },
    createdAt: {
        type: Date,
        required: true
    }
});

// ============================================================
// create model
const differentlyabledProductModel = mongoose.model(
    'Differently abled products',
    differentlyabledProductSchema
);

// ============================================================
// export products
module.exports = differentlyabledProductModel;
