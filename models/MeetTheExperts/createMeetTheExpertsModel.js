// ============================================================
// import libraries
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// create create Schema
const meetTheExpertSchema = new mongoose.Schema(
    {
        personName: {
            type: String,
            required: [true, 'Service should be include a name']
        },
        phone: {
            type: String,
            required: [true, 'Please enter your phone number']
        },
        email: {
            type: String,
            trim: true,
            unique: [true, 'This email already used. please try new email.'],
            lowercase: true,
            required: [true, 'Email should be included'],
            validate: [validator.isEmail, 'Please Enter the valide Email.']
        },
        centerMobileNumber: {
            type: String,
            required: true
        },
        website: {
            type: String
        },
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number]
        },
        vendorType: {
            type: String,
            required: [true, 'Select your service type'],
            enum: ['individual', 'company']
        },
        bannerImage: {
            type: String,
            required: [true, 'Banner image should be included.']
        },
        address: {
            type: String,
            required: [true, 'Address should be included.']
        },
        serviceName: {
            type: String,
            required: [true, "Service should be included a it's type"]
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'Insurance must contain userId.']
        },
        partnerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner',
            required: [true, 'de-addiction must contain partner.']
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
        hiwmtesID: {
            type: String,
            required: true
        },
        fecilities: [
            {
                title: {
                    type: String,
                    requried: [true, 'Title should be included.']
                },
                description: {
                    type: String,
                    required: [true, 'Description should be included.']
                },
                hiwmtefssID: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
// create virtual populate
meetTheExpertSchema.virtual('reviews', {
    ref: 'Meet The Expert Reviews',
    foreignField: 'meetTheExpertId',
    localField: '_id'
});

// ============================================================
// populate user id
meetTheExpertSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'userId',
            select: 'name price date'
        }
    ]);
    next();
});

// ============================================================
// create model
const expertModel = mongoose.model('Meet The Expert', meetTheExpertSchema);

// ============================================================
// exports model
module.exports = expertModel;
