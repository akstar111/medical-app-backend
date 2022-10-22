// import packages
import axios from 'axios';
import swal from 'sweetalert';

// create controllers
export let createMedicalMarket = async (
    contactPersonName,
    contactPersonPhone,
    storePhone,
    landline,
    latitude,
    longtitude,
    openTime,
    closeTime,
    address
) => {
    try {
        await axios({
            method: 'POST',
            url: '/api/v1/market/new-medical-market',
            data: {
                contactPersonName,
                contactPersonPhone,
                storePhone,
                landline,
                location: [latitude, longtitude],
                openTime,
                closeTime,
                address
            }
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Medical market profile created successfully.',
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

// update medical market
export let updateHomecare = async (
    contactPersonName,
    contactPersonPhone,
    bloodBankPhone,
    landline,
    latitude,
    longtitude,
    openTime,
    closeTime,
    address
) => {
    try {
        await axios({
            method: 'PATCH',
            url: '/api/v1/market/update-homecare',
            data: {
                contactPersonName,
                contactPersonPhone,
                bloodBankPhone,
                landline,
                location: [latitude, longtitude],
                openTime,
                closeTime,
                address
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
