// ============================================================
// Libraries
const mongoose = require('mongoose');

// ============================================================
// Schema
const insuranceSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Insurance must contain Name']
        },
        age: {
            type: Number,
            required: [true, 'Please enter your age'],
            maxLength: 2
        },

        gender: {
            type: String,
            required: [true, 'Please Select the gender'],
            enum: ['Male', 'Female', 'Others']
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Please select your date of birth']
        },
        addressLine1: {
            type: String,
            required: [true, 'Please enter you address']
        },
        addressLine2: {
            type: String
        },
        city: {
            type: String,
            required: [true, 'Please enter your city']
        },
        state: {
            type: String,
            required: [true, 'Please enter your state.']
        },
        country: {
            type: String,
            required: [true, 'Please enter your country']
        },
        pincode: {
            type: Number,
            required: [true, 'Please enter your pincode.'],
            maxLength: 6
        },
        phone: {
            type: String,
            required: [true, 'Please enter your phone.']
        },
        profileImage: {
            type: String,
            required: [true, 'Please Select your profile iamge']
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'Insurance must contain userId.']
        },
        insuranceType: {
            type: String,
            required: [true, 'Please select your insurance Type.']
        },
        insuranceStream: {
            type: String,
            required: [true, 'Please select your insurance stream.']
        },
        insuranceAuthorityPerson: {
            type: String,
            required: [true, 'Please select the authority person']
        },
        authorityPersonName: {
            type: String,
            required: [true, 'Please enter the authority person name ']
        },
        authorityPersonPhone: {
            type: String,
            required: [true, "Please enter the authority person's phone number"]
        },
        naminiImage: {
            type: String,
            required: [true, "Please select the namin's image"]
        },
        naminiAadhar: {
            type: String,
            required: [true, "Please select the namini's Aadhaar Image"]
        },
        userAadhar: {
            type: String,
            required: [true, "Please select the User's Aadhaar image."]
        },
        userPan: {
            type: String,
            required: [true, "Please select the Users's pan image"]
        },
        medicalRecodsAadhar: {
            type: String
        },
        validity: {
            type: Date,
            required: [true, 'Valid date should be include.']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const insuranceModel = mongoose.model('Insurance', insuranceSchema);
module.exports = insuranceModel;
