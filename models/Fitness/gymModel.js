// ============================================================
// import libraries
const mongoose = require('mongoose');

function faclitieLimit(val) {
    if (val.length) {
        return true;
    }
    return false;
}
// ============================================================
// create mongoose schema
const gymSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name should be included']
    },
    quotes: {
        type: String,
        required: [true, 'Short notes should be included.']
    },
    city: {
        type: String,
        required: [true, 'City should be indcluded']
    },
    address: {
        type: String,
        required: [true, 'address should be included']
    },
    price: {
        type: Number,
        required: [true, 'Price should be included.']
    },
    description: {
        type: String,
        required: [true, 'description should be included.']
    },
    phone: {
        type: String,
        required: [true, 'Phone should be included.']
    },
    landLine: String,
    openFrom: {
        type: String,
        required: [true, 'Opening time should be included.']
    },
    bannerImage: {
        type: String,
        required: [true]
    },
    openTo: {
        type: String,
        required: [true, 'Closeing time should be included.']
    },
    equipments: [
        {
            name: { type: String, required: true },
            image: {
                type: String,
                required: [true, 'image should be included.']
            },
            description: {
                type: String,
                required: [true, 'Description should be included.']
            },
            hiwgmes: {
                type: String,
                required: true
            }
        }
    ],
    fecilities: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            hiwgmflmID: {
                type: String,
                required: true
            }
        }
    ],
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'Home care must contain userId.']
    },
    partnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: [true, 'homecare must contain partner.']
    },
    verified: {
        type: Boolean,
        required: [true, 'Verification should be inclued.'],
        default: false
    },
    createdAt: {
        type: Date,
        required: [true, 'Created Date should be included.']
    },
    hiwfgsID: {
        type: String,
        required: true
    }
});

// create gym model
const gymModel = mongoose.model('Gym', gymSchema);

// exports gym model
module.exports = gymModel;
