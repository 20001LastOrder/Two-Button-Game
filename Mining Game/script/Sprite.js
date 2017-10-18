//this class for animation a Sprite
function Sprite(context, width, height, img,nOf){
	//this.initialize(this, width,height,img, nOf);
	this.context = context;
	this.frameIndex = 0;
	this.tickCount = 0;
	this.ticksPerFrame = 1;
	this.numberOfFrames = nOf;
	this.width = width;
	this.height = height;
	this.img = img;
	this.scaleRatio = 1;
}

Sprite.prototype.animation = function(isRepeat){

};

Sprite.prototype.update = function(){
	this.tickCount++;
	if(this.tickCount > this.ticksPerFrame){
		this.tickCount = 0;
		if(this.frameIndex < this.numberOfFrames -1){
			this.frameIndex++;
		}else{
			this.frameIndex = 0;
		} //end if
	}
};

//function for draw the graph;
Sprite.prototype.render = function(x,y){
	this.context.drawImage(
			this.img,                                        
			this.frameIndex*this.width/this.numberOfFrames,  //local x
			0,                                               //ly
			this.width/this.numberOfFrames,                  //lw
			this.height,                                     //lh
			x,                                               //convas x
			y,                                               //cy
			this.width/this.numberOfFrames*this.scaleRatio,  //cw
			this.height*this.scaleRatio                      //ch
		);
};