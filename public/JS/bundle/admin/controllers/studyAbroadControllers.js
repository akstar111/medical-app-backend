// import packages
import axios from 'axios';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// update optical
export let updateStudyAbroad = async (
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
            url: `/api/v1/studyabroad/update-study-abroad`,
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

// update study abroad college details
export let updateStudyAbroadcollegeDetails = async (data, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/study-abroad/update-college-details/${id}`,
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

// update study abroad course details
export let studyAbroadCourseUpdate = async (data, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/study-abroad/update-course-details/${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Course detatils updated successfully.',
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

// update study abroad facilites
export let updateStudyAbroadFacilities = async (data, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/study-abroad/update-facilities-details/${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Facilities detatils updated successfully.',
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
