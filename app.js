document.addEventListener('DOMContentLoaded', () =>{ // gives ability to use DOM on the document from here on out
	const userGrid = document.querySelector('.grid-user') // easier way to call grid-user
	const computerGrid = document.querySelector('.grid-computer') // easier way to call grid-computer
	const displayGrid = document.querySelector('.grid-display') // easier way to call grid-display
	const ships = document.querySelectorAll('.ship') // allows all ships to be edited at once
	const cruiser = document.querySelector('.cruiser-container') // allows all cruisers to be edited at once
	const submarine = document.querySelector('.submarine-container') // allows all submarines to be edited at once
	const destroyer = document.querySelector('.destroyer-container') // allows all destroyers to be edited at once
	const battleship = document.querySelector('.battleship-container') // allows all battleships to be edited at once
	const carrier = document.querySelector('.carrier-container') // allows all carriers to be edited at once
	const startButton = document.querySelector('#start') // once clicked, will initialize the game
	const rotateButton = document.querySelector('#rotate') // button that allows user to rotate ships during placement
	const turnDisplay = document.querySelector('#whose-turn') // allows turn botton to change values between user and computer
	const userSquares = [] // this array holds the values of all user squares
	const computerSquares = [] // this array holds the values of all computer squares
	let isHorizontal = true // ships will start horizontally
	let isGameOver = false // will remain false as long as game is winnable
	let currentPlayer = "user" // user always starts

	const width = 10 // 10 units across for board

	// Create Board
	function createBoard(grid, squares) {
		for (let i = 0; i < width * width; i++) { // loop will run from 0-99
			const square = document.createElement('div') // creating a div called square for every iteration
			square.dataset.id = i // giving an html id of the array number for every div
			grid.appendChild(square) // attaching square div to whatever is inputed for grid
			squares.push(square) // pushing square to whatever is inputed for squares
		}
	}
	createBoard(userGrid, userSquares) // creates grid of 100 squares and array from 0-99
	createBoard(computerGrid, computerSquares) // creates grid of 100 squares and array from 0-99

	// Ships
	const shipArray = [ // creates array of objects called shipArray
		{
			name: 'destroyer',
			directions: [
				[0, 1], // gives left-right orientation by taking two squares next to each other
				[0, width] // gives up-down orientation by taking two squares on top of each other
			]
		},
		{
			name: 'submarine',
			directions: [
				[0, 1, 2],
				[0, width, width*2]
			]
		},
		{
			name: 'cruiser',
			directions: [
				[0, 1, 2],
				[0, width, width*2]
			]
		},
		{
			name: 'battleship',
			directions: [
				[0, 1, 2, 3],
				[0, width, width*2, width*3]
			]
		},
		{
			name: 'carrier',
			directions: [
				[0, 1, 2, 3, 4], // left-right would take up squares 0-4 on the grid
				[0, width, width*2, width*3, width*4] // up-down would take up squares 0, 10, 20, 30, 40 on the grid
			]
		}
	]

	// Draw the computer's ships in random locations
	function generate(ship) {
		let randomDirection = Math.floor(Math.random() * ship.directions.length) // generates a number 0-1
		let current = ship.directions[randomDirection] // makes current equal left-right or up-down direction
		if (randomDirection === 0) direction = 1
		if (randomDirection === 1) direction = 10
		let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction))) // gives random starting point for ship
	
		const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken')) // will prevent ships from overlapping each other
		const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1)
		const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)

		if (!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => computerSquares[randomStart + index].classList.add('taken', ship.name))

		else generate(ship) // will rerun code until all ships are properly placed on the board
	}

	generate(shipArray[0])
	generate(shipArray[1])
	generate(shipArray[2])
	generate(shipArray[3])
	generate(shipArray[4])






