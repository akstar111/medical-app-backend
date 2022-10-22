// ============================================================
// import packages
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// mongoose schema
const applyJobSchema = new mongoose.Schema({
    personalDetails: {
        name: String,
        gender: {
            type: String,
            enum: ['male', 'female']
        },
        dateOfBirth: {
            type: String
        },
        email: {
            type: String,
            trim: true,

            lowercase: true,

            validate: [validator.isEmail, 'Please Enter the valide Email.']
        },
        phone: {
            type: String
        },
        address: {
            type: String
        }
    },
    profileSummary: {
        profileTitle: {
            type: String
        },
        exprience: {
            type: Number
        },
        currentLocation: {
            type: String
        },
        currentSalary: {
            type: Number
        },
        category: {
            type: String
        },
        speciality: {
            type: String
        },
        preLocation: {
            type: String
        },
        expectSalary: {
            type: Number
        }
    },
    employementDetails: [
        {
            designation: {
                type: String,
            },
            workplace: {
                type: String
            },
            duration: {
                type: Number
            },
            jobtype: {
                type: String,
                enum: ['Full-Time', 'Part-Time']
            },
            jpUEID: {
                type: String
            }
        }
    ],
    educationDetails: [
        {
            degree: {
                type: String
            },
            education: {
                type: String
            },
            university: {
                type: String
            },
            yearofpassing: {
                type: Number
            },
            jpUEID: {
                type: String
            }
        }
    ],
    createdAt: {
        type: Date,
        required: Date
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'user id shoule be included.']
    }
});

// ============================================================
// create new model
const userJobDetailsModel = mongoose.model(
    'Job User Personal Detail',
    applyJobSchema
);

// ============================================================
// exports model
module.exports = userJobDetailsModel;
