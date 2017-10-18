var canvas;
var Context;
var coin = new Image();
coin.src = "img/sprite/coin.png";
var img = new Image();
img.src = "img/sprite/Explosion1.png";
window.onload = function(){
	canvas = document.getElementById('gameCanvas');
	context = canvas.getContext('2d');

	
	//alert(img.src);
	var sprite = new Sprite(context,1000,100,coin,10);
	var water = new Sprite(context,960,576,img,12);
	water.setDimensions(3,5);
	setInterval(function(){
		context.clearRect(0,0,canvas.width,canvas.height);
		context.fillStyle = 'blue';
	    context.fillRect(0,0,canvas.width,canvas.height);
		sprite.render(0,0);
		sprite.update();
		water.render(100,100);
		water.update();
	}, 1000/30);
	//sprite.render(0,0);
};
