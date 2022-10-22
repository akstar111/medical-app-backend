// import packages
import axios from 'axios';
import swal from 'sweetalert';

// create controllers
// post new job
export let postNewJob = async (data, from) => {
    try {
        await axios({
            method: 'POST',
            url: `/api/v1/jobportal/post-new-job/${from}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal('Success', 'Your job posted successfully.', 'success');
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
// update job
export let updateMyJob = async (data, id, from) => {
    console.log(data);
    try {
        await axios({
            method: 'PATCH',
            url: `/api/v1/jobportal/update-my-job/${from}/${id}`,
            data
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    swal('Success', 'Your job posted successfully.', 'success');
                    return setTimeout(
                        () =>
                            window.location.replace(
                                `/vendor/${from}/job-management/`
                            ),
                        2000
                    );
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

// delete job
export let deleteMyJob = async (id, from) => {
    try {
        swal({
            title: 'Are you sure?',
            text: 'you want delete this job.',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    await axios({
                        method: 'PATCH',
                        url: `/api/v1/jobportal/delete-my-job/${from}/${id}`
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
