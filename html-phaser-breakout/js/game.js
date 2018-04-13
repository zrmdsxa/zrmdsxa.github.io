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
var sides;
var ball;
var paddle;
var scoreText;
var tapStartText;
var finalScoreText;

var brickGroup;
var remainingBricks;
var startBall;
var startGame;
var endGame;

var ballStartX;
var ballStartY;

var paddleMinX;
var paddleMaxX;

var sideX = 180;

var paddleSpeed = 300;

var music;
var paddlehit;
var wallhit;
var brickhit;
var loseball;

function preload ()
{
	var loadingText = this.add.text(window.innerWidth/2, window.innerHeight/2.3, 'Loading', { font: 30 * devicePixelRatio+"px Arial", fill: "#ffffff", align: "center" });
	loadingText.setOrigin(0.5,0);

	var progress = this.add.graphics();

    this.load.on('progress', function (value) {

        progress.clear();
        progress.fillStyle(0xffffff, 1);
        progress.fillRect(0, window.innerHeight/2, 800 * value, 60);

    });

    this.load.on('complete', function () {

        progress.destroy();

    });

	 this.load.image('sky', 'images/sky.png');
	 this.load.image('top', 'images/top.png');
	 this.load.image('sides', 'images/sides.png');
	 this.load.image('brick', 'images/yellowbrick.png');
	 this.load.image('ball', 'images/ball.png');
	 this.load.image('paddle', 'images/paddle.png');
	 this.load.image('image', 'images/image.png');
	 console.log("images loaded");

	 console.log("w:"+window.innerWidth+" h:"+window.innerHeight);
	 devicePixelRatio = window.devicePixelRatio;
	 console.log("dpr:"+devicePixelRatio);

	 this.load.audio('paddlehit', 'sound/paddlehit.mp3');
	 this.load.audio('wallhit', 'sound/wallhit.mp3');
	 this.load.audio('brickhit', 'sound/brickhit.mp3');
	 this.load.audio('loseball', 'sound/loseball.mp3');
	 //this.load.audio('music', 'sound/music.mp3');
	 this.load.audio('music', 'sound/musicmed.mp3');
}



function create ()
{
	

	//background
	background = this.add.image(window.innerWidth/2, window.innerHeight/2, 'sky');
	background.setScale(devicePixelRatio*4,devicePixelRatio*2);

	var image = this.add.image(window.innerWidth/2, (devicePixelRatio * 310), 'image');
	image.setScale(0.44 * devicePixelRatio, 0.44 * devicePixelRatio);

	//sides
	sides = this.physics.add.staticGroup();
	sides.create((window.innerWidth/2)-(sideX * devicePixelRatio),window.innerHeight/2,'sides').setScale(devicePixelRatio*2,devicePixelRatio*10).refreshBody();
	sides.create((window.innerWidth/2)+(sideX * devicePixelRatio)-(2*devicePixelRatio),window.innerHeight/2,'sides').setScale(devicePixelRatio*2,devicePixelRatio*10).refreshBody();

	var testSide = this.add.image(0,0,'sides');
	testSide.setScale(devicePixelRatio*2,devicePixelRatio*10);

	var half = testSide.width * devicePixelRatio;
	console.log(half);
	testSide.destroy();

	//top bar
	topbar = this.physics.add.image(window.innerWidth/2,20 *devicePixelRatio,'top');
	topbar.setScale(devicePixelRatio*10,devicePixelRatio*2);
	topbar.body.immovable = true;

	//bricks
	//brickGroup = this.physics.add.staticGroup();
	brickGroup = this.physics.add.group();
	remainingBricks	= 0;
	console.log(brickGroup);
	for (var i = 0; i < 5;i++){
		for (var j = 0; j < 10; j++){
			//					the horizontal spacing between bricks (i*x*dPR), shift should be 2x spacing (2x*dPR)
			brick = this.physics.add.image(window.innerWidth/2 + (i*50*devicePixelRatio - (100*devicePixelRatio)),(devicePixelRatio * 90) +(26*devicePixelRatio * j), 'brick');
			brick.setScale(devicePixelRatio * 1.5,devicePixelRatio * 1.5);
			brickGroup.add(brick);
			remainingBricks++;
		}
		
		
	}

	//this makes the bricks static
	brickGroup.children.iterate(function (child){
		child.body.immovable = true;
	});
	
	//ball
	ballStartX = window.innerWidth/2;
	ballStartY = window.innerHeight - (95 * devicePixelRatio);
	ball = this.physics.add.image(ballStartX, ballStartY, 'ball');
	ball.setBounce(1.0);

	var ballSize = 0.5;
	ball.setScale(devicePixelRatio * ballSize,devicePixelRatio * ballSize);

	//paddle
	paddle = this.physics.add.image(window.innerWidth/2, window.innerHeight - (40 * devicePixelRatio) , 'paddle');
	paddle.setCollideWorldBounds(true);
	paddle.body.immovable = true;
	paddle.setScale(devicePixelRatio,devicePixelRatio);

	paddleMinX = (window.innerWidth/2)-(sideX * devicePixelRatio) + half + (paddle.width/2 * devicePixelRatio);
	paddleMaxX = (window.innerWidth/2)+(sideX * devicePixelRatio)-(2*devicePixelRatio) - half - (paddle.width/2 * devicePixelRatio);

	console.log(ball.x);
	console.log(paddle.x);
	console.log(window.innerWidth/2);

	//collision detections

	this.physics.add.collider(ball, topbar, hitWall);
	this.physics.add.collider(ball, sides, hitWall);
	this.physics.add.collider(paddle, sides);

	this.physics.add.collider(paddle,ball,hitBall,null,this);
	this.physics.add.collider(brickGroup,ball,hitBrick,null,this);
	


	scoreText = this.add.text(9, 9, 'Score: 0', { font: 20 * devicePixelRatio+"px Arial", fill: "#ffffff", align: "left" });
	tapStartText = this.add.text(window.innerWidth/2, window.innerHeight/1.333, 'Tap to Start', { font: 30 * devicePixelRatio+"px Arial", fill: "#000000", align: "left" });
	tapStartText.setOrigin(0.5,0); //the align option doesnt even work
	finalScoreText = this.add.text(window.innerWidth/2, window.innerHeight/1.333, 'Your Score: -1', { font: 30 * devicePixelRatio+"px Arial", fill: "#000000", align: "center" });
	finalScoreText.setOrigin(0.5,0);
	finalScoreText.visible = false;
	score = 0;
	startBall = true;
	startGame = true;
	endGame	= false;
	
	this.input.on('pointerdown',onPointerDown,this);

	music = this.sound.add('music');
	music.volume = 0.3;
	music.loop = true;
	music.play();
	console.log(music);

	paddlehit = this.sound.add('paddlehit');
	//paddlehit.volume = 0.1;

	wallhit = this.sound.add('wallhit');
	//music.volume = 0.1;

	brickhit = this.sound.add('brickhit');
	//music.volume = 0.1;

	loseball = this.sound.add('loseball');

	//testing ball going through side walls
	//this.add.image((window.innerWidth/2)-(sideX * devicePixelRatio)+ (40 * devicePixelRatio),window.innerHeight/2,'ball');
	//this.add.image((window.innerWidth/2)+(sideX * devicePixelRatio)- (40 * devicePixelRatio),window.innerHeight/2,'ball');
}

function update ()
{
	if (this.input.activePointer.isDown){

		//console.log(this.input.x - paddle.x);
		if (this.input.x <= paddle.x){
			if ((this.input.x - paddle.x) > (-7*devicePixelRatio)){
				paddle.body.setVelocityX(0);
				paddle.x = this.input.x;
				
			}
			else {
				paddle.body.setVelocityX(-paddleSpeed * devicePixelRatio);
			}
			//console.log("left");
		}	
		else {
			if ((this.input.x - paddle.x) < (7*devicePixelRatio)){
				paddle.body.setVelocityX(0);
				paddle.x = this.input.x;
				
			}
			else {
				paddle.body.setVelocityX(paddleSpeed * devicePixelRatio);
			}
			//console.log("right");
		}
		
	}
	
	else{
		paddle.body.setVelocityX(0);
	}


	if(ball.y >= window.innerHeight){
		loseball.play();
		startBall = true;

		ball.body.setVelocityX(0);
		ball.body.setVelocityY(0);

		paddle.x = ballStartX;
		ball.x = ballStartX;
		ball.y = ballStartY;

		score = 0;
		scoreText.setText('Score: '+score);

		
	}

	if(paddle.x < paddleMinX){
		paddle.x = paddleMinX;
	}
	else if(paddle.x > paddleMaxX){
		paddle.x = paddleMaxX;
	}

	if(ball.x < (window.innerWidth/2)-(sideX * devicePixelRatio) + (40 * devicePixelRatio)){
		ball.x = (window.innerWidth/2)-(sideX * devicePixelRatio) + (45 * devicePixelRatio);
	}
	else if(ball.x > (window.innerWidth/2)+(sideX * devicePixelRatio) - (45 * devicePixelRatio)){
		ball.x = (window.innerWidth/2)+(sideX * devicePixelRatio) - (45 * devicePixelRatio);
	}

	if(startBall){
		paddle.x = ballStartX;
		ball.x = ballStartX;
		ball.y = ballStartY;
	}

}

function hitBall (paddle,ball){
	console.log("hitball");
	paddlehit.play();

	//console.log(ball);
	var x = paddle.x - ball.x;
	x *= 10;
	ball.body.setVelocityX(-x);
}

function hitBrick(ball,brick){
	brickhit.play();
	score += 1;
	scoreText.setText('Score: '+score);
	remainingBricks--;
	//brick.destroy();
	brick.disableBody(true,true); //hides the bricks

		console	.log(remainingBricks);
	if(remainingBricks == 0){
		finalScoreText.visible = true;
		finalScoreText.setText('Your score: '+score);
		ball.body.setVelocityX(0);
		ball.body.setVelocityY(0);

		endGame	= true;
	}

}


function hitWall(){
	console.log("hit wall");
	wallhit.play();
}

function onPointerDown(pointer, gameObjects){
	console.log("pointerdown");
	if(startBall){
		startBall = false;

		ball.body.setVelocityY(300 * devicePixelRatio);
	}
	if (startGame){
		startGame = false;
		tapStartText.visible = false;
	}
	if (endGame){
		startBall = true;
		startGame = true;
		endGame	= false;

		tapStartText.visible = true;
		finalScoreText.visible = false;
		score = 0;
		scoreText.setText('Score: '+score);

		ball.x = ballStartX;
		ball.y = ballStartY;

		brickGroup.children.each(function (brick) {

            brick.enableBody(false, 0, 0, true, true);
            remainingBricks++;

        });
	}
}