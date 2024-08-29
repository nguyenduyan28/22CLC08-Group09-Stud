// HEADER SECTION
//Fullscreen button
document.querySelector('.zoomOut').addEventListener('click', function() {
  if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
  } else {
      document.exitFullscreen();
  }
});

// SETUP SECTION
function setupWidget(openButton, widget, closeButton) {
  openButton.addEventListener('click', function() {
      if (widget.style.display === 'block') {
          widget.style.display = 'none';
          widget.classList.remove('open');
      } else {
          widget.style.display = 'block';
          widget.classList.add('open');
      }
  });

  if (closeButton) {
      closeButton.addEventListener('click', function() {
          widget.style.display = 'none';
      });
  }
}

// Theme widget
const openThemeButton = document.querySelector('.theme');
const closeThemeWidget = document.querySelector('.closeThemeWidget');
const themeWidget = document.querySelector('.themeWidget');

// Music widget
const openMusicButton = document.querySelector('.music');
const musicWidget = document.querySelector('.musicContainer');
const closeMusicWidget = document.querySelector('.closeMusicWidget');

// Calendar
const openCalendarButton = document.querySelector('.calendar');
const calendarWidget = document.querySelector('.calendarContainer');
const closeCalendarWidget = document.querySelector('.closeCalendarWidget');

// Clock Widget
const openClockButton = document.querySelector('.clock');
const clockWidget = document.querySelector('.clockWidget');
const closeClockWidget = document.querySelector('.closeClockWidget');

// Setup widget
setupWidget(openThemeButton, themeWidget, closeThemeWidget);
setupWidget(openMusicButton, musicWidget, closeMusicWidget);
setupWidget(openCalendarButton, calendarWidget, closeCalendarWidget);
setupWidget(openClockButton, clockWidget, closeClockWidget);

// INTERACT SECTION
// Theme widget
const imageBox =document.getElementsByClassName('imageBox');
document.querySelectorAll('.imageBox').forEach(function(img) {
    img.addEventListener('click', function() {
        document.body.style.backgroundImage = `url(${img.src})`;
        //themeWidget.style.display = 'none';
        document.body.style.backgroundSize = 'cover';
    });
});

// Calendar widget
const timeElement = document.querySelector(".time");
const dateElement = document.querySelector(".date");

/**
 * @param {Date} date
 */
function formatTime(date) {
  const hours12 = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  const isAm = date.getHours() < 12;

  return `${hours12.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${isAm ? "AM" : "PM"}`;
}

/**
 * @param {Date} date
 */
function formatDate(date) {
  const DAYS = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  const MONTHS = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  return `${DAYS[date.getDay()]}, ${
    MONTHS[date.getMonth()]
  } ${date.getDate()} ${date.getFullYear()}`;
}

setInterval(() => {
  const now = new Date();

  timeElement.textContent = formatTime(now);
  dateElement.textContent = formatDate(now);
}, 200);

// Clock Widget
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const startBtn = document.querySelector('.startButton');
const resetBtn = document.querySelector('.resetButton');
const timerDisplay = document.querySelector('.pomodoro');

const toggleSwitch = document.getElementById('toggle-switch');
const trackingDisplay = document.getElementById('tracking');

let intervalId;
let trackingIntervalId;
let isPomodoroRunning = false;
let isTrackingRunning = false;

let totalSeconds = 0;
let trackingSeconds = 0;
// Pomodoro
function formatTimePomodoro(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
function playAudio() {
  const audioElement = new Audio("/static/room/css/images/YourRoom/music/doneSound.mp3");
  audioElement.play();
}
function startPomodoro() {
    const minutes = parseInt(minutesInput.value);
    const seconds = parseInt(secondsInput.value);

    totalSeconds = minutes * 60 + seconds;
    timerDisplay.textContent = formatTimePomodoro(totalSeconds);

    intervalId = setInterval(() => {
        totalSeconds--;

        timerDisplay.textContent = formatTimePomodoro(totalSeconds);

        // check timeout
        if (totalSeconds === 0) {
            clearInterval(intervalId);
            isPomodoroRunning = false;

            if (totalSeconds === 0) {
                clearInterval(intervalId);
                isPomodoroRunning = false;
                playAudio();
            }
            minutesInput.value = 25;
            secondsInput.value = 0;
        }
    }, 1000);

    startBtn.disabled = true;
    resetBtn.disabled = false;
    isPomodoroRunning = true;
}

function resetPomodoro() {
    clearInterval(intervalId);
    totalSeconds = 0;

    timerDisplay.textContent = formatTimePomodoro(totalSeconds);

    startBtn.disabled = false;
    resetBtn.disabled = true;
    isPomodoroRunning = false;
}
// Tracking
function startTracking() {
    trackingIntervalId = setInterval(() => {
        trackingSeconds++;
        trackingDisplay.textContent = formatTimePomodoro(trackingSeconds);
    }, 1000);

    isTrackingRunning = true;
}
function stopTracking() {
    clearInterval(trackingIntervalId);
    isTrackingRunning = false;
}
toggleSwitch.addEventListener('change', () => {
    if (toggleSwitch.checked) {
        startTracking();
    } else {
        stopTracking();
    }
});

startBtn.addEventListener('click', () => {
  console.log('Start button clicked');
  startPomodoro();
});
resetBtn.addEventListener('click', resetPomodoro);



// chatting

function scrollToBottom() {
  var chatContainer = document.getElementById("chatContainer");
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
// Determine the WebSocket protocol based on the application's URL
const websocketProtocol = window.location.protocol === "https:" ? "wss" : "ws"; //chọn giao thức bảo mật Websocket HTTPS : wss
const wsEndpoint = `${websocketProtocol}://${window.location.host}/ws/notification/{{room_name}}/`;

// Create a new WebSocket connection
const socket = new WebSocket(wsEndpoint);











// Successful connection event
socket.onopen = (event) => {
  console.log("WebSocket connection opened!");
};

// Socket disconnect event
socket.onclose = (event) => {
  console.log("WebSocket connection closed!");
};
// Form submit listener
document.getElementById('message-form').addEventListener('submit', function(event){
  event.preventDefault();
  const message = document.getElementById('msg').value;
  socket.send(
      JSON.stringify({
          'message': message,
          'room_name': '{{room_name}}',
          'sender': '{{user}}',
      })
  );
});

// Response from consumer on the server
socket.addEventListener("message", (event) => {
  const messageData = JSON.parse(event.data)['message'];
  console.log(messageData);

  var sender = messageData['sender'];
  var message = messageData['message'];

  // Empty the message input field after the message has been sent
  if (sender == '{{user}}'){
      document.getElementById('msg').value = '';
  }

  // Append the message to the chatbox
  var messageDiv = document.querySelector('.message');
  if (sender != '{{user}}') { // Assuming you have a variable `currentUser` to hold the current user's name
      messageDiv.innerHTML += '<div class="receive"><p style="color: #000;">' + message + '<strong>-' + sender + '</strong></p></div>';
  } else {
      messageDiv.innerHTML += '<div class="send"><p style="color: #000;">' + message + '</p></div>';
  }
  scrollToBottom();
});
//Drag and drop
function makeDraggable(draggableElement) {
  let isDragging = false;
  let initialX, initialY;
  let widthValue = 0, heightValue = 0;
  const wasHidden = true;
  if (wasHidden) {
    draggableElement.style.display = 'block';
    widthValue = draggableElement.offsetWidth;
    heightValue = draggableElement.offsetHeight;
  }
  if (wasHidden) {
    draggableElement.style.display = 'none';
  }
  //Limit draggable space
  const maxX = window.innerWidth - widthValue;
  const maxY = window.innerHeight - heightValue;
  //const maxX = window.innerWidth - 268;
  //const maxY = window.innerHeight - 342;

  draggableElement.addEventListener('mousedown', function(e) {
    isDragging = true;
    initialX = e.clientX - draggableElement.offsetLeft;
    initialY = e.clientY - draggableElement.offsetTop;
  });

  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      let newX = e.clientX - initialX;
      let newY = e.clientY - initialY;

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      draggableElement.style.left = `${newX}px`;
      draggableElement.style.top = `${newY}px`;
    }
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
  });
}
// Activate drag and drop to widget
makeDraggable(themeWidget);
makeDraggable(musicWidget);
makeDraggable(calendarWidget);
makeDraggable(clockWidget);