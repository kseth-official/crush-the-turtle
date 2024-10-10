/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314 -- Sept 2023 -- Assignment 3
/////////////////////////////////////////////////////////////////////////////////////////

console.log('A3 Sept 2023 - Turtle Animation');

var a=7;  
var b=2.6;
console.log('a=',a,'b=',b);
var myvector = new THREE.Vector3(0,1,2);
console.log('myvector =',myvector);

var animation = true;
var meshesLoaded = false;
var RESOURCES_LOADED = false;
var deg2rad = Math.PI/180;

// give the following global scope (within in this file), which is useful for motions and objects
// that are related to animation

// setup animation data structure, including a call-back function to use to update the model matrix
var myboxMotion = new Motion(myboxSetMatrices); 
var handMotion = new Motion(handSetMatrices);
var turtleIdleMotion = new Motion(turtleSetMatrices);
var turtleGrowMotion = new Motion(turtleSetMatrices);
var turtleMoveMotion = new Motion(turtleSetMatrices);


var link1, link2, link3, link4, link5;
var linkFrame1, linkFrame2, linkFrame3, linkFrame4, linkFrame5;

// Turtle Links
var bLink, rh1Link, rh2Link, rh3Link, lh1Link, lh2Link, lh3Link, rl1Link, rl2Link, ll1Link, ll2Link, nLink, hLink, tLink;
var bLinkFrame, rh1LinkFrame, rh2LinkFrame, rh3LinkFrame, lh1LinkFrame, lh2LinkFrame, lh3LinkFrame, rl1LinkFrame, rl2LinkFrame, ll1LinkFrame, ll2LinkFrame, nLinkFrame, hLinkFrame, tLinkFrame;

var sphere;    
var mybox;     
var meshes = {};  

// SETUP RENDERER & SCENE

var canvas = document.getElementById('canvas');
var camera;
var light;
var ambientLight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setClearColor(0x00bdec);     // set background colour
canvas.appendChild(renderer.domElement);

//////////////////////////////////////////////////////////
//  initCamera():   SETUP CAMERA
//////////////////////////////////////////////////////////

function initCamera() {
    // set up M_proj    (internally:  camera.projectionMatrix )
    var cameraFov = 30;     // initial camera vertical field of view, in degrees
    // view angle, aspect ratio, near, far
    camera = new THREE.PerspectiveCamera(cameraFov,1,0.1,1000); 

    var width = 10;  var height = 5;

//    An example of setting up an orthographic projection using threejs:
//    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000 );

    // set up M_view:   (internally:  camera.matrixWorldInverse )
    camera.position.set(0,12,20);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(0,0,0);
    scene.add(camera);

  // SETUP ORBIT CONTROLS OF THE CAMERA (user control of rotation, pan, zoom)
  // const controls = new OrbitControls( camera, renderer.domElement );
    var controls = new THREE.OrbitControls(camera);
    controls.damping = 0.2;
    controls.autoRotate = false;
};

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
}

////////////////////////////////////////////////////////////////////////	
// init():  setup up scene
////////////////////////////////////////////////////////////////////////	

function init() {
    console.log('init called');

    initCamera();
    initMotions();
    initLights();
    initObjects();
    initHand();
    initTurtle();
    initFileObjects();

    window.addEventListener('resize',resize);
    resize();
};

////////////////////////////////////////////////////////////////////////
// initMotions():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initMotions() {
    // keyframes for turtle:                   name,            time,[x, y, z,   bodyX, bodyY, bodyZ, neckZ,  headZ,   tailZ,  flimbZ,  blimbZ,  fl1X,   fl2X,   fl3X,   bl1X,   bl2X, scale]
    turtleIdleMotion.addKeyFrame(new Keyframe('base_0',         0.0, [0, 0, 0,   0,     0,     0,     0 ,     -20,     0 ,     0 ,      0 ,      0  ,    0  ,    -30,    0  ,    0,    1]));
    turtleIdleMotion.addKeyFrame(new Keyframe('base_1',         1.0, [0, 0, 0,   0,     0,     0,     30,     -40,     25,     15,      15,      -30,    -30,    0  ,    -30,    -30,  1]));
    turtleIdleMotion.addKeyFrame(new Keyframe('base_2',         2.0, [0, 0, 0,   0,     0,     0,     60,     -60,     50,     30,      30,      -60,    -60,    -30,    -60,    -60,  1]));
    turtleIdleMotion.addKeyFrame(new Keyframe('base_3',         3.0, [0, 0, 0,   0,     0,     0,     90,     -40,     75,     45,      45,      -90,    -90,    -60,    -90,    -90,  1]));
    turtleIdleMotion.addKeyFrame(new Keyframe('base_4',         4.0, [0, 0, 0,   0,     0,     0,     60,     -20,     50,     30,      30,      -60,    -60,    -90,    -60,    -60,  1]));
    turtleIdleMotion.addKeyFrame(new Keyframe('base_5',         5.0, [0, 0, 0,   0,     0,     0,     30,      0 ,     25,     15,      15,      -30,    -30,    -60,    -30,    -30,  1]));
    turtleIdleMotion.addKeyFrame(new Keyframe('base_6',         6.0, [0, 0, 0,   0,     0,     0,     0 ,     -20,     0 ,     0 ,      0 ,      0  ,    0  ,    -30,    0  ,    0,    1]));
    
    // keyframes for turtle:                   name,            time,[x, y, z,   bodyX, bodyY, bodyZ, neckZ,  headZ,   tailZ,  flimbZ,  blimbZ,  fl1X,   fl2X,   fl3X,   bl1X,   bl2X, scale]
    turtleGrowMotion.addKeyFrame(new Keyframe('base_0',         0.0, [0, 0, 0,   0,     0,     0,     0 ,     -20,     0 ,     0 ,      0 ,      0  ,    0  ,    -30,    0  ,    0,    1]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_1',         1.0, [0, 0, 0,   0,     0,     0,     30,     -40,     25,     15,      15,      -30,    -30,    0  ,    -30,    -30,  1.1]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_2',         2.0, [0, 0, 0,   0,     0,     0,     60,     -60,     50,     30,      30,      -60,    -60,    -30,    -60,    -60,  1.2]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_3',         3.0, [0, 0, 0,   0,     0,     0,     90,     -40,     75,     45,      45,      -90,    -90,    -60,    -90,    -90,  1.3]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_4',         4.0, [0, 0, 0,   0,     0,     0,     60,     -20,     50,     30,      30,      -60,    -60,    -90,    -60,    -60,  1.4]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_5',         5.0, [0, 0, 0,   0,     0,     0,     30,      0 ,     25,     15,      15,      -30,    -30,    -60,    -30,    -30,  1.5]));

    turtleGrowMotion.addKeyFrame(new Keyframe('base_0',         7.0, [0, 0, 0,   0,     0,     0,     0 ,     -20,     0 ,     0 ,      0 ,      0  ,    0  ,    -30,    0  ,    0,    1.6]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_1',         8.0, [0, 0, 0,   0,     0,     0,     30,     -40,     25,     15,      15,      -30,    -30,    0  ,    -30,    -30,  1.7]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_2',         9.0, [0, 0, 0,   0,     0,     0,     60,     -60,     50,     30,      30,      -60,    -60,    -30,    -60,    -60,  1.8]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_3',         10.0, [3, 0, 0,   36,     0,     0,     90,     -40,     75,     45,      45,      -90,    -90,    -60,    -90,  -90,  1.9]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_4',         11.0, [6, 0, 0,   72,     0,     0,     60,     -20,     50,     30,      30,      -60,    -60,    -90,    -60,  -60,  2.0]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_5',         12.0, [9, 0, 0,   108,     0,     0,     30,      0 ,     25,     15,      15,      -30,    -30,    -60,    -30,  -30, 2.0]));

    turtleGrowMotion.addKeyFrame(new Keyframe('base_0',         13.0, [12, 0, 0,   144,     0,     0,     0 ,     -20,     0 ,     0 ,      0 ,      0  ,    0  ,    -30,    0  ,  0,  2.0]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_1',         14.0, [15, 0, 0,   180,     0,     0,     30,     -40,     25,     15,      15,      -30,    -30,    0  ,    -30,  -30,2.0]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_2',         15.0, [18, 0, 0,   216,     0,     0,     60,     -60,     50,     30,      30,      -60,    -60,    -30,    -60,  -60,2.0]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_3',         16.0, [21, 0, 0,   252,     0,     0,     90,     -40,     75,     45,      45,      -90,    -90,    -60,    -90,  -90,2.0]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_4',         17.0, [24, 0, 0,   288,     0,     0,     60,     -20,     50,     30,      30,      -60,    -60,    -90,    -60,  -60,2.0]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_5',         18.0, [27, 0, 0,   324,     0,     0,     30,      0 ,     25,     15,      15,      -30,    -30,    -60,    -30,  -30,2.0]));
    turtleGrowMotion.addKeyFrame(new Keyframe('base_6',         19.0, [30, 0, 0,   360,     0,     0,     0 ,     -20,     0 ,     0 ,      0 ,      0  ,    0  ,    -30,    0  ,   0,2.0]));

    // keyframes for turtle:                   name,            time,[x, y, z,   bodyX, bodyY, bodyZ, neckZ,  headZ,   tailZ,  flimbZ,  blimbZ,  fl1X,   fl2X,   fl3X,   bl1X,   bl2X, scale]
    turtleMoveMotion.addKeyFrame(new Keyframe('base_0',         0.0, [0, 0, 0,   0,     0,     0,     0 ,     -20,     0 ,     0 ,      0 ,      0  ,    0  ,    -30,    0  ,    0,    1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_1',         1.0, [1, 1, 0,   0,     0,     0,     30,     -40,     25,     15,      15,      -30,    -30,    0  ,    -30,    -30,  1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_2',         2.0, [2, 2, 0,   0,     0,     0,     60,     -60,     50,     30,      30,      -60,    -60,    -30,    -60,    -60,  1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_3',         3.0, [3, 3, 0,   0,     0,     0,     90,     -40,     75,     45,      45,      -90,    -90,    -60,    -90,    -90,  1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_4',         4.0, [4, 4, 0,   0,     0,     0,     60,     -20,     50,     30,      30,      -60,    -60,    -90,    -60,    -60,  1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_5',         5.0, [5, 5, 0,   0,     0,     0,     30,      0 ,     25,     15,      15,      -30,    -30,    -60,    -30,    -30,  1]));

    turtleMoveMotion.addKeyFrame(new Keyframe('base_6',         6.0, [6, 6, 0,   0,     0,     0,     0 ,     -20,     0 ,     0 ,      0 ,      0  ,    0  ,    -30,    0  ,    0,    1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_7',         7.0, [7, 7, 0,   0,     0,     0,     30,     -40,     25,     15,      15,      -30,    -30,    0  ,    -30,    -30,  1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_8',         8.0, [8, 8, 0,   0,     0,     0,     60,     -60,     50,     30,      30,      -60,    -60,    -30,    -60,    -60,  1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_9',         9.0, [9, 9, 0,   0,     0,     0,     90,     -40,     75,     45,      45,      -90,    -90,    -60,    -90,    -90,  1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_10',         10.0, [10, 10, 0,   0,     0,     45,     60,     -20,     50,     30,      30,      -60,    -60,    -90,    -60, -60,1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_11',         11.0, [11, 11, 0,   0,     0,     90,     30,      0 ,     25,     15,      15,      -30,    -30,    -60,    -30, -30,1]));

    turtleMoveMotion.addKeyFrame(new Keyframe('base_12',         12.0, [11, 11, 0,   0,     0,     135,     0 ,     -20,     0 ,     0 ,      0 ,      0  ,    0  ,    -30,    0  ,  0,1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_13',         13.0, [10, 10, 0,   0,     0,     180,     30,     -40,     25,     15,      15,      -30,    -30,    0  ,    -30,-30,1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_14',         14.0, [9, 9, 0,   0,     0,     225,     60,     -60,     50,     30,      30,      -60,    -60,    -30,    -60,  -60,1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_15',         15.0, [8, 8, 0,   0,     0,     225,     90,     -40,     75,     45,      45,      -90,    -90,    -60,    -90,  -90,1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_16',         16.0, [7, 7, 0,   0,     0,     225,     60,     -20,     50,     30,      30,      -60,    -60,    -90,    -60,  -60,1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_17',         17.0, [6, 6, 0,   0,     0,     225,     30,      0 ,     25,     15,      15,      -30,    -30,    -60,    -30,  -30,1]));

    turtleMoveMotion.addKeyFrame(new Keyframe('base_18',         18.0, [5, 5, 0,   0,     0,     225,     0 ,     -20,     0 ,     0 ,      0 ,      0  ,    0  ,    -30,    0  ,    0,1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_19',         19.0, [4, 4, 0,   0,     0,     225,     30,     -40,     25,     15,      15,      -30,    -30,    0  ,    -30,  -30,1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_20',         20.0, [3, 3, 0,   0,     0,     270,     60,     -60,     50,     30,      30,      -60,    -60,    -30,    -60,  -60,1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_21',         21.0, [2, 2, 0,   0,     0,     315,     90,     -40,     75,     45,      45,      -90,    -90,    -60,    -90,  -90,1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_22',         22.0, [1, 1, 0,   0,     0,     360,     60,     -20,     50,     30,      30,      -60,    -60,    -90,    -60,  -60,1]));
    turtleMoveMotion.addKeyFrame(new Keyframe('base_23',         23.0, [0, 0, 0,   0,     0,     0,     30,      0 ,     25,     15,      15,      -30,    -30,    -60,    -30,    -30,1]));
}

///////////////////////////////////////////////////////////////////////////////////////
// myboxSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function myboxSetMatrices(avars) {
     // update position of a box
    mybox.matrixAutoUpdate = false;     // tell three.js not to over-write our updates
    mybox.matrix.identity();              
    mybox.matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0], avars[1], avars[2]));  
    mybox.matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI/2));
    mybox.matrix.multiply(new THREE.Matrix4().makeScale(1.0,1.0,1.0));
    mybox.updateMatrixWorld();  

     // update position of a dragon
    var theta = avars[3]*deg2rad;
    meshes["dragon1"].matrixAutoUpdate = false;
    meshes["dragon1"].matrix.identity();
    meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0],avars[1],0));  
    meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeRotationX(theta));  
    meshes["dragon1"].matrix.multiply(new THREE.Matrix4().makeScale(0.3,0.3,0.3));
    meshes["dragon1"].updateMatrixWorld();  
}

///////////////////////////////////////////////////////////////////////////////////////
// handSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function handSetMatrices(avars) {
    var xPosition = avars[0];
    var yPosition = avars[1];
    var theta1 = avars[2]*deg2rad;
    var theta2 = avars[3]*deg2rad;
    var theta3 = avars[4]*deg2rad;
    var theta4 = avars[5]*deg2rad;
    var theta5 = avars[6]*deg2rad;
    var M =  new THREE.Matrix4();
    
      ////////////// link1 (palm)
    linkFrame1.matrix.identity(); 
    linkFrame1.matrix.multiply(M.makeTranslation(xPosition,yPosition,0));   
    linkFrame1.matrix.multiply(M.makeRotationZ(theta1));    
      // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
    link1.matrix.copy(linkFrame1.matrix);
    link1.matrix.multiply(M.makeTranslation(3,0,0));   
    link1.matrix.multiply(M.makeScale(6,1,3));    

      ////////////// link2 (right finger 1st link)
    linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
    linkFrame2.matrix.multiply(M.makeTranslation(6,0,1));
    linkFrame2.matrix.multiply(M.makeRotationZ(theta2));    
      // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
    link2.matrix.copy(linkFrame2.matrix);
    link2.matrix.multiply(M.makeTranslation(2,0,0));   
    link2.matrix.multiply(M.makeScale(4,1,1));    

      ///////////////  link3 (right finger 2nd link)
    linkFrame3.matrix.copy(linkFrame2.matrix);
    linkFrame3.matrix.multiply(M.makeTranslation(4,0,0));
    linkFrame3.matrix.multiply(M.makeRotationZ(theta3));    
      // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
    link3.matrix.copy(linkFrame3.matrix);
    link3.matrix.multiply(M.makeTranslation(2,0,0));   
    link3.matrix.multiply(M.makeScale(4,1,1));    

      /////////////// link4
    linkFrame4.matrix.copy(linkFrame1.matrix);
    linkFrame4.matrix.multiply(M.makeTranslation(6,0,-1));
    linkFrame4.matrix.multiply(M.makeRotationZ(theta4));    
      // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
    link4.matrix.copy(linkFrame4.matrix);
    link4.matrix.multiply(M.makeTranslation(2,0,0));   
    link4.matrix.multiply(M.makeScale(4,1,1));    

      // link5
    linkFrame5.matrix.copy(linkFrame4.matrix);
    linkFrame5.matrix.multiply(M.makeTranslation(4,0,0));
    linkFrame5.matrix.multiply(M.makeRotationZ(theta5));    
      // Frame 5 has been established, now setup the extra transformations for the scaled box geometry
    link5.matrix.copy(linkFrame5.matrix);
    link5.matrix.multiply(M.makeTranslation(2,0,0));   
    link5.matrix.multiply(M.makeScale(4,1,1));    

    link1.updateMatrixWorld();
    link2.updateMatrixWorld();
    link3.updateMatrixWorld();
    link4.updateMatrixWorld();
    link5.updateMatrixWorld();

    linkFrame1.updateMatrixWorld();
    linkFrame2.updateMatrixWorld();
    linkFrame3.updateMatrixWorld();
    linkFrame4.updateMatrixWorld();
    linkFrame5.updateMatrixWorld();
}

///////////////////////////////////////////////////////////////////////////////////////
// turtleSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function turtleSetMatrices(avars) {
  var xPosition = avars[0];
  var yPosition = 0.4 + avars[1];
  var zPosition = avars[2];
  var bodyRotX = avars[3]*deg2rad;
  var bodyRotY = avars[4]*deg2rad;
  var bodyRotZ = avars[5]*deg2rad;
  var neckRotZ = avars[6]*deg2rad;
  var headRotZ = Math.PI/2 + avars[7]*deg2rad;
  var tailRotZ = Math.PI/4 + avars[8]*deg2rad;
  var frontLimbRotZ = -Math.PI/4 + avars[9]*deg2rad;
  var backLimbRotZ = -Math.PI/6 + avars[10]*deg2rad;
  var frontLink1RotX = Math.PI/4 + avars[11]*deg2rad;
  var frontLink2RotX = Math.PI/4 + avars[12]*deg2rad;
  var frontLink3RotX = Math.PI/4 + avars[13]*deg2rad;
  var backLink1RotX = Math.PI/4 + avars[14]*deg2rad;
  var backLink2RotX = Math.PI/4 + avars[15]*deg2rad;
  var scaleTurtle = 0.2 + avars[16];  

  var M =  new THREE.Matrix4();

  var handOffsetX = 0.5;
  var handOffsetY = -0.25;
  var handOffsetZ = 1;
  
  var legOffsetX = -1;
  var legOffsetY = -0.25;
  var legOffsetZ = 1;
  
  var neckOffsetX = 1;
  var neckOffsetY = 0.15;
  var neckOffsetZ = 0;
  
  var tailOffsetX = -1.5;
  var tailOffsetY = -0.1;
  var tailOffsetZ = 0;

  // Link Scales
  // Body
  var bLinkScaleX = 0.5;
  var bLinkScaleY = 0.5;
  var bLinkScaleZ = 0.5;

  // Right Hand 1
  var rh1LinkScaleX = 0.5;
  var rh1LinkScaleY = 0.1;
  var rh1LinkScaleZ = 0.5;

  // Right Hand 2
  var rh2LinkScaleX = rh1LinkScaleX;
  var rh2LinkScaleY = rh1LinkScaleY;
  var rh2LinkScaleZ = rh1LinkScaleZ * 2;

  // Right Hand 3
  var rh3LinkScaleX = rh1LinkScaleX * 1;
  var rh3LinkScaleY = rh1LinkScaleY * 1;
  var rh3LinkScaleZ = rh1LinkScaleZ * 1;

  // Left Hand 1
  var lh1LinkScaleX = rh1LinkScaleX;
  var lh1LinkScaleY = rh1LinkScaleY;
  var lh1LinkScaleZ = rh1LinkScaleZ;

  // Left Hand 2
  var lh2LinkScaleX = rh2LinkScaleX;
  var lh2LinkScaleY = rh2LinkScaleY;
  var lh2LinkScaleZ = rh2LinkScaleZ;

  // Left Hand 3
  var lh3LinkScaleX = rh3LinkScaleX;
  var lh3LinkScaleY = rh3LinkScaleY;
  var lh3LinkScaleZ = rh3LinkScaleZ;

  // Right Leg 1
  var rl1LinkScaleX = rh1LinkScaleX;
  var rl1LinkScaleY = rh1LinkScaleY;
  var rl1LinkScaleZ = rh1LinkScaleZ / 2;
  
  // Right Leg 2
  var rl2LinkScaleX = rl1LinkScaleX;
  var rl2LinkScaleY = rl1LinkScaleY;
  var rl2LinkScaleZ = rl1LinkScaleZ * 2;
  
  // Left Leg 1
  var ll1LinkScaleX = rl1LinkScaleX;
  var ll1LinkScaleY = rl1LinkScaleY;
  var ll1LinkScaleZ = rl1LinkScaleZ;
  
  // Left Leg 2
  var ll2LinkScaleX = rl2LinkScaleX;
  var ll2LinkScaleY = rl2LinkScaleY;
  var ll2LinkScaleZ = rl2LinkScaleZ;

  // Neck
  var nLinkScaleX = 0.2;
  var nLinkScaleY = 0.5;
  var nLinkScaleZ = 0.2;
  
  // Head
  var hLinkScaleX = nLinkScaleX * 1.3;
  var hLinkScaleY = nLinkScaleY * 1.5;
  var hLinkScaleZ = nLinkScaleZ * 1.3;
  
  // Tail
  var tLinkScaleX = nLinkScaleX;
  var tLinkScaleY = -nLinkScaleY;
  var tLinkScaleZ = nLinkScaleZ;
  
    ////////////// blink (body link)
  bLinkFrame.matrix.identity(); 
  bLinkFrame.matrix.multiply(M.makeTranslation(xPosition,yPosition,zPosition));   
  bLinkFrame.matrix.multiply(M.makeRotationX(bodyRotX));
  bLinkFrame.matrix.multiply(M.makeRotationY(bodyRotY));
  bLinkFrame.matrix.multiply(M.makeRotationZ(bodyRotZ));
  bLinkFrame.matrix.multiply(M.makeScale(scaleTurtle,scaleTurtle,scaleTurtle));        
    // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
  bLink.matrix.copy(bLinkFrame.matrix);
  bLink.matrix.multiply(M.makeTranslation(0,0,0));   
  bLink.matrix.multiply(M.makeScale(1,0.5,0.80));
  
  // update position of the shell
  meshes["shell"].matrixAutoUpdate = false;
  meshes["shell"].matrix.copy(bLinkFrame.matrix);
  meshes["shell"].matrix.multiply(M.makeTranslation(-0.5,-2,0));
  meshes["shell"].matrix.multiply(M.makeRotationY(3*Math.PI/2));
  meshes["shell"].matrix.multiply(M.makeScale(1,1,1));
  meshes["shell"].updateMatrixWorld();  

    ////////////// (right hand 1st link)
  rh1LinkFrame.matrix.copy(bLinkFrame.matrix);      // start with parent frame
  rh1LinkFrame.matrix.multiply(M.makeTranslation(handOffsetX,handOffsetY,handOffsetZ));
  rh1LinkFrame.matrix.multiply(M.makeRotationX(frontLink1RotX));
  rh1LinkFrame.matrix.multiply(M.makeRotationZ(frontLimbRotZ));    
    // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  rh1Link.matrix.copy(rh1LinkFrame.matrix);
  rh1Link.matrix.multiply(M.makeTranslation(0,0,handOffsetZ / 2 * rh1LinkScaleZ));   
  rh1Link.matrix.multiply(M.makeScale(rh1LinkScaleX,rh1LinkScaleY,rh1LinkScaleZ));    
  
    ///////////////  (right hand 2nd link)
  rh2LinkFrame.matrix.copy(rh1LinkFrame.matrix);
  rh2LinkFrame.matrix.multiply(M.makeTranslation(0,0,handOffsetZ * rh1LinkScaleZ));
  rh2LinkFrame.matrix.multiply(M.makeRotationX(frontLink2RotX));
    // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
  rh2Link.matrix.copy(rh2LinkFrame.matrix);
  rh2Link.matrix.multiply(M.makeTranslation(0,0,handOffsetZ * rh1LinkScaleZ));   
  rh2Link.matrix.multiply(M.makeScale(rh2LinkScaleX,rh2LinkScaleY,rh2LinkScaleZ));
  
  ///////////////  (right hand 3rd link)
  rh3LinkFrame.matrix.copy(rh2LinkFrame.matrix);
  rh3LinkFrame.matrix.multiply(M.makeTranslation(0,0,2* handOffsetZ * rh1LinkScaleZ));
  rh3LinkFrame.matrix.multiply(M.makeRotationX(frontLink3RotX));
    // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
  rh3Link.matrix.copy(rh3LinkFrame.matrix);
  rh3Link.matrix.multiply(M.makeTranslation(0,0,handOffsetZ / 2 * rh1LinkScaleZ));   
  rh3Link.matrix.multiply(M.makeScale(rh3LinkScaleX,rh3LinkScaleY,rh3LinkScaleZ)); 

      ////////////// (left hand 1st link)
  lh1LinkFrame.matrix.copy(bLinkFrame.matrix);      // start with parent frame
  lh1LinkFrame.matrix.multiply(M.makeTranslation(handOffsetX,handOffsetY,-handOffsetZ));
  lh1LinkFrame.matrix.multiply(M.makeRotationX(-frontLink1RotX));    
  lh1LinkFrame.matrix.multiply(M.makeRotationZ(frontLimbRotZ));    
    // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  lh1Link.matrix.copy(lh1LinkFrame.matrix);
  lh1Link.matrix.multiply(M.makeTranslation(0,0,-handOffsetZ / 2 * lh1LinkScaleZ));   
  lh1Link.matrix.multiply(M.makeScale(lh1LinkScaleX,lh1LinkScaleY,lh1LinkScaleZ));    
  
    ///////////////  (left hand 2nd link)
  lh2LinkFrame.matrix.copy(lh1LinkFrame.matrix);
  lh2LinkFrame.matrix.multiply(M.makeTranslation(0,0,-handOffsetZ * lh1LinkScaleZ));
  lh2LinkFrame.matrix.multiply(M.makeRotationX(-frontLink2RotX));
    // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
  lh2Link.matrix.copy(lh2LinkFrame.matrix);
  lh2Link.matrix.multiply(M.makeTranslation(0,0,-handOffsetZ * lh1LinkScaleZ));   
  lh2Link.matrix.multiply(M.makeScale(lh2LinkScaleX,lh2LinkScaleY,lh2LinkScaleZ));
  
  ///////////////  (left hand 3rd link)
  lh3LinkFrame.matrix.copy(lh2LinkFrame.matrix);
  lh3LinkFrame.matrix.multiply(M.makeTranslation(0,0,-2* handOffsetZ * lh1LinkScaleZ));
  lh3LinkFrame.matrix.multiply(M.makeRotationX(-frontLink3RotX));
    // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
  lh3Link.matrix.copy(lh3LinkFrame.matrix);
  lh3Link.matrix.multiply(M.makeTranslation(0,0,-handOffsetZ / 2 * lh1LinkScaleZ));   
  lh3Link.matrix.multiply(M.makeScale(lh3LinkScaleX,lh3LinkScaleY,lh3LinkScaleZ)); 

      ////////////// (right leg 1st link)
  rl1LinkFrame.matrix.copy(bLinkFrame.matrix);      // start with parent frame
  rl1LinkFrame.matrix.multiply(M.makeTranslation(legOffsetX,legOffsetY,legOffsetZ));
  rl1LinkFrame.matrix.multiply(M.makeRotationX(backLink1RotX));
  rl1LinkFrame.matrix.multiply(M.makeRotationZ(backLimbRotZ));    
    // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  rl1Link.matrix.copy(rl1LinkFrame.matrix);
  rl1Link.matrix.multiply(M.makeTranslation(0,0,legOffsetZ/2 * rl1LinkScaleZ));   
  rl1Link.matrix.multiply(M.makeScale(rl1LinkScaleX,rl1LinkScaleY,rl1LinkScaleZ));    
  
    ///////////////  (right leg 2nd link)
  rl2LinkFrame.matrix.copy(rl1LinkFrame.matrix);
  rl2LinkFrame.matrix.multiply(M.makeTranslation(0,0,legOffsetZ * rl1LinkScaleZ));
  rl2LinkFrame.matrix.multiply(M.makeRotationX(backLink2RotX));
    // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
  rl2Link.matrix.copy(rl2LinkFrame.matrix);
  rl2Link.matrix.multiply(M.makeTranslation(0,0,legOffsetZ * rl1LinkScaleZ));   
  rl2Link.matrix.multiply(M.makeScale(rl2LinkScaleX,rl2LinkScaleY,rl2LinkScaleZ));

        ////////////// (left leg 1st link)
  ll1LinkFrame.matrix.copy(bLinkFrame.matrix);      // start with parent frame
  ll1LinkFrame.matrix.multiply(M.makeTranslation(legOffsetX,legOffsetY,-legOffsetZ));
  ll1LinkFrame.matrix.multiply(M.makeRotationX(-backLink1RotX));    
  ll1LinkFrame.matrix.multiply(M.makeRotationZ(backLimbRotZ));    
    // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  ll1Link.matrix.copy(ll1LinkFrame.matrix);
  ll1Link.matrix.multiply(M.makeTranslation(0,0,-legOffsetZ / 2 * ll1LinkScaleZ));   
  ll1Link.matrix.multiply(M.makeScale(ll1LinkScaleX,ll1LinkScaleY,ll1LinkScaleZ));    
  
    ///////////////  (left leg 2nd link)
  ll2LinkFrame.matrix.copy(ll1LinkFrame.matrix);
  ll2LinkFrame.matrix.multiply(M.makeTranslation(0,0,-legOffsetZ * ll1LinkScaleZ));
  ll2LinkFrame.matrix.multiply(M.makeRotationX(-backLink2RotX));
    // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
  ll2Link.matrix.copy(ll2LinkFrame.matrix);
  ll2Link.matrix.multiply(M.makeTranslation(0,0,-legOffsetZ * ll1LinkScaleZ));   
  ll2Link.matrix.multiply(M.makeScale(ll2LinkScaleX,ll2LinkScaleY,ll2LinkScaleZ));

        ////////////// (neck link)
  nLinkFrame.matrix.copy(bLinkFrame.matrix);      // start with parent frame
  nLinkFrame.matrix.multiply(M.makeTranslation(neckOffsetX,neckOffsetY,neckOffsetZ));
  nLinkFrame.matrix.multiply(M.makeRotationZ(-neckRotZ));    
    // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  nLink.matrix.copy(nLinkFrame.matrix);
  nLink.matrix.multiply(M.makeTranslation(0,0.5 * nLinkScaleY,0));   
  nLink.matrix.multiply(M.makeScale(nLinkScaleX,nLinkScaleY,nLinkScaleZ));    

      //////////// (head link)
  hLinkFrame.matrix.copy(nLinkFrame.matrix);      // start with parent frame
  hLinkFrame.matrix.multiply(M.makeTranslation(neckOffsetX * nLinkScaleX,neckOffsetY * 8 * nLinkScaleY,neckOffsetZ * hLinkScaleZ));
  hLinkFrame.matrix.multiply(M.makeRotationZ(-headRotZ));    
    // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  hLink.matrix.copy(hLinkFrame.matrix);
  hLink.matrix.multiply(M.makeTranslation(0,neckOffsetY * nLinkScaleY,0));   
  hLink.matrix.multiply(M.makeScale(hLinkScaleX,hLinkScaleY,hLinkScaleZ));
  
          ////////////// (tail link)
  tLinkFrame.matrix.copy(bLinkFrame.matrix);      // start with parent frame
  tLinkFrame.matrix.multiply(M.makeTranslation(tailOffsetX,tailOffsetY,tailOffsetZ));
  tLinkFrame.matrix.multiply(M.makeRotationZ(-tailRotZ));    
  tLinkFrame.matrix.multiply(M.makeScale(1,tailYScale,1));    
    // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  tLink.matrix.copy(tLinkFrame.matrix);
  tLink.matrix.multiply(M.makeTranslation(0,0.5 * tLinkScaleY,0));   
  tLink.matrix.multiply(M.makeScale(tLinkScaleX,tLinkScaleY,tLinkScaleZ));    
}

/////////////////////////////////////	
// initLights():  SETUP LIGHTS
/////////////////////////////////////	

function initLights() {
    light = new THREE.PointLight(0xffffff);
    light.position.set(0,4,2);
    scene.add(light);
    ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);
}

/////////////////////////////////////	
// MATERIALS
/////////////////////////////////////	

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
var basicMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var armadilloMaterial = new THREE.MeshBasicMaterial( {color: 0x7fff7f} );

/////////////////////////////////////	
// initObjects():  setup objects in the scene
/////////////////////////////////////	

function initObjects() {
    var worldFrame = new THREE.AxesHelper(5) ;

    // textured floor
    var floorTexture = new THREE.TextureLoader().load('textures/seabed.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1);
    var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
    var floorGeometry = new THREE.PlaneGeometry(30, 30);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -2.1;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    // sphere, located at light position
    var sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
    sphere = new THREE.Mesh(sphereGeometry, basicMaterial);
    sphere.position.set(-30,-30,-30);
    sphere.position.set(-30, -30, -30);
    // scene.add(sphere);

    //// UNUSED OBJECTS
    // // box
    // var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
    // var box = new THREE.Mesh( boxGeometry, diffuseMaterial );
    // box.position.set(-4, 0, 0);
    // scene.add( box );

    // // multi-colored cube      [https://stemkoski.github.io/Three.js/HelloWorld.html] 
    // var cubeMaterialArray = [];    // order to add materials: x+,x-,y+,y-,z+,z-
    // cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff3333 } ) );
    // cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff8800 } ) );
    // cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xffff33 } ) );
    // cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x33ff33 } ) );
    // cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x3333ff } ) );
    // cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x8833ff } ) );
    //   // Cube parameters: width (x), height (y), depth (z), 
    //   //        (optional) segments along x, segments along y, segments along z
    // var mccGeometry = new THREE.BoxGeometry( 1.5, 1.5, 1.5, 1, 1, 1 );
    // var mcc = new THREE.Mesh( mccGeometry, cubeMaterialArray );
    // mcc.position.set(0,0,0);
    // scene.add( mcc );	

    // // cylinder
    // // parameters:  radiusAtTop, radiusAtBottom, height, radialSegments, heightSegments
    // var cylinderGeometry = new THREE.CylinderGeometry( 0.30, 0.30, 0.80, 20, 4 );
    // var cylinder = new THREE.Mesh( cylinderGeometry, diffuseMaterial);
    // cylinder.position.set(2, 0, 0);
    // scene.add( cylinder );

    // // cone:   parameters --  radiusTop, radiusBot, height, radialSegments, heightSegments
    // var coneGeometry = new THREE.CylinderGeometry( 0.0, 0.30, 0.80, 20, 4 );
    // var cone = new THREE.Mesh( coneGeometry, diffuseMaterial);
    // cone.position.set(4, 0, 0);
    // scene.add( cone);

    // // torus:   parameters -- radius, diameter, radialSegments, torusSegments
    // var torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
    // var torus = new THREE.Mesh( torusGeometry, diffuseMaterial);

    // torus.rotation.set(0,0,0);     // rotation about x,y,z axes
    // torus.scale.set(1,2,3);
    // torus.position.set(-6, 0, 0);   // translation

    // scene.add( torus );

    // /////////////////////////////////////
    // //  CUSTOM OBJECT 
    // ////////////////////////////////////
    
    // var geom = new THREE.Geometry(); 
    // var v0 = new THREE.Vector3(0,0,0);
    // var v1 = new THREE.Vector3(3,0,0);
    // var v2 = new THREE.Vector3(0,3,0);
    // var v3 = new THREE.Vector3(3,3,0);
    
    // geom.vertices.push(v0);
    // geom.vertices.push(v1);
    // geom.vertices.push(v2);
    // geom.vertices.push(v3);
    
    // geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    // geom.faces.push( new THREE.Face3( 1, 3, 2 ) );
    // geom.computeFaceNormals();
    
    // customObject = new THREE.Mesh( geom, diffuseMaterial );
    // customObject.position.set(0, 0, -2);
    // scene.add(customObject);
}

/////////////////////////////////////////////////////////////////////////////////////
//  initHand():  define all geometry associated with the hand (OLD UNUSED CODE)
/////////////////////////////////////////////////////////////////////////////////////

function initHand() {
    // var handMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    // var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth

    // link1 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link1 );
    // linkFrame1   = new THREE.AxesHelper(1) ;   scene.add(linkFrame1);
    // link2 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link2 );
    // linkFrame2   = new THREE.AxesHelper(1) ;   scene.add(linkFrame2);
    // link3 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link3 );
    // linkFrame3   = new THREE.AxesHelper(1) ;   scene.add(linkFrame3);
    // link4 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link4 );
    // linkFrame4   = new THREE.AxesHelper(1) ;   scene.add(linkFrame4);
    // link5 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link5 );
    // linkFrame5   = new THREE.AxesHelper(1) ;   scene.add(linkFrame5);

    // link1.matrixAutoUpdate = false;  
    // link2.matrixAutoUpdate = false;  
    // link3.matrixAutoUpdate = false;  
    // link4.matrixAutoUpdate = false;  
    // link5.matrixAutoUpdate = false;
    // linkFrame1.matrixAutoUpdate = false;  
    // linkFrame2.matrixAutoUpdate = false;  
    // linkFrame3.matrixAutoUpdate = false;  
    // linkFrame4.matrixAutoUpdate = false;  
    // linkFrame5.matrixAutoUpdate = false;
}

/////////////////////////////////////////////////////////////////////////////////////
//  initTurtle():  define all geometry associated with the turtle
/////////////////////////////////////////////////////////////////////////////////////

function initTurtle() {
  // var turtleMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );

  var turtleTexture = new THREE.TextureLoader().load('textures/turtle-skin.jpg');
  turtleTexture.wrapS = turtleTexture.wrapT = THREE.RepeatWrapping;
  turtleTexture.repeat.set(1,1);
  var turtleMaterial = new THREE.MeshBasicMaterial({ map: turtleTexture, side: THREE.DoubleSide });
  
  var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
  // parameters:  radiusAtTop, radiusAtBottom, height, radialSegments, heightSegments
  var cylinderGeometry = new THREE.CylinderGeometry( 1, 1, 1, 64, 64 );
  // parameters:  radiusAtTop, radiusAtBottom, height, radialSegments, heightSegments
  var headGeometry = new THREE.CylinderGeometry( 1, 1, 1, 64, 64 );
  // parameters:  radiusAtTop, radiusAtBottom, height, radialSegments, heightSegments
  var tailGeometry = new THREE.CylinderGeometry( 0.5, 1, 1, 64, 64 );
  bLink = new THREE.Mesh( boxGeometry, turtleMaterial );  scene.add( bLink );
  bLinkFrame   = new THREE.AxesHelper(1) ;   
  // scene.add(bLinkFrame);
  
  rh1Link = new THREE.Mesh( boxGeometry, turtleMaterial );  scene.add( rh1Link );
  rh1LinkFrame   = new THREE.AxesHelper(1) ;   
  // scene.add(rh1LinkFrame);
  rh2Link = new THREE.Mesh( boxGeometry, turtleMaterial );  scene.add( rh2Link );
  rh2LinkFrame   = new THREE.AxesHelper(1) ;   
  // scene.add(rh2LinkFrame);
  rh3Link = new THREE.Mesh( boxGeometry, turtleMaterial );  scene.add( rh3Link );
  rh3LinkFrame   = new THREE.AxesHelper(1) ;   
  // scene.add(rh3LinkFrame);
  
  lh1Link = new THREE.Mesh( boxGeometry, turtleMaterial );  scene.add( lh1Link );
  lh1LinkFrame   = new THREE.AxesHelper(1) ;   
  // scene.add(lh1LinkFrame);
  lh2Link = new THREE.Mesh( boxGeometry, turtleMaterial );  scene.add( lh2Link );
  lh2LinkFrame   = new THREE.AxesHelper(1) ;   
  // scene.add(lh2LinkFrame);
  lh3Link = new THREE.Mesh( boxGeometry, turtleMaterial );  scene.add( lh3Link );
  lh3LinkFrame   = new THREE.AxesHelper(1) ;   
  // scene.add(lh3LinkFrame);

  rl1Link = new THREE.Mesh( boxGeometry, turtleMaterial );  scene.add( rl1Link );
  rl1LinkFrame   = new THREE.AxesHelper(1) ;   
  // scene.add(rl1LinkFrame);
  rl2Link = new THREE.Mesh( boxGeometry, turtleMaterial );  scene.add( rl2Link );
  rl2LinkFrame   = new THREE.AxesHelper(1) ;   
  // scene.add(rl2LinkFrame);
  
  ll1Link = new THREE.Mesh( boxGeometry, turtleMaterial );  scene.add( ll1Link );
  ll1LinkFrame   = new THREE.AxesHelper(1) ;   
  // scene.add(ll1LinkFrame);
  ll2Link = new THREE.Mesh( boxGeometry, turtleMaterial );  scene.add( ll2Link );
  ll2LinkFrame   = new THREE.AxesHelper(1) ;   
  // scene.add(ll2LinkFrame);
  
  nLink = new THREE.Mesh( cylinderGeometry, turtleMaterial );  scene.add( nLink );
  nLinkFrame   = new THREE.AxesHelper(1) ;   
  // scene.add(nLinkFrame);

  hLink = new THREE.Mesh( headGeometry, turtleMaterial );  scene.add( hLink );
  hLinkFrame   = new THREE.AxesHelper(1) ;   
  // scene.add(hLinkFrame);

  tLink = new THREE.Mesh( tailGeometry, turtleMaterial );  scene.add( tLink );
  tLinkFrame   = new THREE.AxesHelper(1) ;   
  // scene.add(tLinkFrame);

  bLink.matrixAutoUpdate = false;  
  rh1Link.matrixAutoUpdate = false;  
  rh2Link.matrixAutoUpdate = false;  
  rh3Link.matrixAutoUpdate = false;  
  lh1Link.matrixAutoUpdate = false;  
  lh2Link.matrixAutoUpdate = false;  
  lh3Link.matrixAutoUpdate = false;  
  rl1Link.matrixAutoUpdate = false;  
  rl2Link.matrixAutoUpdate = false;  
  ll1Link.matrixAutoUpdate = false;  
  ll2Link.matrixAutoUpdate = false;  
  nLink.matrixAutoUpdate = false;  
  hLink.matrixAutoUpdate = false;  
  tLink.matrixAutoUpdate = false;
  
  bLinkFrame.matrixAutoUpdate = false;  
  rh1LinkFrame.matrixAutoUpdate = false;  
  rh2LinkFrame.matrixAutoUpdate = false;  
  rh3LinkFrame.matrixAutoUpdate = false;  
  lh1LinkFrame.matrixAutoUpdate = false;  
  lh2LinkFrame.matrixAutoUpdate = false;  
  lh3LinkFrame.matrixAutoUpdate = false;  
  rl1LinkFrame.matrixAutoUpdate = false;  
  rl2LinkFrame.matrixAutoUpdate = false;  
  ll1LinkFrame.matrixAutoUpdate = false;  
  ll2LinkFrame.matrixAutoUpdate = false;  
  nLinkFrame.matrixAutoUpdate = false;  
  hLinkFrame.matrixAutoUpdate = false;  
  tLinkFrame.matrixAutoUpdate = false;
}

/////////////////////////////////////////////////////////////////////////////////////
//  create customShader material
/////////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial( {
//        uniforms: { textureSampler: {type: 't', value: floorTexture}},
	vertexShader: document.getElementById( 'customVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'customFragmentShader' ).textContent
} );

var ctx = renderer.context;
ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

////////////////////////////////////////////////////////////////////////	
// initFileObjects():    read object data from OBJ files;  see onResourcesLoaded() for instances
////////////////////////////////////////////////////////////////////////	

var models;

function initFileObjects() {
  // var shellTexture = new THREE.TextureLoader().load('textures/turtle-shell.jpg');
  // shellTexture.wrapS = shellTexture.wrapT = THREE.RepeatWrapping;
  // shellTexture.repeat.set(1,1);
  // var shellMaterial = new THREE.MeshBasicMaterial({ map: shellTexture, side: THREE.DoubleSide });

        // list of OBJ files that we want to load, and their material
  models = {     
	  teapot:    {obj:"obj/teapot.obj", mtl: customShaderMaterial, mesh: null	},
	  armadillo: {obj:"obj/armadillo.obj", mtl: customShaderMaterial, mesh: null },
	  dragon:    {obj:"obj/dragon.obj", mtl: customShaderMaterial, mesh: null },
    shell:    {obj:"obj/shell.obj", mtl: customShaderMaterial, mesh: null },
    coral_1:    {obj:"obj/coral_1.obj", mtl: customShaderMaterial, mesh: null },
    coral_2:    {obj:"obj/coral_2.obj", mtl: customShaderMaterial, mesh: null },
    // coral_3:    {obj:"obj/coral_3.obj", mtl: customShaderMaterial, mesh: null },
    angelfish:    {obj:"obj/angelfish.obj", mtl: customShaderMaterial, mesh: null }
  };

  var manager = new THREE.LoadingManager();
  manager.onLoad = function () {
	  console.log("loaded all resources");
	  RESOURCES_LOADED = true;
	  onResourcesLoaded();
  }
  var onProgress = function ( xhr ) {
	  if ( xhr.lengthComputable ) {
	    var percentComplete = xhr.loaded / xhr.total * 100;
	    console.log( Math.round(percentComplete, 2) + '% downloaded' );
	  }
  };
  var onError = function ( xhr ) {
  };

    // Load models;  asynchronous in JS, so wrap code in a fn and pass it the index
  for( var _key in models ){
	  console.log('Key:', _key);
	  (function(key){
	    var objLoader = new THREE.OBJLoader( manager );
	    objLoader.load( models[key].obj, function ( object ) {
		  object.traverse( function ( child ) {
		    if ( child instanceof THREE.Mesh ) {
			    child.material = models[key].mtl;
			    child.material.shading = THREE.SmoothShading;
		    }	} );
		    models[key].mesh = object;
	    }, onProgress, onError );
	  })(_key);
  }
}

/////////////////////////////////////////////////////////////////////////////////////
// onResourcesLoaded():  once all OBJ files are loaded, this gets called.
//                       Object instancing is done here
/////////////////////////////////////////////////////////////////////////////////////

function onResourcesLoaded(){
	
 // Clone models into meshes;   [Michiel:  AFAIK this makes a "shallow" copy of the model,
 //                             i.e., creates references to the geometry, and not full copies ]
    meshes["armadillo1"] = models.armadillo.mesh.clone();
    meshes["armadillo2"] = models.armadillo.mesh.clone();
    meshes["dragon1"] = models.dragon.mesh.clone();
    meshes["teapot1"] = models.teapot.mesh.clone();
    meshes["teapot2"] = models.teapot.mesh.clone();
    meshes["shell"] = models.shell.mesh.clone();

    meshes["coral_1"] = models.coral_1.mesh.clone();
    meshes["coral_1_clone"] = models.coral_1.mesh.clone();
    meshes["coral_2"] = models.coral_2.mesh.clone();
    // meshes["coral_3"] = models.coral_3.mesh.clone();
    meshes["angelfish"] = models.angelfish.mesh.clone();
    
    // position the object instances and parent them to the scene, i.e., WCS
    // For static objects in your scene, it is ok to use the default postion / rotation / scale
    // to build the object-to-world transformation matrix. This is what we do below.
    //
    // Three.js builds the transformation matrix according to:  M = T*R*S,
    // where T = translation, according to position.set()
    //       R = rotation, according to rotation.set(), and which implements the following "Euler angle" rotations:
    //            R = Rx * Ry * Rz
    //       S = scale, according to scale.set()
    
    // meshes["armadillo1"].position.set(-6, 1.5, 2);
    // meshes["armadillo1"].rotation.set(0,-Math.PI/2,0);
    // meshes["armadillo1"].scale.set(1,1,1);
    // scene.add(meshes["armadillo1"]);

    // meshes["armadillo2"].position.set(-3, 1.5, 2);
    // meshes["armadillo2"].rotation.set(0,-Math.PI/2,0);
    // meshes["armadillo2"].scale.set(1,1,1);
    // scene.add(meshes["armadillo2"]);

      // note:  the local transformations described by the following position, rotation, and scale
      // are overwritten by the animation loop for this particular object, which directly builds the
      // dragon1-to-world transformation matrix
    // meshes["dragon1"].position.set(-5, 0.2, 4);
    // meshes["dragon1"].rotation.set(0, Math.PI, 0);
    // meshes["dragon1"].scale.set(0.3,0.3,0.3);
    // scene.add(meshes["dragon1"]);

    // meshes["teapot1"].position.set(3, 0, 3);
    // meshes["teapot1"].scale.set(0.5, 0.5, 0.5);
    // scene.add(meshes["teapot1"]);

    // meshes["teapot2"].position.set(-3, 0, 3);
    // meshes["teapot2"].scale.set(1, 1, 1);
    // scene.add(meshes["teapot2"]);

    meshes["shell"].position.set(0, -2, 0);
    meshes["shell"].rotation.set(0, Math.PI/2, 0);
    meshes["shell"].scale.set(1, 1, 1);
    scene.add(meshes["shell"]);
    
    meshes["coral_1"].position.set(-10, -2.2, -10);
    meshes["coral_1"].rotation.set(-Math.PI/2, 0, 0);
    meshes["coral_1"].scale.set(0.05, 0.05, 0.05);
    scene.add(meshes["coral_1"]);
    
    meshes["coral_1_clone"].position.set(-10, -2.2, -2);
    meshes["coral_1_clone"].rotation.set(-Math.PI/2, 0, 0);
    meshes["coral_1_clone"].scale.set(0.05, 0.05, 0.05);
    scene.add(meshes["coral_1_clone"]);
    
    meshes["coral_2"].position.set(-5, -2.2, -10);
    meshes["coral_2"].rotation.set(-Math.PI/2, 0, 0);
    meshes["coral_2"].scale.set(1, 1, 1);
    scene.add(meshes["coral_2"]);
    
    // meshes["coral_3"].position.set(2, -2.2, -10);
    // meshes["coral_3"].rotation.set(0, 0, 0);
    // meshes["coral_3"].scale.set(0.25, 0.25, 0.25);
    // scene.add(meshes["coral_3"]);

    meshes["angelfish"].position.set(2, 3, -3);
    meshes["angelfish"].rotation.set(-Math.PI/2, 0, -Math.PI/2);
    meshes["angelfish"].scale.set(1, 1, 1);
    scene.add(meshes["angelfish"]);

    meshesLoaded = true;
}


///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // up
    if (keyCode == "W".charCodeAt()) {          // W = up
        light.position.y += 0.11;
        // down
    } else if (keyCode == "S".charCodeAt()) {   // S = down
        light.position.y -= 0.11;
        // left
    } else if (keyCode == "A".charCodeAt()) {   // A = left
	light.position.x -= 0.1;
        // right
    } else if (keyCode == "D".charCodeAt()) {   // D = right
        light.position.x += 0.11;
    } else if (keyCode == "M".charCodeAt()) {   // M = move
      isIdle = false;
      isMoving = true;
      isGrowing = false;
     } else if (keyCode == "I".charCodeAt()) {   // I = idle
      isIdle = true;
      isMoving = false;
      isGrowing = false;
     } else if (keyCode == "G".charCodeAt()) {   // G = Growing and Barrel Roll
      isIdle = false;
      isMoving = false;
      isGrowing = true;
     } else if (keyCode == "B".charCodeAt()) {   // B = Make Tail Bigger
      tailYScale *= 1.1;
     } else if (keyCode == "N".charCodeAt()) {   // N = Make Tail Smaller
      tailYScale *= 0.9;
    } else if (keyCode == " ".charCodeAt()) {   // space
	animation = !animation;
    }
};

var isIdle = true;
var isMoving = false;
var isGrowing = false;
var tailYScale = 1;
var turtleScale = 1;

///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK:    This is the main animation loop
///////////////////////////////////////////////////////////////////////////////////////

function update() {
//    console.log('update()');
    var dt=0.02;
    if (animation && meshesLoaded) {
	  // advance the motion of all the animated objects
	  // myboxMotion.timestep(dt);    // note: will also call boxSetMatrices(), provided as a callback fn during setup
    //  	handMotion.timestep(dt);     // note: will also call handSetMatrices(), provided as a callback fn during setup
    if (isIdle) {
      turtleIdleMotion.timestep(dt);     // note: will also call turtleSetMatrices(), provided as a callback fn during setup
    } else if (isMoving) {
      turtleMoveMotion.timestep(dt);
    } else if (isGrowing) {
      turtleGrowMotion.timestep(dt);     // note: will also call turtleSetMatrices(), provided as a callback fn during setup
    }     
    }
    if (meshesLoaded) {
	    sphere.position.set(light.position.x, light.position.y, light.position.z);
	    renderer.render(scene, camera);
    }
    requestAnimationFrame(update);      // requests the next update call;  this creates a loop
}

init();
update();