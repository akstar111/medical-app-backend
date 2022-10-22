// import packages
import axios from 'axios';
import swal from 'sweetalert';

export let getRecordsForMembers = async (id, id2) => {
    try {
        await axios({
            method: 'GET',
            url: `/api/v1/admin/user-management/medical-records/record-list/${id}/${id2}`
        })
            .then(async (res) => {
                if (res.data.status === 'Success') {
                    const data = await Promise.all(
                        res.data.docs.map((el) => {
                            return `
                       <tr>
                            
                            <td>${el.recordType}</td>
                            <td>${el.documentName}</td>
                            <td>${new Date(
                                el.issuedDate
                            ).toLocaleDateString()}</td>
                            <td>${el.description}</td>
                            <td><a href="${el.report}">View Document</a></td>
                        </tr>

                        `;
                        })
                    );
                    const act = document.getElementById(
                        'add_active_member_medical_records'
                    );
                    act.innerHTML = data.join('');
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
