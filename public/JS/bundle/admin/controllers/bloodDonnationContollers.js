// import packages
import axios from 'axios';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// manageBloods
export let bloodManage = async (
    bloodType,
    availableUnits,
    type,
    partner,
    serviceId
) => {
    try {
        swal({
            title: 'Are you sure?',
            text: 'you want update this service?.',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    await axios({
                        method: 'PATCH',
                        url: `/api/v1/admin/vendor-management/blood-donation/manage-blood/${type}/${partner}?serviceId=${serviceId}`,
                        data: {
                            bloodType,
                            availableUnits
                        }
                    })
                        .then((res) => {
                            if (res.data.status === 'Success') {
                                swal(
                                    'Success',
                                    'Your data updated Successfull'
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
            swal('Warning', err.response.data.message, 'success');
        }
        return swal(
            'Warning',
            'Something went wrong while processing your request.',
            'error'
        );
    }
};

// create new blood donner
export let createNewBloodDonner = async (form, user) => {
    try {
        await axios({
            method: 'POST',
            url: `/api/v1/admin/user-management/blood-donation-services/create-new-donner/${user}`,
            data: form
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal('Success', 'Your data updated Successfull');
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
            swal('Warning', err.response.data.message, 'success');
        }
        return swal(
            'Warning',
            'Something went wrong while processing your request.',
            'error'
        );
    }
};

// update blood donner
export let updateBloodDonner = async (form, user, service) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/user-management/blood-donation-services/update-donner/${user}/${service}`,
            data: form
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal('Success', 'Your data updated Successfull');
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
            swal('Warning', err.response.data.message, 'success');
        }
        return swal(
            'Warning',
            'Something went wrong while processing your request.',
            'error'
        );
    }
};

// update blood requestet
export let updateBloodRequesterUpdate = async (status, user, service) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/user-management/blood-donation-services/update-requester-status/${user}/${service}`,
            data: { status }
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal('Success', 'Your data updated Successfull');
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
            swal('Warning', err.response.data.message, 'success');
        }
        return swal(
            'Warning',
            'Something went wrong while processing your request.',
            'error'
        );
    }
};
// update blood requestet
export let updateUserBloodRequest = async (status, user, service) => {
    try {
        swal({
            title: 'Are you sure?',
            text: 'you want update this service?.',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    await axios({
                        method: 'PATCH',
                        url: `/api/v1/admin/user-management/blood-donation-services/update-request-status/${user}/${service}`,
                        data: { status }
                    })
                        .then((res) => {
                            if (res.data.status === 'Success') {
                                swal(
                                    'Success',
                                    'Your data updated Successfull'
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
            swal('Warning', err.response.data.message, 'success');
        }
        return swal(
            'Warning',
            'Something went wrong while processing your request.',
            'error'
        );
    }
};
