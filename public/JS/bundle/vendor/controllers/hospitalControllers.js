// import packages
import axios from 'axios';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

export let updateHospital = async (
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
    medicalTourism,
    hospitalPackage,
    aboutUs
) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/update-hospital/`,
            data: {
                name,
                phone,
                centerPhone,
                centerLandLine,
                location: [latitude, longtitude],
                openTime,
                closeTime,
                address,
                city,
                medicalTourism,
                hospitalPackage,
                aboutUs
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

// manage hospital package category
export let manageHopitaPackage = async (datas, type, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/package/manage-hospital-package/${type}?serviceId=${id}`,
            data: { category: datas }
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your category updated successfully',
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

// manage hospital package sub category
export let manageHospitalPackageSubCategory = async (
    name,
    type,
    category,
    id
) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/package/manage-hospital-package-subcategory/${type}/${category}?serviceId=${id}`,
            data: { name }
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Sub-Category Updated Successfully.',
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

// manage hospital package sub category
export let manageHospitalssPackType = async (
    datas,
    type,
    category,
    subCategory,
    id
) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/package/manage-hospital-package-subcategory-details/${type}/${category}/${subCategory}?serviceId=${id}`,
            data: { ...datas }
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Sub-Category Updated Successfully.',
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

// manage hospital package service list
export let manageHospitalServiceList = async (
    datas,
    type,
    category,
    subCategory,
    packId,
    id
) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/package/manage-hospital-subcategory-package-details/${type}/${category}/${subCategory}/${packId}?serviceId=${id}`,
            data: { ...datas }
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Sub-Category Updated Successfully.',
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

export let hospitalServiceManagement = async (data, type, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/manage-hospital-services/${type}/?serviceId=${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your service update successfully',
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
export let hospitalFacilityManagement = async (data, type, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/manage-hospital-facilities/${type}/?serviceId=${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your Facility update successfully',
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

// doctor management
export let hospitalDoctorManagement = async (data, type, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/manage-hospital-specialist/${type}/?serviceId=${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your Facility update successfully',
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

export let hospitalRoomFacilityManagement = async (data, type, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/manage-hospital-room-facilities/${type}/?serviceId=${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your Room Facility update successfully',
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
export let hospitalImages = async (data, forW) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/add-hospital-images/${forW}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your Room Facility update successfully',
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
export let removeHospitalRoomImage = async (data, forW) => {
    data = data.slice(data.lastIndexOf('/') + 1);
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/remove-hospital-images/${data}/${forW}`
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        `Your ${forW} image deleted Successfull.`,
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

// manage hospital abailablities
export let manageAvailableHospitalFacilities = async (data) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/manage-hospital-availablities/`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal('Success', ` Successfull Updated.`, 'success');
                    return setTimeout(() => location.reload(), 2000);
                }
            })
            .catch((err) => {
                console.log(err);
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

// manage hospital specialities
export let manageHospitalSpecialities = async (data) => {
    try {
        console.log(data);
        alert('hi');
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/manage-hospital-specialities/`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal('Success', ` Successfull Updated.`, 'success');
                    return setTimeout(() => location.reload(), 2000);
                }
            })
            .catch((err) => {
                console.log(err);
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

// hospital nearby facilities
export let updateHospitalNearbyFacililities = async (data) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/manage-nearby-hospital-facilities/`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your nearby hospital facilities updated successfully.',
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

// hospital nearby hospitals
export let manageNearByHotelsinHospitals = async (data, type, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/manage-nearby-hotels/${type}/?serviceId=${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your nearby hotels updated successfully.',
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

// hospital nearby hospitals restaurents
export let manageNearByRestaurentsinHospitals = async (data, type, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/manage-nearby-restaurents/${type}/?serviceId=${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your nearby hotels updated successfully.',
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

// hospital nearby hospitals airport
export let manageNearByAirportsinHospitals = async (data, service, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/manage-nearby-airports/${service}/?serviceId=${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your nearby hotels updated successfully.',
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

// hospital nearby hospitals train
export let manageNearByTrainInHospitals = async (data, service, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/manage-nearby-trains/${service}/?serviceId=${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your nearby hotels updated successfully.',
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

// hospital nearby hospitals bus
export let manageNearByBusInHospitals = async (data, service, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/hospital/manage-nearby-buses/${service}/?serviceId=${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your nearby hotels updated successfully.',
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
