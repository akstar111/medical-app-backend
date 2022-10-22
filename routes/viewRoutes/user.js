// ============================================================
// import packages
const express = require('express');

// ============================================================
// create router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../controllers/authControllers');
const userViewControllers = require('../../controllers/userViewControllers');

// ============================================================
// create routes

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// shared

// login
router.get(
    '/login',
    authControllers.isUserAlreadyLogin,
    // authControllers.redirectUserttoLogin,
    userViewControllers.login
);



// logout
router.get('/logout', authControllers.logout);

// ============================================================
// export routes
module.exports = router;
