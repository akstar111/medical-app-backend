// ============================================================
// create mogoose
const mongoose = require('mongoose');
const { validate } = require('uuid');

// ============================================================
// create mongoose schema
const ambulanceServiceShchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'Name should be unique.'],
        required: [true, 'Name should be included. ']
    },
    description: {
        type: String,
        required: [true, 'Short description is should be included.']
    },
    bannerImage: {
        type: String,
        required: [true, 'Banner Image should be included.']
    },
    createdAt: {
        type: Date,
        required: [true, 'Date should be included.']
    },
    hiwaanasmID: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (el) {
                return validate(el);
            },
            message:
                'Something went wrong while processing your requrest.Please try again.'
        }
    }
});

// ============================================================
// create mongoose model
const ambulanceServiceModel = mongoose.model(
    'Ambulance Services',
    ambulanceServiceShchema
);

// ============================================================
// export modele
module.exports = ambulanceServiceModel;
