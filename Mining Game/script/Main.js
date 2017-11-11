var canvas;
var Context;
var numOfCoins = 20;
var coin = new Image();
var player1Grab = new Image();
var player2Grab = new Image();
var ground = new Image();
var coins = [];
var player1;
var player2;
var player1Img = new Image();
var player2Img = new Image();
var displayNumebr = new Image();
var player1Gun = new Image();
var player2Gun = new Image();
var explosionImg = new Image();
var player1ScoreDisplay = [];
var player2ScoreDisplay = [];
//for mouse control to debug
var mouseX, mouseY;
//constants
const GROUND_HEIGHT = 200;
const PLAYER1_FRAMES = 6;
const PLAYER2_FRAMES = 5;
const PLAY_Y = 100;
const EMPTY_SPACE_HEIGHT = 100;
const DEFAULT_GRAB1_POS_X = 360;
const DEFAULT_GRAB1_POS_Y = 210;
const DEFAULT_GRAB2_POS_X = 610;
const DEFAULT_GRAB2_POS_Y = 210;
const SCORE1_X = 10;
const SCORE1_Y = 10;
const SCORE2_X = 700;
const SCORE2_Y = 10;
//load resorces
coin.src = "img/sprite/coin.png";
player1Grab.src = "img/sprite/grab1.png";
player2Grab.src = "img/sprite/grab2.png";
ground.src = "img/BG/mine.png";
player1Img.src = "img/sprite/player1.png";
player2Img.src = "img/sprite/player2.png";
displayNumebr.src = "img/sprite/number.png"; 
player1Gun.src = "img/sprite/gun1.png";
player2Gun.src = "img/sprite/gun2.png"; 
explosionImg.src =   "img/sprite/Explosion1.png";                               
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
		moveGrab(player1);
	}
	if(event.keyCode == 40){
		moveGrab(player2);
	}
	if(event.keyCode == 87){
		moveGun(player1);
	}
	if(event.keyCode == 38){
		moveGun(player2);
	}
};

var update = function(){
	player1.updatePlayer(coins);
	//update the score of player1 to player1 display
	player1.updateScore(player1ScoreDisplay);
	player2.updatePlayer(coins);
	player2.updateScore(player2ScoreDisplay);
};

//Draw game contnt
var drawGame = function(){
	drawBackground();
	drawCollectableObjects();
	player1.drawPlayer();
	player1.drawLineToGrab(DEFAULT_GRAB1_POS_X,DEFAULT_GRAB1_POS_Y);
	player2.drawPlayer();
	player2.drawLineToGrab(DEFAULT_GRAB2_POS_X, DEFAULT_GRAB2_POS_Y);
	drawScore();
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


	player1 = initiatePlayer(310,PLAY_Y, player1Img,player1Gun,player1Grab, 
							PLAYER1_FRAMES, DEFAULT_GRAB1_POS_X, DEFAULT_GRAB1_POS_Y);
	player2 = initiatePlayer(560,PLAY_Y, player2Img, player2Gun, player2Grab, 
							PLAYER2_FRAMES, DEFAULT_GRAB2_POS_X, DEFAULT_GRAB2_POS_Y);
	//initiate score display
	for(var i = 0; i < 5; i++){
		player1ScoreDisplay[i] = new Sprite(context, 240, 160, displayNumebr,10);
		player1ScoreDisplay[i].numberOfRows = 5;
		player1ScoreDisplay[i].rowIndex = 2;
		player2ScoreDisplay[i] = new Sprite(context, 240, 160, displayNumebr,10);
		player2ScoreDisplay[i].numberOfRows = 5;
		player2ScoreDisplay[i].rowIndex = 2;
	}
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
		var y = (Math.random() * (canvas.height - GROUND_HEIGHT -EMPTY_SPACE_HEIGHT - coinSprite.getFrameHeight())) + GROUND_HEIGHT+EMPTY_SPACE_HEIGHT;
		coinSprite.x = x;
		coinSprite.y = y;
		for(var i = 0; i < coins.length; i++){
			if(coinSprite.isOverlap(coins[i].sprite)){
				hasOverlapWithOtherCoin = true;
			}
		}
	}while(hasOverlapWithOtherCoin);
	var score;
	if(coinSprite.scaleRatio > 0.5 && coinSprite.scaleRatio <= 0.7){
		score = 200;
	}else if(coinSprite.scaleRatio > 0.7 && coinSprite.scaleRatio <= 0.8){
		score = 400;
	}else if(coinSprite.scaleRatio > 0.8 && coinSprite.scaleRatio <= 0.9){
		score = 900;
	}else if(coinSprite.scaleRatio > 0.9 && coinSprite.scaleRatio <= 1){
		score = 1200;
	}
	coins[coinId] = new Collectable(coinSprite, score);
	coinSprite.render(); 

};

var drawBackground = function(){
	context.clearRect(0,0,canvas.width,canvas.height);
	context.fillStyle = 'orange';
	context.fillRect(0,0,canvas.width,canvas.height);
	context.drawImage(ground, 0,0, canvas.width, GROUND_HEIGHT);
}; //end drawBackGround

var drawCollectableObjects = function(){
	for(var i = 0; i < coins.length; i++){
		coins[i].sprite.animation(true);
	}
}; //end drawCollectableObjects

var drawScore = function(){
	for(var i = 0; i < player1ScoreDisplay.length ; i++){
		player1ScoreDisplay[i].render(SCORE1_X + i * 30, SCORE1_Y);
		player2ScoreDisplay[i].render(SCORE2_X + i * 30, SCORE2_Y);
	}
};


//return a player object
var initiatePlayer = function(x, y, playerImg, playerGun, arrow, frames, grabX, grabY){
	var playerSprite = new Sprite(context, playerImg.width, playerImg.height, playerImg, frames);
	var grab = new Sprite(context, 54, 30, arrow, 2);
	var gun = new Sprite(context, 6, 27, playerGun,1);
	var explosion = new Sprite(context, 960, 576, explosionImg, 12);
	explosion.numberOfColomns = 5;
	explosion.numberOfRows = 3;
	var thisPlayer = new Player(playerSprite, 0, grab, gun, explosion, grabX, grabY);
	thisPlayer.sprite.x = x;
	thisPlayer.sprite.y = y;
	thisPlayer.sprite.ticksPerFrame = 3;
	thisPlayer.grab.scaleRatio = 2;
	thisPlayer.grab.ticksPerFrame = 5;
	thisPlayer.canvas = canvas;
	return (thisPlayer);
}; //end initalte player

var moveGun = function(thisPlayer){
	if(thisPlayer.canFire){
		thisPlayer.firing = true;
		thisPlayer.canFire = false;
		thisPlayer.gun.x = thisPlayer.defaultGrabX  + thisPlayer.grab.getFrameHeight() * Math.sin(-thisPlayer.grabRotation) + 3;
		thisPlayer.gun.y = thisPlayer.defaultGrabY+ thisPlayer.grab.getFrameHeight() * Math.cos(-thisPlayer.grabRotation);
		thisPlayer.gunRotation = thisPlayer.grabRotation;
	}
};

var moveGrab = function(thisPlayer){
	//if the grab is at default position, stop rotation and add speed
	if(thisPlayer.grab.x == thisPlayer.defaultGrabX&& thisPlayer.grab.y == thisPlayer.defaultGrabY){
		thisPlayer.rotationSpeed = 0;
		thisPlayer.grabSpeedX = 5 * Math.sin(-thisPlayer.grabRotation);
		thisPlayer.grabSpeedY = 5 * Math.cos(-thisPlayer.grabRotation);

	}
};

