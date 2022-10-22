// import packages
import axios from 'axios';
import swal from 'sweetalert';

// logmeout
export let logMeout = async () => {
    try {
        swal({
            title: 'Are you sure?',
            text: 'Are you sure Logout?',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    await axios({
                        method: 'GET',
                        url: `/logout`
                    })
                        .then((res) => {
                            console.log(res.data);
                            if (res.data.status === 'Success') {
                                swal(
                                    'Successs',
                                    'You are logout successfully.',
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
