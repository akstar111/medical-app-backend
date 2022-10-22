// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// crete mongoose schema
const medicalMarketListSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: [true, 'Service should be include a name']
        },
        productStream: {
            type: String,
            required: true,
            lowercase: true
        },
        serviceName: {
            type: String,
            required: [true, "Service should be included a it's type"]
        },
        description: {
            type: String,
            required: [true, 'Please ellobrate about your service']
        },
        productType: {
            type: String,
            required: [true, 'Please select the product type'],
            enum: ['single', 'variable'],
            default: 'single'
        },
        price: {
            type: Number,
            required: [true, 'Price should be included.']
        },
        discountPrice: {
            type: Number
        },
        coverImage: {
            type: String,
            required: [true, 'banner image should be incluedd.']
        },
        imageGallery: [String],
        sellerName: {
            type: String,
            required: [true, 'Seller name should be inlcluded.']
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
        color: String,
        size: {
            type: String
        },
        productDetails: [
            {
                color: String,
                availableSize: [
                    {
                        size: {
                            type: String
                        },
                        price: {
                            type: Number
                        },
                        coverImage: { type: String },
                        discountPrice: {
                            type: Number,

                            default: 0
                        },
                        imageGallery: [String]
                    }
                ]
            }
        ],
        additionalProductDetails: {
            type: Object
            // required: true
        },
        aboutItem: {
            type: Array
            // required: true
        },
        parentEID: {
            type: String,
            required: [true]
        },
        hiwmmpmID: {
            type: String,
            required: true,
            unique: true
        },
        partnerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner',
            required: [true, 'market product must contain partner.']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// create virtual populate
medicalMarketListSchema.virtual('reviews', {
    ref: 'Medical Market Product Reviews',
    foreignField: 'marketId',
    localField: '_id'
});

// create virtual populate
medicalMarketListSchema.virtual('partner', {
    ref: 'Partner',
    foreignField: '_id',
    localField: 'partnerId',
    match: { status: 'accepted' }
});

// ============================================================
// create model
const medicalMarketProductModel = mongoose.model(
    'Medical Market Products',
    medicalMarketListSchema
);

// ============================================================
// medical market exports
module.exports = medicalMarketProductModel;
