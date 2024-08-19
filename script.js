// Define the color you want to target
const targetFonts = ["Roboto"]; 
let hiddenElements = [];
let currentIndex, previousIndex;
let autoScroll = true;


//create input element 
const input = document.createElement('input');
input.type = 'text';
input.id = 'userInput';
input.placeholder = 'Type something and press Enter';

 // Function to find all elements with the target color
 function findHiddenTextElements() {
	 const allElements = document.body.getElementsByTagName('*');

	 for (let i = 0; i < allElements.length; i++) {
		 const element = allElements[i];
		 const computedStyle = window.getComputedStyle(element);
		 for (let i=0; i < targetFonts.length; i++){
			let targetFont = targetFonts[i];
			 if (computedStyle.getPropertyValue('font-family') === targetFont) {
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
 	if (hiddenElements[currentIndex].classList.contains('revealed')) {
		hiddenElements[currentIndex].classList.remove('revealed');
	}
	else {
		hiddenElements[currentIndex].classList.add('revealed');
	}
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
function keyPress(event){
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
	else if (event.key === 't') {
		event.preventDefault();
		input.focus();
	}
	else if (event.key === 'h') {
		alert('A = go up\nS = go down\nD = reveal\nF = reveal all\nE = to select\nW = scroll down\nR = scroll up\nQ = toggle auto scroll\nT = focus on input');
	}

};

function inputKeyPress(event) {
	if (event.key === 'Enter') {
		correct = hiddenElements[currentIndex].textContent.trim().toLowerCase()
		answer = this.value.toLowerCase()
		if (answer == correct || answer == ' ') {
			revealTextElement();
		}
		else if (answer == '') {
			goToText('s');
		}
		this.value = '';  // Clear the input after logging
	}
	else if (event.keyCode == 27) {
		input.blur();
	}
}

function inputElement(){
	document.body.appendChild(input);
};

function main(){
	document.addEventListener('DOMContentLoaded', findHiddenTextElements);
	document.addEventListener('DOMContentLoaded', inputElement);
	document.addEventListener('keydown', keyPress);

	input.addEventListener('keydown', inputKeyPress);

	input.addEventListener('focusin', function(){
		document.removeEventListener('keydown', keyPress);
	});

	input.addEventListener('focusout', function(){
		document.addEventListener('keydown', keyPress);
	});
}

//run main
main()
