//this class for animation a Sprite
//
//Sprite with single row
//set repeat play as default
function Sprite(context, width, height, img,nOf){
	//this.initialize
	this.context = context;
	this.frameIndex = 0;
	this.rowIndex = 0;
	this.columnIndex = 0;
	this.tickCount = 0;
	this.ticksPerFrame = 1;
	this.numberOfFrames = nOf;
	this.numberOfColomns = this.numberOfFrames;  //defautly seems it as a one row sprite sheet
	this.numberOfRows = 1;
	this.width = width;
	this.height = height;
	this.img = img;
	this.scaleRatio = 1;
	this.x = 0;
	this.y = 0;
	this.isRepeat = true;
	this.needContinue = true;
}

//for multi rows of sprite sheet
Sprite.prototype.setDimensions = function(rows, colomns){
	this.numberOfRows = rows;
	this.numberOfColomns = colomns;
};


Sprite.prototype.animation = function(isRepeat, x, y){
	this.isRpeat = isRepeat;
	if(typeof(x) == "number" && typeof(y) == "number"){
		this.x = x;
		this.y = y;
	}
	if(this.needContinue){
		this.update();
		this.render();
	}

};



Sprite.prototype.update = function(){
	this.tickCount++;
	if(this.tickCount > this.ticksPerFrame){
		this.tickCount = 0;
		//move frames horizontally first and then move it vertically
		if(this.frameIndex < this.numberOfFrames-1){
			this.frameIndex++;
			if(this.columnIndex < this.numberOfColomns-1){
				this.columnIndex++;
			}else{
				this.columnIndex = 0;
				if(this.rowIndex < this.numberOfRows-1){
					this.rowIndex++;
				}else{
					this.rowIndex = 0;
				} //end check row numbers
			} //end check colomn numbers
		}else{
			//reset colonms and rows when all frames are done
			if(this.isRepeat){
				this.frameIndex = 0;
				this.rowIndex = 0;
				this.columnIndex = 0;
			}else{
				needContinue = false;
			} //end check if repeat
		} //end check frames
	} //end check ticks
}; //end update

//function for draw the graph
Sprite.prototype.render = function(x,y){
	//check if x and y are Number
	if(typeof(x) == "number" && typeof(y) == "number"){
		this.x = x;
		this.y = y;
	} //end judge input
	this.context.drawImage(
			this.img,                                        
			this.columnIndex*this.width/this.numberOfColomns,   //local x
			(this.rowIndex)*this.height /this.numberOfRows, //ly
			this.width/this.numberOfColomns,                  //lw
			this.height/this.numberOfRows,                   //lh
			this.x,                                               //convas x
			this.y,                                               //cy
			this.width/this.numberOfColomns*this.scaleRatio, //cw
			this.height/this.numberOfRows*this.scaleRatio    //ch
		);
};

Sprite.prototype.getFrameWidth = function(){
	return this.width / this.numberOfColomns * this.scaleRatio;
};

Sprite.prototype.getFrameHeight = function(){
	return this.height / this.numberOfRows * this.scaleRatio;
};

Sprite.prototype.isOverlap = function(sprite){
	var higherSprite = (this.getFrameHeight() < sprite.getFrameHeight())? sprite : this; 
	var widerSprite = (this.getFrameWidth() < sprite.getFrameWidth())? sprite : this;
	var lowerSprite = (this.getFrameHeight() < sprite.getFrameHeight())? this : sprite; 
	var shorterSprite = (this.getFrameWidth() < sprite.getFrameWidth())? this : sprite;
	//find if the horizontal interval of the shorterSprite is within the widerSprite
	//and if the vertical interval of the lowerSprite is within higerSprite 
	var leftPointWithin = (higherSprite.y<lowerSprite.y)&& (lowerSprite.y<higherSprite.y + higherSprite.getFrameWidth());
	var rightPointWithin = (higherSprite.y<lowerSprite.y + lowerSprite.getFrameWidth())&& (lowerSprite.y + lowerSprite.getFrameWidth()<higherSprite.y + higherSprite.getFrameWidth());
	var topPointWithin = widerSprite.x<shorterSprite.x && shorterSprite.x<widerSprite.x + higherSprite.getFrameHeight();
	var bottomPointWithin = widerSprite.x<shorterSprite.x + shorterSprite.getFrameHeight() && shorterSprite.x + shorterSprite.getFrameHeight()<widerSprite.x + higherSprite.getFrameHeight();
	if((leftPointWithin || rightPointWithin) && (topPointWithin || bottomPointWithin)){
		return true;
	} //end judge overload
	return false;
}; //end isOverlap

Sprite.prototype.continue = function(){
	this.needContinue = true;
};

Sprite.prototype.pause = function(){
	this.needContinue = false;
};

//rotation around a certain point
Sprite.prototype.rotate = function(angle, x, y, pivotX, pivotY){
	var xPos = this.x;
	var yPos = this.y;
	this.context.save();
	this.context.translate(x , y);
	this.context.rotate(angle);
	//this change the value of current x and y
	this.render(pivotX,pivotY);

	//change it back to the needed coord
	this.x = xPos;
	this.y = yPos;
	this.context.restore();
};


//class for collectable
function Collectable(sprite, value){
	this.sprite = sprite; 
	this.score = value;
	this.speedX = 0;
	this.speedY = 0;
	if(this.sprite != null){
		this.radius = this.sprite.getFrameHeight()/2;
	}
}



//class for player
//Sprite number Sprite Sprite
function Player(sprite, score, grab,gun,explosion, defaultGrabX, defaultGrabY ){
	this.sprite = sprite;
	this.score = score;
	this.grab = grab;
	this.grab.x = defaultGrabX;
	this.grab.y = defaultGrabY;
	this.gun = gun;
	//the player has the same context property as the grab
	this.context = grab.context;
	this.canvas = null;
	this.grabRotation = 0;
	this.rotationSpeed = 0.05;
	this.grabSpeedX = 0;
	this.grabSpeedY = 0;
	this.firing = false;
	this.canFire = false;
	this.gunSpeedX = 10;
	this.gunSpeedY = 10;
	this.gunRotation = 0;
	this.explosion = explosion;
	explosion.needContinue = false;
	explosion.isRepeat = false;
	this.currentCollectable = null; //current hold collectable
	this.defaultGrabX = defaultGrabX;
	this.defaultGrabY = defaultGrabY;
	this.timer = 0;
	this.defaultGrabSpeedX = 5;
	this.defaultGrabSpeedY = 5;
}

Player.prototype.drawExplosion = function(){
	this.explosion.animation(false);
	if(this.explosion.frameIndex == 11){
		//set the column index to be out of range to preventing it drawing
		//here row index is 2 (the image has 3 rows)
		this.explosion.columnIndex = 3;
	}
};

Player.prototype.resetExplosion = function(x, y, ratio){
	this.explosion.frameIndex = 0;
	this.explosion.rowIndex = 0;
	this.explosion.columnIndex = 0;
	this.explosion.needContinue = true;
	this.explosion.x = x;
	this.explosion.y = y;
	this.explosion.scaleRatio = ratio;
};

Player.prototype.drawPlayer = function(){ 
	this.sprite.animation(true);
	//rotate and draw the grab
	this.grab.rotate(this.grabRotation, this.grab.x, this.grab.y,-this.grab.getFrameWidth()/2, 0);
	if(this.grabRotation >= Math.PI/2.5){
			//reset rotation
			this.grabRotation = Math.PI/2.5;
			this.rotationSpeed *= -1;
	}else if(this.grabRotation <= -Math.PI/2.5){
		//reset rotation
		this.grabRotation = -Math.PI/2.5;
		this.rotationSpeed *= -1;
	} //end changeRotation
	this.grabRotation += this.rotationSpeed;
	
	if(this.currentCollectable != null){
		if(this.currentCollectable.sprite != null){
			this.drawCurrentCollectable();
		}
	}

	if(this.firing){
		this.gun.rotate(this.gunRotation,this.gun.x, this.gun.y, 3, 0 );
	}else{
		this.drawExplosion();
	} //end case in firing
};

Player.prototype.drawGunIcon = function(x, y){
	this.gun.render(x,y);
};

Player.prototype.drawLineToGrab = function(){
	//draw the line to the grab
	this.context.beginPath();
	this.context.moveTo(this.defaultGrabX , this.defaultGrabY);
	this.context.lineTo(this.grab.x, this.grab.y);
	this.context.stroke();
};

Player.prototype.drawCurrentCollectable = function(){
	var collectable = this.currentCollectable;
	collectable.sprite.render();
};

Player.prototype.updatePlayer = function(coins,otherPlayer){
	this.updateGrab(otherPlayer);
	if(this.currentCollectable != null){
		if(this.currentCollectable.sprite != null){
			this.updateCurrentCollectable();
		}
	}

	if(this.firing){
		this.updateGun(coins,otherPlayer);	
	}
	//if the gun is not firing, allow next fire
	if(!this.firing && this.score>=200 && this.timer >= 3 * framePerSecond){
		this.canFire = true;
		this.timer = 0;
	}

	if(this.timer <= 3 * framePerSecond){
		this.timer ++;
	}
};
//update playerScore

Player.prototype.updateScore = function(display){
	var n = this.score;
	for(var i = display.length-1; i > 0; i--){
		display[i].columnIndex = Math.round(n % 10);
		n = Math.floor(n/10);
	}
};

Player.prototype.updateGrab = function(otherPlayer){
	//add minus sign at the front because clockwise is negative, counterclockwise is positive
	this.grab.x += (this.grabSpeedX);
	this.grab.y += (this.grabSpeedY );

	//reset the shift of pictures
	//if grab is out of the box, put it backward
	if(this.grab.x >= this.canvas.width - this.grab.getFrameWidth()  || 
		this.grab.y >= this.canvas.height - this.grab.getFrameHeight() ||
		this.grab.x  <= this.grab.getFrameHeight()){
		this.grabSpeedX *= -1;
		this.grabSpeedY *= -1;
	}else if( !this.currentCollectable && isOverlapWithCollectables(this, otherPlayer)){
		//if player is overlap with a collectable and player is not holding a collectable, 
		//pull the grab back
		this.grab.columnIndex = 1; 
		if(this.currentCollectable.sprite.scaleRatio < 0.7){
			this.grabSpeedX *= -1 / ( Math.pow(3,this.currentCollectable.sprite.scaleRatio - 0.5));
			this.grabSpeedY *= -1 / ( Math.pow(3,this.currentCollectable.sprite.scaleRatio - 0.5));	
		}else{
			this.grabSpeedX *= -1 / ( Math.pow(3,this.currentCollectable.sprite.scaleRatio));
			this.grabSpeedY *= -1 / ( Math.pow(3,this.currentCollectable.sprite.scaleRatio));	
		}
	}

	if(this.grabSpeedY < 0 && Math.round(this.grab.x) <= this.defaultGrabX +5 && 
			 Math.round(this.grab.x) >= this.defaultGrabX - 5 &&
			 Math.round(this.grab.y) <= this.defaultGrabY){
		//reset the position of grab
		this.grab.x = this.defaultGrabX;
		this.grab.y = this.defaultGrabY;
		//stop the grab moving
		this.grabSpeedX = 0;
		this.grabSpeedY = 0;
		//start rotation again
		this.rotationSpeed = 0.05;
		//reset frame
		this.grab.columnIndex = 0;
		if(this.currentCollectable != null){
			this.score += this.currentCollectable.score;
			this.currentCollectable = null;

		}
	} //end judge grab
};

Player.prototype.updateCurrentCollectable = function(){
	//create short-hand objects for convinience
	var collectable = this.currentCollectable;
	var thisGrab = this.grab;
	//set the positio of the collectable to near the grab by a length of radius
	var buttomCenterX = thisGrab.x  + thisGrab.getFrameHeight() * Math.sin(-this.grabRotation) - collectable.radius;
	var buttomCenterY = thisGrab.y + thisGrab.getFrameHeight() * Math.cos(-this.grabRotation) - collectable.radius;
	//set the sprite to the last frame
	collectable.sprite.columnIndex = collectable.sprite.numberOfColomns - 1; //the index starts from 0
	collectable.sprite.x = buttomCenterX + collectable.radius * Math.sin(-this.grabRotation);
	collectable.sprite.y = buttomCenterY + collectable.radius * Math.cos(-this.grabRotation);
};

//update the gun according to the coins
//list(collectables)
Player.prototype.updateGun = function(coins, otherPlayer){
	this.gun.x = this.gun.x + Math.sin(-this.gunRotation)*this.gunSpeedX;
	this.gun.y = this.gun.y + Math.cos(-this.gunRotation)*this.gunSpeedY;
	for(var i = 0; i < coins.length; i++){
		if(this.gun.isOverlap(coins[i].sprite)){
			//reset the current explosion
			this.resetExplosion(coins[i].sprite.x - coins[i].radius, coins[i].sprite.y- coins[i].radius, coins[i].sprite.scaleRatio);
			coins.splice(i,1);
			this.firing = false;
		}
	} //end loop through collectable on field
	//check collectable in grab
	if(this.currentCollectable){
		if(this.currentCollectable.sprite){
			if(this.gun.isOverlap(this.currentCollectable.sprite)){
				var tmp = this.currentCollectable;
				this.resetExplosion(tmp.sprite.x - tmp.radius, tmp.sprite.y- tmp.radius, tmp.sprite.scaleRatio);
				this.firing = false;
				//dellete current collectable
				this.currentCollectable = null;
				//set speed to normal
				this.grabSpeedX = - this.defaultGrabSpeedX * Math.sin(-this.grabRotation);
				this.grabSpeedY = - this.defaultGrabSpeedY * Math.cos(-this.grabRotation);
				//put grab frame to 0
				this.grab.columnIndex = 0;
			}
		}	
	}

	if(otherPlayer.currentCollectable != null){
		if(otherPlayer.currentCollectable.sprite != null){
			if(this.gun.isOverlap(otherPlayer.currentCollectable.sprite)){
				var tmp = otherPlayer.currentCollectable;
				this.resetExplosion(tmp.sprite.x - tmp.radius, tmp.sprite.y- tmp.radius, tmp.sprite.scaleRatio);
				this.firing = false;
				//dellete current collectable
				otherPlayer.currentCollectable = null;
				//set speed to normal
				otherPlayer.grabSpeedX = - otherPlayer.defaultGrabSpeedX * Math.sin(-otherPlayer.grabRotation);
				otherPlayer.grabSpeedY = - otherPlayer.defaultGrabSpeedY * Math.cos(-otherPlayer.grabRotation);
				//put grab frame to 0
				otherPlayer.grab.columnIndex = 0;
			}
		}
	}

	if(this.gun.x > this.canvas.width || this.gun.x < 0 || this.gun.y >canvas.height || this.gun.y < 0 ){
		this.firing = false;
	}
};

//find if a player's grab is overlap with any collectables or other player's collectable
var isOverlapWithCollectables = function(thisPlayer, otherPlayer){
	for(var i = 0; i < coins.length; i++){	
		//uses 10 to make it more close to the coin
		if(isOverlapWithOneCollectable(thisPlayer, coins[i])){
			thisPlayer.currentCollectable = coins[i];
			coins.splice(i,1); //remove this collectable from the array list
			return true;
		}
	}
	if(otherPlayer != null && otherPlayer.currentCollectable != null){
		if(otherPlayer.currentCollectable.sprite != null){
			if(isOverlapWithOneCollectable(thisPlayer, otherPlayer.currentCollectable)){
				thisPlayer.currentCollectable = otherPlayer.currentCollectable;
				otherPlayer.currentCollectable = new Collectable(null, 0);
				//set speed of other player to normal
				otherPlayer.grabSpeedX = -otherPlayer.defaultGrabSpeedX * Math.sin(-otherPlayer.grabRotation);
				otherPlayer.grabSpeedY = -otherPlayer.defaultGrabSpeedY * Math.cos(-otherPlayer.grabRotation);
				//put grab of otherplayer frame to 0
				otherPlayer.grab.columnIndex = 0;
				return true;
			}
		}
	}

	return false;
};

var isOverlapWithOneCollectable = function(thisPlayer, collectable){
	var player = thisPlayer;
	var thisGrab = thisPlayer.grab;
	//add minus sign to the angle because clockwise is negative, counterclockwise is positive.
	var buttomCenterX = thisGrab.x  + thisGrab.getFrameHeight() * Math.sin(-player.grabRotation);
	var buttomCenterY = thisGrab.y + thisGrab.getFrameHeight() * Math.cos(-player.grabRotation); 

	var buttomLeftX = buttomCenterX - (thisGrab.getFrameWidth() / 2 - 5) * Math.cos(-player.grabRotation);
	var buttomLeftY = buttomCenterY + (thisGrab.getFrameWidth() / 2 - 5) * Math.sin(-player.grabRotation);
	var buttomRightX = buttomCenterX + (thisGrab.getFrameWidth() / 2 - 5) * Math.cos(-player.grabRotation);
	var buttomRightY = buttomCenterY - (thisGrab.getFrameWidth() / 2 - 5) * Math.sin(-player.grabRotation);
	//find the position of the center
	//the collectable sprite are all is squares, use circle to approach the shape
	var radius = collectable.sprite.getFrameWidth()/2;
	var coinCenterX = collectable.sprite.x + radius;
	var coinCenterY = collectable.sprite.y + radius;
	//get the shortest distance from the center to the buttom 3 points;
	var distanceX = findMin(Math.abs(buttomCenterX - coinCenterX),
							Math.abs( buttomLeftX - coinCenterX),
							Math.abs(buttomRightX - coinCenterX));
	var distanceY = findMin(Math.abs(buttomCenterY - coinCenterY),
							Math.abs(buttomLeftY - coinCenterY),
							Math.abs(buttomRightY - coinCenterY));
	var distance = Math.sqrt(Math.pow(distanceX,2) + Math.pow(distanceY,2));
	if(distance < radius-10 * collectable.sprite.scaleRatio){
		return true;
	}else{
		return false;
	}
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


