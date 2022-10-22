// ============================================================
// import libraries
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// create mongoose schmea
const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter the name']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please Enter the valide Email.']
    },
    phone1: {
        type: String,
        required: [true, 'Phone number should be included.']
    },
    phone2: String,
    address: {
        type: String,
        required: [true, 'please enter address.']
    },
    pincode: {
        type: Number,
        required: [true, 'Pincode should be included.']
    },
    city: {
        type: String,
        required: [true, 'City should be included.']
    },
    state: {
        type: String,
        required: [true, 'State should be included.']
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'Address must contain userId.']
    },
    hiwnusID: {
        type: String,
        required: true
    }
});

// ============================================================
// create address model
const addressModel = mongoose.model('Address', addressSchema);

// ============================================================
// export addressmodel
module.exports = addressModel;
