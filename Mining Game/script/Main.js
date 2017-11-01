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
	console.log("active")
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
	var thisCoin = new Sprite(context, 1000,100,coin,10);
	thisCoin.scaleRatio = (Math.random()*0.5) + 0.5;
	//Reset the position when the coin is overlap with another coin
	//find a random point only within the range of the restricted area
	var hasOverlapWithOtherCoin = false;
	do{
		hasOverlapWithOtherCoin = false;
		var x = Math.random() * (canvas.width - thisCoin.getFrameWidth());
		var y = (Math.random() * (canvas.height - GROUND_HEIGHT -EMPTY_SPACE_HEIGHT - thisCoin.getFrameHeight())) + GROUND_HEIGHT+50;
		thisCoin.x = x;
		thisCoin.y = y;
		for(var i = 0; i < coins.length; i++){
			if(thisCoin.isOverlap(coins[i])){
				hasOverlapWithOtherCoin = true;
			}
		}
	}while(hasOverlapWithOtherCoin);
	
	coins[coinId] = thisCoin;
	thisCoin.render(); 
};

var drawBackground = function(){
	context.clearRect(0,0,canvas.width,canvas.height);
	context.fillStyle = 'black';
	context.fillRect(0,0,canvas.width,canvas.height);
	context.drawImage(ground, 0,0, canvas.width, GROUND_HEIGHT);
}; //end drawBackGround

var drawCollectableObjects = function(){
	for(var i = 0; i < coins.length; i++){
		coins[i].animation(true);
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
	
};

var updateGrab = function(){
	//add minus sign at the front because clockwise is negative, counterclockwise is positive
	player.grab.x += (player.grabSpeedX * Math.sin(-player.grabRotation));
	player.grab.y += (player.grabSpeedY * Math.cos(-player.grabRotation));
	//reset the shift of pictures
	//if grab is out of the box, put it backward
	//add the pivot because it is the point that the picture real is

	if(player.grab.x >= canvas.width - player.grab.getFrameWidth()  || 
		player.grab.y >= canvas.height - player.grab.getFrameHeight() ||
		player.grab.x  <= player.grab.getFrameHeight()){
		player.grabSpeedX *= -1;
		player.grabSpeedY *= -1;
	}else if(player.grabSpeedX != 0 && Math.round(player.grab.x) == 470 && 
			 Math.round(player.grab.y) == 200){
		player.grabSpeedX = 0;
		player.grabSpeedY = 0;
		player.rotationSpeed = 0.05;
	}
	console.log(Math.round(player.grab.x) + ", " + Math.round(player.grab.y ));
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
		player.grabSpeedX = 5;
		player.grabSpeedY = 5;
	}
};