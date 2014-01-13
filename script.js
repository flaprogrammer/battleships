
var playerField = [];
var AIField = [];
var playerShips = [[]];
var AIShips = [[]];
var messages = document.getElementById("messages");
var placeShipGlobal;
placingPlayer();

function placingPlayer() {

	var currentSize = 0;
	var currentShip = 0;
	var currentShipSize = 4;
	placeShipGlobal = placeShip;
	makeField();
	
	function makeField() {
		for(var i = 0; i<10; i++) {
		playerField.push([]);
			for(var j = 0; j<10; j++) {
				var g = document.createElement("DIV");
				g.y = i;
				g.x = j;
				g.setAttribute('class','box sea');
				g.setAttribute('style','top:'+(i*30)+'px; left:'+(j*30)+'px;');
				document.getElementById("playerField").appendChild(g);
				playerField[i].push(g);
			}
		}
		startPlacing();
	}

	function startPlacing() {
		for(var i = 0; i<10; i++) {
			for(var j = 0; j<10; j++) {
				playerField[i][j].setAttribute('onClick','placeShipGlobal(this)');
			}
		}
		messages.innerHTML = "Put your "+currentShipSize+" sized ship";
	}

	function placeShip(box) {
		if(currentSize==0&&checkPlacingPossibility()) {
			box.setAttribute('class','box current_shipped');
			box.shipped = true;
			currentSize++;
		}
		else {
			if(checkPlacingPossibility()&&checkTouching()) {
				box.setAttribute('class', 'box current_shipped');
				box.shipped = true;
				currentSize++;
			}
		}
		
		if(currentSize==currentShipSize) {
			for(var i = 0; i<10; i++) {
				for(var j = 0; j<10; j++) {
					if(playerField[i][j].getAttribute('class')=='box current_shipped') {
						playerField[i][j].setAttribute('class', 'box shipped');
						playerShips[playerShips.length-1].push(playerField[i][j]);
					}
				}
			}
			
			currentShip+=1;
			if(currentShip+currentShipSize==5) {
				currentShipSize -= 1;
				currentShip = 0;
				if(currentShipSize==0) {
					placingAI();
					return;
				}
			}
			playerShips.push([]);
			currentSize = 0;
			messages.innerHTML = "Put your "+currentShipSize+"-decker ship";
		}
		
		function checkPlacingPossibility() {
			//check if it shipped already
			if(playerField[box.y][box.x].getAttribute('class')=="box shipped"
			||playerField[box.y][box.x].getAttribute('class')=="box current_shipped")
				return false;
			
			// check if it touch another ships
			if(box.y>0) {
				if(playerField[box.y-1][box.x].getAttribute('class')=="box shipped")
					return false;
			}
			if(box.y<9) {
				if(playerField[box.y+1][box.x].getAttribute('class')=="box shipped")
					return false;
			}
			if(box.x>0) {
				if(playerField[box.y][box.x-1].getAttribute('class')=="box shipped")
					return false;
			}
			if(box.x<9) {
				if(playerField[box.y][box.x+1].getAttribute('class')=="box shipped")
					return false;
			}
			if(box.y>0&&box.x>0) {
				if(playerField[box.y-1][box.x-1].getAttribute('class')=="box shipped")
					return false;
			}
			if(box.y>0&&box.x<9) {
				if(playerField[box.y-1][box.x+1].getAttribute('class')=="box shipped")
					return false;
			}
			if(box.y<9&&box.x<9) {
				if(playerField[box.y+1][box.x+1].getAttribute('class')=="box shipped")
					return false;
			}
			if(box.y<9&&box.x>0) {
				if(playerField[box.y+1][box.x-1].getAttribute('class')=="box shipped")
					return false;
			}
			return true;
		}
		
		function checkTouching() {
			//check if it touch current ship
			if(box.x<9) {
				if(playerField[box.y][box.x+1].getAttribute('class')=="box current_shipped") {
					return true;
				}
			}
			if(box.x>0) {
				if(playerField[box.y][box.x-1].getAttribute('class')=="box current_shipped") {
					return true;
				}
			}
			if(box.y<9) {
				if(playerField[box.y+1][box.x].getAttribute('class')=="box current_shipped") {
					return true;
				}
			}
			if(box.y>0) {
				if(playerField[box.y-1][box.x].getAttribute('class')=="box current_shipped") {
					return true;
				}
			}
			return false;
		}
	}
}

function placingAI() {
	messages.innerHTML = "Game is started!";
	var currentShipSize = 4;
	var shipsNum = 0;
	
	for(var i=0;i<10;i++) {
		for(var j=0; j<10; j++) {
			playerField[i][j].setAttribute('onClick',"");
		}
	}
	
	makeField();
	
	function makeField() {
		for(var i = 0; i<10; i++) {
		AIField.push([]);
			for(var j = 0; j<10; j++) {
				var g = document.createElement("DIV");
				g.y = i;
				g.x = j;
				g.setAttribute('class','box sea');
				g.setAttribute('style','top:'+(i*30)+'px; left:'+(j*30+400)+'px;');
				document.getElementById("AIField").appendChild(g);
				AIField[i].push(g);
			}
		}
		placeShips();
	}
	
	function placeShips() {
		//console.log(currentShipSize);
		var orientation,theX,theY;
		do {
			orientation = Math.floor(Math.random()*2);
			theX = Math.floor(Math.random()*(10-(currentShipSize-1)*(1-orientation)));
			theY = Math.floor(Math.random()*(10-(currentShipSize-1)*(orientation)));
		}
		while (!checkAll());
		
		if(orientation==1) { //if vertical
			for(var i=0; i<currentShipSize; i++) {
				AIField[theY+i][theX].shipped = true;
				AIShips[AIShips.length-1].push(AIField[theY+i][theX]);
			}
		}
		else {
			for(var i=0; i<currentShipSize; i++) {
				AIField[theY][theX+i].shipped = true;
				AIShips[AIShips.length-1].push(AIField[theY][theX+i]);
			}
		}
		
		shipsNum++;
		if(shipsNum+currentShipSize==5) {
			currentShipSize--;
			shipsNum = 0;
		}
		if(currentShipSize!=0){
			AIShips.push([]);
			placeShips();
		}
			
		else 
			startBattle();
	
		function checkAll() {
			if(orientation==1) {
				for(var i=0; i<currentShipSize; i++) {
					if(!checkIfTouch((theY+i),theX))
						return false;
				}
			}
			else {
				for(var i=0; i<currentShipSize; i++) {
					if(!checkIfTouch(theY,(theX+i))) {
						return false;
					}
				}
			}
			return true;
		}
	}
	
	function checkIfTouch(y,x) {
		if(AIField[y][x].shipped)
			return false;
		if(y>0) {
			if(AIField[y-1][x].shipped)
				return false;
		}
		if(y<9) {
			if(AIField[y+1][x].shipped)
				return false;
		}
		if(x>0) {
			if(AIField[y][x-1].shipped)
				return false;
		}
		if(x<9) {
			if(AIField[y][x+1].shipped)
				return false;
		}
		if(y>0&&x>0) {
			if(AIField[y-1][x-1].shipped)
				return false;
		}
		if(y>0&&x<9) {
			if(AIField[y-1][x+1].shipped)
				return false;
		}
		if(y<9&&x<9) {
			if(AIField[y+1][x+1].shipped)
				return false;
		}
		if(y<9&&x>0) {
			if(AIField[y+1][x-1].shipped)
				return false;
		}
		return true;
	}
	
}

function startBattle() {
	var turn = true;
	var AIListeners = [];
	for(var i=0;i<10;i++) {
		AIListeners.push([]);
		for(var j=0; j<10; j++) {
			AIListeners[i].push(true);
		}
	}
	var injuredShip;
	var injuredShip2;
	
	var turnsToInjured = []; // array of boxes, where can be injured ship

	playerTurn();
	
	function playerTurn() {
		for(var i=0;i<10;i++) {
			for(var j=0; j<10; j++) {
				if(AIListeners[i][j]) {
					AIField[i][j].onclick = playerShoot;
				}
			}
		}
		messages.innerHTML = "Your turn!"
	}
		
		function playerShoot() {
			var killed = true; 
			this.shooted = true;
			this.onclick = null;

			if(this.shipped) {
				this.setAttribute('class','box injured');
				for(var i=0;i<AIShips.length;i++) {
					if(AIShips[i].indexOf(this)!=-1) {
						injuredShip = i;
						break;
					}
				}
				for(var i=0; i<AIShips[injuredShip].length; i++) {
					if(!AIShips[injuredShip][i].shooted)
						killed = false;
				}
				if(killed) {
					for(var i=0; i<AIShips[injuredShip].length; i++) {
						AIShips[injuredShip][i].setAttribute('class','box killed');
					}
					AIShips.splice(injuredShip,1);
					if(AIShips.length==0) {
						endGame(true);
					}
				}
			}
			else  {
				this.setAttribute('class','box dotted');
				AITurn();
			}
		}
	
	function AITurn() {
		var x,y;
		messages.innerHTML = "Wait!"
		for(var i=0;i<10;i++) {
			for(var j=0; j<10; j++) {
				if(AIField[i][j].onclick!=null) 
					AIListeners[i][j] = true;
				else {
					AIListeners[i][j] = false;
					}
				AIField[i][j].setAttribute('onClick',"");
			}
		}
		
		if(turnsToInjured.length==0) {
			do {
				x = Math.floor(Math.random()*10);
				y = Math.floor(Math.random()*10);
			}
			while(playerField[y][x].shooted);
		}
		else {
			var k = Math.floor(Math.random()*turnsToInjured.length);
			x = turnsToInjured[k].x;
			y = turnsToInjured[k].y;
			turnsToInjured.splice(k,1);
		}
		setTimeout(shoot,1000);
		
		function shoot() {
			var killed = true; 
			box = playerField[y][x];
			box.shooted = true;
			if(box.shipped) {
				box.setAttribute('class','box injured');
				if(y<9)
					if(!playerField[y+1][x].shooted&&turnsToInjured.indexOf(playerField[y+1][x])==-1)
						turnsToInjured.push(playerField[y+1][x]);
				if(x<9)
					if(!playerField[y][x+1].shooted&&turnsToInjured.indexOf(playerField[y][x+1])==-1)
						turnsToInjured.push(playerField[y][x+1]);
				if(y>0)
					if(!playerField[y-1][x].shooted&&turnsToInjured.indexOf(playerField[y-1][x])==-1)
						turnsToInjured.push(playerField[y-1][x]);
				if(x>0)
					if(!playerField[y][x-1].shooted&&turnsToInjured.indexOf(playerField[y][x-1])==-1)
						turnsToInjured.push(playerField[y][x-1]);
						
				for(var i=0;i<playerShips.length;i++) {
					if(playerShips[i].indexOf(box)!=-1) {
						injuredShip2 = i;
						break;
					}
				}
				for(var i=0; i<playerShips[injuredShip2].length; i++) {
					if(!playerShips[injuredShip2][i].shooted)
						killed = false;
				}
				if(killed) {
					for(var i=0; i<playerShips[injuredShip2].length; i++) {
						playerShips[injuredShip2][i].setAttribute('class','box killed');
						dotNearestBoxes(playerShips[injuredShip2][i].y,playerShips[injuredShip2][i].x);
					}
					turnsToInjured = [];
					playerShips.splice(injuredShip2,1);
					//console.log("Len = "+playerShips.length);
					if(playerShips.length==0) {
						endGame(false);
					}
				}
				AITurn();
			}
			else  {
				box.setAttribute('class','box dotted');
				playerTurn();
			}
		}
		
		function dotNearestBoxes(y,x) {
			if(y>0) playerField[y-1][x].shooted = true;
				
			if(y<9) playerField[y+1][x].shooted = true;

			if(x>0) playerField[y][x-1].shooted = true;

			if(x<9) playerField[y][x+1].shooted = true;

			if(y>0&&x>0) playerField[y-1][x-1].shooted = true;

			if(y>0&&x<9) playerField[y-1][x+1].shooted = true;

			if(y<9&&x<9) playerField[y+1][x+1].shooted = true;

			if(y<9&&x>0) playerField[y+1][x-1].shooted = true;

		}
	}	
	
	function endGame(playerWin) {
		if(playerWin) {
			messages.innerHTML = "YOU WIN!!!";
		}
		else {
			messages.innerHTML = "YOU LOSE =(";
		}
		for(var i=0;i<10;i++) {
			for(var j=0; j<10; j++) {
				AIField[i][j].setAttribute('onClick',"");
			}
		}
	}	
	

}
	