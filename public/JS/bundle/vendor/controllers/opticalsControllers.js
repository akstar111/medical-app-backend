// import packages
import axios from 'axios';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// update optical
export let updateOpticals = async (
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
            url: `/api/v1/opticals/update-opticals/${id}`,
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

// create new optical product
export let createNewOpticalProduct = async (data) => {
    try {
        await axios({
            method: 'POST',
            url: `/api/v1/opticals/new-optical-product/`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your product created successfully.',
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
// update optical product
export let updateOpticalProduct = async (data, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/opticals/update-optical-product/${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your product updated successfully.',
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

export let updateOpticalProductOrderStatus = async (status, id) => {
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
                    await axios({
                        method: 'PATCH',
                        url: `/api/v1/opticals/update-order-status/${status}/${id}`
                    })
                        .then((res) => {
                            console.log(res.data);
                            if (res.data.status === 'Success') {
                                swal(
                                    'Successs',
                                    "Optical's order status updated successfully. .",
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
                }
            })
            .catch((err) => {
                return setTimeout(() => location.reload(), 2000);
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

// update show room status
export let updateOpticalShowRoomStatus = async (status, id) => {
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
                        html = `<input type="time" id="time" required class="swal2-input"> <input type="text" id="description" required class="swal2-input">`;
                        title = 'Schedule Session';
                    } else if (
                        status === 'rejected' ||
                        status === 'completed' ||
                        status === 'not-arrived'
                    ) {
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
                                    time: document.getElementById('time').value,
                                    description:
                                        document.getElementById('description')
                                            .value
                                };
                            } else if (
                                status === 'rejected' ||
                                status === 'completed' ||
                                status === 'not-arrived'
                            ) {
                                return {
                                    status,
                                    description:
                                        document.getElementById('description')
                                            .value
                                };
                            }
                        }
                    }).then(async (value) => {
                        await axios({
                            method: 'PATCH',
                            url: `/api/v1/opticals/update-booking-status/${status}/${id}`,
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
                console.log(err);
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
