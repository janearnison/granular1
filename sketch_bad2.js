// GRANULAR SYNTH MOUSE INTERACTION

// Define Global Variables
const audioCtx = new AudioContext();
let cnv;
let x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0;

let value = 0
const bgColors = [100, 150, 250];
let bgIndex = 0;
const buffers = [buffer1, buffer2, buffer3, buffer4, buffer5, buffer6, buffer7, buffer8, buffer9]; // Defined in buffers.js
let bufferIndex = 0;
let loopStart, loopEnd, pressedPoint, releasePoint;
let isPlaying = false;
let grainSize = 0.1;
let overlap = 0.1;
let pointerX = 0
let pointerY = 0

// Instantiate Tone.GrainPlayer object
const player = new Tone.GrainPlayer(buffers[bufferIndex]);

// A touch of reverb for extra vibes
const reverb = new Tone.Reverb({
    decay: 3,
    preDelay: 0.25,
    wet: 0.2,
});


function setup() {
    // Create canvas and attch mouse events with callbacks
    cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block');
    cnv.mousePressed(getPressedPoint);
    cnv.mouseReleased(getReleasePoint);
    cnv.mouseWheel(trackPad);


    cnv.addEventListener("pointerdown", handleStart, false);
    cnv.addEventListener("pointerup", handleEnd, false);
    cnv.addEventListener("pointercancel", handleCancel, false);
   cnv.addEventListener("pointermove", handleMove, false);
    log("initialized.");
}



    // Init settings for player
    player.loop = true;
    player.playbackRate = 1;
    player.overlap = overlap;
    player.grainSize = grainSize;
    reverb.toDestination();
    player.chain(reverb);

    pressedPoint = 0;
    releasePoint = 1;




function draw() {
    // Draw background
    // if (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
    //     background(mouseX / 2, mouseY / 2, bgColors[bgIndex]);
    // }
  
  background(50)
    // Draw instructions
    noStroke();
    let f = 80;
    textSize(20);
    textLeading(15);
    textFont("serif");
    for (i = 0; i < instructions.length; i++) {
        fill(f);
        text(instructions[i], 10, 30 * [i] + 30);
        f += 10;
    }

    // Draw rect to indicate loop start and end
    rectMode(CORNER);
    fill(140, 54, 100, 30);
    rect(x1, 0, x2 - x1, height);

    // Draw rect to represent grain size
    let grainSizeDisplay = map(grainSize, 0.01, 2, (width / 80), (height / 1.5));
    rectMode(CENTER);
    fill(255, 204, 0, 50);
    rect(width / 2, height / 2, grainSizeDisplay, grainSizeDisplay);

    // Affect player's tune and rate with mouseX and mouseY
    if (mouseX < width && mouseX > 0) {
        player.detune = (mouseX / (width / 4)) * 1200 - 2400;
    }
    if (mouseY < height && mouseY > 0) {
        player.playbackRate = mouseY / (height / 2) + 0.05;
    }

      // Affect player's tune and rate with pointerX & Y var
      if (pointerX < width && pointerY > 0) {
        player.detune = (pointerX / (width / 4)) * 1200 - 2400;
    }
    if (pointerY < height && pointerY > 0) {
        player.playbackRate = pointerY / (height / 2) + 0.05;
    }

    
    fill('magenta');

    // for each touch, draw an ellipse at its location.
    // touches are stored in array.
    for (var i = 0; i < touches.length; i++) {
      ellipse(touches[i].x, touches[i].y, 50, 50);
    }
}

// do this prevent default touch interaction
function mousePressed() {
    return false;
  }
  
  document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
  });


function getPressedPoint() {
    // Capture mouse pressed x and y
    pressedPoint = mouseX / width;
    x1 = mouseX;
    y1 = mouseY;
}

function getPressedPoint() {
    // Capture pointer pressed x and y
    pressedPoint = pointerX / width;
    x1 = pointerX;
    y1 = pointerY;
}

function getReleasePoint() {
    // Capture mouse released x and y
    releasePoint = pointerX / width;
    x2 = pointerX;
    y2 = pointerY;
    // Calculate loop start and end points
    calculateLoop();
}

function calculateLoop() {
    // Calculate loop start and end points in relation to current buffer's duration
    loopStart = pressedPoint * buffers[bufferIndex].duration;
    loopEnd = releasePoint * buffers[bufferIndex].duration;

    // If mouse dragged left to right, play forwards
    if (loopStart < loopEnd) {
        player.loopStart = loopStart;
        player.loopEnd = loopEnd;
        player.reverse = false;
        player.start(1, loopStart);
    } else { // otherwise, play backwards
        player.loopStart = loopEnd;
        player.loopEnd = loopStart;
        player.reverse = true;
        player.start(1, loopEnd);
    }
    isPlaying = true;
}


function pointerdown() {
    // start and stop the player by pressing pointer (touching/mouseclick)
    if (value === 1) {
        if (!isPlaying) {
            initializeTone();
            player.start(1, loopStart);
            isPlaying = true;
        } else {
            player.stop();
            isPlaying = false;
        }
    }
}

function startAudioContext() {
    if (audioContext.state === 'suspended') {
        audioContext.resume(); 

    }
}

function keyPressed() {
    // start and stop the player with the space bar
    if (key === " ") {
        if (!isPlaying) {
            initializeTone();
            player.start(1, loopStart);
            isPlaying = true;
        } else {
            player.stop();
            isPlaying = false;
        }
    }

    // cycle through buffers and backgrounds with right or left arrow
    if (key === "ArrowRight") {
        bufferIndex = (bufferIndex + 1) % buffers.length;
        player.buffer = buffers[bufferIndex];
        calculateLoop();
        bgIndex = (bgIndex + 1) % bgColors.length;
    }
    if (key === "ArrowLeft") {
        if (bufferIndex > 0) {
            bufferIndex = (bufferIndex - 1) % buffers.length;
            player.buffer = buffers[bufferIndex];
            calculateLoop();
            bgIndex = (bgIndex + 1) % bgColors.length;
        } else {
            bufferIndex = buffers.length - 1;
            player.buffer = buffers[bufferIndex];
            calculateLoop();
            bgIndex = bgColors.length - 1;
        }
    }
}



function trackPad(event) {
    // if mousewheel or trackpad scrolls down, reduce the grain size
    if (event.wheelDeltaY > 10) {
        if (grainSize > 0.02) {
            grainSize -= 0.01;
        }
        // if mousewheel or trackpad scrolls up, increase the grain size
    } else if (event.wheelDeltaY < -10) {
        if (grainSize < 2) {
            grainSize += 0.01;
        }
    }
    player.grainSize = grainSize;
}

async function initializeTone() {
    await player.start();
    console.log("audio context started");
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}