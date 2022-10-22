// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create schema
const hearingAidReview = new mongoose.Schema(
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

        hearingaidId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Hearing AID',
            required: [true, 'Application must contain hearing aidserviceid.']
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
hearingAidReview.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'userId',
            select: '_id name bannerImage'
        }
    ]);
    next();
});

// create review model
const hearingAidReviewModel = mongoose.model(
    'Hearing AID Reviews',
    hearingAidReview
);

// export homecare review
module.exports = hearingAidReviewModel;
