var canvas;
var Context;
var numOfCoins = 5;
var coin = new Image();
var img = new Image();
var background = new Image();
var coins = [];
//load resorces
coin.src = "img/sprite/coin.png";
img.src = "img/sprite/Earth5.png";
background.src = "img/BG/mine.png";
window.onload = function(){
	startGame();
	var framePerSecond = 30;
	setInterval(function(){
		update();
		drawGame();
		/*sprite.render(0,0);
		sprite.update();
		water.update();
		if(water.frameIndex <= 20 && water.frameIndex >=1){
			water.render(100,100);
		}*/
	}, 1000/framePerSecond);
};

var update = function(){
	
};

var drawGame = function(){

	context.clearRect(0,0,canvas.width,canvas.height);
	context.fillStyle = 'black';
	context.fillRect(0,0,canvas.width,canvas.height);
	context.drawImage(background, 0,0);
	for(var i = 0; i < coins.length; i++){
		coins[i].animation(true);
	}
};

var startGame = function(){
	canvas = document.getElementById('gameCanvas');
	context = canvas.getContext('2d');
	while(coins.length < numOfCoins){
		spawnCoin();
	}
//	var water = new Sprite(context,960,1152,img,30);
//	water.ticksPerFrame = 3;
//	water.scaleRatio = 3;
//	water.setDimensions(6,5);
};

var spawnCoin = function(){
	coinId = coins.length;
	var thisCoin = new Sprite(context, 1000,100,coin,10);
	thisCoin.scaleRatio = (Math.random()*2) + 0.5;
	var x = Math.random() * (canvas.width - thisCoin.getFrameWidth());
	var y = (Math.random() * (canvas.height - 345 - thisCoin.getFrameHeight())) + 345;
	coins[coinId] = thisCoin;
	thisCoin.x = x;
	thisCoin.y = y;
	thisCoin.render(); 
};
