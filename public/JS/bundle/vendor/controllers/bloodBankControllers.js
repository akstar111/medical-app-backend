// import packages
import axios from 'axios';
import swal from 'sweetalert';

// update blood bank

export let updateBloodBank = async (
    name,
    phone,
    centerPhone,
    centerLandLine,
    latitude,
    longtitude,
    openTime,
    closeTime,
    address,
    city
) => {
    try {
        await axios({
            method: 'PATCH',
            url: '/api/v1/blooddonation/update-blood-bank',
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
                        'Your Blood Bank profile updated successfully.',
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

// manageBloods
export let bloodManage = async (bloodType, availableUnits, type, serviceId) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/blooddonation/manage-blood-details/${type}?serviceId=${serviceId}`,
            data: {
                bloodType,
                availableUnits
            }
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

// request new quotes
export let newBloodBankQuote = async (
    productName,
    productDescription,
    quantity
) => {
    try {
        await axios({
            method: 'POST',
            url: '/api/v1/blooddonation/request-quotes',
            data: [{ productName, productDescription, quantity }]
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal('Success', 'Your quote send successfully', 'success');
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
            swal('Warning', err.response.data.message, 'error');
        }
        return swal(
            'Warning',
            'Something went wrong while processing your request.',
            'error'
        );
    }
};

// cancel a quote
export let cancelAQuotes = async (id) => {
    try {
        swal({
            title: 'Are you sure?',
            text: "Once you canceled this quuote you wont't able to resume it!",
            icon: 'warning',
            buttons: true,
            dangerMode: true
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    await axios({
                        method: 'PATCH',
                        url: `/api/v1/blooddonation/cancel-quote/${id}`
                    })
                        .then((res) => {
                            if (res.data.status === 'Success') {
                                swal(
                                    'Successs',
                                    'This quote was successfully canceled.',
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

// respond quotes
export let updateQuotes = async (userResponse, id) => {
    try {
        swal('Write something here:', {
            content: 'input'
        })
            .then(async (value) => {
                await axios({
                    method: 'PATCH',
                    url: `/api/v1/blooddonation/update-quote-status/${userResponse}/${id}`,
                    data: { cause: value }
                })
                    .then((res) => {
                        if (res.data.status === 'Success') {
                            swal(
                                'Success',
                                'Your response successfully submited',
                                'success'
                            );
                            return setTimeout(() => location.reload(), 2000);
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

// manage advertisement
export let myAdvertisement = async (data, manage, id) => {
    try {
        const method = manage === 'create' ? 'POST' : 'PATCH';
        const url =
            manage === 'create'
                ? `/api/v1/blooddonation/create-new-advertisement/`
                : `/api/v1/blooddonation/update-my-advertisement/${id}`;
        const successmessage =
            manage === 'create'
                ? 'Your Advertisement created successfully.'
                : 'Your Advertisement updated successfully.';
        await axios({
            method,
            url,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Successs',
                        'Your Advertisement created successfully.',
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
            swal('Warning', err.response.data.message, 'error');
        }
        return swal(
            'Warning',
            'Something went wrong while processing your request.',
            'error'
        );
    }
};

// delete my add
// delete job
export let deleteBloodBankAd = async (id) => {
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
                    await axios({
                        method: 'PATCH',
                        url: `/api/v1/blooddonation/delete-my-advertisement/${id}`
                    })
                        .then((res) => {
                            if (res.data.status === 'Success') {
                                swal(
                                    'Successs',
                                    'Your job deleted successfully.',
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
