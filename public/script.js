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

const dms = document.querySelector('#dms')
const backBtn = document.getElementById('backBtn')
const userLabel = document.getElementById('userLabel')
const dmMessagesListBox = document.querySelector('#dm_messages')
const dmSendMessageBtn = document.querySelector('#dm_sendMsg');


let channelList = []
let currentChannel = null;
let currentPM = null;
let messagesList = []
let userData = {}
let interval = null


// Initialiser l'application
async function start() {
    dms.style.setProperty("display", "none", "important");
    channels.style.removeProperty("display", "none", "important");

    await fetchUserData()
    await fetchUsers()
    await fetchChannels()
    if (!channelList[0]) return console.log('Aucun channel')
    if (window.location.pathname.match(/\/user\/.*/g)) {
        const recipientId = window.location.pathname.split('/')[2]
        goDms(recipientId)
    } else if (window.location.pathname != '/') {
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
            const id = e.target.id.substr(5)
            goDms(id)
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


function goDms(userId) {
    channels.style.setProperty("display", "none", "important");
    dms.style.removeProperty("display", "none", "important");
    const url = '/user/'+userId
    window.history.pushState(url, url, url);
    currentPM = userId
    try {
        clearInterval(interval)
    } catch (e) {
    }
    interval = setInterval(() => {
        fetchDm(userId)
    }, 3000);
    fetchDm(userId)
}


async function fetchDm(userId) {
    const messages = await getData('/pm/' + userId)
    console.log(messages)

    // Reset la conversation
    dmMessagesListBox.innerHTML = ''
    userLabel.innerText = ''

    if (messages.length < 1) {
        const message = document.createElement('p')
        message.innerText = "Aucun message"
        message.style.color = 'white'
        dmMessagesListBox.append(message)
        return
    }

    // Titre de la conversation = le destinataire
    userLabel.innerText = messages[0].recipientId == userData.username ? messages[0].senderId : messages[0].recipientId
    
    for (let i = 0; i < messages.length; i++) {
        const isChannelNameMe = messages[i].senderId == userData.username

        const item = document.createElement('li')
        item.className = 'bg-chat-item rounded-3 p-2 mb-2 text-white'
        item.id = 'message_' + messages[i].id

        const author = document.createElement('h6')

        if (isChannelNameMe) {
            author.innerText = 'Moi'
            item.style.marginLeft = '20px'
            item.style.backgroundColor = '#292e38'
        } else {
            author.innerText = messages[i].recipientId
            item.style.marginRight = '20px'
        }

        const message = document.createElement('p')
        const date = document.createElement('p')
        date.innerText = new Date(messages[i].createdAt).toLocaleDateString("fr-FR" ,{
            day:"numeric",
            month:"numeric",
            hour:"numeric",
            minute:"numeric",
        })
        date.style.float = 'right'
        message.classList = 'text-wrap my-2'
        message.innerText = messages[i].content
        item.append(date)
        item.append(author)
        item.append(message)

        dmMessagesListBox.append(item)
    }
}


// Fonction qui change l'URL, entoure le bouton du channel correspondant, et fetch les messages
function selectChannel(id) {
    dms.style.setProperty("display", "none", "important");
    channels.style.removeProperty("display", "none", "important");

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
    try {
        clearInterval(interval)
    } catch (e) {
    }
    interval = setInterval(() => {
        fetchMessages(currentChannel.id)
    }, 3000);
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
        const date = document.createElement('p')
        date.innerText = new Date(messages[i].createdAt).toLocaleDateString("fr-FR" ,{
            day:"numeric",
            month:"numeric",
            hour:"numeric",
            minute:"numeric",
        })
        date.style.float = 'right'
        const message = document.createElement('p')
        message.classList = 'text-wrap my-2'
        message.innerText = messages[i].content
        item.append(date)
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

dmSendMessageBtn.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const message = event.target.value
        
        const sentMessage = await postData('/pm', {
            content: message,
            recipientId: currentPM
        })
        console.log('send')
        event.target.value = ''
        fetchDm(currentPM)
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



// Ecouter quand l'utilisateur envoie un message et envoie la requete
backBtn.addEventListener("click", async function (event) {
    window.history.pushState({}, '', '/')
    start()
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

