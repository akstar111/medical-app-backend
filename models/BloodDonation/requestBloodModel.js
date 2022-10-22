// ============================================================
// import libraries
const mongoose = require('mongoose');
const { validate } = require('uuid');

// ============================================================
// create schema
const requestForBloodSchma = new mongoose.Schema(
    {
        requesterName: {
            type: String,
            required: [true, 'Requester name should be included.']
        },
        requsterContactName: {
            type: String,
            required: [true, 'Requester contact name  should be included.']
        },
        requesterPhone: {
            type: String,
            required: [true, 'Requester Phne number should be included.']
        },
        requesterBloodType: {
            type: String,
            required: [true, 'Requester Blood type should be included.']
        },
        requesterRequiredUnits: {
            type: Number,
            required: [true, 'Requester units should be included.']
        },
        requestersRequiredDate: {
            type: Date,
            required: [true, 'Requester required Date should be included.']
        },
        hospitalName: {
            type: String,
            required: [true, 'Requester hospital name should be included.']
        },
        hospitalAddress: {
            type: String,
            required: [true, 'Requester hospital address should be included.']
        },
        opertionType: {
            type: String,
            required: [true, 'Requester operation type should be included.']
        },
        description: {
            type: String,
            required: [true, 'Requester description should be included.']
        },
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number]
        },
        status: {
            type: String,
            required: true,
            enum: [
                'requested',
                'accepted',
                'rejected',
                'canceled',
                'donated',
                'completed'
            ],
            default: 'requested'
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true]
        },

        hiwnrqID: {
            type: String,
            required: [true],
            unique: true,
            validate: {
                validator: function (el) {
                    return validate(el);
                },
                message:
                    'Something went wrong while processing your requrest.Please try again.'
            }
        },
        donnerEID: {
            type: String,
            required: true
        },
        donnerUserID: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true]
        },
        createdAt: {
            type: Date,
            required: true
        },
        requesterActionDate: Date,
        donnerResponseDate: Date,
        donnerResponseBy: {
            type: String,
            requried: true,
            enum: ['admin', 'user'],
            default: 'user'
        },
        requesterResponseBy: {
            type: String,
            requried: true,
            enum: ['admin', 'user'],
            default: 'user'
        },
        batch: {
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
requestForBloodSchma.virtual('donners', {
    ref: 'Blood Donation New Donner',
    foreignField: 'hiwbdndID',
    localField: 'donnerEID'
});
// ============================================================
// create model
const bloodRequesterModel = mongoose.model(
    'Blood Donation Blood Requests',
    requestForBloodSchma
);

// ============================================================
// export mdoel
module.exports = bloodRequesterModel;
