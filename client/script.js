import bot from "./assetsZip/bot.svg"
import user from "./assetsZip/user.svg"


const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '..';
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
}

function typeText (element, text) {
let i = 0;

let interval = setInterval (() => {
  if (i < text.length) {
    element.innerHTML += text.charAt(i);
    i++;
  } else {
    clearInterval(interval)
  }
}, 20)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexdecimalString = randomNumber.toString(15);

  return `id-${timestamp}-${hexdecimalString}`
}

function chatStripe (isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
    <div class="profile">
<img src="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}"/>
    </div>
    <div class="message" id=${uniqueId}>${value}
    </div>
    </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault()

  const data = new FormData(form)
  //user ChatStripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'))
  form.reset()
  //bot ChatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId)

  loader(messageDiv)

  //fetch data from server -> bots response

  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({prompt: data.get('prompt')})
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
const data = await response.json();
const parseData = data.bot.trim()
typeText(messageDiv, parseData)
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Oops! Something went wrong";
    alert(err)
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e)
  }
})