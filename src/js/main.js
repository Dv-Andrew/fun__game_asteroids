"use strict";

import { drawGrid } from './modules/learnCanvas.min.js';
import { Asteroid } from './modules/gameObjects.min.js';

var canvas = document.querySelector('.game__asteroids');
var context = canvas.getContext('2d');

//------------------------------------------------------
var asteroids = [];
for(let i = 0; i < 5; i++) {
    asteroids[i] = new Asteroid(context, Math.random() * canvas.width, Math.random() * canvas.height, 10000);
}

function draw(ctx, guide) {
    if(guide) {
        drawGrid(ctx);
    }
    asteroids.forEach(function(asteroid) {
        asteroid.draw();
    });
}

function update(elapsed) {
    asteroids.forEach(function(asteroid) {
        asteroid.update(elapsed);
    });
}

var previousTime;
function frame(timestamp) {
    if (!previousTime) {
        previousTime = timestamp;
    }
    let elapsedTime = timestamp - previousTime;
    previousTime = timestamp;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    update(elapsedTime / 1000);
    draw(context, true);
    
    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);