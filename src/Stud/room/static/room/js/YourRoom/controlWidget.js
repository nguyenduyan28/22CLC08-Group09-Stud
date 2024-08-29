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
function setupWidget(openButton, widget, closeButton, load) {
  openButton.addEventListener('click', function() {
      if (widget.style.display === 'block') {
          widget.style.display = 'none';
          widget.classList.remove('open');
      } else {
          widget.style.display = 'block';
          widget.classList.add('open');

          if (load){
            load();
          }
      }
  });

  if (closeButton) {
      closeButton.addEventListener('click', function() {
          widget.style.display = 'none';
      });
  }
}
// Header yourrom
// Your room
const openYourRoomInfo = document.querySelector('.yourroom-header');
const closeYourRoominfo = document.querySelector('.yourroom-header-popup-top-close');
const yourRoomInfo = document.querySelector('.yourroom-header-popup');
// Invite link
const openInviteLink = document.querySelector('.invite-header');
const closeInviteLink = document.querySelector('.invite-header-popup-top-close');
const inviteLink = document.querySelector('.invite-header-popup');

// Theme widget
const openThemeButton = document.querySelector('.theme');
const closeThemeWidget = document.querySelector('.closeThemeWidget');
const themeWidget = document.querySelector('.themeWidget');
// Upload image
const openUploadButton = document.querySelector('.uploadImageButton');
const closeUpload = document.querySelector('.closeUploadWidget');
const UploadButton = document.querySelector('.formUploadImage');

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

// Message Widget
const openMessageButton = document.querySelector('.messageIcon');
const messageWidget = document.querySelector('.messageWidget');
const closeMessage = document.querySelector('.closeMessageWidget');

// Member Widget
const openMemberWidget = document.querySelector('.participate');
const memberWidget = document.querySelector('.memberWidget');
const closeMemberWidget = document.querySelector('.closeMessageWidget');

// Setup widget
setupWidget(openThemeButton, themeWidget, closeThemeWidget);
setupWidget(openUploadButton, UploadButton, closeUpload);
setupWidget(openMusicButton, musicWidget, closeMusicWidget);
setupWidget(openCalendarButton, calendarWidget, closeCalendarWidget);
setupWidget(openClockButton, clockWidget, closeClockWidget);
setupWidget(openNoteButton, noteWidget, closeNoteWidget, loadNoteAndTodos);
setupWidget(openMessageButton, messageWidget, closeMessage);
setupWidget(openYourRoomInfo, yourRoomInfo, closeYourRoominfo);
setupWidget(openInviteLink, inviteLink, closeInviteLink);
setupWidget(openMemberWidget, memberWidget, closeMemberWidget);

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

const trackingResetBtn = document.getElementById('trackingResetButton');
const lastTrackedDisplay = document.getElementById('lastTracked');
const trackingList = document.getElementById('trackingList');


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

  $.ajax({
    type: "GET",
    url: "start_timer",
    data: {
    },
    success: function(response) {
      console.log("Timer started successfully");
      entryId = response.entry_id;
      console.log("entry id= ", entryId)

    },
    error: (error) => {
      console.log(JSON.stringify(error));
    }

  });

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

  $.ajax({
    type: "GET",
    url: "end_timer",
    data: {
      entry_id: entryId
    },
    success: function(data) {
      console.log("Timer ended successfully");
      console.log("entry id=", entryId)
      entryId = null
    },
    error: (error) => {
      console.log(JSON.stringify(error));
    }

  });

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

// view achievement
function viewAchievement() {
  $.ajax({
      type: "GET",
      url: "view_achievement",
      success: function(data) {
          console.log("Achievement data fetched successfully:", data);
          document.getElementById("totalTime").textContent = data.total_time;
          document.getElementById("numSessions").textContent = data.num_sessions;
          document.getElementById("achievementPopup").style.display = "block";
      },
      error: function(xhr, status, error) {
          console.log("Error fetching achievement data:");
          console.log("Status:", status);
          console.log("Error:", error);
      }
  });
}
document.getElementById("viewAchievementBtn").addEventListener("click", function(event) {
  event.preventDefault(); 
  viewAchievement();
});
document.getElementById("closePopupBtn").addEventListener("click", function() {
  document.getElementById("achievementPopup").style.display = "none";
});
// Tracking Reset Function

function resetTracking() {
  if (trackingSeconds > 0) { 
    
    console.log("tracking time:", trackingSeconds)
    $.ajax({
      type: 'GET',
      url: 'update_tracking',  
      data: {
        tracking_seconds: trackingSeconds,
      },
      success: function(response) {
        console.log("Total time updated successfully:", response.total_time);
      },
      error: (error) => {
        console.log(JSON.stringify(error));
      }
    });
  }
  clearInterval(trackingIntervalId);
  trackingSeconds = 0;
  //trackingDisplay.textContent = formatTimePomodoro(trackingSeconds);
  isTrackingRunning = false;
  toggleSwitch.checked = false;
}
// Event Listener for Tracking Reset Button
trackingResetBtn.addEventListener('click', resetTracking);

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

// ----------------------------------- save note
let typingTimer;
const typingInterval = 2000; // 2 seconds
const noteInput = document.getElementById('noteInput');
const todoContainer = document.getElementById('todoContainer');

// Save function to send data to the server
function saveNoteAndTodo() {
    const todos = [];
    document.querySelectorAll('.todoItem').forEach(item => {
        const todoText = item.querySelector('input[type="text"]').value;
        const isChecked = item.querySelector('input[type="checkbox"]').checked;
        todos.push({ text: todoText, completed: isChecked });
    });

    const noteContent = noteInput.value;

    $.ajax({
        type: 'GET',
        url: 'save_note_and_todo',
        data: {
            todos: JSON.stringify(todos),
            note: noteContent,
        },
        success: function(response) {
            console.log('Note and todo saved successfully.');
        },
        error: function(error) {
            console.error('Error saving note and todo:', error);
        }
    });
}

noteInput.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(saveNoteAndTodo, typingInterval);
});

noteInput.addEventListener('keydown', () => {
    clearTimeout(typingTimer);
});

todoContainer.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(saveNoteAndTodo, typingInterval);
});

todoContainer.addEventListener('keydown', () => {
    clearTimeout(typingTimer);
});

// ------------------------- load note
//function loadNoteAndTodos() {}
function loadNoteAndTodos() {
  $.ajax({
      type: 'GET',
      url: 'get_note_and_todo',
      success: function(response) {
          if (response.status === 'error') {
              console.error('Error fetching note and todos:', response.message);
              return;
          }

          document.getElementById('noteInput').value = response.note;

          const todoContainer = document.getElementById('todoContainer');
          todoContainer.innerHTML = ''; 

          response.todos.forEach(item => { 
            const todoItem = document.createElement('div');
            todoItem.className = 'todoItem';
          
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
          
            const todoTextInput = document.createElement('input');
            todoTextInput.type = 'text';
            todoTextInput.value = item.text; 
            
            checkbox.addEventListener('change', function() {
                if (checkbox.checked) {
                    todoTextInput.style.textDecoration = 'line-through';
                } else {
                    todoTextInput.style.textDecoration = 'none';
                }
            });
          
            todoItem.appendChild(checkbox);
            todoItem.appendChild(todoTextInput);
            todoContainer.appendChild(todoItem);
          
          });
      },
      error: function(error) {
          console.error('Error fetching note and todos:', error);
      }
  });
}
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
makeDraggable(messageWidget);
makeDraggable(yourRoomInfo);
makeDraggable(inviteLink);
makeDraggable(memberWidget);

// Upload section
const actualBtn = document.getElementById('id_image');

const fileChosen = document.getElementById('file-chosen');

actualBtn.addEventListener('change', function(){
  fileChosen.textContent = this.files[0].name
})