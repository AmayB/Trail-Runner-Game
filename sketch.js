var boy, boyImg;
var powerUpSound,winSound,gameOverSound,backgroundMusic;
var gameOver, gameOverImg, restart, restartImg, goodJob, goodJobImg;
var rockImg, logImg, obstaclesGroup;
var monster1, monster1Img, monster2, monster2Img, monster3, monster3Img, monsterGroup;
var powerUp, powerUpImg, powerUpGroup;
var start, startImg, welcome, welcomeImg;
var finishLine, finishLineImg;
var trail, trailImg;
var checkpoint;
var gameState;
var score = 0;

function preload() {
    boyImg = loadImage("Images/boy.png");
    gameOverImg = loadImage("Images/gameOver.png");
    restartImg = loadImage("Images/restart.png");
    monster1Img = loadImage("Images/monster1.png");
    monster2Img = loadImage("Images/monster2.png");
    monster3Img = loadImage("Images/monster3.png");
    powerUpImg = loadImage("Images/powerUp.png");
    trailImg = loadImage("Images/trail.jpg");
    welcomeImg = loadImage("Images/welcome.png");
    rockImg = loadImage("Images/rock.png");
    logImg = loadImage("Images/log.png");
    finishLineImg = loadImage("Images/finishLine.png")
    powerUpSound = loadSound("Images/powerUpSound.mp3");
    gameOverSound = loadSound("Images/gameOverSound.wav");
    winSound = loadSound("Images/win.wav");
    backgroundMusic = loadSound("Images/backgroundMusic.mp3");
}

function setup() {
    createCanvas(600,1000);



    trail = createSprite(300,500);
    trail.addImage("trail",trailImg);
    trail.scale = 3;

    boy = createSprite(300,700,20,20);
    boy.addImage("boy",boyImg);
    boy.scale = 0.3;
    boy.setCollider("rectangle",-10,0,130,300);

    start = createImg("Images/start.png");
    start.position(250,500);
    start.size(100,100);
    start.mouseClicked(startGame);

    welcome = createSprite(300,300,20,20);
    welcome.addImage("welcome",welcomeImg);

    checkpoint = createSprite(300,200,600,500)
    checkpoint.visible = false;

    gameOver = createSprite(300,300,20,20);
    gameOver.addImage("gameover", gameOverImg);
    gameOver.scale = 0.5;
    gameOver.visible = false;

    restart = createImg("Images/restart.png");
    restart.position(250,400);
    restart.hide();
    restart.size(100,100);
    restart.mouseClicked(restartGame);

    finishLine = createSprite(300,50,10,10);
    finishLine.addImage("finish", finishLineImg);
    finishLine.scale = 1.5;
    finishLine.setCollider("rectangle", -10,0,600,80)



    monsterGroup = new Group();
    powerUpGroup = new Group();
    obstaclesGroup = new Group();

    score = 0;
}

function draw() {
    background(0);
    textSize(20);
    fill("black");
    text("Score"+score,100,100);
    if (gameState === "play") {
        start.visible = false;
        restart.visible = false;
        welcome.visible = false;

        score = score + Math.round(getFrameRate()/60);


        trail.velocityY = 1;

        if (trail.y > 1120){
            trail.y = trail.height/2;
        }

        if(keyDown(LEFT_ARROW)) {
            boy.x = boy.x + -6;
        }
        if(keyDown(RIGHT_ARROW)) {
            boy.x = boy.x + 6;
        }

        spawnMonsters();
        spawnPowerUps();

        if(boy.isTouching(checkpoint)) {
            spawnObstacles();
            spawnPowerUps();
            if(keyDown(LEFT_ARROW)) {
                boy.x = boy.x + -6.5;
            }
            if(keyDown(RIGHT_ARROW)) {
                boy.x = boy.x + 6.5;
            }
        }


        if(powerUpGroup.isTouching(boy)) {
            boy.velocityY = -6;
            powerUpSound.play();
            powerUpSound.setVolume(0.1);
        }
        else {
            boy.velocityY = 0;
        }

        if(boy.isTouching(finishLine)) {
            finish();
            winSound.play();
        }

        if (monsterGroup.isTouching(boy)||obstaclesGroup.isTouching(boy)) {
            gameState = "end";
            gameOverSound.play();
        }


    }
    else if (gameState === "end") {
        trail.velocityY = 0;
        boy.velocityY = 0;
        gameOver.visible = true;
        restart.show();
    }
    drawSprites();
}

function spawnObstacles() {
    if(frameCount % 60 === 0) {
        var obstacles = createSprite(300,-20,20,30);
        obstacles.x = Math.round(random(30,570));
        obstacles.velocityY = 3;
        var rand = Math.round(random(1,2));
        switch(rand) {
            case 1: obstacles.addImage(rockImg);
                break;
            case 2: obstacles.addImage(logImg);
                break;
            default: break;
        }

        obstacles.scale = 0.15;
        obstacles.lifetime = 300;
        obstacles.depth = boy.depth;
        boy.depth = boy.depth + 1;
        obstaclesGroup.add(obstacles);
    }
}

function spawnMonsters() {
    if(frameCount % 60 === 0) {
      var monsters = createSprite(300,-20,20,30);
    
      monsters.x = Math.round(random(30,570));

      monsters.velocityY = 6;
      
      var rand = Math.round(random(1,3));
      switch(rand) {
        case 1: monsters.addImage(monster1Img);
                break;
        case 2: monsters.addImage(monster2Img);
                break;
        case 3: monsters.addImage(monster3Img);
                break;
        default: break;
      }
               
      monsters.scale = 0.2;
      monsters.lifetime = 300;
      monsters.depth = boy.depth;
      boy.depth +=1;
      monsterGroup.add(monsters);
    }
}

function spawnPowerUps() {
    if(frameCount % 60 === 0) {
        powerUp = createSprite(300,-20,20,30);
        powerUp.x = Math.round(random(1800,40));
        powerUp.addImage(powerUpImg);
        powerUp.scale = 0.15;
        powerUp.velocityY = 15;
        powerUp.lifetime = 200;
        powerUp.depth = boy.depth;
        boy.depth = boy.depth + 1;
        powerUpGroup.add(powerUp);
    }
}

function finish() {
    swal(
        {
        title: 'You Finished!!!',
        text: "Great Job",
        confirmButtonText: "Play Again" 
        },
        function (isConfirm) {
            if(isConfirm) {
                location.reload();
            }
        }
    );
}

function restartGame() {
    gameState = "start";
    welcome.visible = true;
    start.show();
    boy.y = 700;
    boy.x = 300;
    gameOver.visible = false;
    restart.hide();
    monsterGroup.destroyEach();
    powerUpGroup.destroyEach();
    score = 0;
}

function startGame() {
    gameState = "play";
    start.hide();
}