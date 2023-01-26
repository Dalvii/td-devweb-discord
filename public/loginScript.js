const BACK_URL = '/api'

const username = document.querySelector('#email')
const password = document.querySelector('#password')

async function login() {
    const log = await postData('/auth/signin', {
        username: username.value,
        password: password.value
    })
    console.log(log)
    if (log.message) {
        alert(log.message)
    }
    if (log.accessToken) {
        setCookie('token' ,log.accessToken)
        window.location.href = '/'
    }
}



// Fonction pour stocker un cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Fonction pour récupérer un cookie
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Fonction pour envoyer une requete POST avec des données
async function postData(url = '', data = {}) {
    const response = await fetch(BACK_URL + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': getCookie('token')
        },
        body: JSON.stringify(data)
    });
    return response.json();
}