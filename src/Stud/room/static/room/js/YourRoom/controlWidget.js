//Setup widget
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

//Interact theme selector
const imageBox =document.getElementsByClassName('imageBox');
document.querySelectorAll('.imageBox').forEach(function(img) {
    img.addEventListener('click', function() {
        document.body.style.backgroundImage = `url(${img.src})`;
        //themeWidget.style.display = 'none';
        document.body.style.backgroundSize = 'cover';
    });
});

// Music widget
const openMusicButton = document.querySelector('.music');
const musicWidget = document.querySelector('.musicContainer');
const closeMusicWidget = document.querySelector('.closeMusicWidget');

//Calendar
const openCalendarButton = document.querySelector('.calendar');
const calendarWidget = document.querySelector('.calendarContainer');
const closeCalendarWidget = document.querySelector('.closeCalendarWidget');

// Setup widget
setupWidget(openThemeButton, themeWidget, closeThemeWidget);
setupWidget(openMusicButton, musicWidget, closeMusicWidget);
setupWidget(openCalendarButton, calendarWidget, closeCalendarWidget);

//Fullscreen button
document.querySelector('.zoomOut').addEventListener('click', function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen();
    }
});
//Clock section
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

//Drag and Drop

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
makeDraggable(themeWidget);
makeDraggable(musicWidget);
makeDraggable(calendarWidget);