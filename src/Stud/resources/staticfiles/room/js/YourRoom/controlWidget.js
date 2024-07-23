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
const calendarWidget = document.querySelector('.calendarWidget');
const closeCalendarWidget = document.querySelector('.closeCalendarWidget');

// Clock Widget
const openClockButton = document.querySelector('.clock');
const clockWidget = document.querySelector('.clockWidget');
const closeClockWidget = document.querySelector('.closeClockWidget');

// Note Widget
const openNoteButton = document.querySelector('.notebook');
const noteWidget = document.querySelector('.noteWidget');
const closeNoteWidget = document.querySelector('.closeNoteWidget');

// Setup widget
setupWidget(openThemeButton, themeWidget, closeThemeWidget);
setupWidget(openMusicButton, musicWidget, closeMusicWidget);
setupWidget(openCalendarButton, calendarWidget, closeCalendarWidget);
setupWidget(openClockButton, clockWidget, closeClockWidget);
setupWidget(openNoteButton, noteWidget, closeNoteWidget);

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

// Music widget
document.getElementById('playMusicButton').addEventListener('click', function() {
  const url = document.getElementById('urlInput').value;
  const musicWidget = document.getElementById('musicWidget');

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1] || url.split('/').pop();
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      musicWidget.src = embedUrl;
  } else if (url.includes('spotify.com')) {
      const embedUrl = url.replace('/track/', '/embed/track/').replace('/album/', '/embed/album/').replace('/playlist/', '/embed/playlist/');
      musicWidget.src = embedUrl;
  } else if (url.includes('music.apple.com')) {
      const embedUrl = url.replace('music.apple.com', 'embed.music.apple.com');
      musicWidget.src = embedUrl;
  } else {
      alert('Unsupported URL');
  }
});

document.getElementById('resetButton').addEventListener('click', function() {
  const defaultUrl = 'https://open.spotify.com/embed/album/6s84u2TUpR3wdUv4NgKA2j?utm_source=generator';
  document.getElementById('musicWidget').src = defaultUrl;
});

// Calendar widget
const CLIENT_ID = '775438645625-14ljqeu8juek64ei8vtdmo829cmguqbm.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDED6NWjqvO-_fO3lX64PRCzzpwuQR7_9Y';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;
let currentDate = new Date();

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (resp) => {
          if (resp.error) {
              console.error('Error during authentication:', resp.error);
              return;
          }
          document.getElementById('signout_button').style.visibility = 'visible';
          document.getElementById('authorize_button').innerText = 'Refresh';
          listUpcomingEvents(); // Fetch and display calendar events
      },
  });
  gisInited = true;
  maybeEnableButtons();
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

// function gisLoaded() {
//     tokenClient = google.accounts.oauth2.initTokenClient({
//         client_id: CLIENT_ID,
//         scope: SCOPES,
//         callback: '', // defined later
//     });
//     gisInited = true;
//     maybeEnableButtons();
// }

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
        listUpcomingEvents();
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

async function listUpcomingEvents() {
    const calendarElement = document.getElementById('calendarSection');
    calendarElement.innerHTML = '';

    for (let i = 0; i < 24; i++) {
        const hourElement = document.createElement('div');
        hourElement.className = 'hour';
        const timeElement = document.createElement('div');
        timeElement.className = 'time';
        timeElement.innerText = formatHour(i);
        const eventsElement = document.createElement('div');
        eventsElement.className = 'events';
        hourElement.appendChild(timeElement);
        hourElement.appendChild(eventsElement);
        calendarElement.appendChild(hourElement);
    }

    let response;
    try {
        const timeMin = new Date(currentDate);
        timeMin.setHours(0, 0, 0, 0);
        const timeMax = new Date(currentDate);
        timeMax.setHours(23, 59, 59, 999);

        const request = {
            'calendarId': 'primary',
            'timeMin': timeMin.toISOString(),
            'timeMax': timeMax.toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'orderBy': 'startTime',
        };
        response = await gapi.client.calendar.events.list(request);
    } catch (err) {
        // send message 'underfined'
        //document.getElementById('content').innerText = err.message;
        return;
    }

    const events = response.result.items;
    if (!events || events.length == 0) {
        document.getElementById('content').innerText = '';
    } else {
        events.forEach(event => {
            const start = new Date(event.start.dateTime || event.start.date);
            const end = new Date(event.end.dateTime || event.end.date);
            const startHour = start.getHours();
            const startMinute = start.getMinutes();
            const endHour = end.getHours();
            const endMinute = end.getMinutes();
            const duration = ((end - start) / 60000); // Duration in minutes

            const eventElement = document.createElement('div');
            eventElement.className = 'event';
            eventElement.style.top = `${(startMinute / 60) * 100}%`;
            eventElement.style.height = `${(duration / 60) * 100}%`;
            eventElement.innerText = event.summary;

            const hourElement = document.querySelector(`.hour:nth-child(${startHour + 1}) .events`);
            if (hourElement) {
                hourElement.appendChild(eventElement);
            }
        });

        const output = events.reduce(
            (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
            'Events:\n'
        );
        //document.getElementById('content').innerText = output;
    }

    document.getElementById('currentDate').innerText = formatDate(currentDate);
}

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatHour(hour) {
    const period = hour < 12 ? 'AM' : 'PM';
    const formattedHour = hour % 12 || 12; // Convert to AM PM hour
    return `${formattedHour} ${period}`;
}

function prevDay() {
    currentDate.setDate(currentDate.getDate() - 1);
    listUpcomingEvents();
}

function nextDay() {
    currentDate.setDate(currentDate.getDate() + 1);
    listUpcomingEvents();
}

// Calendar widget
const timeElement = document.querySelector(".timeClock");
const dateElement = document.querySelector(".dateClock");

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
minutesInput.addEventListener('blur', () => {
  if (minutesInput.value.trim() === '') {
    minutesInput.value = 0;
  }
});

secondsInput.addEventListener('blur', () => {
  if (secondsInput.value.trim() === '') {
    secondsInput.value = 0;
  }
});
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
  const audioElement = new Audio("../../static/room/images/YourRoom/music/doneSound.mp3");
  audioElement.play();
}
function startPomodoro() {
  const minutes = parseInt(minutesInput.value);
  const seconds = parseInt(secondsInput.value);
  totalSeconds = minutes * 60 + seconds;
    // Check if totalSeconds is zero
  if (totalSeconds === 0) {
    return;
  }
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

// Note Widget
document.getElementById('addTodoButton').addEventListener('click', function() {
  const todoItem = document.createElement('div');
  todoItem.className = 'todoItem';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  const todoTextInput = document.createElement('input');
  todoTextInput.type = 'text';
  todoTextInput.placeholder = 'Enter your todo...';

  todoTextInput.addEventListener('keydown', function(event) {
      if (event.key === 'Backspace' && todoTextInput.value === '') {
          todoItem.remove();

          if (document.getElementById('todoContainer').children.length === 0) {
              document.getElementById('noteInput').placeholder = 'Write your note here...';
          }
      }
  });

  checkbox.addEventListener('change', function() {
      if (checkbox.checked) {
          todoTextInput.style.textDecoration = 'line-through';
      } else {
          todoTextInput.style.textDecoration = 'none';
      }
  });

  todoItem.appendChild(checkbox);
  todoItem.appendChild(todoTextInput);
  document.getElementById('todoContainer').appendChild(todoItem);

  document.getElementById('noteInput').placeholder = '';
});

document.getElementById('noteInput').addEventListener('keydown', function(event) {
  if (event.key === 'Backspace' && this.selectionStart === 0) {
      const todoContainer = document.getElementById('todoContainer');
      const lastTodoItem = todoContainer.lastElementChild;

      if (lastTodoItem) {
          todoContainer.removeChild(lastTodoItem);

          if (todoContainer.children.length === 0) {
              document.getElementById('noteInput').placeholder = 'Write your note here...';
          }

          event.preventDefault();
      }
  }
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
makeDraggable(noteWidget);