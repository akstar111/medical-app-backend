// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create schema
const deaddictionReview = new mongoose.Schema(
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

        deAddictionId: {
            type: mongoose.Schema.ObjectId,
            ref: 'De-Addiction Center',
            required: [
                true,
                'Application must contain home care expert serviceid.'
            ]
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
deaddictionReview.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'userId',
            select: '_id name bannerImage'
        }
    ]);
    next();
});

// create review model
const deaddictionReviewModel = mongoose.model(
    'De-addiction Reviews',
    deaddictionReview
);

// export homecare review
module.exports = deaddictionReviewModel;
