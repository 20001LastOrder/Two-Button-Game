var canvas;
var Context;
var numOfCoins = 10;
var coin = new Image();
var img = new Image();
var ground = new Image();
var coins = [];
//for mouse control to debug
var mouseX, mouseY;
const GROUND_HEIGHT = 200;
//load resorces
coin.src = "img/sprite/coin.png";
img.src = "img/sprite/Earth5.png";
ground.src = "img/BG/mine.png";
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

function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
};
var update = function(){
	

};

//Draw the background and objects
var drawGame = function(){
	context.clearRect(0,0,canvas.width,canvas.height);
	context.fillStyle = 'black';
	context.fillRect(0,0,canvas.width,canvas.height);
	context.drawImage(ground, 0,0, canvas.width, GROUND_HEIGHT);
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
