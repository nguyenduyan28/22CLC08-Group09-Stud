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
document.querySelectorAll('.explore__main--discoverRoomSection--roomBox').forEach(box => {
    box.addEventListener('click', () => {
        const roomName = box.getAttribute('data-room-name');
        const roomDescription = box.getAttribute('data-room-description');
        const roomMembers = box.getAttribute('data-room-members');
        const inviteToken = box.getAttribute('data-room-token');
        document.getElementById('modalRoomName').innerText = roomName;
        document.getElementById('modalRoomDescription').innerText = roomDescription;
        document.getElementById('modalRoomMembers').innerText = roomMembers;

        const inviteLink = document.getElementById('modalRoomToken');
        const modal = document.getElementById('roomModalInfos');
        inviteLink.href = `/room/yourroom/${inviteToken}`;
        modal.style.display = 'block';
    });
});

document.querySelector('.closeModalButton').addEventListener('click', () => {
    const modal = document.getElementById('roomModalInfos');
    modal.style.display = 'none';
});
    
// window.addEventListener('click', (event) => {
//     const modal = document.getElementById('roomModalInfos');
//     if (event.target == modal) {
//         modal.style.display = 'none';
//     }
// });