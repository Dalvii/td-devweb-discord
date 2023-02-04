let myModal = document.getElementById('exampleModal')
let myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', function () {
    myInput.focus()
    console.log('test')
})


const BACK_URL = '/api'



const channels = document.querySelector('#channels')
const channelsListBox = document.querySelector('#channelsList')
const messagesListBox = document.querySelector('#messages')
const usersBox = document.querySelector('#users');
const sendMessageBtn = document.querySelector('#sendMsg');
const createChannelBtn = document.querySelector('#createChannel');
const createChannelInput = document.querySelector('#createChannelInput');
const userBox = document.querySelector('#userBox > p');


let channelList = []
let currentChannel = null;
let messagesList = []
let userData = {}


// Initialiser l'application
async function start() {
    await fetchUserData()
    await fetchUsers()
    await fetchChannels()
    if (!channelList[0]) return console.log('Aucun channel')
    if (window.location.pathname != '/') {
        const url = window.location.pathname.substring(1)
        selectChannel(url)
    } else {
        selectChannel(channelList[0].id)

    }
    
}
start()




// Récuperer la liste des Users et les insérer dans le DOM
async function fetchUsers() {
    const users = await getData('/users');
    console.log(users)
    usersBox.innerHTML = ''

    for (let i = 0; i < users.length; i++) {
        const item = document.createElement('li')
        console.log(item)
        item.className = 'user bg-channel p-2 mb-2 d-flex flex-column align-items-center justify-content-center text-white'
        item.id = 'user_' + users[i].username
        item.innerText = users[i].username
        usersBox.append(item)

        item.addEventListener("click", function (e) {
            console.log(e.target)
            const id = e.target.id.substr(8)
            selectChannel(id)
        });
    }
}


// Récuperer la liste des Channels et les insérer dans le DOM
async function fetchChannels() {
    const channels = await getData('/channels');
    channelList = channels
    console.log(channels)
    channelsListBox.innerHTML = ''

    for (let i = 0; i < channels.length; i++) {
        if (channels[i].type != 'channel') continue;
        const item = document.createElement('li')
        console.log(item)
        item.className = 'channel bg-channel rounded-3 px-2 py-1 mb-2 text-white'
        item.id = 'channel_' + channels[i].id
        item.innerText = channels[i].name
        channelsListBox.append(item)

        item.addEventListener("click", function (e) {
            console.log(e.target)
            const id = e.target.id.substr(8)
            selectChannel(id)
        });
    }

    const addChannelButton = document.createElement('li')
    channelsListBox.append(addChannelButton)
    addChannelButton.outerHTML = `<li class="bg-channel rounded-3 px-2 py-1 mb-2 text-white" id="myInput" data-bs-toggle="modal" data-bs-target="#exampleModal">
            + Creer un channel
        </li>`
}




// Fonction qui change l'URL, entoure le bouton du channel correspondant, et fetch les messages
function selectChannel(id) {
    console.log(id)
    currentChannel = channelList.find(channel => channel.id == id)
    if (!currentChannel) {
        messagesListBox.innerHTML = ''
        const message = document.createElement('p')
        message.innerText = "Channel inexistant"
        message.style.color = 'white'
        messagesListBox.append(message)
        return
    }

    // Change le titre de la page
    document.title = currentChannel.name

    const notSelectedChannel = document.querySelectorAll('.channel')
    notSelectedChannel.forEach(channel => {
        channel.classList.remove('selected')
    });
    const selectedChannel = document.querySelector('#channel_' + id)
    selectedChannel.classList.add('selected')
    window.history.pushState(currentChannel.id, currentChannel.id, currentChannel.id);

    fetchMessages(id)
    // setInterval(() => {
    //     fetchMessages(currentChannel.id)
    // }, 3000);
}



// Récuperer la liste des Messages d'un channel donné et les insérer dans le DOM
async function fetchMessages(channelId) {
    const messages = await getData('/channel/' + channelId);
    messagesList = messages
    console.log(messages)
    messagesListBox.innerHTML = ''

    if (messages.length < 1) {
        const message = document.createElement('p')
        message.innerText = "Aucun message"
        message.style.color = 'white'
        messagesListBox.append(message)
    }
    
    for (let i = 0; i < messages.length; i++) {
        const item = document.createElement('li')
        item.className = 'bg-chat-item rounded-3 p-2 mb-2 text-white'
        item.id = 'message_' + messages[i].id

        const author = document.createElement('h6')
        author.innerText = messages[i].sender

        const message = document.createElement('p')
        message.classList = 'text-wrap my-2'
        message.innerText = messages[i].content
        item.append(author)
        item.append(message)

        messagesListBox.append(item)
    }
}


// Ecouter quand l'utilisateur envoie un message et envoie la requete
sendMessageBtn.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const message = event.target.value
        
        const sentMessage = await postData('/channel/' + currentChannel.id, {
            content: message
        })
        console.log('send')
        event.target.value = ''
        fetchMessages(currentChannel.id)
    }
});


// Ecouter quand l'utilisateur envoie un message et envoie la requete
createChannelBtn.addEventListener("click", async function (event) {
    const channelName = createChannelInput.value
    createChannelInput.value = ''

    const createdChannel = await postData('/channel', {
        name: channelName,
        type: 'channel'
    })
    console.log(createdChannel)
    await fetchChannels()
    selectChannel(createdChannel.id)
    fetchMessages(currentChannel.id)
});



async function fetchUserData() {
    const user = await getData('/user/');
    console.log(user)
    if (user.message) {
        window.location.href = '/login'
    }
    userBox.innerText = user.username
    userData = user
    // console.log(messages)
    // messagesListBox.innerHTML = ''
}


function logout() {
    setCookie('token', null)
    window.location.href = '/login'
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

// Fonction pour envoyer une requete GET
async function getData(url = '') {
    const response = await fetch(BACK_URL + url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': getCookie('token')
        },
    });
    return response.json();
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

