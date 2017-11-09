var canvas;
var Context;
var numOfCoins = 10;
var coin = new Image();
var arrow = new Image();
var ground = new Image();
var coins = [];
var player;
var playerImg = new Image();
var displayNumebr = new Image();
var playerGun = new Image();
var explosionImg = new Image();
var playerScoreDisplay = [];
//for mouse control to debug
var mouseX, mouseY;
//constants
const GROUND_HEIGHT = 200;
const PLAYER_FRAMES = 6;
const PLAY_Y = 100;
const EMPTY_SPACE_HEIGHT = 100;
const DEFAULT_GRAB_POS_X = 470;
const DEFAULT_GRAB_POS_Y = 210;
const SCORE_X = 10;
const SCORE_Y = 10;
//load resorces
coin.src = "img/sprite/coin.png";
arrow.src = "img/sprite/Arrow.png";
ground.src = "img/BG/mine.png";
playerImg.src = "img/sprite/Player1.png";
displayNumebr.src = "img/sprite/number.png"; 
playerGun.src = "img/sprite/Gun.png"; 
explosionImg.src =   "img/sprite/Explosion1.png"                               
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
	if(event.keyCode == 87){
		moveGun();
	}
};

var update = function(){
	updatePlayer();
	updateScore();
};

//Draw game contnt
var drawGame = function(){
	drawBackground();
	drawCollectableObjects();
	drawPlayer(player, 300,50);
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


	player = initiatePlayer(canvas.width/2 - playerImg.width/(2*PLAYER_FRAMES),PLAY_Y);
	//initiate score display
	for(var i = 0; i < 5; i++){
		playerScoreDisplay[i] = new Sprite(context, 240, 160, displayNumebr,10);
		playerScoreDisplay[i].numberOfRows = 5;
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
	coins[coinId] = new Collectable(coinSprite, Math.round(100*Math.exp(coinSprite.scaleRatio)));
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

var drawPlayer = function(player, x, y){
	player.sprite.animation(true);
	//rotate and draw the grab
	player.grab.rotate(player.grabRotation, player.grab.x, player.grab.y,-player.grab.getFrameWidth()/2, 0);
	if(player.grabRotation >= Math.PI/2.5){
			player.rotationSpeed *= -1;
	}else if(player.grabRotation <= -Math.PI/2.5){
		player.rotationSpeed *= -1;
	} //end changeRotation
	player.grabRotation += player.rotationSpeed;
	
	if(player.currentCollectable != null){
		drawCurrentCollectable(player);
	}

	if(player.firing){
		player.gun.rotate(player.gunRotation,player.gun.x, player.gun.y, 3, 0 );
	}else{
		player.drawExplosion();
	}

	//draw the line to the grab
	context.beginPath();
	context.moveTo(DEFAULT_GRAB_POS_X,DEFAULT_GRAB_POS_Y);
	context.lineTo(player.grab.x, player.grab.y);
	context.stroke();
}; //end drawPlayer

var updatePlayer = function(){
	updateGrab();
	if(player.currentCollectable != null){
		updateCurrentCollectable(player);
	}

	if(player.firing){
		updateGun();	
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
		player.grabSpeedX *= -1 / ( Math.pow(3,player.currentCollectable.sprite.scaleRatio - 0.5));
		player.grabSpeedY *= -1 / ( Math.pow(3,player.currentCollectable.sprite.scaleRatio - 0.5));

	}else if(player.grabSpeedY < 0 && Math.round(player.grab.x) <= DEFAULT_GRAB_POS_X +5 && 
			 Math.round(player.grab.x) >= DEFAULT_GRAB_POS_X - 5 &&
			 Math.round(player.grab.y) <= DEFAULT_GRAB_POS_Y){
		//reset the position of grab
		player.grab.x = DEFAULT_GRAB_POS_X;
		player.grab.y = DEFAULT_GRAB_POS_Y;
		//stop the grab moving
		player.grabSpeedX = 0;
		player.grabSpeedY = 0;
		//start rotation again
		player.rotationSpeed = 0.05;
		//reset frame
		player.grab.columnIndex = 0;
		if(player.currentCollectable != null){
			player.score += player.currentCollectable.score;
			player.currentCollectable = null;

		}
	} //end judge grab
};

var updateCurrentCollectable = function(thisPlayer){
	var collectable = thisPlayer.currentCollectable;
	var thisGrab = thisPlayer.grab;
	//set the positio of the collectable to near the grab by a length of radius
	var buttomCenterX = thisGrab.x  + thisGrab.getFrameHeight() * Math.sin(-player.grabRotation) - collectable.radius;
	var buttomCenterY = thisGrab.y + thisGrab.getFrameHeight() * Math.cos(-player.grabRotation) - collectable.radius;
	//set the sprite to the last frame
	collectable.sprite.columnIndex = collectable.sprite.numberOfColomns - 1; //the index starts from 0
	collectable.sprite.x = buttomCenterX + collectable.radius * Math.sin(-player.grabRotation);
	collectable.sprite.y = buttomCenterY + collectable.radius * Math.cos(-player.grabRotation);
	//console.log(collectable.x + ", " + collectable.y);
};

var drawCurrentCollectable = function(thisPlayer){
	var collectable = thisPlayer.currentCollectable;
	collectable.sprite.render();
};

var updateScore = function(){
	var n = player.score;
	for(var i = playerScoreDisplay.length-1; i > 0; i--){
		playerScoreDisplay[i].columnIndex = Math.round(n % 10);
		n = Math.floor(n/10);
	}
};

var drawScore = function(){
	for(var i = 0; i < playerScoreDisplay.length ; i++){
		playerScoreDisplay[i].render(SCORE_X + i * 30, SCORE_Y);
	}
};


//return a player object
var initiatePlayer = function(x, y){
	var playerSprite = new Sprite(context, 576, 96, playerImg, PLAYER_FRAMES);
	var grab = new Sprite(context, 54, 30, arrow, 2);
	var gun = new Sprite(context, 6, 27, playerGun,1);
	var explosion = new Sprite(context, 960, 576, explosionImg, 12);
	explosion.numberOfColomns = 5;
	explosion.numberOfRows = 3;
	var thisPlayer = new Player(playerSprite, 0, grab, gun, explosion);
	thisPlayer.sprite.x = x;
	thisPlayer.sprite.y = y;
	thisPlayer.sprite.ticksPerFrame = 3;
	thisPlayer.grab.scaleRatio = 2;
	thisPlayer.grab.ticksPerFrame = 5;
	thisPlayer.grab.x = DEFAULT_GRAB_POS_X;
	thisPlayer.grab.y = DEFAULT_GRAB_POS_Y;
	return (thisPlayer);
}; //end initalte player
var updateGun = function(){
	player.gun.x = player.gun.x + Math.sin(-player.gunRotation)*player.gunSpeedX;
	player.gun.y = player.gun.y + Math.cos(-player.gunRotation)*player.gunSpeedY;
	for(var i = 0; i < coins.length; i++){
		if(player.gun.isOverlap(coins[i].sprite)){
			//reset the current explosion
			player.resetExplosion(coins[i].sprite.x - coins[i].radius, coins[i].sprite.y- coins[i].radius, coins[i].sprite.scaleRatio);
			coins.splice(i,1);
			player.firing = false;
		}
	}
};
var moveGun = function(){
	if(player.canFire){
		player.firing = true;
		player.gun.x = DEFAULT_GRAB_POS_X  + player.grab.getFrameHeight() * Math.sin(-player.grabRotation) + 3;
		player.gun.y = DEFAULT_GRAB_POS_Y+ player.grab.getFrameHeight() * Math.cos(-player.grabRotation);
		player.gunRotation = player.grabRotation;
	}
};
var moveGrab = function(){
	//if the grab is at default position, stop rotation and add speed
	if(player.grab.x == DEFAULT_GRAB_POS_X&& player.grab.y == DEFAULT_GRAB_POS_Y){
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
								Math.abs(buttomLeftY - coinCenterY),
								Math.abs(buttomRightY - coinCenterY));
		var distance = Math.sqrt(Math.pow(distanceX,2) + Math.pow(distanceY,2));
		//uses 10 to make it more close to the coin
		if(distance < radius-10 * coins[i].sprite.scaleRatio){
			thisPlayer.currentCollectable = coins[i];
			coins.splice(i,1); //remove this collectable from the array list
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