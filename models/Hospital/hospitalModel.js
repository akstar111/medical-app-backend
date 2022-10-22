// ============================================================
// import libraries
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// create mongoose schema
const packageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
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
        hospitalDetailsStatus: {
            type: Boolean,
            default: false
        },
        hospitalPackageStatus: {
            type: Boolean,
            default: false
        },
        hospitaltourismStatus: {
            type: Boolean,
            default: false
        },
        packageDetails: [
            {
                category: {
                    type: String,
                    required: [true, 'Service name should be included.']
                },
                subCategory: [
                    {
                        name: {
                            type: String,
                            required: [true, 'Service name should be included.']
                        },
                        packType: [
                            {
                                packageName: {
                                    type: String,
                                    required: true
                                },

                                recommendAge: {
                                    type: Number,
                                    required: true
                                },
                                description: {
                                    type: String,
                                    required: true
                                },
                                price: {
                                    type: Number,
                                    requied: true
                                },
                                serviceList: [
                                    {
                                        serviceTitle: {
                                            required: true,
                                            type: String
                                        },
                                        services: [
                                            {
                                                type: String,
                                                required: true,
                                                min: 1
                                            }
                                        ],
                                        hiwhpslsID: {
                                            type: String,
                                            required: true
                                        }
                                    }
                                ],
                                hiwhppscdID: {
                                    type: String,
                                    required: true
                                }
                            }
                        ],
                        hiwhppdsID: {
                            type: String,
                            required: true
                        }
                    }
                ],
                hiwhpdsnmID: {
                    type: String,
                    required: true
                }
            }
        ],

        hospitalServices: [
            {
                name: String,
                priceFrom: Number,
                priceTo: Number,
                description: String,
                bannerImage: String,
                hiwhdmsID: String
            }
        ],
        hospitalFacilities: [
            {
                bannerImage: String,
                name: String,
                description: String,
                hiwhdfs: String
            }
        ],
        specialist: [
            {
                bannerImage: String,
                name: String,
                successRate: Number,
                posistion: String,
                hiwhdslsID: String
            }
        ],
        hospitalRoomFacilities: [
            {
                bannerImage: String,
                name: String,
                description: String,
                howmhdrfID: String
            }
        ],
        hospitalAvailableFacilities: {
            numberOfBeds: Number,
            numberOfOperationTheater: Number,
            personalNursingCare: Boolean,
            numberOfVendilators: Number,
            numberOfAmbulance: Number
        },
        specialitiesDetails: {
            currencyExcanage: Boolean,
            threadlessPlayingArea: Boolean,
            hospitalPackages: Boolean,
            testingLabAvailablit: Boolean,
            secondOption: Boolean,
            diagnosticMachines: String
        },
        hospitalRoomImags: {
            type: [String]
        },
        hospitalCanteenImags: {
            type: [String]
        },
        hospitalGuestRoomImags: {
            type: [String]
        },
        nearbyFacilities: {
            transportationService: Boolean,
            visaArrangements: Boolean,
            flightArrangeMents: Boolean,
            travelDesk: Boolean,
            multilingualStaff: Boolean,
            interpreterService: Boolean,
            airportPickupAndDropFacility: Boolean,

            rentalCarService: Boolean,
            insuranceContidion: Boolean,
            foodAndDietaryService: Boolean,
            suiteRooms: Boolean,
            laundryAndHouseKeepingService: Boolean,
            hotelAndGuestHouseAccommodation: Boolean,
            internationalCuisine: Boolean,
            specialIndianFoodOrChoiceOfMeals: Boolean,
            dayCareService: Boolean,
            nearByHotels: Boolean,
            parkingFacility: Boolean,
            securityService: Boolean,
            postTravelMedicalCare: Boolean
        },
        nearBy: {
            hotels: [
                {
                    name: String,
                    foodFacility: Boolean,
                    AC: {
                        type: String,
                        enum: ['AC', 'NON-AC']
                    },
                    location: {
                        type: {
                            type: String,
                            default: 'Point',
                            enum: ['Point']
                        },
                        coordinates: [Number]
                    },
                    distance: Number,
                    bannerImage: String,
                    hiwhtsmhdsID: String
                }
            ],
            restaurants: [
                {
                    name: String,
                    foodType: String,
                    VEG: {
                        type: String,
                        enum: ['VEG', 'NON-VEG']
                    },
                    location: {
                        type: {
                            type: String,
                            default: 'Point',
                            enum: ['Point']
                        },
                        coordinates: [Number]
                    },
                    distance: Number,
                    bannerImage: String,
                    hiwhtsmrdsID: String
                }
            ],
            airports: [
                {
                    name: String,
                    city: String,
                    distance: Number,
                    location: {
                        type: {
                            type: String,
                            default: 'Point',
                            enum: ['Point']
                        },
                        coordinates: [Number]
                    },
                    bannerImage: String,
                    hiwhtsmadsID: String
                }
            ],
            railwayStation: [
                {
                    name: String,
                    city: String,
                    distance: Number,
                    location: {
                        type: {
                            type: String,
                            default: 'Point',
                            enum: ['Point']
                        },
                        coordinates: [Number]
                    },
                    bannerImage: String,
                    hiwhtsmrsdsID: String
                }
            ],
            busStop: [
                {
                    name: String,
                    city: String,
                    location: {
                        type: {
                            type: String,
                            default: 'Point',
                            enum: ['Point']
                        },
                        coordinates: [Number]
                    },
                    distance: Number,
                    bannerImage: String,
                    hiwhtsmbssID: String
                }
            ]
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'hospital package must contain userId.'],
            unique: true
        },
        partnerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner',
            required: [true, 'Hosptial package must contain partner id.'],
            unique: true
        },
        partnerEId: {
            type: String,
            required: true,
            unique: true
        },
        createdAt: {
            type: Date,
            required: true
        },
        hiwhppsID: {
            type: String,
            required: true
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
// create virtual populate
packageSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'partnerId',
            select: 'bannerImage address status hospital.hospitalPackage hospital.medicalTourism hospital.aboutUs'
        }
    ]);
    next();
});

// create virtual populate
packageSchema.virtual('partner', {
    ref: 'Partner',
    foreignField: '_id',
    localField: 'partnerId'
});

// create pagckage model
const packageModel = mongoose.model('Hospitals', packageSchema);

// ============================================================
// export packagemodel
module.exports = packageModel;
