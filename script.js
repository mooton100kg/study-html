(function() {
	 // Define the color you want to target
	 const targetColors = ['rgb(90, 90, 90)', 'rgb(74, 134, 232)']; // RGB equivalent of #5A5A5A
	 let hiddenElements = [];
	 let currentIndex, previousIndex;
	 let autoScroll = false;

	 // Function to find all elements with the target color
	 function findHiddenTextElements() {
		 const allElements = document.body.getElementsByTagName('*');

		 for (let i = 0; i < allElements.length; i++) {
			 const element = allElements[i];
			 const computedStyle = window.getComputedStyle(element);
			 for (let i=0; i < targetColors.length; i++){
			 	let targetColor = targetColors[i];
				 if (computedStyle.color === targetColor) {
					 hiddenElements.push(element);
					 element.classList.add('hidden-text');

					 element.addEventListener('click', function(e) {
						currentIndex = hiddenElements.indexOf(e.target);
						goToText('click');
					 });
				 }
			 }
		 }
	 }

	 // Function to reveal the next hidden text element
	 function revealTextElement() {
		 hiddenElements[currentIndex].classList.add('revealed');
	 }

	 function revealAllTextElement() {
	 	if (hiddenElements[0].classList.contains('revealed')) {
			for (let i=0; i<hiddenElements.length; i++) {
				hiddenElements[i].classList.remove('revealed');
			}	
		}
		else {
			for (let i = 0; i < hiddenElements.length; i++){
				hiddenElements[i].classList.add('revealed');
			}
		}
	 }

	 function indexKey() {
		 if (currentIndex > hiddenElements.length - 1) {
			 CI = 0;
		 } else if (currentIndex < 0) {
			 CI = hiddenElements.length - 1;
		 } else {
			 CI = currentIndex;
		 }
		 	
	 	 return CI
	 }
	 function goToText(key) {
		 if (currentIndex == null) currentIndex = 0;
		 else if (key === 's') currentIndex++;
		 else if (key === 'a') currentIndex--;

		 currentIndex  = indexKey()

		 for (let i = 0; i < hiddenElements.length; i++){
			 if (hiddenElements[i].classList.contains('revealed')){
				 hiddenElements[i].classList.remove('revealed');
			 }
			 if (hiddenElements[i].classList.contains('current')){
				 hiddenElements[i].classList.remove('current');
			 }
		 }

		 hiddenElements[currentIndex].classList.add('current');
		 if (autoScroll) scrollToElementVertically(hiddenElements[currentIndex]);
	 }

	 function scrollToElementVertically(element) {
		 const rect = element.getBoundingClientRect();
		 const elementHeight = rect.height;

		 // Calculate the scroll position needed to center the element vertically
		 const viewportHeight = window.innerHeight;
		 const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		 const top = rect.top + scrollTop - (viewportHeight / 2 - elementHeight / 2);

		 window.scrollTo({
			top: top,
			behavior: 'smooth' // Smooth scrolling
		});
	}


	// Event listener for keypress
	document.addEventListener('keydown', (event) => {
		if (event.key === 'a') {
			goToText('a');
		}
		else if (event.key === 's') {
			goToText('s');
		}
		else if (event.key === 'd') {
			revealTextElement();
		}
		else if (event.key === 'f') {
			revealAllTextElement();
		}
		else if (event.key === 'e') {
			scrollToElementVertically(hiddenElements[currentIndex]);
		}
		else if (event.key === 'q') {
			autoScroll = !autoScroll;
		}
		else if (event.key === 'w') {
			const scrollAmount = window.innerHeight / 4;

			// Scroll down by the calculated amount
			window.scrollBy({
				top: scrollAmount,
				behavior: 'smooth' // Smooth scrolling
			});
		}
		else if (event.key === 'r') {
			const scrollAmount = window.innerHeight / 4;

			// Scroll down by the calculated amount
			window.scrollBy({
				top: -scrollAmount,
				behavior: 'smooth' // Smooth scrolling
			});
		}
		else if (event.key === 'h') {
			alert('A = go up\nS = go down\nD = reveal\nF = reveal all\nE = to select\nW = scroll down\nR = scroll up\nQ = toggle auto scroll');
		}

	});

	// Initialize the hidden text elements on DOMContentLoaded
	document.addEventListener('DOMContentLoaded', findHiddenTextElements);
})();
