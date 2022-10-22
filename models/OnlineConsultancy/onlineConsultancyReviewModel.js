// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create schema
const onlineConsultantReviewSchema = new mongoose.Schema(
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

        consultantId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Doctor Online Consultancy Doctor Slots',
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
onlineConsultantReviewSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'userId',
            select: '_id name bannerImage'
        }
    ]);
    next();
});

// create review model
const onlineConsultantReviewModel = mongoose.model(
    'Doctor Online Consultancy Reviews',
    onlineConsultantReviewSchema
);

// export homecare review
module.exports = onlineConsultantReviewModel;
