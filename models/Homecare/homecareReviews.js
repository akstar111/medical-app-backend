// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create schema
const homecareReviewSchema = new mongoose.Schema(
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

        homecareServiceId: {
            type: mongoose.Schema.ObjectId,
            ref: 'HomeCareService',
            required: [true, 'Homecare service should be included id.']
        },
        createdAt: {
            type: Date,
            required: [true]
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
homecareReviewSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'userId',
            select: '_id name bannerImage'
        }
    ]);
    next();
});

// create review model
const homecareReviewModel = mongoose.model(
    'Homecare Reviews',
    homecareReviewSchema
);

// export homecare review
module.exports = homecareReviewModel;
