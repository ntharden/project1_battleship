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
			name: 'cruiser',
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
			name: 'destroyer',
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

	// rotate the ships
	function rotate() {
		if (isHorizontal) {
			// will toggle all ships to vertical container if rotate() is called and isHorizontal = true
			destroyer.classList.toggle('cruiser-container-vertical')
			submarine.classList.toggle('submarine-container-vertical')
			cruiser.classList.toggle('destroyer-container-vertical')
			battleship.classList.toggle('battleship-container-vertical')
			carrier.classList.toggle('carrier-container-vertical')
			isHorizontal = false // ships are now vertical
			// console.log(isHorizontal)
			return
		} 
		if (!isHorizontal) {
			destroyer.classList.toggle('cruiser-container-vertical')
			submarine.classList.toggle('submarine-container-vertical')
			cruiser.classList.toggle('destroyer-container-vertical')
			battleship.classList.toggle('battleship-container-vertical')
			carrier.classList.toggle('carrier-container-vertical')
			isHorizontal = true
			// console.log(isHorizontal)
			return
		}
	}
	rotateButton.addEventListener('click', rotate) // allows button to click and run function

	// move around user ship
	ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
	userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
	userSquares.forEach(square => square.addEventListener('dragover', dragOver))
	userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
	userSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
	userSquares.forEach(square => square.addEventListener('drop', dragDrop))
	userSquares.forEach(square => square.addEventListener('dragend', dragEnd))

	let selectedShipNameWithIndex
	let draggedShip
	let draggedShipLength




	ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
		selectedShipNameWithIndex = e.target.id
	}))

	function dragStart() {
		draggedShip = this
		draggedShipLength = this.childNodes.length
	}
	function dragOver(e) {
		e.preventDefault()
	}
	function dragEnter(e) {
		e.preventDefault()
	}
	function dragLeave(e) {
		e.preventDefault()
	}
	function dragDrop() {
		let shipNameWithLastId = draggedShip.lastChild.id
		let shipClass = shipNameWithLastId.slice(0, -2)
		let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
		let shipLastId = lastShipIndex + parseInt(this.dataset.id)
		const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,12,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93] // prevents ships from being dropped in squares that will make ship spill over
		const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60] // prevents ships from being dropped in squares that will make ship spill over

		let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
		let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)

		selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))

		shipLastId = shipLastId - selectedShipIndex

		if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
			for (let i = 0; i < draggedShipLength; i++) {
				userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass)
			}
		} else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
			for (let i = 0; i < draggedShipLength; i++) {
				userSquares[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('taken', shipClass)
			}
		} else return

		displayGrid.removeChild(draggedShip)

	}
	function dragEnd() {
		
	}

	// Game Logic
	function playGame() {
		if (isGameOver) return
		checkForWins() // function that will look for sunk ships
		if (currentPlayer === 'user') {
			turnDisplay.innerHTML = 'Your Turn'
			computerSquares.forEach(square => square.addEventListener('click', function(e) {
				revealSquare(square) // will run a function for user to click on a square and reveal whether it is a ship or not
			}))
		}
		if (currentPlayer === 'computer') {
			turnDisplay.innerHTML = 'Computers Turn'
			setTimeout (computerGo, 1000) // pause before computer's turn
		}
	}
	startButton.addEventListener('click', playGame) // once start button is pushed, play game will run

	let cruiserCount = 0
	let submarineCount = 0
	let destroyerCount = 0
	let battleshipCount = 0
	let carrierCount = 0

	function revealSquare(square) {
		if (!square.classList.contains('boom')){
			// keeps count of whether ships have been hit
			if (square.classList.contains('cruiser')) destroyerCount++
			if (square.classList.contains('submarine')) submarineCount++
			if (square.classList.contains('destroyer')) cruiserCount++
			if (square.classList.contains('battleship')) battleshipCount++
			if (square.classList.contains('carrier')) carrierCount++
		}
		if (square.classList.contains('taken')) {
			square.classList.add('boom') // if ship is on square, gives class of boom to square
		} else {
			square.classList.add('miss') // otherwise miss is given
		}
		currentPlayer = 'computer'
		playGame() // restart game function
	}

	let cpuCruiserCount = 0
	let cpuSubmarineCount = 0
	let cpuDestroyerCount = 0
	let cpuBattleshipCount = 0
	let cpuCarrierCount = 0


	function computerGo() {
		let random = Math.floor(Math.random() * userSquares.length) // creates random integer that will allow computer to randomly attack a square on the board
		if (!userSquares[random].classList.contains('boom')) {
			if (userSquares[random].classList.contains('cruiser')) cpuCruiserCount++
			if (userSquares[random].classList.contains('submarine')) cpuSubmarineCount++
			if (userSquares[random].classList.contains('destroyer')) cpuDestroyerCount++
			if (userSquares[random].classList.contains('battleship')) cpuBattleshipCount++
			if (userSquares[random].classList.contains('carrier')) cpuCarrierCount++
		} // else computerGo()
		if (userSquares[random].classList.contains('taken')) {
			userSquares[random].classList.add('boom')
		} else {
			userSquares[random].classList.add('miss')
		}	
		console.log(random)
	currentPlayer = 'user'
	turnDisplay.innerHTML = 'Your Turn'
		}

	function checkForWins() { // will alert for sunk ships and whether game is won
		if (destroyerCount === 2) {
			window.alert('You sunk the computers destroyer')
			destroyerCount = 10
		}
		if (submarineCount === 3) {
			window.alert('You sunk sthe computers submarine')
			submarineCount = 10
		}
		if (cruiserCount === 3) {
			window.alert('You sunk the computers cruiser')
			cruiserCount = 10
		}
		if (battleshipCount === 4) {
			window.alert('You sunk the computers battleship')
			battleshipCount = 10
		}
		if (carrierCount === 5) {
			window.alert('You sunk the computers carrier')
			carrierCount = 10
		}
		if (cpuDestroyerCount === 2) {
			window.alert('The computer sunk your destroyer')
			cpuDestroyerCount = 10
		}
		if (cpuSubmarineCount === 3) {
			window.alert('The computer sunk your submarine')
			cpuSubmarineCount = 10
		}
		if (cpuCruiserCount === 3) {
			window.alert('The computer sunk your cruiser')
			cpuCruiserCount = 10
		}
		if (cpuBattleshipCount === 4) {
			window.alert('The computer sunk your battleship')
			cpuBattleshipCount = 10
		}
		if (cpuCarrierCount === 5) {
			window.alert('The computer sunk your carrier')
			cpuCarrierCount = 10
		}
		if ((destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount) === 50) {
			window.alert("You Win!")
			gameOver()
		}
		if ((cpuDestroyerCount + cpuSubmarineCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount) === 50) {
			window.alert("Computer Wins")
			gameOver()
		}
	}
	function gameOver() {
		isGameOver = true
		startButton.removeEventListener('click', playGame)
	}

})






