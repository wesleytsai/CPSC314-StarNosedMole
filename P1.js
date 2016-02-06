// UBC CPSC 314 (2015W2) -- P1
// HAVE FUN!!! :)

// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function (a) {
    this.matrix = a;
    this.matrix.decompose(this.position, this.quaternion, this.scale);
};

// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xFFFFFF); // white background colour
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(45, 20, 40);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);

// ADAPT TO WINDOW RESIZE
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize', resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
    window.scrollTo(0, 0);
};

// SETUP HELPER GRID
// Note: Press Z to show/hide
var gridGeometry = new THREE.Geometry();
var i;
for (i = -50; i < 51; i += 2) {
    gridGeometry.vertices.push(new THREE.Vector3(i, 0, -50));
    gridGeometry.vertices.push(new THREE.Vector3(i, 0, 50));
    gridGeometry.vertices.push(new THREE.Vector3(-50, 0, i));
    gridGeometry.vertices.push(new THREE.Vector3(50, 0, i));
}

var gridMaterial = new THREE.LineBasicMaterial({color: 0xBBBBBB});
var grid = new THREE.Line(gridGeometry, gridMaterial, THREE.LinePieces);

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// MATERIALS
// Note: Feel free to be creative with this! 
var normalMaterial = new THREE.MeshNormalMaterial();
var brownMat = new THREE.MeshBasicMaterial();
brownMat.color = new THREE.Color(0x612D1C);
var lightBrownMat = new THREE.MeshBasicMaterial();
lightBrownMat.color = new THREE.Color(0x9E7C55);
var clawMat = new THREE.MeshBasicMaterial();
clawMat.color = new THREE.Color(0xCFBEAB);

var tentMat = new THREE.MeshBasicMaterial();
tentMat.color = new THREE.Color(0xF57B56);


// function drawCube()
// Draws a unit cube centered about the origin.
// Note: You will be using this for all of your geometry
function makeCube() {
    var unitCube = new THREE.BoxGeometry(1, 1, 1);
    return unitCube;
}

// GEOMETRY
var torsoGeometry = makeCube();
var non_uniform_scale = new THREE.Matrix4().set(5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 8, 0, 0, 0, 0, 1);
torsoGeometry.applyMatrix(non_uniform_scale);

// TO-DO: SPECIFY THE REST OF YOUR STAR-NOSE MOLE'S GEOMETRY. 
// Note: You will be using transformation matrices to set the shape. 
// Note: You are not allowed to use the tools Three.js provides for 
//       rotation, translation and scaling.
// Note: The torso has been done for you (but feel free to modify it!)  
// Hint: Explicitly declare new matrices using Matrix4().set

function scale(x, y, z) {
    return new THREE.Matrix4().set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
}

var headGeometry = makeCube();
var head_scale = scale(3, 3, 4);
headGeometry.applyMatrix(head_scale);

var noseGeometry = makeCube();
var nose_scale = scale(3, 2, 0.5);
noseGeometry.applyMatrix(nose_scale);

var lgTentGeometry = makeCube();
var lgTent_scale = scale(0.2, 0.2, 1.5);
lgTentGeometry.applyMatrix(lgTent_scale);

var smTentGeometry = makeCube();
var smTent_scale = scale(0.15, 0.15, 1);
smTentGeometry.applyMatrix(smTent_scale);

var pawGeometry = makeCube();
var paw_scale = scale(3, 1, 4);
pawGeometry.applyMatrix(paw_scale);

var clawGeometry = makeCube();
var claw_scale = scale(0.3, 0.5, 1);
clawGeometry.applyMatrix(claw_scale);

var tailGeometry = makeCube();
var tail_scale = scale(1, 1, 6);
tailGeometry.applyMatrix(tail_scale);

// MATRICES
var torsoMatrix = new THREE.Matrix4().set(1, 0, 0, 0, 0, 1, 0, 2.5, 0, 0, 1, 0, 0, 0, 0, 1);
var inverseTorsoMatrix = new THREE.Matrix4().set(1, 0, 0, 0, 0, 1, 0, -2.5, 0, 0, 1, 0, 0, 0, 0, 1);

// TO-DO: INITIALIZE THE REST OF YOUR MATRICES 
// Note: Use of parent attribute is not allowed.
// Hint: Keep hierarchies in mind!   
// Hint: Play around with the TorsoMatrix values, what changes in the render? Why?         

function translation(x, y, z) {
    return new THREE.Matrix4().set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
}

// Equation obtained from http://new.math.uiuc.edu/math198/MA198-2013/marya2/rotation_matrix.png
// The equation is the matrix multiplication of RotateZ * RotateY * RotateX
function rotation(x, y, z) {
    return new THREE.Matrix4().set(
        Math.cos(z) * Math.cos(y), -Math.sin(z) * Math.cos(x) + Math.cos(z) * Math.sin(y) * Math.sin(x), Math.sin(z) * Math.sin(x) + Math.cos(z) * Math.sin(y) * Math.cos(x), 0,
        Math.sin(z) * Math.cos(y), Math.cos(z) * Math.cos(x) + Math.sin(z) * Math.sin(y) * Math.sin(x), -Math.cos(z) * Math.sin(x) + Math.sin(z) * Math.sin(y) * Math.cos(x), 0,
        -Math.sin(y), Math.cos(y) * Math.sin(x), Math.cos(y) * Math.cos(x), 0,
        0, 0, 0, 1
    )
}

function setMatrix(mesh, m1) {
}

function multiply(m1, m2) {
    return new THREE.Matrix4().multiplyMatrices(m1, m2);
}

var matrixStack = [];
function pushMatrix(m) {
    var m2 = new Matrix4(m);
    matrixStack.push(m2);
}

function popMatrix(m) {
    return matrixStack.pop();
}

var headMatrix = multiply(torsoMatrix, translation(0, 0, 5));
var inverseHeadMatrix = multiply(torsoMatrix, translation(0, 0, -5));
var noseMatrix = multiply(headMatrix, translation(0, 0, 2.25));
var tailMatrix = multiply(torsoMatrix, translation(0, 0, -5.5));

// Paws stored in order: RF, LF, RR, LR
var pawMatrices = [];
pawMatrices[0] = multiply(translation(-2, 0, 3.5), rotation(0.1, 0, 0));
pawMatrices[1] = multiply(translation(2, 0, 3.5), rotation(0.1, 0, 0));
pawMatrices[2] = multiply(translation(-2, 0, -1.8), rotation(0.1, 0, 0));
pawMatrices[3] = multiply(translation(2, 0, -1.8), rotation(0.1, 0, 0));

// Need 5 claws per paw
var clawMatrices = [];
for (var i = 0; i < 5; i++) {
    clawMatrices[i] = translation(-1.5 + 0.75 * i, -0.2, 2);
}

// Need 9 large tentacles on each side
var lgTentLeftMatrices = [];
var lgTentRightMatrices = [];

for (var i = 0; i < 9; i++) {
    // Rotate
    lgTentRightMatrices[i] = multiply(translation(0.15, 0.15, 0.8), rotation(1.2 - 0.3 * i, -0.5, 0));

    // Separate the tentacles
    lgTentRightMatrices[i] = multiply(lgTentRightMatrices[i], translation(-0.7, i * 0.02, 0.5));

    // Rotate
    lgTentLeftMatrices[i] = multiply(translation(0.15,0.15, 0.8), rotation(1.2 - 0.3 * i, 0.5, 0));

    // Separate the tentacles
    lgTentLeftMatrices[i] = multiply(lgTentLeftMatrices[i], translation(0.5, i * 0.02, 0.5));
}

// Need 2 small tentacles on each side
var smTentRightMatrices = [];
var smTentLeftMatrices = [];

for (var i = 0; i < 2; i++) {
    // Rotate
    smTentRightMatrices[i] = multiply(rotation(0.2 - i * 0.4, 0, 0), translation(-0.2, 0, 1));

    smTentLeftMatrices[i] = multiply(rotation(0.2 - i * 0.4, 0, 0), translation(0.2, 0, 1));
}


// CREATE BODY
var torso = new THREE.Mesh(torsoGeometry, brownMat);
torso.setMatrix(torsoMatrix);
scene.add(torso);

// TO-DO: PUT TOGETHER THE REST OF YOUR STAR-NOSED MOLE AND ADD TO THE SCENE!
// Hint: Hint: Add one piece of geometry at a time, then implement the motion for that part. 
//             Then you can make sure your hierarchy still works properly after each step.
//
var head = new THREE.Mesh(headGeometry, lightBrownMat);
head.setMatrix(headMatrix);
scene.add(head);

var nose = new THREE.Mesh(noseGeometry, brownMat);
nose.setMatrix(noseMatrix);
var lgTentLeft = [];
var lgTentRight = [];
for (var i = 0; i < 9; i++) {
    lgTentRight[i] = new THREE.Mesh(lgTentGeometry, tentMat);
    lgTentRight[i].setMatrix(multiply(noseMatrix, lgTentRightMatrices[i]));
    scene.add(lgTentRight[i]);

    lgTentLeft[i] = new THREE.Mesh(lgTentGeometry, tentMat);
    lgTentLeft[i].setMatrix(multiply(noseMatrix, lgTentLeftMatrices[i]));
    scene.add(lgTentLeft[i]);
}

var smTentRight = [];
var smTentLeft = [];
for (var i = 0; i < 2; i++) {
    smTentRight[i] = new THREE.Mesh(smTentGeometry, lightBrownMat);
    smTentRight[i].setMatrix(multiply(noseMatrix, smTentRightMatrices[i]));
    scene.add(smTentRight[i]);

    smTentLeft[i] = new THREE.Mesh(smTentGeometry, lightBrownMat);
    smTentLeft[i].setMatrix(multiply(noseMatrix, smTentLeftMatrices[i]));
    scene.add(smTentLeft[i]);
}

scene.add(nose);

var tail = new THREE.Mesh(tailGeometry, clawMat);
tail.setMatrix(tailMatrix);
scene.add(tail);


var paw = [];
var claw = [];
for (var i = 0; i < 4; i++) {

    paw[i] = new THREE.Mesh(pawGeometry, lightBrownMat);
    paw[i].setMatrix(pawMatrices[i]);
    scene.add(paw[i]);

    for (var j = 0; j < 5; j++) {
        claw[i * 5 + j] = new THREE.Mesh(clawGeometry, clawMat);
        claw[i * 5 + j].setMatrix(multiply(pawMatrices[i], clawMatrices[j]));
        scene.add(claw[i * 5 + j]);
    }
}


// APPLY DIFFERENT JUMP CUTS/ANIMATIONS TO DIFFERENT KEYS
// Note: The start of "U" animation has been done for you, you must implement the hiearchy and jumpcut.
// Hint: There are other ways to manipulate and grab clock values!!
// Hint: Check THREE.js clock documenation for ideas.
// Hint: It may help to start with a jumpcut and implement the animation after.
// Hint: Where is updateBody() called?
var clock = new THREE.Clock(true);

var p0; // start position or angle
var p1; // end position or angle
var time_length; // total time of animation
var time_start; // start time of animation
var time_end; // end time of animation
var p; // current frame
var animate = false; // animate?

var torsoRotMatrix = torsoMatrix;
var headRotMatrix = headMatrix;
var noseRotMatrix = noseMatrix;
var tailRotMatrix = tailMatrix;

// function init_animation()
// Initializes parameters and sets animate flag to true.
// Input: start position or angle, end position or angle, and total time of animation.
function init_animation(p_start, p_end, t_length) {
    p0 = p_start;
    p1 = p_end;
    time_length = t_length;
    time_start = clock.getElapsedTime();
    time_end = time_start + time_length;
    animate = true; // flag for animation
    return;
}


function updateBody() {
    var direction;
    p = get_p_frame();
    switch (true) {
        case ((key == "U" || key == "E")):
            direction = key == "E" ? -1 : 1;
            bodyTilt(direction);
            break;

        // TO-DO: IMPLEMENT JUMPCUT/ANIMATION FOR EACH KEY!
        // Note: Remember spacebar sets jumpcut/animate!

        // H is head right, G is head left
        case (key == "H" || key == "G"):
            direction = key == "H" ? -1 : 1;
            moveHead(direction);
            break;

        // T is tail right, V is tail left
        case (key == "T" || key == "V"):
            direction = key == "V" ? -1 : 1;
            moveTail(direction);
            break;

        // N is tentacles fan out
        case (key == "N"):
            fanTents();
            break;

        // S is Swim
        case (key == "S"):
            performSwimmingStarNosedMoleAnimation();
            break;

        // D is dig
        case (key == "D"):
            dig();
            break;

        default:
            break;
    }
}


function get_p_frame() {
    var time = clock.getElapsedTime(); // t seconds passed since the clock started.

    if (time > time_end || animMode == AnimModes.JUMPCUT) {
        p = p1;
        animate = false;
        return p;
    }

    p = (p1 - p0) * ((time - time_start) / time_length) + p0; // current frame
    return p;
}

function performSwimmingStarNosedMoleAnimation() {
    var right = -1;
    var left = 1;

    var rf = 0;
    var lf = 1;
    var rr = 2;
    var lr = 3;

    if (p > 0) {
        moveHead(right);
        movePaw(lf);
        movePaw(rr);
        moveTail(left);
        fanTents();
    } else {
        p = -p;
        moveHead(left);
        movePaw(rf);
        movePaw(lr);
        moveTail(right);
        fanTents();
    }
}

function moveHead(direction) {
    // direction: -1 for right, 1 for left

    var head_rotation_point_z = 1.5;

    headRotMatrix = multiply(torsoRotMatrix, headMatrix);
    headRotMatrix = multiply(headRotMatrix, translation(0, 0, -head_rotation_point_z));
    headRotMatrix = multiply(headRotMatrix, inverseTorsoMatrix);
    headRotMatrix = multiply(headRotMatrix, rotation(0, direction*p, 0));
    headRotMatrix = multiply(headRotMatrix, translation(0, 0, head_rotation_point_z));
    head.setMatrix(headRotMatrix);

    noseRotMatrix = multiply(headRotMatrix, noseMatrix);
    noseRotMatrix = multiply(noseRotMatrix, inverseTorsoMatrix);
    noseRotMatrix = multiply(noseRotMatrix, inverseHeadMatrix);
    noseRotMatrix = multiply(noseRotMatrix, inverseTorsoMatrix);
    nose.setMatrix(noseRotMatrix);

    for (var i = 0; i < 9; i++) {
        lgTentRight[i].setMatrix(multiply(noseRotMatrix, lgTentRightMatrices[i]));
        lgTentLeft[i].setMatrix(multiply(noseRotMatrix, lgTentLeftMatrices[i]));
    }

    for (var i = 0; i < 2; i++) {
        smTentRight[i].setMatrix(multiply(noseRotMatrix, smTentRightMatrices[i]));
        smTentLeft[i].setMatrix(multiply(noseRotMatrix, smTentLeftMatrices[i]));
    }
    
}


function moveTail(direction) {
    // direction: -1 for right, 1 for left

    var tail_rotation_point_z = 2.0;

    tailRotMatrix = multiply(torsoRotMatrix, tailMatrix);

    // Translate to point of rotation and translate back
    tailRotMatrix = multiply(tailRotMatrix, translation(0,0,tail_rotation_point_z));
    tailRotMatrix = multiply(tailRotMatrix, rotation(0, direction*p, 0));
    tailRotMatrix = multiply(tailRotMatrix, translation(0,0,-tail_rotation_point_z));

    tailRotMatrix = multiply(tailRotMatrix, inverseTorsoMatrix);

    tail.setMatrix(tailRotMatrix);
}


function bodyTilt(direction) {
    torsoRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, rotation(-direction*p, 0, 0));
    torso.setMatrix(torsoRotMatrix);

    headRotMatrix = multiply(torsoRotMatrix, headMatrix);
    headRotMatrix = multiply(headRotMatrix, inverseTorsoMatrix);
    head.setMatrix(headRotMatrix);

    noseRotMatrix = multiply(torsoRotMatrix, noseMatrix);
    noseRotMatrix = multiply(noseRotMatrix, inverseTorsoMatrix);
    nose.setMatrix(noseRotMatrix);

    tailRotMatrix = multiply(torsoRotMatrix, tailMatrix);
    tailRotMatrix = multiply(tailRotMatrix, inverseTorsoMatrix);
    tail.setMatrix(tailRotMatrix);

    for (var i = 0; i < 4; i++) {
        var pawRotMatrix = multiply(torsoRotMatrix, pawMatrices[i]);
        pawRotMatrix = multiply(pawRotMatrix, inverseTorsoMatrix);
        paw[i].setMatrix(pawRotMatrix);
        for (var j = 0; j < 5; j++) {
            claw[i * 5 + j].setMatrix(multiply(pawRotMatrix, clawMatrices[j]));
        }
    }

    for (var i = 0; i < 9; i++) {
        lgTentRight[i].setMatrix(multiply(noseRotMatrix, lgTentRightMatrices[i]));
        lgTentLeft[i].setMatrix(multiply(noseRotMatrix, lgTentLeftMatrices[i]));
    }

    for (var i = 0; i < 2; i++) {
        smTentRight[i].setMatrix(multiply(noseRotMatrix, smTentRightMatrices[i]));
        smTentLeft[i].setMatrix(multiply(noseRotMatrix, smTentLeftMatrices[i]));
    }
}

// D is for dig
function dig() {
    for (var i = 0; i < 2; i++) {
        movePaw(i);
    }
}

function movePaw(i) {
    var pawRotMatrix = multiply(torsoRotMatrix, pawMatrices[i]);
    pawRotMatrix = multiply(pawRotMatrix, inverseTorsoMatrix);
    pawRotMatrix = multiply(pawRotMatrix, rotation(p, 0, 0));
    paw[i].setMatrix(pawRotMatrix);
    for (var j = 0; j < 5; j++) {
        var clawRotMatrix = multiply(pawRotMatrix, clawMatrices[j]);
        clawRotMatrix = multiply(clawRotMatrix, rotation(p, 0, 0));
        claw[i * 5 + j].setMatrix(clawRotMatrix);
    }
}

// N is for tentacle fanning
function fanTents() {
    for (var i = 0; i < 9; i++) {
        var rightRotMatrix = multiply(noseRotMatrix, lgTentRightMatrices[i]);
        rightRotMatrix = multiply(rightRotMatrix, rotation(0, -p, 0));
        lgTentRight[i].setMatrix(rightRotMatrix);

        var leftRotMatrix = multiply(noseRotMatrix, lgTentLeftMatrices[i]);
        leftRotMatrix = multiply(leftRotMatrix, rotation(0, p, 0));
        lgTentLeft[i].setMatrix(leftRotMatrix);
    }

    for (var i = 0; i < 2; i++) {
        var smTentRightRotMatrix = multiply(noseRotMatrix, smTentRightMatrices[i]);
        smTentRightRotMatrix = multiply(smTentRightRotMatrix, rotation(0, -p, 0));
        smTentRight[i].setMatrix(smTentRightRotMatrix);

        var smTentLeftRotMatrix = multiply(noseRotMatrix, smTentLeftMatrices[i]);
        smTentLeftRotMatrix = multiply(smTentLeftRotMatrix, rotation(0, p, 0));
        smTentLeft[i].setMatrix(smTentLeftRotMatrix);
    }
}


// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var key;
var AnimModes = {
    SMOOTH: "smooth",
    JUMPCUT: "jumpcut"
};
var animMode = AnimModes.SMOOTH;
var swimState = 0;
keyboard.domElement.addEventListener('keydown', function (event) {
    if (event.repeat)
        return;
    if (keyboard.eventMatches(event, "Z")) {  // Z: Reveal/Hide helper grid
        grid_state = !grid_state;
        grid_state ? scene.add(grid) : scene.remove(grid);
    }
    else if (keyboard.eventMatches(event, "0")) {    // 0: Set camera to neutral position, view reset
        camera.position.set(45, 0, 0);
        camera.lookAt(scene.position);
    }
    else if (keyboard.eventMatches(event, "U")) {
        (key == "U") ? init_animation(p1, p0, time_length) : (init_animation(0, Math.PI / 4, 1), key = "U")
    }
    else if (keyboard.eventMatches(event, "E")) {
        (key == "E") ? init_animation(p1, p0, time_length) : (init_animation(0, Math.PI / 4, 1), key = "E")
    }
    else if (keyboard.eventMatches(event, "H")) {
        (key == "H") ? init_animation(p1, p0, time_length) : (init_animation(0, Math.PI / 4, 1), key = "H")
    }
    else if (keyboard.eventMatches(event, "G")) {
        (key == "G") ? init_animation(p1, p0, time_length) : (init_animation(0, Math.PI / 4, 1), key = "G")
    }
    else if (keyboard.eventMatches(event, "T")) {
        (key == "T") ? init_animation(p1, p0, time_length) : (init_animation(0, Math.PI / 4, 1), key = "T")
    }
    else if (keyboard.eventMatches(event, "V")) {
        (key == "V") ? init_animation(p1, p0, time_length) : (init_animation(0, Math.PI / 4, 1), key = "V")
    }
    else if (keyboard.eventMatches(event, "N")) {
        (key == "N") ? init_animation(p1, p0, time_length) : (init_animation(0, Math.PI / 4, 1), key = "N")
    }
    else if (keyboard.eventMatches(event, "S")) {
        key = "S";
        switch(swimState) {
            case 0:
                init_animation(0, Math.PI / 4, 1);
                break;
            case 1:
                init_animation(p1, -p1, 2*time_length);
                break;
            case 2:
                init_animation(p1, 0, time_length/2);
                break;
        }
        swimState++;
        swimState = swimState%3;
    }
    else if (keyboard.eventMatches(event, "D")) {
        (key == "D") ? init_animation(p1, p0, time_length) : (init_animation(0, Math.PI / 4, 1), key = "D")
    }
    // TO-DO: BIND KEYS TO YOUR JUMP CUTS AND ANIMATIONS
    // Note: Remember spacebar sets jumpcut/animate!
    // Hint: Look up "threex.keyboardstate by Jerome Tienne" for more info.
    else if (keyboard.eventMatches(event, "space")) {
        if (animMode == AnimModes.JUMPCUT)
            animMode = AnimModes.SMOOTH;
        else
            animMode = AnimModes.JUMPCUT;
    }
});

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
function update() {
    updateBody();

    requestAnimationFrame(update);
    renderer.render(scene, camera);
}

update();
