// Variable used to determine the time it takes to run the script.
// Basically, the variable's purpose is to start the "timer".
// At the end of the script, there should be another similar variable to stop the "timer".
let timerStart = performance.now();

// Variable that will store all the numbers, in correct order, of the sudoku to then be used by the FOR loop that creates the actual sudoku.
let sudoku = [];

// Sudoku is a grid 9x9 which means it will have 81 cells.
const sudokuLen = 81;

// Retrieves the table already coded in HTML to then add the elements inside it with JS.
// Coding 81 elements with HTML wouldn't be efficient.
const table = document.getElementById("table");

// When randomizing numbers, this array will store those who aren't fit for the current cell.
// If the variable gets all the 9 possible numbers, that means the cell will no longer be able to contain any number, and for such, 
// there's a condition to go back to the previous cell so the sudoku doesn't become invalid or the loop stuck.
let used = []; 

// This variable will store arrays containing elements retrieved from the sudoku array:
//	- At index 0, the number which used to be in a specific cell;
//	- At index 1, the index at which that number was located on (in the sudoku array).
// Certain elements inside this array will be undefined (they were DELETED, which doesn't mean they were actually deleted,
// they were replaced, the existing array was replaced for undefined).
// Those certain elements became undefined if, at a certain point, the cell index they were located on
// is bigger than the index of the cell currently being randomized.
// If no numbers are possible in a specific cell, the loop will go back cell by cell,
// until it finds one cell where there is another possible number to fill for the existing one.
// With a new number on a smaller cell index, new possibilities of numbers are formed from there on out, 
// making it possible that the following cells have a solution / another solution.
// Wouldn't make sense if it kept the numbers already used with a bigger index than the current index it is on
// since changing previous numbers affects the next cells to come, which means, the numbers once verified as an impossible fit, could now work.
let numsBefore = []; 

// This function will check if in the variable numsBefore, there are values which were already used in a certain cell index, and return them.
// Goal of the function is to make sure that the loop doesn't keep using the numbers which were already checked as non-solutions over and over,
// which can cause an infinite loop, meaning it won't finish the sudoku.
function numbersBefore(len){

	// Variable that will gather all the numbers previously checked as non-solutions of a specific index to then be returned.
	let answer = [];

	for(let i=0; i < numsBefore.length; i++){

		// Make sure that it checks to not be undefined, otherwise, it causes an error when trying to acess that undefined element like it was an array.
		if(numsBefore[i] !== undefined && numsBefore[i][1] === len){

			// Add the number to the variable answer to then be returned.
			answer.push(numsBefore[i][0]);
		}
	}

	return answer;
}

// Loop won't stop until the sudoku variable has the 81 elements (sudokuLen is supposed to equal 81) needed to make a sudoku
while(sudoku.length < sudokuLen){

	// Generates a random number between 1 and 9 (inclusive)
	let randNum = Math.floor(Math.random() * 9 + 1);

	// This algorithm will always equal to (0, 9, 18, 27, 36, 45, 54, 63, 72)
	let row = 9 * Math.floor(sudoku.length/9);

	// This algorithm will always equal to (0, 1, 2, 3, 4, 5, 6, 7, 8)
	let col = Math.floor(((sudoku.length / 9) % 1 ) * 10);

	// This algorithm will always equal to (0, 3, 6, 27, 30, 33, 54, 57, 60)
	let square = (3 * Math.floor(sudoku.length/3)) - (9 * Math.floor((sudoku.length - (27 * Math.floor(sudoku.length/27)))/9));		
	
	// This variable gathers all the numbers in the row, column and square of a certain cell
	let joined = sudoku.slice(row, row+9).concat(
				[sudoku[col], sudoku[9+col], sudoku[18+col], sudoku[27+col], sudoku[36+col], sudoku[45+col], sudoku[54+col], sudoku[63+col], sudoku[72+col]],
				sudoku.slice(square, square+3),sudoku.slice(square+9, square+12),sudoku.slice(square+18, square+21));


	// This will remove any arrays of numsBefore array that contain numbers used with bigger indexes than the current length of the sudoku.
	for(let j=0; j < numsBefore.length; j++){

		// Make sure the element isn't undefined, otherwise, it causes an error when trying to acess that undefined element like it was an array.
		// It "deletes" the elements of the array numsBefore which were previously marked as non-solutions and now have
		// bigger indexes than the current index of the cell being randomized. 
		// This could happen when the loop goes back to the previous cell after analyzing that the current cell doesn't have more possible numbers to fill.
		if(numsBefore[j] !== undefined && numsBefore[j][1] > sudoku.length){

			// This doesn't delete the element of the array, replaces it by undefined				
			delete numsBefore[j];
		}
	}

	// This is the main part of the loop, it will check all the information previously gather and then fill in the cells with the appropriate numbers.
	// First and foremost, it will check if the random number generated isn't included in the row / column / square of the cell and
	// it will check if that random number had previously been identified as a non-solution by the numbersBefore() function and make sure it isn't.
	if(!joined.includes(randNum) && !numbersBefore(sudoku.length).includes(randNum)){

		// Add the number to the sudoku array
		sudoku[sudoku.length] = randNum;

		// Reset the variable "used" so that the next cell can be properly analyzed without
		// being influenced by numbers marked as non-solutions of this current cell.
		used = [];
	} else {

		// Check if the variable "used" doesn't include the random number, it must only contain 9 different numbers (1-9 inclusive) inside.
		if(!used.includes(randNum)){

			// Add the number to the "used" array if it isn't already included.
			used.push(randNum);

			// This will only run if the used array has all the 9 possible numbers, which means, there aren't any other possible numbers to fill in.
			if(used.length === 9){

				// Reset the variable "used" since he's going to go back to the previous cell
				used = [];

				// Add an array containing the last number of the sudoku array, at index 0,
				// and at what index it was located on, at index 1.
				// The goal is to make sure the loop doesn't recognize the last number of the sudoku array as a solution once again
				// after he goes back to that cell
				numsBefore.push([sudoku[sudoku.length-1], sudoku.length-1]);

				// Remove the last element of the sudoku array which will cause the loop to go back to that cell
				sudoku.pop();
			}	
		}				
	}			
}

// Loop responsible to make the elements that will go inside of the table
for(let k=0; k < sudokuLen; k++){

	// Since sudoku is a 9x9 grid, there's only need for 9 rows
	if(k % 9 === 0){

		// Important to have the keyword "var" on this variable since the appending of the cell is depending on it.
		// If it had a keyword "let", the appending couldn't be done since it wouldn't be accessed because it's inside a condition.
		var tableRow = document.createElement("tr");

		// Append the child to the table.
		table.appendChild(tableRow);
	}

	// Creation of the element "td" or cell to then be added its value and appended to the last row
	let cell = document.createElement("td");

	// Styling the border so the game is more intuitive, in this case, styling the horizontal borders needed
	if(9 * Math.floor(k/9) === 27 || 9 * Math.floor(k/9) === 54){
		cell.style.borderTop = "thick solid #000";
	}

	// Styling the border so the game is more intuitive, in this case, styling the vertical borders needed
	if(Math.floor(((k/9) % 1 ) * 10) === 3 || Math.floor(((k/9) % 1 ) * 10) === 6){
		cell.style.borderLeft = "thick solid #000";
	}

	// Since sudoku variable already contains all the numbers in the correct order, we can asign the value of the cell to the respective number.
	cell.innerHTML = sudoku[k];

	// Append the cell to the row last created and not the table.
	tableRow.appendChild(cell);
}

// Variable used to determine the time it takes to run the script.
// Basically, the variable's purpose is to stop the "timer".
// At the beginning of the script, there is another similar variable to start the "timer".
let timerStop = performance.now();

// The difference between the 2 variables (timeStart and timeStop) is the amount of time it takes to run the script since
// they are located right when the script ends and starts, respectively.
console.log("It took " + Math.round(timerStop - timerStart) + " milliseconds to run the script.");