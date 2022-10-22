// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// blood donation
// blood donation home
exports.bloodBankHome = (req, res) =>
    res.render('vendor/bloodDonnation/bloodBank', {
        partner: req.body.partner,
        bloodbank: req.body.bloodbank,
        activeScreen: 'home'
    });
// blood manage blood
exports.bloodBankManageBlood = (req, res) =>
    res.render('vendor/bloodDonnation/manageBloods', {
        partner: req.body.partner,
        bloodbank: req.body.bloodbank,
        activeScreen: 'manage'
    });

// blood bank quotes
exports.bloodBankQuotes = (req, res) =>
    res.render('vendor/bloodDonnation/quote/quotes', {
        partner: req.body.partner,
        bloodbank: req.body.bloodbank,
        names: req.body.names,
        request: req.body.request,
        activeList: req.body.activeList,
        history: req.body.history
    });

// blood bank manage request
exports.bloodBankQuotesList = (req, res) =>
    res.status(200).render('vendor/bloodDonnation/quote/lowestQuotesList', {
        quotes: req.body.lowest,
        partner: req.body.partner,
        bloodbank: req.body.bloodbank
    });

// blodd bank job home
exports.bloodBankjob = (req, res) =>
    res.render('vendor/job/job', {
        partner: req.body.partner,
        bloodbank: req.body.bloodbank,
        jobs: req.body.jobs,
        activeScreen: 'job'
    });

// post a jobs
exports.bloodBankPostJob = (req, res) =>
    res.render('vendor/job/postJob', {
        partner: req.body.partner,
        categories: req.body.categories,
        activeScreen: 'job'
    });

// update a job
exports.bloodBankUpdateJob = (req, res) =>
    res.render('vendor/job/updateJob', {
        partner: req.body.partner,
        bloodbank: req.body.bloodbank,
        categories: req.body.categories,
        job: req.body.job,
        activeScreen: 'job'
    });

// view job and applications
exports.bloodBankViewaJob = (req, res) =>
    res.render('vendor/job/viewJob', {
        partner: req.body.partner,
        bloodbank: req.body.bloodbank,
        job: req.body.findOnePopulateDocs,
        activeScreen: 'job'
    });

// view job and applications
exports.bloodBankViewaApplicant = (req, res) =>
    res.render('vendor/job/viewProfile', {
        partner: req.body.partner,
        activeScreen: 'job',
        applicant: req.body.applicant
    });

// blood bank advertisement
exports.bloodBankAdvertisement = (req, res) =>
    res.render('vendor/bloodDonnation/advertisement/advertisement', {
        partner: req.body.partner,
        bloodbank: req.body.bloodbank,
        advertisement: req.body.advertisement
    });

// blood bank add new advertisement
exports.bloodbankNewAdvertisement = (req, res) =>
    res.render('vendor/bloodDonnation/advertisement/newAdvertisement', {
        partner: req.body.partner,
        bloodbank: req.body.bloodbank
    });
// blood bank update advertisement
exports.bloodbankUpdateAdvertisement = (req, res) =>
    res.render('vendor/bloodDonnation/advertisement/updateAdvertisement', {
        partner: req.body.partner,
        bloodbank: req.body.bloodbank,
        advertisement: req.docs
    });

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// medical market
exports.medicalMarketHome = (req, res) =>
    res.status(200).render('vendor/medicalMarket/medicalMarket', {
        partner: req.body.partner,
        market: req.body.market,
        activeScreen: 'home'
    });

// manage medical market
exports.medicalMarketManageProduct = (req, res) =>
    res
        .status(200)
        .render('vendor/medicalMarket/medicalMarketProductManagement', {
            partner: req.body.partner,
            market: req.body.market,
            products: req.body.product,
            activeScreen: 'myProducts'
        });

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// homecare
exports.homcareServiceHome = (req, res) =>
    res.status(200).render('vendor/homecare/homecare', {
        partner: req.body.partner,
        activeScreen: 'home'
    });

// homecare services
exports.homecareServices = (req, res) =>
    res.status(200).render('vendor/homecare/homecareServices', {
        partner: req.body.partner,
        services: req.body.services,
        homecares: req.body.homecares,
        activeScreen: 'services'
    });

// homecare services
exports.homecareFacilities = (req, res) =>
    res.status(200).render('vendor/homecare/homecareFacilities', {
        partner: req.body.partner,
        activeScreen: 'facilities'
    });
// homecare applicants
exports.homecareApplicants = (req, res) =>
    res.status(200).render('vendor/homecare/homecareApplications', {
        partner: req.body.partner,
        applicants: req.body.applicants,
        activeScreen: 'booking'
    });
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// deaddiction
exports.deaddictionHome = (req, res) =>
    res.status(200).render('vendor/deaddiction/deaddiction', {
        partner: req.body.partner,
        activeScreen: 'home'
    });

// deaddiction services
exports.deaddictionServices = (req, res) =>
    res.status(200).render('vendor/deaddiction/deaddictionServices', {
        partner: req.body.partner,
        services: req.body.services,
        deaddiction: req.body.deaddiction,
        activeScreen: 'services'
    });

// deaddiction services
exports.deaddictionFacilities = (req, res) =>
    res.status(200).render('vendor/deaddiction/deaddictionFacilities', {
        partner: req.body.partner,
        activeScreen: 'facilities'
    });
// deaddiction applicants
exports.deaddictionApplicants = (req, res) =>
    res.status(200).render('vendor/deaddiction/deaddictionApplications', {
        partner: req.body.partner,
        applicants: req.body.applicants,
        activeScreen: 'booking'
    });

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// opticals
// opticals home
exports.opticalsHome = (req, res) =>
    res.status(200).render('vendor/opticals/opticalsHome', {
        partner: req.docs,
        activeScreen: 'home'
    });

// optical service
exports.opticalServices = (req, res) =>
    res.status(200).render('vendor/opticals/opticalServiceManage', {
        partner: req.docs,
        products: req.body.products,
        orders: req.body.orders,
        activeScreen: 'services'
    });
// optical Booking
exports.opticalBooking = (req, res) =>
    res.status(200).render('vendor/opticals/opticalShowRoomBooking', {
        partner: req.docs,
        active: req.body.active,
        history: req.body.history,
        activeScreen: 'booking'
    });

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// hearing aid
// hearing aid home
exports.hearingaidHome = (req, res) =>
    res.status(200).render('vendor/hearingaid/hearingaidHome', {
        partner: req.docs,
        activeScreen: 'home'
    });

// hearing aid hospital booking
exports.hearingaidHospitalBooking = (req, res) =>
    res.status(200).render('vendor/hearingaid/hearingaidHospital', {
        partner: req.docs,
        activeScreen: 'hospital',
        active: req.body.booking.active,
        history: req.body.booking.history
    });

// hearing aid product data
exports.hearingAidProducts = (req, res) => {
    res.status(200).render('vendor/hearingaid/hearingaidShop', {
        partner: req.docs,
        activeScreen: 'product',
        activeSubList: 'product',
        products: req.body.products,
        orders: req.body.orders
    });
};

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// differently abled
// differently abled home
exports.differentlyAbledHome = (req, res) =>
    res.status(200).render('vendor/differentlyAbled/differentlyAbledHome', {
        partner: req.docs,
        activeScreen: 'home'
    });

// differently abled product data
exports.differentlyAbledProducts = (req, res) => {
    res.status(200).render('vendor/differentlyAbled/differentlyAbledShop', {
        partner: req.docs,
        activeScreen: 'diffproduct',

        products: req.body.products,
        orders: req.body.orders
    });
};
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// study abroad
// study abroad home
exports.studyabroadHome = (req, res) =>
    res.status(200).render('vendor/studyAbroad/studyAbroad', {
        partner: req.docs,
        activeScreen: 'home'
    });

// study aborad college details
exports.studyAbroadCollegeManage = (req, res) =>
    res.status(200).render('vendor/studyAbroad/studyAbroadCollegeDetails', {
        partner: req.body.partner,
        activeScreen: 'college',
        college: req.docs.collegeDetails
    });

// // study aborad course details
exports.studyAbroadCourseManage = (req, res) => {
    res.status(200).render('vendor/studyAbroad/studyAbroadCourseDetails', {
        partner: req.body.partner,
        activeScreen: 'course',
        college: req.docs.courseDetails
    });
};
// // study aborad faciliteis
exports.studyAbroadFacilityManage = (req, res) => {
    res.status(200).render('vendor/studyAbroad/studyAbroadFacilitiesDetails', {
        partner: req.body.partner,
        activeScreen: 'facilities',
        college: req.docs.faciliteisAvailable
    });
};

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// hospitals
// home
exports.hospitalHome = (req, res) =>
    res.status(200).render('vendor/hospitals/hopitalHome', {
        partner: req.docs,
        activeScreen: 'home'
    });

// hospital package managements
exports.hospitalPackageManagement = (req, res) => {
    res.status(200).render(
        'vendor/hospitals/package/hopitalPackageManagement',
        {
            partner: req.docs,
            activeScreen: 'package',
            packs: req.body.packs,
            packages: req.body.packages
        }
    );
};

// hospital service management
exports.getHospitalServices = (req, res) => {
    console.log(JSON.stringify(req.body));
    res.status(200).render('vendor/hospitals/services', {
        partner: req.body.partner,
        activeScreen: 'service',
        services: req.body.service.hospitalServices,
        packs: req.body.pack
    });
};

// hospital facilieties management
exports.getHospitalFacilities = (req, res) => {
    req.docs._id = undefined;

    res.status(200).render('vendor/hospitals/facilities', {
        partner: req.body.partner,
        activeScreen: 'facilities',
        facilities: req.docs.hospitalFacilities
    });
};

// hospital Specialist management
exports.getHospitalSpeacialist = (req, res) => {
    req.docs._id = undefined;

    res.status(200).render('vendor/hospitals/specialist', {
        partner: req.body.partner,
        activeScreen: 'specialist',
        specialist: req.docs.specialist
    });
};

// hospital room facilities management
exports.getHospitalRoomFacilities = (req, res) => {
    req.docs._id = undefined;
    console.log(req.docs.specialitiesDetails);
    res.status(200).render('vendor/hospitals/hospitalRoomFacilities', {
        partner: req.body.partner,
        activeScreen: 'room',
        room: req.docs.hospitalRoomFacilities ?? [],
        roomImages: req.docs.hospitalRoomImags ?? [],
        canteenImages: req.docs.hospitalCanteenImags ?? [],
        guestRoomImages: req.docs.hospitalGuestRoomImags ?? [],
        availableFacilities: req.docs.hospitalAvailableFacilities ?? {},
        speciality: req.docs.specialitiesDetails ?? {}
    });
};

// hospital nearby facilities
exports.getHospitalNearByFacilities = (req, res) => {
    req.docs._id = undefined;
    res.status(200).render('vendor/hospitals/tourism/nearByFacilities', {
        partner: req.body.partner,
        activeScreen: 'nearby',
        activeList: 'nearbyfac',
        nearby: req.docs.nearbyFacilities
    });
};

// hospital nearby hotes
exports.getHospitalNearByHotels = (req, res) => {
    req.docs._id = undefined;
    res.status(200).render('vendor/hospitals/tourism/nearByHotels', {
        partner: req.body.partner,
        activeScreen: 'nearby',
        activeList: 'hotels',
        hotels: req.docs.nearBy?.hotels ?? []
    });
};

// hospital nearby restaurents
exports.getHospitalNearByRestaurents = (req, res) => {
    req.docs._id = undefined;
    res.status(200).render('vendor/hospitals/tourism/nearByRestaurents', {
        partner: req.body.partner,
        activeScreen: 'nearby',
        activeList: 'restaurants',
        restaurants: req.docs.nearBy?.restaurants ?? []
    });
};

// hospital nearby airports
exports.getHospitalNearByAirports = (req, res) => {
    req.docs._id = undefined;
    res.status(200).render('vendor/hospitals/tourism/nearByAirports', {
        partner: req.body.partner,
        activeScreen: 'nearby',
        activeList: 'airports',
        airports: req.docs.nearBy?.airports ?? []
    });
};

// hospital nearby railway station
exports.getHospitalNearByRailwayStation = (req, res) => {
    req.docs._id = undefined;
    res.status(200).render('vendor/hospitals/tourism/nearByTrain', {
        partner: req.body.partner,
        activeScreen: 'nearby',
        activeList: 'train',
        railwayStation: req.docs.nearBy?.railwayStation ?? []
    });
};

// hospital nearby bus stops
exports.getHospitalNearByBusStops = (req, res) => {
    req.docs._id = undefined;
    res.status(200).render('vendor/hospitals/tourism/nearByBus', {
        partner: req.body.partner,
        activeScreen: 'nearby',
        activeList: 'bus',
        bus: req.docs.nearBy?.busStop ?? []
    });
};

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// Fitness routes
exports.getHospitalNearByBusStops = (req, res) =>
    res.status(200).render('vendor/fitness/fitness', {
        partner: req.docs,
        activeScreen: 'home'
    });

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// laboratory
// home
exports.laboratoryHome = (req, res) =>
    res.status(200).render('vendor/laboratory/laboratoryHome', {
        partner: req.docs,
        activeScreen: 'home'
    });

// laboratory services
exports.laboratoryServiceList = (req, res) =>
    res.status(200).render('vendor/laboratory/laboratoryServices', {
        activeScreen: 'tests',
        partner: req.docs,
        services: req.body.services
    });

// laboratory facilities
exports.laboratoryFacilitiesList = (req, res) =>
    res.status(200).render('vendor/laboratory/laboratoryFacilities', {
        activeScreen: 'facilities',
        partner: req.docs
    });

// laboratory images
exports.laboratoryImages = (req, res) =>
    res.status(200).render('vendor/laboratory/laboratoryImages', {
        activeScreen: 'image',
        partner: req.docs
    });

// laboratory images
exports.laboratoryBookings = (req, res) =>
    res.status(200).render('vendor/laboratory/laboratoryBookings', {
        activeScreen: 'bookings',
        partner: req.docs,
        booking: req.body.booking
    });
