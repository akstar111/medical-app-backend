// ============================================================
// import packages
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const hearingAIDShema = new mongoose.Schema(
    {
        servicePrice: {
            type: Number
        },
        availableDoctors: Number,
        price: Number,
        discountPrice: {
            type: Number,
            default: 0
        },
        batteryChangeCharge: Number,
        noiseFixCharge: Number,
        cleaningCharge: Number,
        firmBanner: String,
        createdAt: { type: Date, required: true },
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
        hiwhamID: {
            type: String,
            required: true
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// create virtual populate
hearingAIDShema.virtual('reviews', {
    ref: 'Hearing AID Reviews',
    foreignField: 'hearingaidId',
    localField: '_id'
});

// ============================================================
// populate user id
hearingAIDShema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'userId',
            select: 'name price date'
        },
        {
            path: 'partnerId',
            select: 'status'
        }
    ]);
    next();
});

// ============================================================
// create hearing aid model
const hearingAidModel = mongoose.model('Hearing AID', hearingAIDShema);

// ============================================================
// exports hearing aid model
module.exports = hearingAidModel;
