// import packages
import axios from 'axios';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// update option hospital booking status
export let updateHearingAidHospitalBookingStatus = async (status, id, id2) => {
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
                                url: `/api/v1/admin/vendor-management/hearingaid/update-hospital-booking-status/${status}/${id}/${id2}`,
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
export let updateHearingaidProductOrderStatus = async (status, id, id2) => {
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
                        url: `/api/v1/admin/vendor-management/hearingaid/update-order-status/${status}/${id}/${id2}`
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
                            console.log(err);
                            return swal(
                                'Warning',
                                'Something went wrong while processing your request1.',
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
            'Something went wrong while processing your request.1',
            'error'
        );
    }
};

// differently abled product update status
export let updateDiffOrderProductOrderStatus = async (status, id, id2) => {
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
                        url: `/api/v1/admin/vendor-management/differentlyabled/update-order-status/${status}/${id}/${id2}`
                    })
                        .then((res) => {
                            console.log(res.data);
                            if (res.data.status === 'Success') {
                                swal(
                                    'Successs',
                                    "Differently abled 's order status updated successfully. .",
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
export let createNewHearingAidProduct = async (data, id) => {
    try {
        await axios({
            method: 'POST',
            url: `/api/v1/admin/vendor-management/hearingaid/new-hearingaid-product/${id}`,
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
export let updateHearingAidProduct = async (data, id, id2) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hearingaid/update-hearingaid-product/${id}/${id2}`,
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

// create new diff  product
export let createNewDiffProduct = async (data, id) => {
    try {
        await axios({
            method: 'POST',
            url: `/api/v1/admin/vendor-management/differentlyabled/create-new-product/${id}`,
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

// create new diff  product
export let updateNewDiffProduct = async (data, id, id2) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/differentlyabled/update-product/${id}/${id2}`,
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

// hearinga id hopital booking status
export let updateHearingAidHospitalUserBookingStatus = async (
    status,
    id,
    id2
) => {
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

                    if (status === 'canceled') {
                        html = `<input type="text" id="description" required class="swal2-input">`;
                        title = 'Tell us your reason';
                    } else {
                        return swal(
                            'Warning',
                            'You can only perform cancel request from user side.',
                            'error'
                        );
                    }
                    await Swal.fire({
                        title,
                        html,
                        focusConfirm: false,
                        preConfirm: () => {
                            if (status === 'canceled') {
                                return {
                                    description:
                                        document.getElementById('description')
                                            .value
                                };
                            }
                        }
                    }).then(async (value) => {
                        await axios({
                            method: 'PATCH',
                            url: `/api/v1/admin/user-management/hearingaid/update-hospital-booking-status/${status}/${id}/${id2}`,
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

// hearinga id hearinga id product order status
export let updateHearingAidUserProductOrderStatus = async (status, id, id2) => {
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

                    if (status === 'canceled') {
                        html = `<input type="text" id="description" required class="swal2-input">`;
                        title = 'Tell us your reason';
                    } else {
                        return swal(
                            'Warning',
                            'You can only perform cancel request from user side.',
                            'error'
                        );
                    }
                    await Swal.fire({
                        title,
                        html,
                        focusConfirm: false,
                        preConfirm: () => {
                            if (status === 'canceled') {
                                return {
                                    description:
                                        document.getElementById('description')
                                            .value
                                };
                            }
                        }
                    }).then(async (value) => {
                        await axios({
                            method: 'PATCH',
                            url: `/api/v1/admin/user-management/hearingaid/update-hearing-order-status/${status}/${id}/${id2}`,
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
