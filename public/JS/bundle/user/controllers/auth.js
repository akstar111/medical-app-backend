// import packages
import axios from 'axios';
import swal from 'sweetalert';

export let login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/user/login',
            data: { email, password }
        });
        console.log(res.data);
        if (res.data.status === 'Success') {
            swal('Success', 'You are logined successfully.', 'success');
        }
    } catch (err) {
        if (err?.response?.data?.message) {
            return swal('Warning', err.response.data.message);
        }
        return swal(
            'Warning',
            'Something went wrong while processing your request.'
        );
    }
};
