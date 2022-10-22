// ============================================================
// import libraires
const mongoose = require('mongoose');
const validator = require('validator');

// create mongoose schema
const studyAbroadSchema = new mongoose.Schema(
    {
        collegeDetails: {
            establishedYear: {
                type: Number
            },
            universityType: {
                type: String
            },
            affliation: {
                type: String
            },
            teachingLanguage: {
                type: String
            },
            syllabus: {
                type: String
            },
            availableHospitalBeds: {
                type: Number
            },
            majorityStrudentsFrom: {
                type: String
            },
            collegeInfraStructureVideo: {
                type: String
            },
            courseAvailable: [String],
            ugCourses: [String],
            pgCourses: [String],
            availableSeatsinUG: {
                type: Number
            },
            availableSeatsinPG: {
                type: Number
            },
            hostelImages: [String],
            hostelFacilities: {
                withFood: {
                    type: Boolean
                },
                cookingFacilites: {
                    type: Boolean
                }
            },
            proximityFromCollegetoHostel: {
                type: Number
            },
            libraryFacilities: {
                type: Boolean
            },
            libraryImages: [String],
            sportIndoorActivities: [String]
        },
        courseDetails: {
            underGraduateCourses: [String],
            postGraduateCourses: [String],
            eligiblityCretria: {
                minimumPercentage: {
                    type: Number
                },
                entranceExam: {
                    type: String
                }
            },
            underGraduateFees: {
                tutionFees: {
                    type: Number
                },
                tutionFeesHostel: {
                    type: Number
                },
                tutionFeesACHostel: {
                    type: Number
                },
                totalTutionFees: {
                    type: Number
                },
                totalTutionFeesHostel: {
                    type: Number
                },
                totalTutionFeesACHostel: {
                    type: Number
                }
            },
            underGraduationCourseSyllabus: [
                {
                    year: { type: Number },
                    semester1: [String],
                    semester2: [String],
                    hiwsaugcssID: String
                }
            ],
            termFees: {
                firstTerm: {
                    type: Number
                },
                remainingFees: {
                    type: Number
                }
            },
            courseDuration: {
                type: Number
            },
            labDetails: {
                type: String
            },
            scholrshipAvailablity: {
                type: Boolean
            }
        },
        faciliteisAvailable: {
            indianFoodAvailablityinHostel: {
                type: String
            },
            monthlyRentalAvailablityOutsideCollege: {
                type: Number
            },
            travelExpenditure: {
                type: Number
            },
            nearestAirport: {
                type: String
            },
            distanceAirporttoCollege: {
                type: Number
            },
            busFacilities: {
                type: Boolean
            },
            proximityFromCollegetoIndianEmbassy: {
                type: Number
            },
            indianEmbassyContactDetails: {
                address: {
                    type: String
                },
                phone: {
                    type: String
                },
                email: {
                    type: String,
                    trim: true,

                    lowercase: true,
                    validate: [
                        validator.isEmail,
                        'Please Enter the valide Email.'
                    ]
                }
            },
            nearestCountryvaiRoad: {
                type: String
            },
            nearbyIndianRestarents: [String],
            modeofIndianTransportAvailablity: [String],
            visaFormality: {
                type: Boolean
            },
            politicalStablity: {
                type: Boolean
            },
            womenSafety: {
                type: Boolean
            },
            otherEmbassy: [
                {
                    address: { type: String },
                    phone: { type: String },
                    email: {
                        type: String,
                        trim: true,

                        lowercase: true,
                        required: [true, 'Email should be included'],
                        validate: [
                            validator.isEmail,
                            'Please Enter the valide Email.'
                        ]
                    },
                    website: {
                        type: String
                    }
                }
            ]
        },
        createdAt: {
            type: Date,
            required: true
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'studyabroad must contain userId.'],
            unique: [true, 'You already created Study abroad']
        },
        partnerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner',
            required: [true, 'Studyabroad must contain partner id.'],
            unique: [true, 'You already created Study abroad']
        },
        partnerEId: {
            type: String,
            required: true,
            unique: [true, 'You already created Study abroad']
        },
        country: {
            type: String,
            required: true
        },
        hiwsabmID: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
// ============================================================
// populate user id
studyAbroadSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'partnerId',
            select: 'address company bannerImage'
        }
    ]);
    next();
});
// ============================================================
// create model
const studyAbroadModel = mongoose.model('Study Abroad', studyAbroadSchema);

// ============================================================
// export study abroad
module.exports = studyAbroadModel;
