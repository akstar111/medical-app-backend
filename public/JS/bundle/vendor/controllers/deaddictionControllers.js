// import packages
import axios from 'axios';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// // create controllers
// export let createDeaddiction = async (
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

// update homeare
export let updateDeaddiction = async (
    name,
    phone,
    centerPhone,
    centerLandLine,
    latitude,
    longtitude,
    openTime,
    closeTime,
    address,
    city,
    id
) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/deaddiction/update-deaddiction-center/`,
            data: {
                name,
                phone,
                centerPhone,
                centerLandLine,
                location: [latitude, longtitude],
                openTime,
                closeTime,
                address,
                city
            }
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your Medical market profile updated successfully.',
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
                    'Something went wrong while processing your reques1t.',
                    'error'
                );
            });
    } catch (err) {
        console.log(err);
        if (err?.response?.data?.message) {
            return swal('Warning', err.response.data.message, 'error');
        }
        return swal(
            'Warning',
            'Something went wrong while processing your request2.',
            'error'
        );
    }
};

// create homecare services
export let createDeaddictionServices = async (data) => {
    try {
        await axios({
            method: 'POST',
            url: '/api/v1/deaddiction/new-deaddiction-service',
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
export let updateDeaddictionService = async (data, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/deaddiction/update-deaddiction-services/${id}`,
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

// maage homecare facilites
export let manageDeaddictionFacilities = async (
    title,
    description,
    manage,
    id
) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/deaddiction/manage-deadication-facilities/${manage}?facilitieId=${id}`,
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

export let deaddictionStatusUpdate = async (status, id, center) => {
    try {
        swal({
            title: 'Are you sure?',
            text: 'Perform this action?',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    let html = '';
                    let title = '';

                    if (status === 'accepted') {
                        html = `<input type="date" id="date" required class="swal2-input"><input type="time" id="time" required class="swal2-input"> <input type="text" id="description" required class="swal2-input">`;
                        title = 'Schedule Session';
                    } else if (status === 'rejected') {
                        html = `<input type="text" id="description" required class="swal2-input">`;
                        title = 'Tell us your reason';
                    } else {
                        return swal(
                            'Warning',
                            'Something went wrong while processing your request.',
                            'error'
                        );
                    }
                    await Swal.fire({
                        title,
                        html,
                        focusConfirm: false,
                        preConfirm: () => {
                            if (status === 'accepted') {
                                return {
                                    status,
                                    scheduledDate:
                                        document.getElementById('date').value,
                                    scheduledTime:
                                        document.getElementById('time').value,
                                    cause: document.getElementById(
                                        'description'
                                    ).value
                                };
                            } else if (status === 'rejected') {
                                return {
                                    status,
                                    cause: document.getElementById(
                                        'description'
                                    ).value
                                };
                            }
                        }
                    }).then(async (value) => {
                        await axios({
                            method: 'PATCH',
                            url: `/api/v1/deaddiction/manage-deaddication-booking-slots/${id}/${center}`,
                            data: value.value
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
