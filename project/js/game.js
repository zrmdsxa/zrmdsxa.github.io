var config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
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

var topbar;
var ball;
var paddle;
var text;

function preload ()
{
	 this.load.image('sky', 'images/sky.png');
	 this.load.image('top', 'images/top.png');
	 this.load.image('brick', 'images/yellowbrick.png');
	 this.load.image('ball', 'images/ball.png');
	 this.load.image('paddle', 'images/paddle.png');
	 console.log("sky loaded");
}



function create ()
{

	//background
	this.add.image(400, 340, 'sky');

	//top bar
	topbar = this.physics.add.staticGroup();
	topbar.create(180,20,'top');

	//bricks
	this.add.image(180, 200, 'brick');

	//ball
	ball = this.physics.add.image(180, 550, 'ball');
	ball.setBounce(1.0);
	ball.setCollideWorldBounds(true);
	ball.body.setVelocityY(300);

	//paddle
	paddle = this.physics.add.image(180, 600, 'paddle');
	paddle.setCollideWorldBounds(true);
	paddle.body.immovable = true;

	this.physics.add.collider(ball, topbar);

	//this.physics.add.overlap(paddle,ball,hitBall,null,this,false);
	this.physics.add.collider(paddle,ball,hitBall,null,this);
	//text = this.add.text(9, 9, 'test:x', { font: "20px Arial", fill: "#ffffff", align: "left" });

}

function update ()
{
	if (this.input.activePointer.isDown){
		//console.log(this.input.x);
		if (this.input.x <= paddle.x){
			paddle.body.setVelocityX(-250);
			//console.log("left");
		}	
		else {
			paddle.body.setVelocityX(250);
			//console.log("right");
		}
		
	}
	else{
		paddle.body.setVelocityX(0);
	}
}

function hitBall (paddle,ball){
	console.log("hitball");
	console.log(ball.body);
	//console.log(ball);
	var x = paddle.x - ball.x;
	x *= 5;
	ball.body.setVelocityX(-x);
}