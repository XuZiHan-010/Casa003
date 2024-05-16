function animateElementById(elementId, animationClass) {
    var showId = document.getElementById(elementId);
    var clients = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var divTop = showId.getBoundingClientRect().top;
    if (divTop <= clients) {
        showId.classList.add(animationClass);
    } else {
        showId.classList.remove(animationClass);
    }
}

function handleScroll() {
animateElementById('all', 'fadeInRight'); 
animateElementById('legend', 'bounceInRight'); 			
animateElementById('options', 'bounceInRight'); 
animateElementById('buttons', 'fadeInRight'); 
animateElementById('map-aq', 'fadeInRight'); 
animateElementById('instr', 'slideInRight'); 
// animateElementById('airQuality', 'zoomInDown'); 


}

window.onscroll = handleScroll;