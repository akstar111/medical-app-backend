// ============================================================
// import libraries
const express = require('express');

// ============================================================
// import controller
const authControllers = require('../controllers/authControllers');
const orgonControllers = require('../controllers/orgonControllers');

// ============================================================
// set routes
const router = express.Router();

// ============================================================
// set routes
router.post(
    '/new-orgon',
    authControllers.protect,
    orgonControllers.assignPartnerSearchData,
    orgonControllers.verifyValidPartner,
    orgonControllers.assignPartnerId,
    orgonControllers.createNewService,
    orgonControllers.sendServiceJson
);

// update organ
router.patch(
    '/update-orgon/:orgonId',
    authControllers.protect,
    orgonControllers.assignPartnerSearchData,
    orgonControllers.verifyValidPartner,
    orgonControllers.assignValidPartnerSearchData,
    orgonControllers.verifyValidPartnerissSerive,
    orgonControllers.updateOrgaonDonation,
    orgonControllers.sendServiceJson
);

// delete organ
router.delete(
    '/delete-orgon/:orgonId',
    authControllers.protect,
    orgonControllers.assignPartnerSearchData,
    orgonControllers.verifyValidPartner,
    orgonControllers.assignValidPartnerSearchData,
    orgonControllers.verifyValidPartnerissSerive,
    orgonControllers.deleteOrgaonDonation,
    orgonControllers.sendServiceJson
);
// ============================================================
// export routes
module.exports = router;
