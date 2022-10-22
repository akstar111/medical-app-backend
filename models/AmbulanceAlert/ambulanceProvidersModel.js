// ============================================================
// import packages
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// create mongoose shcema
const ambulanceProvidersSchmea = new mongoose.Schema(
    {
        profileImage: {
            type: String,
            default:
                'https://medi-app360.s3.amazonaws.com/1652723237848-cover.jpg'
        },
        centerName: {
            type: String
        },
        centerNumber: {
            type: String
        },
        website: {
            type: String
        },
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number]
        },
        centerAddress: {
            type: String
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'ambulance must contain userId.']
        },

        ambulanceService: [
            {
                ambulanceNumber: {
                    type: String,
                    required: [true, 'Ambulance numbers hould be included.']
                },
                location: {
                    type: {
                        type: String,
                        default: 'Point',
                        enum: ['Point']
                    },
                    coordinates: [Number]
                },
                services: [String]
            }
        ],
        driverDetails: [
            {
                name: {
                    type: String,
                    required: true
                },
                phoneumber: {
                    type: String,
                    required: true
                },
                verified: {
                    type: Boolean,
                    required: true
                }
            }
        ],
        createdAt: {
            type: Date,
            required: true
        },
        partnerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner',
            required: [true, 'Application must contain partner id.']
        },
        hiwapspID: {
            type: String,
            required: true
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
ambulanceProvidersSchmea.index({
    'ambulanceService.location': '2dsphere'
});
// ============================================================
// create mongose model
const ambulanceProviderModel = mongoose.model(
    'Ambulance Service Providers',
    ambulanceProvidersSchmea
);

// ============================================================
// export model
module.exports = ambulanceProviderModel;
