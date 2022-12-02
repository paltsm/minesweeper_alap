const BOARD=document.createElement("table")
BOARD.setAttribute("id","board")
BOARD.setAttribute("oncontextmenu","event.preventDefault()")

const TEXT=document.createElement("div")
TEXT.setAttribute("id","mine_number")
let mine_number=0
const BACK=document.createElement("button")

const LOST=document.createElement("div")
LOST.setAttribute("id","bitch")
LOST.style.position="absolute"
LOST.style.top="7rem"
LOST.style.backgroundColor="transparent"



let mine_positions=[]
let adjacent_positions=[]

function Board(size, mines){
	for(let i=1;i<=size*size;i++){
		adjacent_positions[i]=0
	}
	mine_number=mines
	Mines(size, mines) //creates an array where mines are
	
	document.body.appendChild(TEXT)
	document.getElementById("mine_number").innerText=mines

	document.body.appendChild(BOARD) //create the table

	for (let i = 0; i < size; i++) { //row

		const ROW=document.createElement("tr")
		ROW.setAttribute("id","row"+i)
		document.getElementById("board").appendChild(ROW) //create the row

		for (let j = 1; j <= size; j++) { //td
			let id_number=i*size+j
			
			const TD=document.createElement("td")
			TD.setAttribute("id",id_number)
			TD.setAttribute("onclick","play("+id_number+", "+size+")")
			TD.setAttribute("oncontextmenu","event.preventDefault();Mark("+id_number+", "+size+")")//right click no context menu and function

			if (mine_positions.includes(id_number)) {//check the tiles around the mine to give them numbers
				for (let k = id_number-size; k <= id_number+size; k+=size) {//going through rows
					for (let l = k-1; l <= k+1; l++) {//look around it
						if(l>0 && l<(size*size)+1 && mine_positions.includes(l)==false) {//its on the table and not a mine
							if ((id_number%size==0 && l>k) || (id_number%size==1 && l<k)){

							}
							else{
								adjacent_positions[l]+=1
							}
						}
					}
				}				
			}

			document.getElementById("row"+i).appendChild(TD) //create td
		}
	}

	BACK.innerHTML="back"
	BACK.setAttribute("id","back")
	BACK.setAttribute("onclick","Back()")
	document.body.appendChild(BACK)
	
	
	document.getElementById("button1").remove()
	document.getElementById("button2").remove()
	document.getElementById("button3").remove()


}


function Mines(size, mines){
	while (mine_positions.length<mines) {
		let mine=Math.floor(Math.random()*(size*size)+1)
		if (!mine_positions.includes(mine)) {
			mine_positions.push(mine)
		}
	}
	mine_positions.sort(function(a,b){return a-b})
}


function Mark(id_number, size){
	let tile=document.getElementById(id_number)

	if (tile.style.backgroundColor=='yellow') {//if its alredy marked then unmark it
		tile.removeAttribute("style")//remove the yellow color and this way we get the hover effect back(it is in the css file but inline css blocks it)
		tile.setAttribute("onclick","play("+id_number+", "+size+")")//put back so you can click on it
		mine_number+=1
		document.getElementById("mine_number").innerText=mine_number
	}
	else if(window.getComputedStyle(tile).getPropertyValue("background-color")!='rgb(80, 80, 80)'){//if its a mine or has alredy been clicked
		// console.log(window.getComputedStyle(tile).getPropertyValue("background-color"))//only way to find external background color. this is actually the hover color
	}
	else {//mark it
		tile.style.backgroundColor='yellow'
		tile.removeAttribute("onclick")//remove it so you cant click a marked tile
		mine_number-=1
		document.getElementById("mine_number").innerText=mine_number

	}
}


function play(id_number, size){//when you click on a tile
	let tile=document.getElementById(id_number)

	if (mine_positions.includes(id_number)) {//if its a mine
		tile.style.backgroundColor="red"
		for(let i=1;i<=size*size;i++){
			let tile=document.getElementById(i)
			tile.removeAttribute("onclick")
		}
		tile.removeAttribute("onclick")
		mine_number-=1
		document.getElementById("mine_number").innerText=mine_number
		// LOST.style.width=String(2*size+0.125*size+1)+"rem"
		// LOST.style.height=String(2*size+0.125*size+1)+"rem"
		// document.body.appendChild(LOST)
//4ioaojiaiioasdfosddoasijadosjoadsfjdoasijdiosjfdoasjasodfjdsoafjasdfjkljdlasjflaskfjsdflkjdljlajfldfjlasfjlkdjflksjfldskjfljflkasjlasjkglsajglkjflkjglkjfldjkfldkfjgldfjgdlfgjkdflkgjdfljlkdjfljdlvjlvkjlvjdlvjdvldjfldjvldfjvdflvjdljfldjkldfjgldgjlvkjdlvjkdflkjdlbjdlfbjdlbjdlfbjdlbkjdfljvkdjlvjflvjdlvjfdlvjdlfkvjdlbjdlbjdlfbjdlbjdlbjdlbjdlfjldgjodgijdfbjdlkfjlibjdfoigj
	}
	else{
		tile.style.backgroundColor="rgb(48, 48, 48)"
		tile.removeAttribute("onclick")
		if(adjacent_positions[id_number]!=0){
			tile.textContent=adjacent_positions[id_number]
		}
		else{
			Reveal(tile, id_number, size)
		}
	}
	
}


function Reveal(tile, id_number, size){
	for (let k = id_number-size; k <= id_number+size; k+=size) {//going through rows
		for (let l = k-1; l <= k+1; l++) {//look around it
			let adjacent=document.getElementById(l)
			if(l>0 && l<(size*size)+1 && mine_positions.includes(l)==false && window.getComputedStyle(adjacent).getPropertyValue("background-color")!='rgb(48, 48, 48)') {//its on the table
				if ((id_number%size==0 && l>k) || (id_number%size==1 && l<k)){
				}
				else{
					adjacent.click()
					
				}
				
			}
		}
	}
}

function Back(){
	window.location.reload()
}