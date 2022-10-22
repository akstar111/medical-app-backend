// import packages
import axios from 'axios';
import swal from 'sweetalert';

// // create controllers
// export let createHomcecare = async (
//     name,
//     phone,
//     centerPhone,
//     centerLandLine,
//     latitude,
//     longtitude,
//     openTime,
//     closeTime,
//     address,
//     serviceType,
//     city
// ) => {
//     try {
//         await axios({
//             method: 'POST',
//             url: '/api/v1/homecare/new-homecare',
//             data: {
//                 name,
//                 phone,
//                 centerPhone,
//                 centerLandLine,
//                 location: [latitude, longtitude],
//                 openTime,
//                 closeTime,
//                 address,
//                 serviceType,
//                 city
//             }
//         })
//             .then((res) => {
//                 if (res.data.status === 'Success') {
//                     swal(
//                         'Success',
//                         'Your Homecare profile created successfully.',
//                         'success'
//                     );
//                     return setTimeout(() => location.reload(), 2000);
//                 }
//             })
//             .catch((err) => {
//                 if (err?.response?.data?.message) {
//                     return swal('Warning', err.response.data.message, 'error');
//                 }
//                 return swal(
//                     'Warning',
//                     'Something went wrong while processing your request.',
//                     'error'
//                 );
//             });
//     } catch (err) {
//         if (err?.response?.data?.message) {
//             return swal('Warning', err.response.data.message, 'error');
//         }
//         return swal(
//             'Warning',
//             'Something went wrong while processing your request.',
//             'error'
//         );
//     }
// };

// create homecare services
export let createHomecareServices = async (data, id) => {
    try {
        await axios({
            method: 'POST',
            url: `/api/v1/admin/vendor-management/homecare-services/new-homecare-service/${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your services created Successfully',
                        'success'
                    );
                    return setTimeout(() => location.reload(), 2000);
                }
            })
            .catch((err) => {
                if (err?.response?.data?.message) {
                    return swal('Warning', err.response.data.message, 'error');
                }
                return swal(
                    'Warning',
                    'Something went wrong while processing your request.',
                    'error'
                );
            });
    } catch (err) {
        if (err?.response?.data?.message) {
            return swal('Warning', err.response.data.message, 'error');
        }
        return swal(
            'Warning',
            'Something went wrong while processing your request.',
            'error'
        );
    }
};

// update homecare services
export let updateHomecareService = async (data, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/homecare-services/update-homecare-service/${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your services updated Successfully',
                        'success'
                    );
                    return setTimeout(() => location.reload(), 2000);
                }
            })
            .catch((err) => {
                if (err?.response?.data?.message) {
                    return swal('Warning', err.response.data.message, 'error');
                }
                return swal(
                    'Warning',
                    'Something went wrong while processing your request.',
                    'error'
                );
            });
    } catch (err) {
        if (err?.response?.data?.message) {
            return swal('Warning', err.response.data.message, 'error');
        }
        return swal(
            'Warning',
            'Something went wrong while processing your request.',
            'error'
        );
    }
};

// maage homecare facilites
export let manageHomecareFacilities = async (
    title,
    description,
    manage,
    partner,
    id
) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/homecare-services/manage-homecare-facilities/facilities/${manage}/${partner}?serviceId=${id}`,
            data: { title, description }
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your facilities updated succesfully.',
                        'success'
                    );
                    return setTimeout(() => location.reload(), 2000);
                }
            })
            .catch((err) => {
                if (err?.response?.data?.message) {
                    return swal('Warning', err.response.data.message, 'error');
                }
                return swal(
                    'Warning',
                    'Something went wrong while processing your request.',
                    'error'
                );
            });
    } catch (err) {
        if (err?.response?.data?.message) {
            return swal('Warning', err.response.data.message, 'error');
        }
        return swal(
            'Warning',
            'Something went wrong while processing your request.',
            'error'
        );
    }
};

export let homecareStatusUpdate = async (status, id) => {
    try {
        swal({
            title: 'Are you sure?',
            text: 'you want delete this advertisement.',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    swal('Are you willing to enter your description?', {
                        content: 'input'
                    }).then(async (value) => {
                        await axios({
                            method: 'PATCH',
                            url: `/api/v1/admin/vendor-management/homecare-services/update-homecare-status/${status}/${id}`,
                            data: { cause: value }
                        })
                            .then((res) => {
                                if (res.data.status === 'Success') {
                                    swal(
                                        'Successs',
                                        'Your status updated successfully.',
                                        'success'
                                    );
                                    return setTimeout(
                                        () => location.reload(),
                                        2000
                                    );
                                }
                            })
                            .catch((err) => {
                                if (err?.response?.data?.message) {
                                    return swal(
                                        'Warning',
                                        err.response.data.message,
                                        'error'
                                    );
                                }
                                return swal(
                                    'Warning',
                                    'Something went wrong while processing your request.',
                                    'error'
                                );
                            });
                    });
                }
            })
            .catch((err) => {
                if (err?.response?.data?.message) {
                    return swal('Warning', err.response.data.message, 'error');
                }
                return swal(
                    'Warning',
                    'Something went wrong while processing your request.',
                    'error'
                );
            });
    } catch (err) {
        if (err?.response?.data?.message) {
            swal('Warning', err.response.data.message, 'error');
        }
        return swal(
            'Warning',
            'Something went wrong while processing your request.',
            'error'
        );
    }
};
export let homecareStatusUpdateUser = async (status, id) => {
    try {
        swal({
            title: 'Are you sure?',
            text: 'Are you sure you want update the status?',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    swal('Are you willing to enter your description?', {
                        content: 'input'
                    }).then(async (value) => {
                        await axios({
                            method: 'PATCH',
                            url: `/api/v1/admin/user-management/homecare-services/update-homecare-status/${status}/${id}`,
                            data: { cause: value }
                        })
                            .then((res) => {
                                if (res.data.status === 'Success') {
                                    swal(
                                        'Successs',
                                        'Your status updated successfully.',
                                        'success'
                                    );
                                    return setTimeout(
                                        () => location.reload(),
                                        2000
                                    );
                                }
                            })
                            .catch((err) => {
                                if (err?.response?.data?.message) {
                                    return swal(
                                        'Warning',
                                        err.response.data.message,
                                        'error'
                                    );
                                }
                                return swal(
                                    'Warning',
                                    'Something went wrong while processing your request.',
                                    'error'
                                );
                            });
                    });
                }
            })
            .catch((err) => {
                if (err?.response?.data?.message) {
                    return swal('Warning', err.response.data.message, 'error');
                }
                return swal(
                    'Warning',
                    'Something went wrong while processing your request.',
                    'error'
                );
            });
    } catch (err) {
        if (err?.response?.data?.message) {
            swal('Warning', err.response.data.message, 'error');
        }
        return swal(
            'Warning',
            'Something went wrong while processing your request.',
            'error'
        );
    }
};
