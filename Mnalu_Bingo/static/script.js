let auto

let board=document.getElementById("board")

for(let i=1;i<=75;i++){

let letter=""

if(i<=15)letter="B"
else if(i<=30)letter="I"
else if(i<=45)letter="N"
else if(i<=60)letter="G"
else letter="O"

let div=document.createElement("div")

div.className="cell"
div.id="n"+i
div.innerText=letter+i

board.appendChild(div)

}

function draw(){

fetch("/draw")
.then(r=>r.json())
.then(data=>{

document.getElementById("current").innerText=data.number

let cell=document.getElementById("n"+data.value)

if(cell)cell.classList.add("called")

speak(data.number)

})

}

function autoStart(){

auto=setInterval(draw,3000)

}

function stopAuto(){

clearInterval(auto)

}

function resetGame(){

fetch("/reset").then(()=>location.reload())

}

function speak(text){

let speech=new SpeechSynthesisUtterance(text)

speech.rate=0.9

speechSynthesis.speak(speech)

}