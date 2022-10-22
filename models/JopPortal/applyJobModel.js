// ============================================================
// import packages
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// mongoose schema
const applyJobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name should be included.']
    },
    phone: {
        type: String,
        required: [true, 'phone number should be include.']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'Email should be included'],
        validate: [validator.isEmail, 'Please Enter the valide Email.']
    },
    category: {
        type: String,
        required: [true, 'category should be included.']
    },
    speciality: {
        type: String,
        required: [true, 'Specilality should be included.']
    },
    experience: {
        type: Number,
        required: [true, 'Experience should be included.']
    },
    currentLocation: {
        type: String,
        required: [true, 'Current Location should be included.']
    },
    resume: {
        type: String,
        required: [true, 'Resume should be included.']
    },
    privacyPolicy: {
        type: Boolean,
        required: true
    },
    jobEId: {
        type: String,
        required: true
    },
    jobDetails: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        requierd: true
    },
    hiwnjasID: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        enum: ['applied', 'rejected', 'hired', 'not-qualified'],
        default: 'applied'
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'Job must contain userId.']
    }
});

// virtual populate job

// ============================================================
// create new model
const applyJobModel = mongoose.model('Job Apply', applyJobSchema);

// ============================================================
// exports job
module.exports = applyJobModel;
