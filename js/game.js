var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,//360,
    height: window.innerHeight,//640,
    physics: {
    	default: 'arcade',
    	arcade: {
    		gravity: {y:0},
    		debug:false
    	}

    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var devicePixelRatio;

var background;
var topbar;
var leftbar;
var rightbar;
var ball;
var paddle;
var scoreText;

var brickGroup;
var startBall;

function preload ()
{

	 this.load.image('sky', 'images/sky.png');
	 this.load.image('top', 'images/top.png');
	 this.load.image('sides', 'images/sides.png');
	 this.load.image('brick', 'images/yellowbrick.png');
	 this.load.image('ball', 'images/ball.png');
	 this.load.image('paddle', 'images/paddle.png');
	 console.log("sky loaded");

	 console.log("w:"+window.innerWidth+" h:"+window.innerHeight);
	 devicePixelRatio = window.devicePixelRatio;
	 console.log("dpr:"+devicePixelRatio);
}



function create ()
{
	
	//background
	background = this.add.image(window.innerWidth/2, window.innerHeight/2, 'sky');
	background.setScale(devicePixelRatio*4,devicePixelRatio*2);

	

	//sides
	leftbar = this.physics.add.image((window.innerWidth/2)-(195 * devicePixelRatio),window.innerHeight/2,'sides');
	leftbar.setScale(devicePixelRatio*2,devicePixelRatio*10);
	leftbar.body.immovable = true;

	rightbar = this.physics.add.image((window.innerWidth/2)+(195 * devicePixelRatio),window.innerHeight/2,'sides');
	rightbar.setScale(devicePixelRatio*2,devicePixelRatio*10);
	rightbar.body.immovable = true;

	//top bar
	topbar = this.physics.add.image(window.innerWidth/2,20 *devicePixelRatio,'top');
	topbar.setScale(devicePixelRatio*10,devicePixelRatio*2);
	topbar.body.immovable = true;

	//bricks
	//brickGroup = this.physics.add.staticGroup();
	brickGroup = this.physics.add.group();
	console.log(brickGroup);
	for (var i = 0; i < 5;i++){
		for (var j = 0; j < 5; j++){
			//					the horizontal spacing between bricks (i*x*dPR), shift should be 2x spacing (2x*dPR)
			brick = this.physics.add.image(window.innerWidth/2 + (i*50*devicePixelRatio - (100*devicePixelRatio)),(devicePixelRatio * 100) +(26*devicePixelRatio * j), 'brick');
			brick.setScale(devicePixelRatio * 1.5,devicePixelRatio * 1.5);
			brickGroup.add(brick);
		}
		
		
	}

	//this makes the bricks static
	brickGroup.children.iterate(function (child){
		child.body.immovable = true;
	});
	
	//ball
	ball = this.physics.add.image(window.innerWidth/2, window.innerHeight - (95 * devicePixelRatio), 'ball');
	ball.setBounce(1.0);
	//ball.setCollideWorldBounds(true);
	//
	ball.setScale(devicePixelRatio * 0.8,devicePixelRatio * 0.8);

	//paddle
	paddle = this.physics.add.image(window.innerWidth/2, window.innerHeight - (40 * devicePixelRatio) , 'paddle');
	paddle.setCollideWorldBounds(true);
	paddle.body.immovable = true;
	paddle.setScale(devicePixelRatio,devicePixelRatio);

	//collision detections
	this.physics.add.collider(ball, topbar);
	this.physics.add.collider(ball, leftbar);
	this.physics.add.collider(ball, rightbar);
	this.physics.add.collider(paddle,ball,hitBall,null,this);
	this.physics.add.collider(brickGroup,ball,hitBrick,null,this);


	scoreText = this.add.text(9, 9, 'Score: 0', { font: 20 * devicePixelRatio+"px Arial", fill: "#ffffff", align: "left" });

	score = 0;
	startBall = true;

	ball.body.setVelocityY(300 * devicePixelRatio);
	console.log(this.input);
	console.log(game.input);
	console.log(this.input.onTap);
	console.log(game.input.onTap);
	//this.input.onTap.add(this.onTap,this);
}

function update ()
{
	if (this.input.activePointer.isDown){

		console.log(this.input.x - paddle.x);
		if (this.input.x <= paddle.x){
			if ((this.input.x - paddle.x) > -15){
				paddle.body.setVelocityX(0);
				paddle.x = this.input.x;
				
			}
			else {
				paddle.body.setVelocityX(-250 * devicePixelRatio);
			}
			//console.log("left");
		}	
		else {
			if ((this.input.x - paddle.x) < 15){
				paddle.body.setVelocityX(0);
				paddle.x = this.input.x;
				
			}
			else {
				paddle.body.setVelocityX(-250 * devicePixelRatio);
			}
			paddle.body.setVelocityX(250 * devicePixelRatio);
			//console.log("right");
		}
		
	}
	
	else{
		paddle.body.setVelocityX(0);
	}

}

function hitBall (paddle,ball){
	console.log("hitball");

	//console.log(ball);
	var x = paddle.x - ball.x;
	x *= 10;
	ball.body.setVelocityX(-x);
}

function hitBrick(ball,brick){
	score += 1;
	scoreText.setText('Score: '+score);

	brick.destroy();

}

function onTap(pointer, doubleTap){
	console.log("tap");
}