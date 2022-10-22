// ============================================================
// import packages
const express = require('express');

// ============================================================
// create router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../controllers/authControllers');
const vendorViewControllers = require('../../controllers/vendorViewControllers');
const bloodDonationControllers = require('../../controllers/bloodDonationControllers');
const medicalMarketControllers = require('../../controllers/medicalMarketControllers');
const jobPortalControllers = require('../../controllers/jobPortalControllers');
const advertisementControllers = require('../../controllers/advertisementControllers');
const homecareServiceControllers = require('../../controllers/homecareServiceControllers');
const deaddictionControllers = require('../../controllers/deAddictionControllers');
const vendorControllers = require('../../controllers/vendorControllers');
const opticlasControllers = require('../../controllers/opticalControllers');
const hearingControllers = require('../../controllers/hearingControllers');
const studyAbroadControllers = require('../../controllers/studeAbroadControlles');
const hospitalControllers = require('../../controllers/hospitalPackageControllers');
const differentlyAbledControllers = require('../../controllers/differentlyAbledControllers');
const fitnessControllers = require('../../controllers/fitnessControllers');
const laboratoryControllers = require('../../controllers/laboratoryControllers');

// ============================================================
// create routes

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// blood donation

// blood donation home
router.get(
    '/blood-bank',
    authControllers.protect,
    vendorControllers.assignPartnerBloodBank,
    vendorControllers.getPartner,
    vendorViewControllers.bloodBankHome
);

// manage blood bank bloods
router.get(
    '/blood-bank/manage-blood',
    authControllers.protect,
    vendorControllers.assignPartnerBloodBank,
    vendorControllers.getPartner,
    vendorViewControllers.bloodBankManageBlood
);
// quotes
router.get(
    '/blood-bank/quotes',
    authControllers.protect,
    vendorControllers.getPartner,
    medicalMarketControllers.getProductList,
    vendorViewControllers.bloodBankQuotes
);

// quotelist
router.get(
    '/blood-bank/quotes/lowest-quotes/:batchId',
    authControllers.protect,
    vendorControllers.getPartner,
    medicalMarketControllers.getTop3LowestQuotes,
    vendorViewControllers.bloodBankQuotesList
);

// viewa a quote
router.get(
    '/blood-bank/get-a-quote/:quoteId',
    authControllers.protect,
    vendorControllers.getPartner,
    medicalMarketControllers.getTop3LowestQuotes,
    vendorViewControllers.bloodBankQuotesList
);

// jobjob
router.get(
    '/:from/job-management',
    authControllers.protect,
    vendorControllers.getPartner,
    jobPortalControllers.GetMyPostedJobs,
    vendorViewControllers.bloodBankjob
);

// blood bank post job
router.get(
    '/:from/job-management/post-new-job',
    authControllers.protect,
    vendorControllers.getPartner,
    jobPortalControllers.getCategories,
    vendorViewControllers.bloodBankPostJob
);

// update my job
router.get(
    '/:from/job-management/update-my-job/:jobId',
    authControllers.protect,
    vendorControllers.getPartner,
    jobPortalControllers.getCategories,
    vendorViewControllers.bloodBankUpdateJob
);

// get job
router.get(
    '/:from/job-management/view-a-job/:jobId',
    authControllers.protect,
    vendorControllers.getPartner,
    jobPortalControllers.assignDataforGetJobandReceivedApplications,
    jobPortalControllers.getJobandapplications,
    vendorViewControllers.bloodBankViewaJob
);

// get a job profile
router.get(
    '/:from/job-management/applicant/:applicantId',
    authControllers.protect,
    vendorControllers.getPartner,
    jobPortalControllers.findOneJobApplicant,
    vendorViewControllers.bloodBankViewaApplicant
);

// blood dontaion advertisiment
router.get(
    '/blood-bank/advertisement/',
    authControllers.protect,
    vendorControllers.getPartner,
    advertisementControllers.getMyadvertisements,
    vendorViewControllers.bloodBankAdvertisement
);

// blood donnation create new advertisement
router.get(
    '/blood-bank/advertisement/new-advertisement',
    authControllers.protect,
    vendorControllers.getPartner,
    vendorViewControllers.bloodbankNewAdvertisement
);

// blood donation update advertisement
router.get(
    `/blood-bank/advertisement/update-advertisement/:adId`,
    authControllers.protect,
    vendorControllers.getPartner,
    advertisementControllers.assignDataForGetAAdvertisement,
    advertisementControllers.getAAdvertisement,
    vendorViewControllers.bloodbankUpdateAdvertisement
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// medical market
// blood donation home
router.get(
    '/medical-market',
    authControllers.protect,
    medicalMarketControllers.getPartneranMarket,
    vendorViewControllers.medicalMarketHome
);
router.get(
    '/medical-market/product-management',
    authControllers.protect,
    medicalMarketControllers.getPartneranMarket,
    medicalMarketControllers.getMyProducts,
    vendorViewControllers.medicalMarketManageProduct
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// Home care services
router.get(
    '/homecare-services',
    authControllers.protect,
    homecareServiceControllers.getPartneranService,
    vendorViewControllers.homcareServiceHome
);

// home care serives
router.get(
    '/homecare-services/services',
    authControllers.protect,
    homecareServiceControllers.getPartneranService,
    vendorViewControllers.homecareServices
);
// home care faciliteis
router.get(
    '/homecare-services/facilities',
    authControllers.protect,
    homecareServiceControllers.getPartneranService,
    vendorViewControllers.homecareFacilities
);

// home care faciliteis
router.get(
    '/homecare-services/booking-management',
    authControllers.protect,
    homecareServiceControllers.getPartneranService,
    homecareServiceControllers.getHomecareAppliants,
    vendorViewControllers.homecareApplicants
);
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// Deaddiction

router.get(
    '/deaddiction-service',
    authControllers.protect,
    deaddictionControllers.getPartneraService,
    vendorViewControllers.deaddictionHome
);

// home care serives
router.get(
    '/deaddiction-service/services',
    authControllers.protect,
    deaddictionControllers.getPartneranService,
    vendorViewControllers.deaddictionServices
);
// home care faciliteis
router.get(
    '/deaddiction-service/facilities',
    authControllers.protect,
    deaddictionControllers.getPartneraService,
    vendorViewControllers.deaddictionFacilities
);

// home care faciliteis
router.get(
    '/deaddiction-service/booking-management',
    authControllers.protect,
    deaddictionControllers.getPartneraService,
    deaddictionControllers.getDeaddictionAppliants,
    vendorViewControllers.deaddictionApplicants
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// opticals
// opticals home
router.get(
    '/opticals/',
    authControllers.protect,
    opticlasControllers.assignPartnerSearchData,
    opticlasControllers.verifyValidPartner,
    vendorViewControllers.opticalsHome
);

// get optical service
router.get(
    '/opticals/manage-services',
    authControllers.protect,
    opticlasControllers.assignPartnerSearchData,
    opticlasControllers.verifyValidPartner,
    opticlasControllers.getOpticalProductandOrders,
    vendorViewControllers.opticalServices
);

// get optical bookings datas
router.get(
    '/opticals/manage-showroom-booking',
    authControllers.protect,
    opticlasControllers.assignPartnerSearchData,
    opticlasControllers.verifyValidPartner,
    opticlasControllers.getMyOpticalsBooking,
    vendorViewControllers.opticalBooking
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// Hearing-AID
// hearing aid home
router.get(
    '/hearingaid',
    authControllers.protect,
    hearingControllers.assignPartnerSearchData,
    hearingControllers.verifyValidPartner,
    vendorViewControllers.hearingaidHome
);

// hearing aid hospital booking managemennt
router.get(
    '/hearingaid/hospital-booking-management',
    authControllers.protect,
    hearingControllers.assignPartnerSearchData,
    hearingControllers.verifyValidPartner,
    hearingControllers.getHearingAidHospitalBookingData,
    vendorViewControllers.hearingaidHospitalBooking
);

// hearing aid hearingaid product managemnt
router.get(
    '/hearingaid/hearingaid-product-management',
    authControllers.protect,
    hearingControllers.assignPartnerSearchData,
    hearingControllers.verifyValidPartner,
    hearingControllers.getHearingaidProduct,
    vendorViewControllers.hearingAidProducts
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// Differetnly Abled
// hearing aid home
router.get(
    '/differently-abled-products',
    authControllers.protect,
    differentlyAbledControllers.assignPartnerSearchDataForDifferently,
    differentlyAbledControllers.verifyValidPartner,
    vendorViewControllers.differentlyAbledHome
);
// hearing aid hearingaid product managemnt
router.get(
    '/differently-abled-products/differently-abled-product-management',
    authControllers.protect,
    differentlyAbledControllers.assignPartnerSearchDataForDifferently,
    differentlyAbledControllers.verifyValidPartner,
    differentlyAbledControllers.getDifferentlyAbledProducts,
    vendorViewControllers.differentlyAbledProducts
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// study abroad
router.get(
    '/study-abroad',
    authControllers.protect,
    studyAbroadControllers.assignPartnerSearchData,
    studyAbroadControllers.verifyValidPartner,
    studyAbroadControllers.createStudyAbroadDetailsidItNew,
    vendorViewControllers.studyabroadHome
);

// stude abroad college details
router.get(
    '/study-abroad/college-details-management',
    authControllers.protect,
    studyAbroadControllers.assignPartnerSearchData,
    studyAbroadControllers.verifyValidPartner,
    studyAbroadControllers.checkIfDataAlreadyCreated,
    studyAbroadControllers.assignDataForGetStudyAbroad,
    studyAbroadControllers.getACollege,
    vendorViewControllers.studyAbroadCollegeManage
);

// study aborad course details
router.get(
    '/study-abroad/course-details-management',
    authControllers.protect,
    studyAbroadControllers.assignPartnerSearchData,
    studyAbroadControllers.verifyValidPartner,
    studyAbroadControllers.checkIfDataAlreadyCreated,
    studyAbroadControllers.assignDataForGetStudyAbroad,
    studyAbroadControllers.getACollege,
    vendorViewControllers.studyAbroadCourseManage
);

// study abroad faclities update
router.get(
    '/study-abroad/facilities-management',
    authControllers.protect,
    studyAbroadControllers.assignPartnerSearchData,
    studyAbroadControllers.verifyValidPartner,
    studyAbroadControllers.checkIfDataAlreadyCreated,
    studyAbroadControllers.assignDataForGetStudyAbroad,
    studyAbroadControllers.getACollege,
    vendorViewControllers.studyAbroadFacilityManage
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// hospital
// home
router.get(
    '/hospital',
    authControllers.protect,
    hospitalControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    vendorViewControllers.hospitalHome
);
// hospital package management
router.get(
    '/hospital/package-management',
    authControllers.protect,
    hospitalControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    hospitalControllers.getAllHospitalPackageServices,
    vendorViewControllers.hospitalPackageManagement
);

// hospital service management
router.get(
    '/hospital/service-management',
    authControllers.protect,
    hospitalControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    hospitalControllers.getAllHospitalServicesAndPackages,
    // hospitalControllers.assignDataFotGettHospitalServices,
    // hospitalControllers.getHospitalDatas,
    vendorViewControllers.getHospitalServices
);

// hospital facilitie management
router.get(
    '/hospital/facilities-management',
    authControllers.protect,
    hospitalControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    hospitalControllers.assignDataFotGettHospitalFacilities,
    hospitalControllers.getHospitalDatas,
    vendorViewControllers.getHospitalFacilities
);

// hospital speciallist management
router.get(
    '/hospital/specialist-management',
    authControllers.protect,
    hospitalControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    hospitalControllers.assignDataFotGettHospitalSpecialist,
    hospitalControllers.getHospitalDatas,
    vendorViewControllers.getHospitalSpeacialist
);

// hospital room management
router.get(
    '/hospital/hospital-room-management',
    authControllers.protect,
    hospitalControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    hospitalControllers.assignDataFotGettHospitalRoomFacilities,
    hospitalControllers.getHospitalDatas,
    vendorViewControllers.getHospitalRoomFacilities
);

// near by facility management
router.get(
    '/hospital/nearby-facility-management',
    authControllers.protect,
    hospitalControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    hospitalControllers.assignDataFotGettHospitalNearby,
    hospitalControllers.getHospitalDatas,
    vendorViewControllers.getHospitalNearByFacilities
);

// near by hotels management
router.get(
    '/hospital/nearby-hotels-management',
    authControllers.protect,
    hospitalControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    hospitalControllers.assignDataFotGettHospitalNearbyHotels,
    hospitalControllers.getHospitalDatas,
    vendorViewControllers.getHospitalNearByHotels
);

// near by restaurents management
router.get(
    '/hospital/nearby-restaurants-management',
    authControllers.protect,
    hospitalControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    hospitalControllers.assignDataFotGettHospitalNearbyRestaurents,
    hospitalControllers.getHospitalDatas,
    vendorViewControllers.getHospitalNearByRestaurents
);

// near by airport management
router.get(
    '/hospital/nearby-airport-management',
    authControllers.protect,
    hospitalControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    hospitalControllers.assignDataFotGettHospitalNearbyAirports,
    hospitalControllers.getHospitalDatas,
    vendorViewControllers.getHospitalNearByAirports
);

// near by bust management
router.get(
    '/hospital/nearby-railwayStation-management',
    authControllers.protect,
    hospitalControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    hospitalControllers.assignDataFotGettHospitalNearbyRailwayStation,
    hospitalControllers.getHospitalDatas,
    vendorViewControllers.getHospitalNearByRailwayStation
);

// near by bus stop management
router.get(
    '/hospital/nearby-busstops-management',
    authControllers.protect,
    hospitalControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    hospitalControllers.assignDataFotGettHospitalNearbyBusStops,
    hospitalControllers.getHospitalDatas,
    vendorViewControllers.getHospitalNearByBusStops
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// Fitness
// Get fitness home
router.get(
    '/fitness',
    authControllers.protect,
    fitnessControllers.assignPartnerSearchData,
    fitnessControllers.verifyValidPartner,
    vendorViewControllers.getHospitalNearByBusStops
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// Laboratory
// get laboratory home
router.get(
    '/laboratory',
    authControllers.protect,
    laboratoryControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    vendorViewControllers.laboratoryHome
);

// get laboratory services
router.get(
    '/laboratory/manage-services',
    authControllers.protect,
    laboratoryControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    laboratoryControllers.getAllLaboratoryCategories,
    vendorViewControllers.laboratoryServiceList
);

// get laboratory facilities
router.get(
    '/laboratory/manage-facilities',
    authControllers.protect,
    laboratoryControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    vendorViewControllers.laboratoryFacilitiesList
);

// get laboratory lab images
router.get(
    '/laboratory/manage-lab-images',
    authControllers.protect,
    laboratoryControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    vendorViewControllers.laboratoryImages
);

// get laboratory booking management
router.get(
    '/laboratory/laboratory-bookings',
    authControllers.protect,
    laboratoryControllers.assignPartnerSearch,
    hospitalControllers.verifyValidPartner,
    laboratoryControllers.getAllLaboratoryBookings,
    vendorViewControllers.laboratoryBookings
);

// ============================================================
// export routes
module.exports = router;
