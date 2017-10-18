//this class for animation a Sprite
//
//Sprite with single row
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
}

//for multi rows of sprite sheet
Sprite.prototype.setDimensions = function(rows, colomns){
	this.numberOfRows = rows;
	this.numberOfColomns = colomns;
};


Sprite.prototype.animation = function(isRepeat){

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