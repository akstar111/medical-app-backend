// ============================================================
// import libraires
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const opticalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name should be included.']
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
        frameDetails: [
            {
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
                opticalPrice: {
                    type: Number,
                    required: true
                },
                opticalDiscountPrice: {
                    type: Number,
                    default: 0
                },
                frameImage: {
                    type: String,
                    required: true
                },
                frameImageGallery: [String],
                hiwopptmID: {
                    type: String,
                    required: true
                }
            }
        ],
        materiralType: {
            type: String,
            required: true,
            enum: ['plastic', 'acetate', 'wood', 'metal', 'taitanium']
        },
        frameImage: {
            type: String,
            required: true
        },
        frameImageGallery: {
            type: Array,
            required: true
        },
        description: {
            type: String,
            required: true
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
        ratingsAverage: {
            type: Number,
            default: 0,
            max: 5,
            set: (val) => Math.round(val * 10) / 10
        },
        opticalPrice: {
            type: Number,
            required: true
        },
        opticalDiscountPrice: {
            type: Number,
            default: 0
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        hiwnopmID: {
            type: String,
            required: true
        },
        createdBy: {
            type: String,
            required: true,
            enum: ['admin', 'vendor'],
            default: 'vendor'
        },
        createdAt: {
            type: Date,
            required: true
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
// create virtual populate
opticalSchema.virtual('reviews', {
    ref: 'Opticals Reviews',
    foreignField: 'opticalsId',
    localField: '_id'
});

// ============================================================
// create model
const opticalModel = mongoose.model('Opticals', opticalSchema);

// ============================================================
// export optical model
module.exports = opticalModel;
