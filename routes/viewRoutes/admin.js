// ============================================================
// import packages
const express = require('express');

// ============================================================
// create router
const router = express.Router();

// ============================================================
// import controllers
// admin controllers
const authControllers = require('../../controllers/authControllers');
const vendorViewControllers = require('../../controllers/vendorViewControllers');
const bloodDonationControllers = require('../../controllers/bloodDonationControllers');
const medicalMarketControllers = require('../../controllers/medicalMarketControllers');
const jobPortalControllers = require('../../controllers/jobPortalControllers');
const advertisementControllers = require('../../controllers/advertisementControllers');
const homecareServiceControllers = require('../../controllers/homecareServiceControllers');
const deaddictionControllers = require('../../controllers/deAddictionControllers');
const adminControllers = require('../../controllers/admin/adminControllers');
const adminViewControllers = require('../../controllers/adminViewControllers');
const ambulanceContro = require('../../controllers/admin/ambulanceContro');
const homecareContro = require('../../controllers/admin/homecareContro');
const deaddictionContro = require('../../controllers/admin/deaddictionContro');
const moduleContro = require('../../controllers/admin/moduleControllers');
const bloodDonationContro = require('../../controllers/bloodDonationControllers');
const expertContro = require('../../controllers/admin/meetTheExpertControllers');
const trackAmbulanceManagement = require('../../controllers/admin/trackAmbulanceManagement');
const opticalsControllers = require('../../controllers/admin/opticalsAdminControllers');

// vendor controllers
const studyAbroadVendorControllers = require('../../controllers/studeAbroadControlles');
const hospitalVenodrControllers = require('../../controllers/hospitalPackageControllers');
const speakToUsControllers = require('../../controllers/speakToUsControllers');
const opticalVendorControllers = require('../../controllers/opticalControllers');
const hearingaidVendorControllers = require('../../controllers/hearingControllers');
const differentlyabledControllers = require('../../controllers/differentlyAbledControllers');
const donnationVendorControllers = require('../../controllers/donnationControllers');
const medicalRecordsVendorControllers = require('../../controllers/medicalRecordsControllers');
const fitnessVendorControllers = require('../../controllers/fitnessControllers');
const ambulanceVendorControllers = require('../../controllers/ambulanceControllers');
const laboratoryVendorControllers = require('../../controllers/laboratoryControllers');
const meetTheExpertVendorControllers = require('../../controllers/meetTheExportControllers');
// ============================================================
// create routes
router.use(authControllers.protect, authControllers.restrictTo('admin'));
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// home
router.get(
    '/',
    adminControllers.countNumberOfDocuments,
    adminViewControllers.adminHome
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// vendor management
// get all modules
router.get('/vendor-management/', adminViewControllers.getVendorHome);

// get new partner requests
router.get(
    '/vendor-management/partner-requests',
    adminControllers.assignDataForGetRequestedPartners,
    adminControllers.getRequestedPartner,
    adminViewControllers.getRequesterVendorList
);

// get all vendors depend on modules
router.get(
    '/vendor-management/:moduleName',
    adminControllers.assignDataForGetAllVendors,
    adminControllers.getAllVendors,
    adminViewControllers.getVendorList
);

// get a vendor with available details
router.get(
    '/vendor-management/view-vendor/:vendorId',
    adminControllers.getAVendor,
    adminViewControllers.getAVendor
);

// get vendor's personal details
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/personal-deatils',
    adminControllers.assignDataForGetAVendorPersonalDetails,
    adminControllers.getVendorADeatails,
    adminViewControllers.getAVendorDetails
);

// get vendor's personal details
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/service-and-facilities',
    adminControllers.vendorFacilitiesandServices,
    adminViewControllers.getAVendorServiceDetails
);
// get vendor's personal details
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/booking-management',
    adminControllers.getAppliants,
    adminViewControllers.getAVendorBookingManagement
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ambulance
// get vendor's personal details
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/ambulance-drivers',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminViewControllers.getAAmbulanceDrivers
);
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/ambulance-facilities',
    adminControllers.getPartnerAndAmbulanceServices,
    adminViewControllers.getAAmbulanceFacilities
);
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/ambulance-quotes-management',
    adminControllers.setSearchqueryForAmbulanceQuotes,
    ambulanceVendorControllers.getPartnerAndQuotes,
    adminViewControllers.getAAmbulanceBooking
);

// ============================================================
// ============================================================
// ============================================================
// blood bank
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/blood-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminViewControllers.getABloodbankBloodManage
);
// ============================================================
// ============================================================
// ============================================================
// meet the experts service and facilities
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/expert-service-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    meetTheExpertVendorControllers.getMeetTheExpertsServices,
    adminViewControllers.getAExpertServiceManage
);

// expert booking management
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/expert-booking-management',
    adminControllers.setSearchForExportBookingList,
    meetTheExpertVendorControllers.getMeetTheExpertsBookingList,
    adminViewControllers.getAExpertsBooking
);

// ============================================================
// ============================================================
// ============================================================
// study abroad
// study aboroad home
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/college-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.createStudyAbroadDetailsidItNew,
    adminControllers.assignDataForGetStudyAbroad,
    studyAbroadVendorControllers.getACollege,
    adminViewControllers.getStudyAboradCollegeDetailsManagement
);

// study aboroad course management
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/course-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.createStudyAbroadDetailsidItNew,
    adminControllers.assignDataForGetStudyAbroad,
    studyAbroadVendorControllers.getACollege,
    adminViewControllers.getStudyAboradCourseDetailsManagement
);

// study aboroad course management
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/facilities-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.createStudyAbroadDetailsidItNew,
    adminControllers.assignDataForGetStudyAbroad,
    studyAbroadVendorControllers.getACollege,
    adminViewControllers.getStudyAboradFacilitieManagement
);

// ============================================================
// ============================================================
// ============================================================
// Hospital
// Hospital Package Management
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/package-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVenodrControllers.getAllHospitalPackageServices,
    adminViewControllers.getHospitalPackageManagement
);
// hospital package managemetn
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/hospital-service-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVenodrControllers.getAllHospitalServicesAndPackages,
    adminViewControllers.getHospitalServiceManagement
);

// hospital facilities managemetn
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/hospital-facilities-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVenodrControllers.assignDataFotGettHospitalFacilities,
    hospitalVenodrControllers.getHospitalDatas,
    adminViewControllers.getHospitalFacilitieManagement
);

// hospital facilities managemetn
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/hospital-specialist-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVenodrControllers.assignDataFotGettHospitalSpecialist,
    hospitalVenodrControllers.getHospitalDatas,
    adminViewControllers.getHospitalSpecialManagement
);

// hospital room facilities managemetn
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/hospital-room-facilities-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVenodrControllers.assignDataFotGettHospitalRoomFacilities,
    hospitalVenodrControllers.getHospitalDatas,
    adminViewControllers.getHospitalRoomFacilitiesManagement
);

// hospital nearby management
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/tourism/nearby-facilities-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVenodrControllers.assignDataFotGettHospitalNearby,
    hospitalVenodrControllers.getHospitalDatas,
    adminViewControllers.getHospitalNearbyFacilitiesManagemant
);

// hospital nearby hotel management management
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/tourism/nearby-hotels-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVenodrControllers.assignDataFotGettHospitalNearbyHotels,
    hospitalVenodrControllers.getHospitalDatas,
    adminViewControllers.getHospitalNearbyHotelsManagemant
);

// hospital nearby restaurents management management
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/tourism/nearby-restaurants-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVenodrControllers.assignDataFotGettHospitalNearbyRestaurents,
    hospitalVenodrControllers.getHospitalDatas,
    adminViewControllers.getHospitalNearbyReastaurentsManagemant
);

// hospital nearby restaurents management management
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/tourism/nearby-airport-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVenodrControllers.assignDataFotGettHospitalNearbyAirports,
    hospitalVenodrControllers.getHospitalDatas,
    adminViewControllers.getHospitalNearbyAirportsManagemant
);
// hospital nearby tarain management management
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/tourism/nearby-railwayStation-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVenodrControllers.assignDataFotGettHospitalNearbyRailwayStation,
    hospitalVenodrControllers.getHospitalDatas,
    adminViewControllers.getHospitalNearbyTrainsManagemant
);
// hospital nearby restaurents management management
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/tourism/nearby-busstops-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVenodrControllers.assignDataFotGettHospitalNearbyBusStops,
    hospitalVenodrControllers.getHospitalDatas,
    adminViewControllers.getHospitalNearbyBussManagemant
);

// ============================================================
// ============================================================
// ============================================================
// Speak to Us
// Slots managemetn
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/slots-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.assignDataForGetSpeakToUsAvailablity,
    speakToUsControllers.verifyVendorDatas,
    speakToUsControllers.assignDataForFindMyAvailablitySlots,
    speakToUsControllers.getMyAvailablity,
    adminViewControllers.getSpeakToUsSlots
);

// ============================================================
// ============================================================
// ============================================================
// Opticals Management
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/product-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.getOpticalProductandOrders,
    adminViewControllers.getOpticalsProductsManagement
);

// booking managemetn
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/opticals-booking-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.getAllBookinOpticalBookingdata,
    adminViewControllers.getOpticalsBookingManagement
);

// ============================================================
// ============================================================
// ============================================================
// hearing aid
// bearinga id product management
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/hearingaid-products-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    hearingaidVendorControllers.getHearingaidProduct,
    adminViewControllers.getHearingAidProductManagement
);

// differenly able product mnagemnte
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/differently-abled-products-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    differentlyabledControllers.getDifferentlyAbledProducts,
    adminViewControllers.getDifferentlyAbledProductManagement
);

// hearing aid hospital booking management
router.get(
    '/vendor-management/vendor-details/:moduleName/:vendorId/hospital-booking-management',
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    hearingaidVendorControllers.getHearingAidHospitalBookingData,
    adminViewControllers.getHearingAidHospitalProductManagement
);

// ============================================================
// ============================================================
// ============================================================
// equip management
router.get(
    '/vendor-management/vendor-details/Fitness/:vendorId/equipment-management',
    adminControllers.setModuleNameForFitness,
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminViewControllers.getAEquidmentManagement
);

// facilities management
router.get(
    '/vendor-management/vendor-details/Fitness/:vendorId/fitness-facilities-management',
    adminControllers.setModuleNameForFitness,
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminViewControllers.getFacilitiesManagement
);

// fitness videos management
router.get(
    '/vendor-management/vendor-details/Fitness/:vendorId/fitness-video-management',
    adminControllers.setModuleNameForFitness,
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    fitnessVendorControllers.assignDatatoGetVendorFitnessVideos,
    fitnessVendorControllers.getVendorFitnesVideos,
    adminViewControllers.getVideoManagement
);

// ============================================================
// ============================================================
// ============================================================
// laboratory
// get laboratory booking
router.get(
    '/vendor-management/vendor-details/Laboratory/:vendorId/laboratory-booking-management',
    adminControllers.setModuleNameForLaboratory,
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    laboratoryVendorControllers.getAllLaboratoryBookings,
    adminViewControllers.getLaboratoryBooking
);

// get laboratory services
router.get(
    '/vendor-management/vendor-details/Laboratory/:vendorId/laboratory-services-management',
    adminControllers.setModuleNameForLaboratory,
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    laboratoryVendorControllers.getAllLaboratoryCategories,
    adminViewControllers.getLaboratoryServices
);

// get laboratory facilities
router.get(
    '/vendor-management/vendor-details/Laboratory/:vendorId/laboratory-facilities-management',
    adminControllers.setModuleNameForLaboratory,
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminViewControllers.getLaboratoryFacilities
);

// get laboratory lab images
router.get(
    '/vendor-management/vendor-details/Laboratory/:vendorId/laboratory-lab-images-management',
    adminControllers.setModuleNameForLaboratory,
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminViewControllers.getLaboratoryImages
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// users
router.get(
    '/user-management/',
    adminControllers.assignDataForFindUsers,
    adminControllers.getAllUsers,
    adminViewControllers.getAlluserHome
);

// get a user
router.get(
    '/user-management/view-user/:userEId',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    adminViewControllers.getAUser
);

// ============================================================
// ============================================================
// ============================================================
// ambulance
router.get(
    '/user-management/ambulance-service/:userEId',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    ambulanceContro.getUsersBookedData,
    adminViewControllers.getUserAmbulanceHome
);

// ============================================================
// ============================================================
// ============================================================
// homecare
// homecare home
router.get(
    '/user-management/homecare-services/:userEId',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    homecareContro.getUserBookedHomecareServices,
    adminViewControllers.getUserHomecareHome
);
// ============================================================
// ============================================================
// ============================================================
// expert
// expert home
router.get(
    '/user-management/meet-the-expert-service/:userEId',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    expertContro.getUserBookedExpertServices,
    adminViewControllers.getUserExpertHome
);

// ============================================================
// ============================================================
// ============================================================
// deaddiction
// deaddiction home
router.get(
    '/user-management/de-addiction-service/:userEId',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    deaddictionContro.getUserBookedDeaddictionServices,
    adminViewControllers.getUserDeaddictionHome
);
// ============================================================
// ============================================================
// ============================================================
// blood donation
// blood donner management
router.get(
    '/user-management/blood-donation-service/:userEId/blood-donner-list',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    bloodDonationContro.assignDataForGetBloodDonners,
    bloodDonationContro.getBloodDonners,
    adminViewControllers.getUserBloodDonationHome
);

// blood request management
router.get(
    '/user-management/blood-donation-service/:userEId/blood-request-management',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    bloodDonationContro.assignDataForGetBloodDonners,
    bloodDonationContro.getBloodDonners,
    adminViewControllers.getUserBloodDonationHome
);
// ============================================================
// ============================================================
// ============================================================
// Meet The Expert
// blood donation
router.get(
    '/user-management/blood-donation-service/:userEId/blood-donner-list',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    bloodDonationContro.assignDataForGetBloodDonners,
    bloodDonationContro.getBloodDonners,
    adminViewControllers.getUserBloodDonationHome
);

// blood requests
router.get(
    '/user-management/blood-donation-service/:userEId/user-blood-request',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    bloodDonationContro.getUserBloodRequests,
    adminViewControllers.getUserBloodDonationRequester
);
// blood requests
router.get(
    '/user-management/blood-donation-service/:userEId/user-blood-request-received',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    bloodDonationContro.getUserReceivedBloodRequests,
    adminViewControllers.getUserBloodDonationRequest
);

// ============================================================
// ============================================================
// ============================================================
// opticals
// order management
router.get(
    '/user-management/opticals-service/:userEId/order-management',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    opticalsControllers.assignDataForOpticalOrdersGet,
    opticalVendorControllers.getMyOpticalOrders,
    adminViewControllers.getUserOpticalsOrders
);

// booking management
router.get(
    '/user-management/opticals-service/:userEId/booking-management',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    opticalsControllers.assignDataForOpticalOrdersGet,
    opticalVendorControllers.getMyOpticalBooking,
    adminViewControllers.getUserOpticalsBooking
);

// ============================================================
// ============================================================
// ============================================================
// hearing aid
// booking management
router.get(
    '/user-management/hearingaid-service/:userEId/hospital-booking-management',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    opticalsControllers.assignDataForOpticalOrdersGet,
    hearingaidVendorControllers.getMyHearingAidBooking,
    adminViewControllers.getUserHearingAidBookingHospital
);

// hearig aid order management
router.get(
    '/user-management/hearingaid-service/:userEId/hearingadi-order-management',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    opticalsControllers.assignDataForOpticalOrdersGet,
    hearingaidVendorControllers.getMyHearingAidOrders,
    adminViewControllers.getUserHearingAidOrdes
);

// ============================================================
// ============================================================
// ============================================================
// different abled product
// differently order management
router.get(
    '/user-management/differently-abled-service/:userEId/differently-abled-order-management',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    opticalsControllers.assignDataForOpticalOrdersGet,
    hearingaidVendorControllers.getMyDifferentlyAbledOrders,
    adminViewControllers.getUserDifferentlyabliedOrdes
);

// ============================================================
// ============================================================
// ============================================================
// donation and charity
// my donation
router.get(
    '/user-management/donation-and-charity/:userEId/user-fund-donation',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    opticalsControllers.assignDataForOpticalOrdersGet,
    donnationVendorControllers.assignDataForGetAllDonationHistory,
    donnationVendorControllers.getAllFundDonationHistory,
    adminViewControllers.getUserFundDonations
);

// my donation requst donation
router.get(
    '/user-management/donation-and-charity/:userEId/user-fund-requests',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    opticalsControllers.assignDataForOpticalOrdersGet,
    donnationVendorControllers.asssignDataForGetAllDonationHistory,
    donnationVendorControllers.getAllDonationRequstHistoty,
    adminViewControllers.getAllDonationRequestHistory
);

// user donation request
router.get(
    '/user-management/donation-and-charity/:userEId/user-fund-requests',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    opticalsControllers.assignDataForOpticalOrdersGet
);

// ============================================================
// ============================================================
// ============================================================
// Medical records
router.get(
    '/user-management/medical-records/:userEId/medical-records-management',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    opticalsControllers.assignDataForOpticalOrdersGet,
    medicalRecordsVendorControllers.getMedicalRecordsThroughMember,
    adminViewControllers.getMedicalRecords
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// modules management
router.get('/module-management/', adminViewControllers.getModuleHome);

// ============================================================
// ============================================================
// ============================================================
// homecare modules
router.get(
    '/module-management/homecare-service/',
    adminControllers.getAUser,
    moduleContro.getAllHomecareServices,
    adminViewControllers.getModuleHomecareHome
);
// ============================================================
// ============================================================
// ============================================================
// deaddiction modules
router.get(
    '/module-management/deaddiction-service/',
    adminControllers.getAUser,
    moduleContro.getAllDeaddictionServices,
    adminViewControllers.getModuleDeaddictionHome
);
// ============================================================
// ============================================================
// ============================================================
// ambulance modules
router.get(
    '/module-management/ambulance-service/',
    adminControllers.getAUser,
    moduleContro.getAllAmbulanceServices,
    adminViewControllers.getModulesAmbulanceHome
);
// ============================================================
// ============================================================
// ============================================================
// Hospita Packages
router.get(
    '/module-management/hospital-packages/',
    adminControllers.getAUser,
    moduleContro.getAllHospitalPackages,
    adminViewControllers.getModulesHospitalPackageHome
);

// ============================================================
// ============================================================
// ============================================================
// Fitness
router.get(
    '/module-management/fitness/',
    adminControllers.getAUser,
    moduleContro.getAllNutritions,
    adminViewControllers.getModulesFitnesNutrionsHome
);

// ============================================================
// ============================================================
// ============================================================
// Pharmacy
// cate4gories
router.get(
    '/module-management/pharmacy/categories',
    adminControllers.getAUser,
    moduleContro.getAllPharmacyCategories,
    adminViewControllers.getModulesFitnesPharmacyCategories
);
// Pharmacy
router.get(
    '/module-management/pharmacy/medicines',
    adminControllers.getAUser,
    moduleContro.getAllMedicinesAndCategoreis,
    adminViewControllers.getModulesFitnesPharmacyMedicines
);

// ============================================================
// ============================================================
// ============================================================
// Laboratory
router.get(
    '/module-management/laboratory/categories',
    adminControllers.getAUser,
    moduleContro.getAllLaboratoryCategories,
    adminViewControllers.getModulesFitnesLaboratoryCategories
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ambulance management
// Ambulance management home
router.get('/ambulance-alert', adminViewControllers.getModuleAmbulanceHome);
// ambulance drivers
router.get(
    '/ambulance-alert/ambulance-driver-management',
    trackAmbulanceManagement.getAllAmbulanceDrivers,
    adminViewControllers.getModuleAmbulanceDriver
);
// ambulance drivers
router.get(
    '/ambulance-alert/traffic-police-management',
    trackAmbulanceManagement.getAllTrafficPoliceModel,
    adminViewControllers.getModuleTrafficPolice
);

// request new ambulance request
router.get(
    '/ambulance-alert/request-management/new-ambulance-request',
    trackAmbulanceManagement.getAllNewAmbulanceAlert,
    adminViewControllers.getModuleAlertNewAlerts
);

// request new Veify request
router.get(
    '/ambulance-alert/request-management/verification-requests',
    trackAmbulanceManagement.assignDataForGetAllVerifyRequest,
    trackAmbulanceManagement.getAllVerifyRequest,
    adminViewControllers.getModuleAlertVerifyAlerts
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// Donation management

// ============================================================
// ============================================================
// ============================================================
// donation and charity
router.get(
    '/donation-management/donation-and-charity/active-donation-management'
);

// export routes
module.exports = router;
