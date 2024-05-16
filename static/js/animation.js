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
    animateElementById('identify', 'bounceInLeft'); 
    animateElementById('history', 'fadeInLeft'); 
    animateElementById('his-pic', 'fadeInLeft'); 			
    animateElementById('his-list', 'fadeInLeft'); 			
    animateElementById('population-tran', 'fadeInRight'); 			
    animateElementById('animated-text-population-1', 'bounceInLeft'); 
    animateElementById('animated-text-population-2', 'bounceInLeft'); 

    animateElementById('popu-map', 'fadeInLeftBig'); 
    animateElementById('metro', 'slideInRight'); 
    animateElementById('buildup', 'slideInRight'); 
    animateElementById('airQuality', 'fadeInRight'); 
    animateElementById('airQuality-text', 'bounceInLeft'); 
    animateElementById('PM2.5-P-C', 'slideInLeft'); 
    animateElementById('conclu', 'slideInLeft'); 
    

}

window.onscroll = handleScroll;