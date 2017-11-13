var canvas;
var Context;
var numOfCoins = 20;
var coin = new Image();
var player1Grab = new Image();
var player2Grab = new Image();
var ground = new Image();
var coins;
var player1;
var player2;
var player1Img = new Image();
var player2Img = new Image();
var displayNumebr = new Image();
var player1Gun = new Image();
var player2Gun = new Image();
var explosionImg = new Image();
var winImg = new Image();
var executionImg = new Image();
var player1ScoreDisplay = [];
var player2ScoreDisplay = [];
var framePerSecond = 30;
var doublePlayer = true;
var execution; //image for punishing the losing player
var newGame = false;
var gameoverImg = new Image();
var explosions;
var stonesImg = [new Image(), new Image(), new Image()];
//for mouse control to debug
var mouseX, mouseY;
var timer;
var targetScore = 2000;
//constants
const GROUND_HEIGHT = 200;
const PLAYER1_FRAMES = 6;
const PLAYER2_FRAMES = 5;
const PLAY_Y = 100;
const EMPTY_SPACE_HEIGHT = 100;
var DEFAULT_GRAB1_POS_X = 360;
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
winImg.src = "img/BG/Plain.png";
player1Img.src = "img/sprite/player1.png";
player2Img.src = "img/sprite/player2.png";
displayNumebr.src = "img/sprite/number.png"; 
player1Gun.src = "img/sprite/gun1.png";
player2Gun.src = "img/sprite/gun2.png"; 
explosionImg.src =  "img/sprite/Explosion1.png";  
executionImg.src = "img/sprite/execution.png" ;
gameoverImg.src = "img/BG/GameOver.png";
for(var i = 0; i < stonesImg.length; i++){
	stonesImg[i].src = "img/sprite/stone" + (i+1) + ".png";
}                           
window.onload = function(){
	startGame();
	canvas.addEventListener('mousemove', updateMousePos);
	document.addEventListener('keydown', characterControl);
	setInterval(function(){
		if(!newGame){
			drawTitleScreen();
		}else{
			if(timer <= 60 * framePerSecond){
				update();
				drawGame();
				updateAndShowTimer();
			}else{
				showGameOver();
			}
		}
	}, 1000/framePerSecond);
};

var updateMousePos = function(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;

};

var updateAndShowTimer = function(){
	timer = timer + 1;
	var timeLeft = Math.ceil(60 - timer / framePerSecond);
	context.textAlign = "left";
	context.fillStyle = "red";
	context.font="30px Verdana";
	context.fillText("Time Left: " + timeLeft, canvas.width/2 - 100, 30);
};

var characterControl = function(event){
	if(newGame){
		if(event.keyCode == 83){
			moveGrab(player1);
		}

		if(event.keyCode == 87){
			moveGun(player1);
		}
		if(doublePlayer){
			if(event.keyCode == 40){
				moveGrab(player2);
			}
			if(event.keyCode == 38){
				moveGun(player2);
			}
		}
		if(event.keyCode == 32){
			newGame = false;
			startGame();
		}
	}else{
		if(event.keyCode == 87){
			doublePlayer = false;
			newGame = true;
			startGame();
		}

		if(event.keyCode == 83){
	 		doublePlayer = true;
	 		newGame = true;
	 		startGame();
		}
	}
};
var drawTitleScreen = function(){
	drawBackground();
	drawCollectableObjects();
	player1.sprite.render(100,100);
	player2.sprite.render(800,100);
	execution.render(380,50);
	context.textAlign = "center";
	context.fillStyle = "black";
	context.font = "25px Arial";
	context.strokeText("Only the One Getting Higher Score Can Survive", canvas.width/2 , 250);
	context.font="40px Comic Sans MS";
	context.fillStyle = "red";
	context.fillText("Press W for Single Player", canvas.width/2 , 400);
	context.fillText("Press S for Double Player", canvas.width/2 ,500);
};
var showGameOver = function(){
	if(doublePlayer){
		var winnerPlayer, losePlayer;
		if(player1.score > player2.score){
			winnerPlayer = player1;
			losePlayer = player2;
		}else if(player1.score < player2.score){
			winnerPlayer = player2;
			losePlayer = player1;
		}else{
			startGame();
			execution.needContinue = false;
		}
		if(execution.needContinue){
			drawBackground();
			drawCollectableObjects();
			winnerPlayer.drawPlayer();
			execution.update();
			if(execution.frameIndex > 0 && execution.frameIndex <= 20){
				execution.render(losePlayer.sprite.x - 50, losePlayer.sprite.y);
			}else if(execution.frameIndex > 20){
				execution.needContinue = false;
			}
		}else{
			context.fillStyle = "orange";
			context.fillRect(0,0,canvas.width,canvas.height);
			winnerPlayer.sprite.columnIndex = 1;
			winnerPlayer.sprite.scaleRatio = 5;
			winnerPlayer.sprite.render(canvas.width/2-winnerPlayer.sprite.getFrameWidth()/2,
										canvas.height/2 - winnerPlayer.sprite.getFrameHeight()/2);
			context.fillStyle = "";
			context.font="40px Comic Sans MS";
			var gradient=context.createLinearGradient(canvas.width/2 - 100,50,canvas.width/2+50 ,50);
			gradient.addColorStop("0","magenta");
			gradient.addColorStop("0.5","blue");
			gradient.addColorStop("1.0","red");
			context.fillStyle = gradient;
			context.textAlign = "center";
			context.fillText("You Win!!!", canvas.width/2 , 100);
			context.fillText("Press Space To Go Back", canvas.width/2 ,200);

		}
	}else{
		if(player1.score > targetScore){
			goToNextLevel();
		}else{
			if(execution.needContinue){
				drawBackground();
				drawCollectableObjects();
				execution.update();
				if(execution.frameIndex > 0 && execution.frameIndex <= 20){
					execution.render(player1.sprite.x - 50, player1.sprite.y);
				}else if(execution.frameIndex > 20){
					execution.needContinue = false;
				}
			}else{
				context.drawImage(gameoverImg, 0, 0, canvas.width, canvas.height);
			}
		}
	}
};

var update = function(){
	player1.updatePlayer(coins, player2);
	//update the score of player1 to player1 display
	player1.updateScore(player1ScoreDisplay);
	if(doublePlayer){
		player2.updatePlayer(coins, player1);
		player2.updateScore(player2ScoreDisplay);
	}
};

//Draw game contnt
var drawGame = function(){
	drawBackground();
	drawCollectableObjects();
	player1.drawPlayer();
	player1.drawLineToGrab(DEFAULT_GRAB1_POS_X,DEFAULT_GRAB1_POS_Y);
	if(doublePlayer){
		player2.drawPlayer();
		player2.drawLineToGrab(DEFAULT_GRAB2_POS_X, DEFAULT_GRAB2_POS_Y);
	}
	drawScore();
	if(player1.canFire){
		player1.drawGunIcon(SCORE1_X + 10, SCORE1_Y + 35);
	}
	if(doublePlayer){
		if(player2.canFire){
			player2.drawGunIcon(SCORE2_X + 10, SCORE2_Y + 35);
		}
	}else{

		drawTargetScore();
	}
	/*context.fillStyle = "red";
	context.font="30px Verdana";
	context.fillText("(" + mouseX + " ," + mouseY + ")", mouseX,mouseY);	*/
};

//start game (call once only)
var goToNextLevel = function(){
	context = canvas.getContext('2d');
	context.clearRect ( 0 , 0 , canvas.width , canvas.height );
	coins = [];
	timer = 0;
	targetScore = targetScore * 2;
		while(coins.length < numOfCoins){
		spawnCollectable();
	}

};
var startGame = function(){
	canvas = document.getElementById('gameCanvas');
	context = canvas.getContext('2d');
	context.clearRect ( 0 , 0 , canvas.width , canvas.height );
	coins = [];
	timer = 0;
	execution = new Sprite(context, 960, 1152, executionImg, 30);
	execution.numberOfRows = 6;
	execution.numberOfColomns = 5;
	while(coins.length < numOfCoins){
		spawnCollectable();
	}

	if(doublePlayer){
	    DEFAULT_GRAB1_POS_X = 360;
		player1 = initiatePlayer(310,PLAY_Y, player1Img,player1Gun,player1Grab, 
								PLAYER1_FRAMES, DEFAULT_GRAB1_POS_X, DEFAULT_GRAB1_POS_Y);
		player2 = initiatePlayer(560,PLAY_Y, player2Img, player2Gun, player2Grab, 
								PLAYER2_FRAMES, DEFAULT_GRAB2_POS_X, DEFAULT_GRAB2_POS_Y);
	}else{
		DEFAULT_GRAB1_POS_X = canvas.width/2;
		player1 = initiatePlayer(430,PLAY_Y, player1Img,player1Gun,player1Grab, 
								PLAYER1_FRAMES, DEFAULT_GRAB1_POS_X, DEFAULT_GRAB1_POS_Y);
	}
	//initiate score display
	for(var i = 0; i < 5; i++){
		player1ScoreDisplay[i] = new Sprite(context, 169, 19, displayNumebr,10);
		player1ScoreDisplay[i].scaleRatio = 1.5;
		if(doublePlayer){
			player2ScoreDisplay[i] = new Sprite(context, 169, 19, displayNumebr,10);
			player2ScoreDisplay[i].scaleRatio = 1.5; 
		}
	}
};

var spawnCollectable = function(){
	coinId = coins.length;
	var coinSprite;
	var score;
	if(coins.length <= 8){
		coinSprite = new Sprite(context, 1000,100,coin,10);
		coinSprite.scaleRatio = (Math.random()*0.5) + 0.5;
		if(coinSprite.scaleRatio > 0.5 && coinSprite.scaleRatio <= 0.7){
			score = 200;
		}else if(coinSprite.scaleRatio > 0.7 && coinSprite.scaleRatio <= 0.8){
			score = 400;
		}else if(coinSprite.scaleRatio > 0.8 && coinSprite.scaleRatio <= 0.9){
			score = 900;
		}else if(coinSprite.scaleRatio > 0.9 ){
			score = 1200;
		}
	}else{
		var i = Math.round(Math.random()*2);
		coinSprite = new Sprite(context,60, 63, stonesImg[i],1);
		coinSprite.scaleRatio = (Math.random()*0.5) + 0.8;
		if(coinSprite.scaleRatio > 0.8 && coinSprite.scaleRatio <= 1.0){
			score = 50;
		}else if(coinSprite.scaleRatio > 1.0 && coinSprite.scaleRatio <= 1.1){
			score = 100;
		}else if(coinSprite.scaleRatio > 1.1 && coinSprite.scaleRatio <= 1.2){
			score = 200;
		}else if(coinSprite.scaleRatio > 1.2 ){
			score = 300;
		}
	}
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
		if(doublePlayer){
			player2ScoreDisplay[i].render(SCORE2_X + i * 30, SCORE2_Y);
		}
	}
};

var drawTargetScore = function(){
	var x = canvas.width/2 - 80;
	var y = SCORE1_Y + 50;
	context.fillStyle = "red";
	context.textAlign = "left";
	context.font = "30px Verdana";
	context.fillText("Target: " + targetScore, x, y);
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
	if(thisPlayer.canFire ){
		thisPlayer.score -= 200;	
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
		thisPlayer.grabSpeedX = thisPlayer.defaultGrabSpeedX * Math.sin(-thisPlayer.grabRotation);
		thisPlayer.grabSpeedY = thisPlayer.defaultGrabSpeedY * Math.cos(-thisPlayer.grabRotation);

	}
};

