// import packages
import axios from 'axios';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

// hearinga id hearinga id product order status
export let updateDifferentlyUserProductOrderStatus = async (
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
                            url: `/api/v1/admin/user-management/differentlyabled/update-differently-abled-order-status/${status}/${id}/${id2}`,
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
