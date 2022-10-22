// assign data for get optical orders
exports.assignDataForOpticalOrdersGet = (req, res, next) => {
    req.user = { _id: req.docs._id };
    return next();
};
