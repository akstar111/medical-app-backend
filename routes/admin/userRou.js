// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../controllers/authControllers');
const adminControllers = require('../../controllers/admin/adminControllers');
// ============================================================
router.use(authControllers.protect, authControllers.restrictTo('admin'));

// get all user
router.get(
    '/get-all-user',
    adminControllers.assignDataForFindUsers,
    adminControllers.getAllUsers,
    adminControllers.sendJsonForGetAll
);
// get  a user
router.get(
    '/get-a-user/:userEId',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ambulance
// get all request
router.get('/blooddontion/requests/:email', adminControllers.getBloodRequest);

// ============================================================
module.exports = router;
