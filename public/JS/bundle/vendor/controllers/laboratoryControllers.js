// import packages
import axios from 'axios';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// update optical
export let updateLaboratory = async (data) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/laboratory/update-laboratory`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your Laboratory profile updated successfully.',
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

// manage laboratory services
export let manageLaboratoryTest = async (data, type, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/laboratory/manage-laboratory-tests/${type}?serviceId=${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your Laboratory Test updated successfully.',
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

// mange laboratory service
export let createNewLaboratoryFacilities = async (data, type, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/laboratory/manage-laboratory-facilities/${type}?serviceId=${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your Laboratory Test updated successfully.',
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

// hospital room images
export let addLaboratoryImages = async (data, forW) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/laboratory/add-laboratory-images/`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Laboratory images updated successfully.',
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

// hospital delete images
export let removeLaboratoryImages = async (data,) => {
    data = data.slice(data.lastIndexOf('/') + 1);
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/laboratory/remove-laboratory-images/${data}`
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        `Your image deleted Successfull.`,
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
export let updateLaboratoryBooking = async (status, id) => {
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
                            await axios({
                                method: 'PATCH',
                                url: `/api/v1/laboratory/update-laboratory-booking-status/${status}/${id}`,
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
