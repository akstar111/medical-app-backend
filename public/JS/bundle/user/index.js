import 'core-js/actual';
import 'regenerator-runtime/runtime.js';

// import scripts
import { login } from './controllers/auth';

// // import doms
const userLoginFor = document.getElementById('user__login');

// create mangament
if (userLoginFor) {
    userLoginFor.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        return login(email, password);
    });
}

// update proposal