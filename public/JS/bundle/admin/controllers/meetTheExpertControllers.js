// import packages
import axios from 'axios';
import swal from 'sweetalert';

// manage meet the expert services
export let createMeetTheExpertServices = async (data, partner) => {
    try {
        await axios({
            method: 'POST',
            url: `/api/v1/admin/vendor-management/meet-the-expert/create-services/${partner}`,
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
// manage meet the expert services
export let updateMeetTheExpertServices = async (data, partner, serviceId) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/meet-the-expert/update-services/${partner}/${serviceId}`,
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
export let manageExpertFacilities = async (
    title,
    description,
    manage,
    partner,
    id
) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/meet-the-expert/manage-facilities/${manage}/${partner}?serviceId=${id}`,
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

// expert status update
export let expertStatusUpdate = async (status, id) => {
    try {
        swal({
            title: 'Are you sure?',
            text: 'You want update this status?',
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
                            url: `/api/v1/admin/vendor-management/meet-the-expert/update-expert-status/${status}/${id}`,
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

// update expert status from user
export let expertStatusUpdateUser = async (status, id) => {
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
                            url: `/api/v1/admin/user-management/meet-the-expert-services/update-expert-status/${status}/${id}`,
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
