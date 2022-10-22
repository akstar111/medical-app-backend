// ============================================================
// import libraries
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// create mongoose schema
const studyAbroadFormSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'student name should be included.']
    },
    phone: {
        type: String,
        required: [true, 'Phone number should be included.']
    },
    email: {
        type: String,
        trim: true,
        unique: [true, 'This email already used. please try new email.'],
        lowercase: true,
        required: [true, 'Email should be included'],
        validate: [validator.isEmail, 'Please Enter the valide Email.']
    },
    country: {
        type: String,
        required: [true, 'Country should be included.']
    },
    state: {
        type: String,
        required: [true, 'state should be included.']
    },
    city: {
        type: String,
        required: [true, 'city should be included.']
    },
    educationQualification: {
        type: String,
        required: [true, 'educationQualification should be included.']
    },
    selectDegree: {
        type: String
    }
});

// ============================================================
// craete mongoose model
const studyAbroadFormModel = mongoose.model(
    'Study Abroad Admission Forms',
    studyAbroadFormSchema
);

// ============================================================
// export stude abroad
module.exports = studyAbroadFormModel;
