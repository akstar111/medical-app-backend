// import packages
import axios from 'axios';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// update optical
export let updateHearingAid = async (data, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hearingaid/update-hearinaid/${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your hearing profile profile updated successfully.',
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

// update option hospital booking status
export let updateHearingAidHospitalBookingStatus = async (status, id) => {
    try {
        swal({
            title: 'Are you sure?',
            text: 'Are you want perform this action?',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        })
            .then(async (willDelete) => {
                let obj = {};
                switch (status) {
                    case 'accepted':
                        obj.des = 'Please select the schedule time!!!';
                        obj.html =
                            '<input id="swaltscheduletime" type="time"  class="swal2-input">' +
                            '<input id="swalDescription" class="swal2-input" placeholder="Description">';
                        break;

                    case 'rejected':
                    case 'not-arrived':
                        obj.des = 'Do you want short description?';
                        obj.html =
                            '<input id="swalDescription" class="swal2-input" placeholder="Description">';
                        break;
                    default:
                        willDelete = false;
                        swal(
                            'Warning',
                            'Something went wrong. Please try valid method.',
                            'error'
                        );
                }
                if (willDelete) {
                    await Swal.fire({
                        title: obj.des,
                        html: obj.html,
                        focusConfirm: false,
                        preConfirm: () => {
                            if (status === 'accepted') {
                                return {
                                    description:
                                        document.getElementById(
                                            'swalDescription'
                                        ).value,
                                    time: document.getElementById(
                                        'swaltscheduletime'
                                    ).value
                                };
                            } else {
                                return {
                                    description:
                                        document.getElementById(
                                            'swalDescription'
                                        ).value
                                };
                            }
                        }
                    })
                        .then(async (value) => {
                            alert('hi');
                            await axios({
                                method: 'PATCH',
                                url: `/api/v1/hearingaid/update-hospital-booking-status/${status}/${id}`,
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
                        })
                        .catch((err) => {
                            if (err?.response?.data?.message) {
                                return swal(
                                    'Warning',
                                    err.response.data.message,
                                    'error'
                                );
                            }
                            console.log(err);
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

// optical product update status
export let updateHearingaidProductOrderStatus = async (status, id) => {
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
                        url: `/api/v1/hearingaid/update-order-status/${status}/${id}`
                    })
                        .then((res) => {
                            console.log(res.data);
                            if (res.data.status === 'Success') {
                                swal(
                                    'Successs',
                                    "Hearingaid's order status updated successfully. .",
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

// create new optical product
export let createNewHearingAidProduct = async (data) => {
    alert('ji');
    try {
        await axios({
            method: 'POST',
            url: `/api/v1/hearingaid/new-hearingaid-product/`,
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

// create update hearingaid product
export let updateHearingAidProduct = async (data, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hearingaid/update-hearingaid-product/${id}`,
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
