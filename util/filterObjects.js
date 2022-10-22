const filerDataFromRequest = (obj, ...allowedFields) => {
    const filterdData = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) filterdData[el] = obj[el];
    });
    return filterdData;
};

module.exports = filerDataFromRequest;