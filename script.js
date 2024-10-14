// Define the color you want to target
const targetFonts = ['"Chakra Petch"']; 
let hiddenElements = [];
let currentIndex;
let autoScroll = true;
let holdAns = false;
let saveIndex = new Set(JSON.parse(localStorage.getItem("saveIndex")));

//create input element 
const input = document.createElement('input');
input.type = 'text';
input.id = 'userInput';
input.placeholder = 'Type something and press Enter';

//device to detect as mobile
const mobileBrowser = /iPhone/i;

//mobile btn
const nextBtn = document.createElement('button');
nextBtn.type = 'button';
nextBtn.id = 'nextBtn';

// Function to find all elements with target font
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
					goToNextElement('click');
				});
			}
		}
		if (document.title == 'patho' && element.tagName == 'IMG') {
			hiddenElements.push(element);
			element.classList.add('hidden-text');
		}
	}

	//add mark to saveIndex
	addMarkToSaveIndex(saveIndex)
}

//check if there are any adjacent element
function checkAdjacentElement(CIndex){
	let NIndex = calculateNextElementIndex(CIndex + 1);
	let PIndex = calculateNextElementIndex(CIndex - 1);
	let adjacentIndex = [CIndex];
	
	while (hiddenElements[calculateNextElementIndex(NIndex - 1)].nextElementSibling === hiddenElements[NIndex]) {
		adjacentIndex.push(NIndex++);
	}
	while (hiddenElements[PIndex].nextElementSibling === hiddenElements[calculateNextElementIndex(PIndex + 1)]) {
		adjacentIndex.push(PIndex--);
	}
	return adjacentIndex.sort((a, b) => (a - b))
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
		adjacentIndex = checkAdjacentElement(currentIndex);
		for (let i of adjacentIndex) {
			hiddenElements[i].classList.add('revealed');
			hiddenElements[i].classList.add('current');
		}
		currentIndex = adjacentIndex[adjacentIndex.length - 1];
	}
}

//F key to reveal all element
function revealAllTextElement() {
	//check if all are already revealed
	if (hiddenElements[0].classList.contains('revealed')) {
		for (let element of hiddenElements) {
			element.classList.remove('revealed');
		}	
	}
	else {
		for (let element of hiddenElements){
			element.classList.add('revealed');
		}
	}
}

//calculate next element index
function calculateNextElementIndex(indexPlus) {
	//index Plus = Index++ w/o calculate anything

	//if element is the last (for S key)
	if (indexPlus > hiddenElements.length - 1) {
		nextIndex = 0;
	} 
	//if element is the first (for A key)
	else if (indexPlus < 0) {
		nextIndex = hiddenElements.length - 1;
	} 
	else {
		nextIndex = indexPlus;
	}

	return nextIndex
}

//when S/A key clicked, go to next element
function goToNextElement(key) {
	//if no element is selected, select first element
	if (currentIndex == null) currentIndex = 0;
	//if key S/A clicked w/ already selected element, go to next element
	else if (key === 's') currentIndex++;
	else if (key === 'a') currentIndex--;

	//calculat next element index 
	currentIndex  = calculateNextElementIndex(currentIndex)

	//remove not current element class
	for (let element of hiddenElements){
		//check if holdAns is on
		if (element.classList.contains('revealed') && !holdAns){
			element.classList.remove('revealed');
		}
		if (element.classList.contains('current')){
			element.classList.remove('current');
		}
	}

	//select current element
	adjacentIndex = checkAdjacentElement(currentIndex);
	for (let i of adjacentIndex) {
		hiddenElements[i].classList.add('current');
	}
	if (key === 's') currentIndex = adjacentIndex[adjacentIndex.length - 1];
	else if (key === 'a') currentIndex = adjacentIndex[0];
	
	

	//scroll to current element
	if (autoScroll) scrollToElementVertically(hiddenElements[currentIndex]);
}

//scroll to make element in the middle of the screen
function scrollToElementVertically(element) {
	const rect = element.getBoundingClientRect();
	const elementHeight = rect.height;

	// Calculate the scroll position needed to center the element vertically
	const viewportHeight = window.innerHeight;
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

	const top = rect.top + scrollTop - (viewportHeight / 2 - elementHeight / 2);

	window.scrollTo({
		top: top,
		behavior: 'smooth'
	});
}

//shuffle table row
function shuffleTable(){
	let table = document.getElementsByTagName("table")[0];

	let rowsCollection = table.querySelectorAll("tr");

	let rows = Array.from(rowsCollection).slice(1); //skip the header row

	//shuffle the array
	shuffleArray(rows);

	//replace the row with new order
	for (const row of rows) {
		table.appendChild(row);
	}
};

//shuffle the array
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
};

//find next nearest saved element
function nextSaveElement(set){
	let nextNearest;
	for (let num of set) {
		if (num > currentIndex) {
			nextNearest = num;
			break;
		}
	}
	if (nextNearest == currentIndex || nextNearest == null) nextNearest = [...set][0]
	return nextNearest
};

//input key check after click Enter
function inputKeyPress(event) {
	if (event.key === 'Enter') {
		correct = hiddenElements[currentIndex].textContent.trim().toLowerCase()
		answer = this.value.toLowerCase()

		if (answer == '') {
			goToNextElement('s');
		}
		else {
			revealTextElement();
		}
		this.value = '';  // Clear the input after checking
	}

	//un-focus input element if click Esc
	else if (event.keyCode == 27) {
		input.blur();
	}
}

//add mark class to save element in saveIndex
function addMarkToSaveIndex(saveIndex) {
	for (let i of saveIndex) {
		for (let j of checkAdjacentElement(i)) {
			hiddenElements[j].classList.add('mark')
		}
	}
}

//save current element to saveIndex
function saveToSaveIndex() {
	let index = checkAdjacentElement(currentIndex)[0];
	//check if saveIndex is empty
	if (localStorage.getItem("saveIndex") === null){
		saveIndex = new Set([index]);
		hiddenElements[index].classList.add('mark');
	}
	else {
		//get saveIndex from localStorage
		saveIndex = new Set(JSON.parse(localStorage.getItem("saveIndex")));

		//check if current element is in saveIndex
		//delete element from saveIndex if it in
		if (saveIndex.has(index)){
			saveIndex.delete(index)
			hiddenElements[index].classList.remove('mark');
		}
		else {
			saveIndex.add(index);
			hiddenElements[index].classList.add('mark');
		}
	}

	//save new saveIndex in localStorage
	localStorage.setItem("saveIndex", JSON.stringify([...saveIndex].sort((a, b) => (a - b))));
}

//Event listener for keypress
function keyPress(event){
	if (event.key === 'a') {
		goToNextElement('a');
	}
	else if (event.key === 's') {
		goToNextElement('s');
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

		// Scroll up by the calculated amount
		window.scrollBy({
			top: -scrollAmount,
			behavior: 'smooth' // Smooth scrolling
		});
	}
	else if (event.key === 't') {
		//focus input element
		event.preventDefault();
		input.focus();
	}
	else if (event.key === 'g') {
		//toggle holdAns function
		holdAns = !holdAns
	}
	else if (event.key === 'N') {
		//save current element to bookmark
		localStorage.setItem('bookmark', currentIndex);
	}
	else if (event.key === 'B') {
		//go to saved element in bookmark
		for (let i of checkAdjacentElement(currentIndex)) {
			hiddenElements[i].classList.remove('current');
		}
		currentIndex = Number(localStorage.getItem('bookmark'));
		for (let i of checkAdjacentElement(currentIndex)) {
			hiddenElements[i].classList.add('current');
		}
	}
	else if (event.key === 'n') {
		saveToSaveIndex();
	}
	else if (event.key === 'b') {
		//check if saveIndex is empty > if empty do nothing
		if (saveIndex.size != 0){
			//check if current element is selected
			if (currentIndex != null) {
				for (let i of checkAdjacentElement(currentIndex)) {
					hiddenElements[i].classList.remove('current')
					if (!holdAns) hiddenElements[i].classList.remove('revealed')
				}
			}
			else {
				currentIndex = 0
			}

			//find nearest element that is in saveIndex
			adjacentIndex = checkAdjacentElement(nextSaveElement(saveIndex));
			for (let i of adjacentIndex) {
				hiddenElements[i].classList.add('current')
			}
			currentIndex = adjacentIndex[adjacentIndex.length - 1];
			scrollToElementVertically(hiddenElements[currentIndex]);
		}
	}
	else if (event.key === 'z') {
		shuffleTable();			
	}
	else if (event.key === 'h') {
		alert('A = go up\nS = go down\nD = reveal\nF = reveal all\nE = to select\nW = scroll down\nR = scroll up\nQ = toggle auto scroll\nT = focus on input\nG = hold reveal\nN = new bookmark\nB = go to bookmark');
	}

};

//add input element to document
function inputElement(){
	document.body.appendChild(input);
};

//detect mobile browser
function isMobile(){
	let agent = navigator.userAgent;
	return mobileBrowser.test(agent);
};

function main(){
	if (!isMobile()){
		document.addEventListener('DOMContentLoaded', findHiddenTextElements);
		document.addEventListener('keydown', keyPress);
		document.addEventListener('DOMContentLoaded', inputElement);

		//check if input element is click Enter
		input.addEventListener('keydown', inputKeyPress);

		//if focus on input element, don't listen to keypress
		input.addEventListener('focusin', function(){
			document.removeEventListener('keydown', keyPress);
		});

		//if not focus on input element, listen to keypress
		input.addEventListener('focusout', function(){
			document.addEventListener('keydown', keyPress);
		});
	}

	//add button if on mobile
	else if (isMobile()) {
		pdf = window.location.pathname.split("/").pop().replace('.html','.pdf')
		window.open(pdf, '_self');
	};
}

//run main
main()
