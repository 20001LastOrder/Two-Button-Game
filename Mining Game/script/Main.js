var canvas;
var Context;
var numOfCoins = 10;
var coin = new Image();
var arrow = new Image();
var ground = new Image();
var coins = [];
var player;
var playerImg = new Image();
//for mouse control to debug
var mouseX, mouseY;
//constants
const GROUND_HEIGHT = 200;
const PLAYER_FRAMES = 6;
const PLAY_Y = 100;
const EMPTY_SPACE_HEIGHT = 50;

//load resorces
coin.src = "img/sprite/coin.png";
arrow.src = "img/sprite/Arrow.png";
ground.src = "img/BG/mine.png";
playerImg.src = "img/sprite/Player1.png";

window.onload = function(){
	startGame();
	canvas.addEventListener('mousemove', updateMousePos);
	document.addEventListener('keydown', characterControl);
	var framePerSecond = 30;
	setInterval(function(){
		update();
		drawGame();
		//function to detecting the mouse movement for debugging
		
		/*sprite.render(0,0);
		sprite.update();
		water.update();
		if(water.frameIndex <= 20 && water.frameIndex >=1){
			water.render(100,100);
		}*/
	}, 1000/framePerSecond);
};

var updateMousePos = function(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;

};

var characterControl = function(event){
	if(event.keyCode == 83){
		moveGrab();
	}
};

var update = function(){
	updatePlayer();

};

//Draw game contnt
var drawGame = function(){
	drawBackground();
	drawCollectableObjects();
	drawPlayer(player, 300,50);
	context.fillStyle = "red";
	context.font="30px Verdana";
	context.fillText("(" + mouseX + " ," + mouseY + ")", mouseX,mouseY);	
};

//start game (call once only)
var startGame = function(){
	canvas = document.getElementById('gameCanvas');
	context = canvas.getContext('2d');

	while(coins.length < numOfCoins){
		spawnCoin();
	}

	player = initiatePlayer(canvas.width/2 - playerImg.width/(2*PLAYER_FRAMES),PLAY_Y);
};

var spawnCoin = function(){
	coinId = coins.length;
	var coinSprite = new Sprite(context, 1000,100,coin,10);
	coinSprite.scaleRatio = (Math.random()*0.5) + 0.5;
	//Reset the position when the coin is overlap with another coin
	//find a random point only within the range of the restricted area
	var hasOverlapWithOtherCoin = false;
	do{
		hasOverlapWithOtherCoin = false;
		var x = Math.random() * (canvas.width - coinSprite.getFrameWidth());
		var y = (Math.random() * (canvas.height - GROUND_HEIGHT -EMPTY_SPACE_HEIGHT - coinSprite.getFrameHeight())) + GROUND_HEIGHT+50;
		coinSprite.x = x;
		coinSprite.y = y;
		for(var i = 0; i < coins.length; i++){
			if(coinSprite.isOverlap(coins[i].sprite)){
				hasOverlapWithOtherCoin = true;
			}
		}
	}while(hasOverlapWithOtherCoin);
	coins[coinId] = new Collectable(coinSprite, Math.round(100*coinSprite.scaleRatio));
	coinSprite.render(); 

};

var drawBackground = function(){
	context.clearRect(0,0,canvas.width,canvas.height);
	context.fillStyle = 'black';
	context.fillRect(0,0,canvas.width,canvas.height);
	context.drawImage(ground, 0,0, canvas.width, GROUND_HEIGHT);
}; //end drawBackGround

var drawCollectableObjects = function(){
	for(var i = 0; i < coins.length; i++){
		coins[i].sprite.animation(true);
	}
}; //end drawCollectableObjects

var drawPlayer = function(player, x, y){
	player.sprite.animation(true);
	//rotate and draw the grab
	player.grab.rotate(player.grabRotation, player.grab.x, player.grab.y );
	if(player.grabRotation >= Math.PI/3){
			player.rotationSpeed *= -1;
	}else if(player.grabRotation <= -Math.PI/3){
		player.rotationSpeed *= -1;
	} //end changeRotation
	player.grabRotation += player.rotationSpeed;
	//arrow.
}; //end drawPlayer

var updatePlayer = function(){
	updateGrab();
	if(player.currentCollectable != null){
	
	}
};

var updateGrab = function(){
	//add minus sign at the front because clockwise is negative, counterclockwise is positive
	player.grab.x += (player.grabSpeedX);
	player.grab.y += (player.grabSpeedY );
	//reset the shift of pictures
	//if grab is out of the box, put it backward
	if(player.grab.x >= canvas.width - player.grab.getFrameWidth()  || 
		player.grab.y >= canvas.height - player.grab.getFrameHeight() ||
		player.grab.x  <= player.grab.getFrameHeight()){
		player.grabSpeedX *= -1;
		player.grabSpeedY *= -1;
	}else if(isOverlapWithCollectables(player)){
		player.grab.columnIndex = 1;
		player.grabSpeedX *= -1;
		player.grabSpeedY *= -1;

	}else if(player.grabSpeedY < 0 && Math.round(player.grab.x) == 470 && 
			 Math.round(player.grab.y) == 200){
		//reset the position of grab
		player.grab.x = 470;
		player.grab.y = 200;
		//stop the grab moving
		player.grabSpeedX = 0;
		player.grabSpeedY = 0;
		//start rotation again
		player.rotationSpeed = 0.05;
		//reset frame
		player.grab.columnIndex = 0;
	} //end judge grab
};

//return a player object
var initiatePlayer = function(x, y){
	var playerSprite = new Sprite(context, 576, 96, playerImg, PLAYER_FRAMES);
	var grab = new Sprite(context, 54, 30, arrow, 2);
	var thisPlayer = new Player(playerSprite, 0, grab);
	thisPlayer.sprite.x = x;
	thisPlayer.sprite.y = y;
	thisPlayer.sprite.ticksPerFrame = 3;
	thisPlayer.grab.scaleRatio = 2;
	thisPlayer.grab.ticksPerFrame = 5;
	thisPlayer.grab.x = 2*(x - 30)-324;
	thisPlayer.grab.y = 2*(y + 60)-120;
	return (thisPlayer);
}; //end initalte player

var moveGrab = function(){
	//if the grab is at default position, stop rotation and add speed
	if(player.grab.x == 470&& player.grab.y == 200){
		player.rotationSpeed = 0;
		player.grabSpeedX = 5 * Math.sin(-player.grabRotation);
		player.grabSpeedY = 5 * Math.cos(-player.grabRotation);
	}
};

//find if a player's grab is overlap with any collectables
var isOverlapWithCollectables = function(thisPlayer){
	var thisGrab = thisPlayer.grab;
	//add minus sign to the angle because clockwise is negative, counterclockwise is positive.
	var buttomCenterX = thisGrab.x  + thisGrab.getFrameHeight() * Math.sin(-player.grabRotation);
	var buttomCenterY = thisGrab.y + thisGrab.getFrameHeight() * Math.cos(-player.grabRotation); 

	var buttomLeftX = buttomCenterX - (thisGrab.getFrameWidth() / 2 - 5) * Math.cos(-player.grabRotation);
	var buttomLeftY = buttomCenterY + (thisGrab.getFrameWidth() / 2 - 5) * Math.sin(-player.grabRotation);
	var buttomRightX = buttomCenterX + (thisGrab.getFrameWidth() / 2 - 5) * Math.cos(-player.grabRotation);
	var buttomRightY = buttomCenterY - (thisGrab.getFrameWidth() / 2 - 5) * Math.sin(-player.grabRotation);
	for(var i = 0; i < coins.length; i++){
		//find the position of the center
		//the collectable sprite are all is squares, use circle to approach the shape
		var radius = coins[i].sprite.getFrameWidth()/2;
		var coinCenterX = coins[i].sprite.x + radius;
		var coinCenterY = coins[i].sprite.y + radius;

		//get the shortest distance from the center to the buttom 3 points;
		var distanceX = findMin(Math.abs(buttomCenterX - coinCenterX),
								Math.abs( buttomLeftX - coinCenterX),
								Math.abs(buttomRightX - coinCenterX));
		var distanceY = findMin(Math.abs(buttomCenterY - coinCenterY),
								Math.abs( buttomLeftY - coinCenterY),
								Math.abs(buttomRightY - coinCenterY));
		var distance = Math.sqrt(Math.pow(distanceX,2) + Math.pow(distanceY,2));
		//uses 10 to make it more close to the coin
		if(distance < radius-10 * coins[i].sprite.scaleRatio){
			thisPlayer.currentCollectable = coins[i];
			return true;
		}
	}

	return false;
};

var findMin = function(x,y,z){
	var min = x;
	if(y < min){
		min = y;
	}
	if(z < min){
		min = z;
	}
	return min;
};