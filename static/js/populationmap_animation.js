
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
			animateElementById('selectYear', 'fadeInDown'); 
			animateElementById('instuction-button', 'fadeInDown'); 			
			animateElementById('homePage', 'fadeInDown'); 
			animateElementById('chart', 'fadeInRight'); 
			animateElementById('instr', 'slideInRight'); 

		}

		window.onscroll = handleScroll;

