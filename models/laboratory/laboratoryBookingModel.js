// ============================================================
// import libraries
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// crete mongoose schema
const bookLaboratorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name should be included.']
    },
    phone: {
        type: String,
        required: [true, 'Phone Number should be included.']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please Enter the valide Email.']
    },
    address: {
        type: String,
        required: [true, 'Address should be included.']
    },
    status: {
        type: String,
        required: [true, 'Status should be included.'],
        enum: [
            'requested',
            'accepted',
            'rejected',
            'completed',
            'not-arrived',
            'canceled'
        ],
        default: 'requested'
    },
    createdAt: {
        type: Date,
        required: [true, 'Created date should be included.']
    },
    vendorAcceptedDate: {
        type: Date
    },
    bookingType: {
        type: String,
        required: true,
        enum: ['home', 'lab']
    },
    vendorAcceptDescription: String,
    rejectedDate: Date,
    rejectedResponse: String,
    completedDate: Date,
    completedResponse: String,
    notArrivedDate: Date,
    notArrivedResponse: String,
    cancelDate: Date,
    cancelDescription: String,
    requestDate: {
        type: Date,
        required: [true, 'Requesting date should be included.']
    },
    alocatedTime: {
        type: String
    },
    askedService: [
        {
            name: { type: String, required: true },
            price: { type: String, required: true }
        }
    ],
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    labId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: true,
        select: false
    },
    labEId: {
        type: String,
        required: true
    },
    hiwlbbssID: {
        type: String,
        required: [true],
        unique: [true, 'Something went wrong, please try again.']
    }
});

// create mongoose model
const laboratoryBookingModel = mongoose.model(
    'Laboratory Booking',
    bookLaboratorySchema
);

// export mongoose schema
module.exports = laboratoryBookingModel;
