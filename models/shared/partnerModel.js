// ============================================================
// import libraries
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// create schema
const partnerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name should be included']
        },
        phone: {
            type: String,
            required: [true, 'Phone number should be included']
        },
        whatsappNumber: {
            type: String
        },
        website: {
            type: String
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Email should be included'],
            validate: [validator.isEmail, 'Please Enter the valide Email.']
        },
        centerPhone: {
            type: String,
            required: [true, "center's phone number should be inlcluded."]
        },
        centerLandLine: {
            type: String
        },
        profileImage: {
            type: String,
            required: [true, 'profile image should be inlcluded.']
        },
        bannerImage: {
            required: [true, 'Banner image should be included.'],
            type: String
        },
        imageGallery: {
            type: Array,
            required: [true, 'Service images should be included.']
        },
        onlineConsultancy: {
            speciality: {
                type: String
            },
            category: {
                type: String
            },
            experience: {
                type: Number
            }
        },
        bloodBank: {
            bloodDetails: [
                {
                    bloodType: {
                        type: String,
                        requried: [true, 'Blood Details should be included.']
                    },
                    availableUnits: {
                        type: Number,
                        required: [true, 'Unites should be included.']
                    },
                    lastUpdate: {
                        type: Date,
                        required: true
                    },
                    hiwbbbdID: {
                        type: String,
                        required: true
                    }
                }
            ]
        },
        studyAbroad: {
            status: { type: Boolean, default: false }
        },
        openTime: {
            type: String
        },
        city: {
            type: String,
            required: [true, 'city should be included.']
        },
        closeTime: {
            type: String
        },
        hiwpmID: {
            type: String,
            required: true
        },
        for: {
            type: String,
            required: [
                true,
                'Please select which partner you are going to select'
            ]
        },
        address: {
            type: String,
            required: [true, 'Address should be included.']
        },
        hospital: {
            stream: {
                type: String,
                enum: [
                    'clinic',
                    'nursing-home',
                    'hospitals',
                    'muti-speciality-hospital',
                    'medical-college'
                ]
            },
            aboutUs: {
                type: String
            },
            medicalTourism: {
                type: Boolean
            },
            hospitalPackage: {
                type: Boolean
            }
        },
        hearingAid: {
            serviceType: {
                type: String,
                enum: ['shop', 'hospital', 'repairStore']
            },
            batteryChangeCharge: Number,
            noiseFixCharge: Number,
            cleaningCharge: Number,
            price: Number,
            availableDoctors: Number
        },
        ambulance: {
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
                    services: [String],
                    hiwpmasasssID: {
                        type: String,
                        required: true
                    }
                }
            ],
            driverDetails: [
                {
                    name: {
                        type: String,
                        required: true
                    },

                    createdBy: {
                        type: String,
                        required: true,
                        default: 'partner',
                        enum: ['partner', 'admin']
                    },
                    driverProfile: {
                        type: String,
                        required: [
                            true,
                            "Driver's profile image should be included."
                        ]
                    },
                    phone: {
                        type: String,
                        required: true
                    },
                    hiwaddusID: {
                        type: String,
                        required: true
                    }
                }
            ]
        },
        deaddiction: {
            aboutus: {
                type: String
            },
            fecilities: [
                {
                    title: String,
                    description: String,
                    hiwdacfls: String
                }
            ]
        },
        meettheExperts: {
            serviceType: {
                type: String,
                enum: ['contractors', 'service', 'consultants']
            },
            vendorType: {
                type: String,
                enum: ['individual', 'company']
            },
            fecilities: [
                {
                    title: {
                        type: String,
                        requried: [true, 'Title should be included.']
                    },
                    description: {
                        type: String,
                        required: [true, 'Description should be included.']
                    },
                    hiwmtefssID: {
                        type: String,
                        required: true
                    }
                }
            ]
        },
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number]
        },
        fitness: {
            serviceType: {
                type: String,
                enum: ['gym', 'yoga', 'meditation']
            },
            aboutus: { type: String },
            equipments: [
                {
                    name: { type: String, required: true },

                    description: {
                        type: String,
                        required: [true, 'Description should be included.']
                    },
                    bannerImage: {
                        type: String,
                        required: [true, 'image should be included.']
                    },
                    hiwgmesID: {
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
            ]
        },
        homecare: {
            serviceType: {
                type: String,
                enum: ['company', 'individual']
            },
            facilities: [
                {
                    title: {
                        type: String,
                        required: true
                    },
                    description: {
                        type: String,
                        requird: true
                    },
                    hiwhcmflsID: {
                        type: String,
                        required: true
                    }
                }
            ]
        },
        speakToUs: {
            counselingNumber: {
                type: String
            },
            availablity: {
                type: Boolean,
                default: false
            }
        },
        laboratory: {
            availableTests: [
                {
                    name: {
                        type: String,
                        required: [true, 'name shoudld be included.']
                    },
                    description: {
                        type: String,
                        required: [true, 'Description should be included.']
                    },
                    price: {
                        type: Number,
                        requried: [true, 'Price should be included.']
                    },
                    hiwlabatsID: {
                        type: String,
                        required: [true]
                    }
                }
            ],
            fecilities: [
                {
                    title: {
                        type: String,
                        required: [true, 'title should be included.']
                    },
                    description: {
                        type: String,
                        required: [true, 'description should be included.']
                    },
                    bannerImage: {
                        type: String,
                        required: [true, 'bannerImage should be included.']
                    },
                    hiwlflisID: {
                        type: String,
                        required: [true]
                    }
                }
            ],
            labImages: {
                type: [String]
            }
        },
        country: {
            type: String,
            required: true,
            default: 'india'
        },
        company: {
            type: String,
            required: [true, 'Company or center name should be icluded']
        },
        verificationVideo: {
            type: String,
            required: true,
            select: false,
            default: 'https://youtu.be/tgbNymZ7vqY'
        },
        idProof: {
            type: String,
            required: [true, 'ID Prood should be included'],
            default:
                'https://medi-app360.s3.amazonaws.com/1652723237848-cover.jpg',
            select: false
        },
        addressProof: {
            type: String,
            required: [true, 'Address should be included'],
            default:
                'https://medi-app360.s3.amazonaws.com/1652723237848-cover.jpg',
            select: false
        },
        aadharId: {
            select: false,
            type: String,
            required: [true, 'aadhar should be included'],
            default:
                'https://medi-app360.s3.amazonaws.com/1652723237848-cover.jpg'
        },
        gstNumber: {
            select: false,
            type: String,
            required: [true, 'GST should be included']
        },
        licence: {
            type: String,
            required: [true, 'Licence should be included'],
            default:
                'https://medi-app360.s3.amazonaws.com/1652723237848-cover.jpg',
            select: false
        },
        status: {
            type: String,
            required: [true, 'Something went worng'],
            default: 'pending',
            enum: ['pending', 'accepted', 'rejected']
        },
        cause: {
            type: String
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'partner must contain userId.']
        },
        createdAt: {
            type: Date,
            required: true
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
partnerSchema.index({
    'ambulance.ambulanceService.location': '2dsphere'
});
partnerSchema.index({
    location: '2dsphere'
});

partnerSchema.index({ for: 1 });
partnerSchema.index(
    { userId: 1, 'laboratory.availableTests.name': 1 },
    { unique: true, partialFilterExpression: { for: { $eq: 'Laboratory' } } }
);
// ============================================================
// create parner model
const partnerModel = mongoose.model('Partner', partnerSchema);

module.exports = partnerModel;
