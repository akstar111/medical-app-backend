// ============================================================
// import packages
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const hearingAidProductSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: [true, 'Product name should be included.']
        },
        description: {
            type: String,
            required: true
        },
        bannerImage: {
            type: String,
            required: true
        },
        imageGallery: [String],
        city: {
            type: String,
            required: [true, 'Store city should be included.']
        },
        address: {
            type: String,
            required: [true, 'Address should be included.']
        },
        price: {
            type: Number,
            required: [true, 'Price should be included.']
        },
        discountPrice: {
            type: Number
        },
        productType: {
            type: String,
            required: [true, 'Product type should be included.'],
            enum: ['OF', 'RIC', 'BTE', 'ITE', 'ITC', 'CIC']
        },
        productDetails: [
            {
                color: {
                    type: String,
                    required: true
                },
                bannerImage: {
                    type: String,
                    required: [true, 'Banner image should be included.']
                },
                imageGallery: [String],
                subDetails: [
                    {
                        size: {
                            type: String,
                            required: true
                        },
                        price: {
                            type: Number,
                            required: true
                        },
                        discountPrice: {
                            type: Number
                        },

                        hiwhaicscpID: {
                            type: String,
                            required: true
                        }
                    }
                ],
                hiwhapdsID: {
                    type: String,
                    required: true
                }
            }
        ],
        features: {
            type: Array,
            required: true
        },
        createdAt: {
            type: Date,
            required: true
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'hearing aid must contain userId.']
        },
        partnerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner',
            required: [true, 'hearing aid must contain partner.']
        },
        hiwhapnsID: {
            type: String,
            unique: [true, 'Something went wrong please try again.']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// virtural populte for partner
hearingAidProductSchema.virtual('partner', {
    ref: 'Partner',
    localField: 'partnerId',
    foreignField: '_id'
});

// ============================================================
// create mongoose model
const hearingAidProductModel = mongoose.model(
    'Hearing AID Products',
    hearingAidProductSchema
);

// ============================================================
// exports create hearing aid
module.exports = hearingAidProductModel;
