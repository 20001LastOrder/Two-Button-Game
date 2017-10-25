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

//load resorces
coin.src = "img/sprite/coin.png";
arrow.src = "img/sprite/Arrow.png";
ground.src = "img/BG/mine.png";
playerImg.src = "img/sprite/Player1.png";

window.onload = function(){
	startGame();
	var framePerSecond = 30;
	setInterval(function(){
		update();
		drawGame();
		//function to detecting the mouse movement for debugging
		canvas.addEventListener('mousemove', updateMousePos);
		
		/*sprite.render(0,0);
		sprite.update();
		water.update();
		if(water.frameIndex <= 20 && water.frameIndex >=1){
			water.render(100,100);
		}*/
	}, 1000/framePerSecond);
};

updateMousePos = function(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
};


var update = function(){
	

};

//Draw game contnt
var drawGame = function(){
	drawBackground();
	drawCollectableObject();
	drawPlayer(player, 300,50);
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
		var y = (Math.random() * (canvas.height - GROUND_HEIGHT -50 - thisCoin.getFrameHeight())) + GROUND_HEIGHT+50;
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
};

var drawCollectableObject = function(){
	for(var i = 0; i < coins.length; i++){
		coins[i].animation(true);
	}
};

var drawPlayer = function(player, x, y){
	player.sprite.animation(true);
	player.grab.render();
	//TODO: add player animation and add constant for initial player and 
	//arrow.

};


var initiatePlayer = function(x, y){
	var playerSprite = new Sprite(context, 576, 96, playerImg, PLAYER_FRAMES);
	var grab = new Sprite(context, 537/3, 716/4, arrow, 1);
	var thisPlayer = new Player(playerSprite, 0, grab);
	thisPlayer.sprite.x = x;
	thisPlayer.sprite.y = y;
	thisPlayer.sprite.ticksPerFrame = 3;
	thisPlayer.grab.scaleRatio = 0.5;
	thisPlayer.grab.x = x ;
	thisPlayer.grab.y = y + 100;
	return (thisPlayer);
};