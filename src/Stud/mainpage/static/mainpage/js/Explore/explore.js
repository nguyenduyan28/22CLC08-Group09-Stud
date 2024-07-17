// Page Number
const itemsPerPage = 9;
let currentPage = 1;

function showPage(page) {
    const items = document.querySelectorAll('.explore__main--discoverRoomSection--roomList .explore__main--discoverRoomSection--roomBox');
    const totalPages = Math.ceil(items.length / itemsPerPage);

    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    items.forEach((item, index) => {
        item.style.display = 'none';
        if (index >= (page - 1) * itemsPerPage && index < page * itemsPerPage) {
            item.style.display = 'block';
        }
    });

    document.getElementById('page-num').textContent = `Page ${page} of ${totalPages}`;
    currentPage = page;
}

function nextPage() {
    showPage(currentPage + 1);
}

function prevPage() {
    showPage(currentPage - 1);
}
showPage(currentPage);

// Show info
// JavaScript code to set up widget interaction for each room box
const roomBoxes = document.querySelectorAll('.explore__main--discoverRoomSection--roomBox');
const roomInformation = document.querySelector('.roomInformation');

function setupWidgets() {
    roomBoxes.forEach((box, index) => {
        const openButton = box.querySelector('.roomBox-bottom .roomName'); // Adjust this selector as needed
        const closeButton = roomInformation.querySelector('.closeThemeWidget'); // Adjust this selector as needed
        
        openButton.addEventListener('click', function() {
            if (roomInformation.style.display === 'block') {
                roomInformation.style.display = 'none';
                roomInformation.classList.remove('open');
            } else {
                roomInformation.style.display = 'block';
                roomInformation.classList.add('open');
            }
        });

        if (closeButton) {
            closeButton.addEventListener('click', function() {
                roomInformation.style.display = 'none';
            });
        }
    });
}

setupWidgets();
