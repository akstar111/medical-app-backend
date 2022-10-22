// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create schema
const opticalsReviewSchema = new mongoose.Schema(
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

        opticalsId: {
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
opticalsReviewSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'userId',
            select: '_id name bannerImage'
        }
    ]);
    next();
});

// create review model
const opticalsReviewModel = mongoose.model(
    'Opticals Reviews',
    opticalsReviewSchema
);

// export homecare review
module.exports = opticalsReviewModel;
