// ============================================================
// import packages
const mongoose = require('mongoose');

// ============================================================
// create schema
const bookDoctorOnlineConsultancyShema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'speaktous must contain userId.']
        },
        createdAt: {
            type: Date,
            required: true
        },

        partnerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner',
            required: [true, 'Application must contain partner id.']
        },
        hiwdocboEID: {
            type: String,
            required: true
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

        availableQuota: [
            {
                date: {
                    type: Date,
                    required: true
                },
                availableTime: [
                    {
                        type: String
                    }
                ],
                slotsInHour: Number,
                pricePerSlot: Number,
                availablity: {
                    type: String,
                    enum: ['online', 'opd']
                },
                day: Number
            }
        ]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

bookDoctorOnlineConsultancyShema.virtual('reviews', {
    ref: 'Doctor Online Consultancy Reviews',
    foreignField: 'consultantId',
    localField: '_id'
});
// ============================================================
// populate user id
bookDoctorOnlineConsultancyShema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'partnerId',
            select: 'status'
        }
    ]);
    next();
});

// ============================================================
// create mongoose model
const doctorOnlineConsultancyBookModel = mongoose.model(
    'Doctor Online Consultancy Doctor Slots',
    bookDoctorOnlineConsultancyShema
);

// ============================================================
// export mongoose model
module.exports = doctorOnlineConsultancyBookModel;
