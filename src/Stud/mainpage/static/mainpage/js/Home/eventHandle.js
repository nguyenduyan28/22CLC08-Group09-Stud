// Handle nav links
const navLinkEls = document.querySelectorAll('.middle-header-Nav');
const windowPathName = window.location.pathname.toLocaleLowerCase();

navLinkEls.forEach(navLinkEl =>{
    const navLinkPathName = new URL(navlinkEl.href).pathname.toLocaleLowerCase();
    if((windowPathName === navLinkPathName) || (windowPathName === '/Home.html' && navLinkPathName === '/')){
        navLinkEl.classList.add('active');
    }
});

const logoElements = document.querySelectorAll('.Stud-logo, .Stud-logo-footer');
logoElements.forEach(logoElement => {
  logoElement.addEventListener('click', () => {
    window.location.href = `${window.location.origin}/Home.html`;
  });
});
  