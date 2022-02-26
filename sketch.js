var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var trex, trex_running, trex_collide, edges;
var groundImage,ground, ground2;
var cloud, cloudimg;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var obstaclegroup, cloudsgroup;
var score = 0;
var jump, checkpoint, die;
var gameover, gameoverimg, restart, restartimg;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collide = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudimg = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  gameoverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");

}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //crear sprite de Trex
  trex = createSprite(50,height/2,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collide", trex_collide);
  edges = createEdgeSprites();
  
  //agregar tamaño y posición al Trex
  trex.scale = 0.5;
  trex.x = 50

  ground = createSprite(width/2,height/2 + 10,width,20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width/2;

  ground2 = createSprite(width/2,height/2 + 20,width,10);
  ground2.visible = false;
  obstaclegroup = createGroup();
  cloudsgroup = createGroup();
  trex.debug = false
  trex.setCollider("circle", 0, 0, 35);

  gameover = createSprite(width/2,height/2 - 100);
  gameover.addImage("gameover", gameoverimg);
  gameover.scale = 0.5;
  restart = createSprite(width/2,height/2 - 50);
  restart.addImage("restart", restartimg);
  restart.scale = 0.5;
  gameover.visible = false;
  restart.visible = false;
}


function draw(){
  //establecer color de fondo.
  background("white");
  text ("score: "+ score,width - 200,50);
  
  if(gamestate == PLAY){
    score = score+ Math.round(getFrameRate()/60);
    ground.velocityX = -6;
    if(ground.x<0){
      ground.x = ground.width/2;   
    }
  //hacer que el Trex salte al presionar la barra espaciadora
    if(keyDown("space")&& trex.y >= height/2 - 10){
      trex.velocityY = -8;
      jump.play();
    }
    if(touches.length > 0 && trex.y >= height/2 - 10){
      trex.velocityY = -8;
      jump.play();
      touches = [];
    }
        //asigna gravedad al t-rex
    trex.velocityY = trex.velocityY + 0.5;
    clouds();
    obsticle();
    if (score > 0 && score% 100 == 0) {
      checkpoint.play();
    }
    if(obstaclegroup.isTouching(trex)){
      gamestate = END;
      die.play();
    
    }
  }
  else if(gamestate == END){
    ground.velocityX = 0;
    trex.changeAnimation("collide", trex_collide);
    obstaclegroup.setVelocityXEach(0);
    cloudsgroup.setVelocityXEach(0);
    obstaclegroup.setLifetimeEach(-1);
    cloudsgroup.setLifetimeEach(-1);
    trex.velocityY = 0;
    gameover.visible = true;
    restart.visible = true;
    if(mousePressedOver(restart)|| touches.length > 0){
      reset();
      touches = [];
    }
  }

  //cargar la posición Y del Trex
  console.log(trex.y)
  
 
  
  
  //evitar que el Trex caiga
  trex.collide(ground2);
   
 
  drawSprites();
}
function clouds(){
  if (frameCount%60==0){
    cloud = createSprite(width + 20,height,40,10);
    cloud.velocityX = -3;
    cloud.addImage(cloudimg);
    cloud.scale = 0.6;
    cloud.y = Math.round(random(10,height/2 - 50));
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    cloud.lifetime = width + 5;
    cloudsgroup.add(cloud);
    
  }
}
function obsticle(){
  if (frameCount%60==0){
    var cactus = createSprite(width + 20,height/2 - 1,10,40);
      cactus.velocityX = -6;
      var rand = Math.round(random(1,6));
      switch(rand){
        case 1: cactus.addImage(obstacle1);
        break;
        case 2: cactus.addImage(obstacle2);
        break;
        case 3: cactus.addImage(obstacle3);
        break;
        case 4: cactus.addImage(obstacle4);
        break;
        case 5: cactus.addImage(obstacle5);
        break;
        case 6: cactus.addImage(obstacle6);
        break;
        default: break;
      }
      cactus.scale = 0.5;
      cactus.lifetime = width + 5;
      obstaclegroup.add(cactus);
  }
    }
    function reset(){
      gamestate = PLAY;
      gameover.visible = false;
      restart.visible = false;
      obstaclegroup.destroyEach();
      cloudsgroup.destroyEach();
      score = 0;
      trex.changeAnimation("running", trex_running);
    }