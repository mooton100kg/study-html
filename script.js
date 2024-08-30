// Define the color you want to target
const targetFonts = ["Roboto"]; 
let hiddenElements = [];
let currentIndex, previousIndex;
let autoScroll = true;
let holdAns = false;
let saveIndex = new Set();

//create input element 
const input = document.createElement('input');
input.type = 'text';
input.id = 'userInput';
input.placeholder = 'Type something and press Enter';

//device to detect as mobile
const mobileBrowser = /iPhone/i;

//mobile btn
const btnContainer = document.createElement('div');
btnContainer.classiName = 'container';

const nextBtn = document.createElement('button');
nextBtn.type = 'button';
nextBtn.id = 'nextBtn';

const previousBtn = document.createElement('button');
previousBtn.type = 'button';
previousBtn.id = 'previousBtn';


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
		 for (let i = 0; i < hiddenElements.length; i++){
			 if (hiddenElements[i].classList.contains('revealed') && !holdAns){
				 hiddenElements[i].classList.remove('revealed');
			 }
		}
	}
	else {
		hiddenElements[currentIndex].classList.add('revealed');
		nextElement = indexKey(currentIndex + 1) 
		while (hiddenElements[currentIndex].nextElementSibling === hiddenElements[nextElement]){
			currentIndex = indexKey(currentIndex + 1)
			hiddenElements[currentIndex].classList.add('revealed');
			hiddenElements[currentIndex].classList.add('current');
			nextElement = indexKey(currentIndex + 1) 
		}
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

 function indexKey(index) {
	 if (index > hiddenElements.length - 1) {
		 CI = 0;
	 } else if (index < 0) {
		 CI = hiddenElements.length - 1;
	 } else {
		 CI = index;
	 }
		
	 return CI
 }

 function goToText(key) {
	 if (currentIndex == null) currentIndex = 0;
	 else if (key === 's') currentIndex++;
	 else if (key === 'a') currentIndex--;

	 currentIndex  = indexKey(currentIndex)

	 for (let i = 0; i < hiddenElements.length; i++){
		 if (hiddenElements[i].classList.contains('revealed') && !holdAns){
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

//shuffle table row
function shuffleTable(){
	//get the parent table for convenience
	let table = document.getElementsByTagName("table")[0];

	//1. get all rows
	let rowsCollection = table.querySelectorAll("tr");

	//2. convert to array
	let rows = Array.from(rowsCollection).slice(1); //skip the header row

	//3. shuffle
	shuffleArray(rows);

	//4. add back to the DOM
	for (const row of rows) {
		table.appendChild(row);
	}
};

function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
};

function nextSaveIndex(set){
	for (let num of set) {
		if (num > currentIndex) {
			nextNearest = num;
			break;
		}
	}
	return nextNearest
};

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
	else if (event.key === 'g') {
		holdAns = !holdAns
	}
	else if (event.key === 'N') {
		localStorage.setItem('bookmark', currentIndex);
	}
	else if (event.key === 'B') {
		hiddenElements[currentIndex].classList.remove('current');
		currentIndex = Number(localStorage.getItem('bookmark'));
		hiddenElements[currentIndex].classList.add('current');
	}
	else if (event.key === 'n') {
		if (localStorage.getItem("saveIndex") === null){
			saveIndex = new Set([currentIndex]);
			hiddenElements[currentIndex].classList.add('mark');
		}
		else {
			saveIndex = new Set(JSON.parse(localStorage.getItem("saveIndex")));
			if (saveIndex.has(currentIndex)){
				saveIndex.delete(currentIndex)
				hiddenElements[currentIndex].classList.remove('mark');
			}
			else {
				saveIndex.add(currentIndex);
				hiddenElements[currentIndex].classList.add('mark');
			}
		}

		localStorage.setItem("saveIndex", JSON.stringify([...saveIndex].sort((a, b) => (a - b))));
	}
	else if (event.key === 'b') {
		saveIndex = new Set(JSON.parse(localStorage.getItem("saveIndex")));
		if (localStorage.getItem("saveIndex") != null){
			hiddenElements[currentIndex].classList.remove('current')
			currentIndex = nextSaveIndex(saveIndex);
			hiddenElements[currentIndex].classList.add('current')
			scrollToElementVertically(hiddenElements[currentIndex]);
			if (!hiddenElements[currentIndex].classList.contains('mark')){
				for (let i of saveIndex){
					hiddenElements[i].classList.add('mark')
				}	
			}
		}
	}
	else if (event.key === 'z') {
		shuffleTable();			
	}
	else if (event.key === 'h') {
		alert('A = go up\nS = go down\nD = reveal\nF = reveal all\nE = to select\nW = scroll down\nR = scroll up\nQ = toggle auto scroll\nT = focus on input\nG = hold reveal\nN = new bookmark\nB = go to bookmark');
	}

};

function inputKeyPress(event) {
	if (event.key === 'Enter') {
		correct = hiddenElements[currentIndex].textContent.trim().toLowerCase()
		answer = this.value.toLowerCase()
		if (answer == correct || answer == ' ' || (answer != correct && answer != "")) {
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

//detect mobile browser
function isMobile(){
	let agent = navigator.userAgent;
	return mobileBrowser.test(agent);
};

//add btn to mobile
function mobileBtn(){
	document.body.appendChild(nextBtn);
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

	//add button if on mobile
	if (isMobile()) {
		mobileBtn();
	};
}

//run main
main()
