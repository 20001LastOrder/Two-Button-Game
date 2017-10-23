//this class for animation a Sprite
//
//Sprite with single row
//set repeat play as default
function Sprite(context, width, height, img,nOf){
	//this.initialize
	this.context = context;
	this.frameIndex = 0;
	this.rowIndex = 0;
	this.colomnIndex = 0;
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


Sprite.prototype.animation = function(isRepeat){
	this.isRpeat = isRepeat;
	this.update();
	if(this.needContinue){
		this.render();
	}
};

Sprite.prototype.animation = function(isRepeat,x,y){
	this.isRepeat = isRepeat;
	this.update();
	if(this.needContinue){
		this.render(x,y);
	}
};

Sprite.prototype.update = function(){
	this.tickCount++;
	if(this.tickCount > this.ticksPerFrame){
		this.tickCount = 0;
		//move frames horizontally first and then move it vertically
		if(this.frameIndex < this.numberOfFrames-1){
			this.frameIndex++;
			if(this.colomnIndex < this.numberOfColomns-1){
				this.colomnIndex++;
			}else{
				this.colomnIndex = 0;
				if(this.rowIndex < this.numberOfRows-1){
					this.rowIndex++;
				}else{
					this.rowIndex = 0;
				}
			}
		}else{
			//reset colonms and rows when all frames are done
			this.frameIndex = 0;
			this.rowIndex = 0;
			this.colomnIndex = 0;
		} //end if
	}
};

//function for draw the graph;
Sprite.prototype.render = function(x,y){
	this.x = x;
	this.y = y;
	this.context.drawImage(
			this.img,                                        
			this.colomnIndex*this.width/this.numberOfColomns,   //local x
			(this.rowIndex)*this.height /this.numberOfRows, //ly
			this.width/this.numberOfColomns,                  //lw
			this.height/this.numberOfRows,                   //lh
			x,                                               //convas x
			y,                                               //cy
			this.width/this.numberOfColomns*this.scaleRatio, //cw
			this.height/this.numberOfRows*this.scaleRatio    //ch
		);
};

Sprite.prototype.render = function(){
	this.context.drawImage(
			this.img,                                        
			this.colomnIndex*this.width/this.numberOfColomns,   //local x
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
	}
	return false;
};