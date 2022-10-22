// ============================================================
// import libraries
const mongoose = require('mongoose');
const { validate } = require('uuid');

// ============================================================
// create schema
const trafficPoliceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    },
    hiwaltrsID: {
        type: String,
        required: true,
        unique: [true, 'Something went wrong please try again.'],
        validate: {
            validator: function (el) {
                return validate(el);
            },
            message:
                'Something went wrong while processing your requrest.Please try again.'
        }
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    }
});

// ============================================================
// create model
const trafficPoliceModel = mongoose.model(
    'Ambulance Service Traffic Police',
    trafficPoliceSchema
);

// ============================================================
// export model
module.exports = trafficPoliceModel;
