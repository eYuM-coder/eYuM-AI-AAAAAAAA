import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form')
const body = document.querySelector('html')
const table = document.querySelector('table')
const tds = table.querySelectorAll('td')
const formstyle = document.querySelector('form')
const element = document.querySelector('html')
const themeChanger = document.querySelector('#mode-toggle')
const chatContainer = document.querySelector('#chat_container')
const textarea = document.querySelector('textarea')
let currentTheme = 'light';

let loadInterval;

function loader(element) {
  element.textContent = '.'

  loadInterval = setInterval(() => {
    // Update the text content of the loading indicator
    element.textContent += '.';

    // If the loading indicator has reached three dots, reset it
    if (element.textContent === '....') {
      element.textContent = '.';
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index <= text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
      chatStripe(true, text, uniqueId);
    }
  }, 20);
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  const formattedText = value.replace(/\*\*\*(.*?)\*\*\*/g, '<b><em>$1</em></b>');
  const boldText = formattedText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  const italicizedText = boldText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  return (
    `
    <div class="wrapper ${isAi && 'ai'} ${currentTheme}">
      <div class="chat">
        <div class="profile">
          <img 
            src=${isAi ? bot : user} 
            alt="${isAi ? 'bot' : 'user'}" 
          />
        </div>
        <div class="message" id=${uniqueId}>${italicizedText}</div>
      </div>
    </div>
  `
  );
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form)
  
  if(e.shiftKey) {
    return;
  } else {
    // user's chatstripe
    const userMessage = data.get('prompt');
    chatContainer.innerHTML += chatStripe(false, userMessage)
  
    // to clear the textarea input 
    form.reset()
  
    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)
  
    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;
  
    // specific message div 
    const messageDiv = document.getElementById(uniqueId)
  
    // messageDiv.innerHTML = "..."
    loader(messageDiv)
  
    const response = await fetch('https://eyumaiserver.onrender.com', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: userMessage
      })
    })
  
    clearInterval(loadInterval)
    messageDiv.innerHTML = " "
  
    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot;
  
      typeText(messageDiv, parsedData)
    } else {
      const err = await response.text()
  
      messageDiv.innerHTML = "Something went wrong"
      alert(err)
    }
  }
}

form.addEventListener('submit', handleSubmit)
window.addEventListener('load', () => {
  if(body.classList.contains('dark')) {
    themeChanger.textContent = "Light Mode";
    currentTheme = 'dark';
  } else {
    themeChanger.textContent = "Dark Mode";
    currentTheme = 'light';
  }
});
themeChanger.addEventListener('click', () => {
  body.classList.toggle('dark');
    body.classList.toggle('light');
    tds.forEach(td => {
      td.classList.toggle('dark');
      td.classList.toggle('light');
    })
    form.classList.toggle('dark');
    form.classList.toggle('light');
    chatContainer.classList.toggle('dark');
    chatContainer.classList.toggle('light');
    chatContainer.querySelectorAll('.wrapper.ai').forEach(chat => {
      chat.classList.toggle('dark');
      chat.classList.toggle('light');
    });
  textarea.classList.toggle('dark');
  textarea.classList.toggle('light');
  themeChanger.classList.toggle('dark');
  themeChanger.classList.toggle('light');
  if (body.classList.contains('dark')) {
    themeChanger.textContent = "Light mode";
    currentTheme = 'dark';
  } else {
    themeChanger.textContent = "Dark mode";
    currentTheme = 'light';
  }
});
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 18) {
    e.preventDefault();
  } else if (e.keyCode === 13) {
    e.preventDefault();
    handleSubmit(e);
  }
})