// import packages
import axios from 'axios';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// manage hospital package category
export let manageHopitaPackage = async (datas, type, con, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/package/manage-hospital-package/${type}/${con}?serviceId=${id}`,
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
    con,
    category,
    id
) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/package/manage-hospital-package-subcategory/${type}/${con}/${category}?serviceId=${id}`,
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
    con,
    category,
    subCategory,
    id
) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/package/manage-hospital-package-subcategory-details/${type}/${con}/${category}/${subCategory}?serviceId=${id}`,
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
    con,
    category,
    subCategory,
    packId,
    id
) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/package/manage-hospital-subcategory-package-details/${type}/${con}/${category}/${subCategory}/${packId}?serviceId=${id}`,
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

export let hospitalServiceManagement = async (data, type, id, id2) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/manage-hospital-services/${id}/${type}/?serviceId=${id2}`,
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
export let hospitalFacilityManagement = async (data, type, id, id2) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/manage-hospital-facilities/${id}/${type}/?serviceId=${id2}`,
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
export let hospitalDoctorManagement = async (data, type, id, id2) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/manage-hospital-specialist/${id}/${type}/?serviceId=${id2}`,
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

export let hospitalRoomFacilityManagement = async (data, type, id, id2) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/manage-hospital-room-facilities/${id}/${type}/?serviceId=${id2}`,
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
export let hospitalRoomImages = async (data, forW, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/add-hospital-images/${forW}/${id}`,
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
export let removeHospitalRoomImage = async (data, forW, id) => {
    data = data.slice(data.lastIndexOf('/') + 1);
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/remove-hospital-images/${data}/${forW}/${id}`
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your room image deleted Successfull.',
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
export let manageAvailableHospitalFacilities = async (data, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/manage-hospital-availablities/${id}`,
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
export let manageHospitalSpecialities = async (data, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/manage-hospital-specialities/${id}`,
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
export let updateHospitalNearbyFacililities = async (data, id) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/manage-nearby-hospital-facilities/${id}`,
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
export let manageNearByHotelsinHospitals = async (data, type, id, id2) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/tourism/manage-nearby-hotels/${type}/${id}/?serviceId=${id2}`,
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
export let manageNearByRestaurentsinHospitals = async (data, type, id, id2) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/tourism/manage-nearby-restaurents/${type}/${id}/?serviceId=${id2}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal(
                        'Success',
                        'Your nearby Reastaurents updated successfully.',
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
export let manageNearByAirportsinHospitals = async (data, service, id, id2) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/tourism/manage-nearby-airports/${service}/${id}/?serviceId=${id2}`,
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
export let manageNearByTrainInHospitals = async (data, service, id, id2) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/tourism/manage-nearby-trains/${service}/${id}/?serviceId=${id2}`,
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
export let manageNearByBusInHospitals = async (data, service, id, id2) => {
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/admin/vendor-management/hospital/tourism/manage-nearby-buses/${service}/${id}/?serviceId=${id2}`,
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
