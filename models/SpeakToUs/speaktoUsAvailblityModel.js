// ============================================================
// import packages
const mongoose = require('mongoose');
const encryptID = require('../../util/uuid');

// ============================================================
// create schema
const speaktousAvailablitySchema = new mongoose.Schema(
    {
        partnerEId: { type: String, require: true, unique: true },
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
            required: [true, 'Application must contain partner id.'],
            unique: true
        },
        hiwstpasID: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: 'inactive',
            enum: ['inactive', 'active']
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
                day: Number
            }
        ]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// ============================================================
// populate user id
speaktousAvailablitySchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'partnerId',
            select: 'name phone centerPhone'
        }
    ]);
    next();
});

// ============================================================
// create mongoose model
const speaktousAvailablityModel = mongoose.model(
    'Speak To US Availablity',
    speaktousAvailablitySchema
);

// ============================================================
// export mongoose model
module.exports = speaktousAvailablityModel;
