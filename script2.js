const BOARD = document.createElement("table")
BOARD.setAttribute("id", "board")
BOARD.setAttribute("oncontextmenu", "event.preventDefault()")

const BACK = document.createElement("button")
BACK.innerHTML = "back"
BACK.setAttribute("id", "back")
BACK.setAttribute("onclick", "window.location.reload()")

havestarted = false
haveended = false
revealed = 0
let SIZE = 0
let DIF = 0
// i could probably make a custom size input, so any size can be put in

// stop being able to click on tiles after win or lose

// have restart button and back button

function Init(size) {
	let dif = Number(document.getElementById("difslide").value)
	Board(size, dif)
	SIZE = size
	DIF = dif
}

function Board(size, dif) {

	document.body.appendChild(BACK)
	document.body.appendChild(BOARD)
	document.getElementById("button1").remove()
	document.getElementById("button2").remove()
	document.getElementById("button3").remove()
	document.getElementById("difslide").remove()

	for (let i = 0; i < size; i++) {
		const ROW = document.createElement("tr")
		ROW.setAttribute("id", "row" + i)
		document.getElementById("board").appendChild(ROW)
		for (let j = 0; j < size; j++) {
			const TD = document.createElement("td")
			TD.setAttribute("id", (i * size + j))
			TD.addEventListener("click", () => Play(i * size + j))
			TD.addEventListener("dblclick",()=>Play2(i * size + j))
			TD.addEventListener("contextmenu", () => {
				if (!TD.classList.contains("clicked")) {
					TD.textContent = TD.textContent == "🚩" ? "" : "🚩"
				}
			})
			ROW.appendChild(TD)
		}

	}

}

function Play2(id){
	const TILE = document.getElementById(id)
	if(TILE.classList.contains("clicked")){
		adjacent=Adjacent(id)
		tagged=0
		adjacent.filter(x=>{
			if(document.getElementById(x).textContent=="🚩"){
				tagged++
			}
		})
		if(Number(TILE.textContent)==tagged){
			adjacent.filter(x=>{
				Play(x)
			})
		}
	}
}

function Play(id) {
	if (haveended == true) {
		return
	}
	if (havestarted == false) {
		havestarted = true
		mines = Mines(SIZE, DIF, id)
		console.log(mines)
	}
	const TILE = document.getElementById(id)
	if (TILE.classList.contains("clicked") || TILE.textContent == "🚩") { return }
	if (mines.includes(id)) {
		TILE.classList.add("mine")
		haveended = true
		Revealmines(mines)
		alert("bitch")
		return
	}
	TILE.classList.add("clicked")
	TILE.addEventListener("contextmenu", () => { return })
	revealed++
	if (revealed == (SIZE * SIZE - mines.length)) {
		alert("YOU WIN")
		//I SHOULD REPLACE THIS WITH A POPUP 
		// THAT SHOWS UP 1 SECOND AFTER CLICKING 
		// AND THERE IS ANIMATION OF THE FLAGS JUMPING
	}

	let adjacent = Adjacent(id)
	let minecount=adjacent.filter(x=> mines.includes(x)).length
	if (minecount != 0) {
		TILE.textContent = minecount
	}
	else {
		adjacent.forEach(Play)
	}

}

function Adjacent(id){
	let adjacent = []
	for (let row = id - SIZE; row <= id + SIZE; row += SIZE) {
		for (let adj = row - 1; adj <= row + 1; adj++) {
			if ((id % SIZE == 0 && adj < row) || (id % SIZE == SIZE - 1 && row < adj)) {
				continue
			}
			if (row >= 0 && row < SIZE * SIZE && adj >= 0 && adj < SIZE * SIZE && adj != id) {
				adjacent.push(adj)
			}
		}

	}
	return adjacent
}

function Mines(size, dif, id) {
	let diff = [0.125, 0.1875, 0.25]
	let mines = []
	while (mines.length < size * size * diff[dif - 1]) {
		let mine = Math.floor(Math.random() * (size * size))
		if (mine != id && !mines.includes(mine)) {
			mines.push(mine)
		}
	}
	return mines
}

function Revealmines(mines) {
	for (let i = 0; i < mines.length; i++) {
		document.getElementById(mines[i]).classList.add("mine")
	}
}