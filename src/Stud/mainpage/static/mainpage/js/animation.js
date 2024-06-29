const midElementBox = document.getElementById("mid-element");
const locationSectionBox = document.getElementById("location-section");
const prepareSectionBox = document.getElementById("prepare-section");
const subcribeSectionBox = document.getElementById("subcribe-section");
function isIntoView(element){
    const rect = element.getBoundingClientRect();
    return rect.bottom <= window.innerHeight;
}
window.addEventListener("scroll", () => {
    if(isIntoView(midElementBox)){
        midElementBox.classList.add("active");
    }else {
        midElementBox.classList.remove("active"); 
    }
})
window.addEventListener("scroll", () => {
    if(isIntoView(locationSectionBox)){
        locationSectionBox.classList.add("active");
    }else {
        locationSectionBox.classList.remove("active"); 
    }
})
window.addEventListener("scroll", () => {
    if(isIntoView(prepareSectionBox)){
        prepareSectionBox.classList.add("active");
    }else {
        prepareSectionBox.classList.remove("active"); 
    }
})
window.addEventListener("scroll", () => {
    if(isIntoView(subcribeSectionBox)){
        subcribeSectionBox.classList.add("active");
    }else {
        subcribeSectionBox.classList.remove("active"); 
    }
})