// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create schema
const medicalMarketReviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, "Review can't be empty."]
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, "Rating can't be empty"]
        },

        marketId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Medical Market Products',
            required: [true, 'Application must contain market id.']
        },
        createdAt: {
            type: Date,
            required: true
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'Homecare service  should be included user id.']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
medicalMarketReviewSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'userId',
            select: '_id name bannerImage'
        }
    ]);
    next();
});

// create review model
const medicalMarketReviewModel = mongoose.model(
    'Medical Market Product Reviews',
    medicalMarketReviewSchema
);

// export homecare review
module.exports = medicalMarketReviewModel;
