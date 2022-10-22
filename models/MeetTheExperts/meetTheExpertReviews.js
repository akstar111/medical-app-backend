// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create schema
const expertReviewSchema = new mongoose.Schema(
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

        meetTheExpertId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Meet The Expert',
            required: [true, 'expert service should be included id.']
        },
        createdAt: {
            type: Date,
            required: [true]
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'expert service  should be included user id.']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
expertReviewSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'userId',
            select: '_id name bannerImage'
        }
    ]);
    next();
});

// create review model
const expertReviewModel = mongoose.model(
    'Meet The Expert Reviews',
    expertReviewSchema
);

// export expert review
module.exports = expertReviewModel;
