"use strict";

import { drawGrid } from './modules/learnCanvas.min.js';
import { Ship, Asteroid } from './modules/gameObjects.min.js';

var canvas = document.querySelector('.game__asteroids');
var context = canvas.getContext('2d');

//------------------------------------------------------
var asteroids = [];
for(let i = 0; i < 10; i++) {
    asteroids[i] = new Asteroid(context, Math.random() * canvas.width, Math.random() * canvas.height, 10000);
    asteroids[i].push(Math.random() * Math.PI * 2, 2000, 60);
    asteroids[i].twist((Math.random()-0.5) * 500, 60);
}

var ship = new Ship(context, canvas.width/2, canvas.height/2);
window.ship = ship;

function draw(ctx, guide) {
    if(guide) {
        drawGrid(ctx);
    }
    asteroids.forEach(function(asteroid) {
        asteroid.draw();
    });
    ship.draw();
}

function update(elapsed) {
    asteroids.forEach(function(asteroid) {
        asteroid.update(elapsed);
    });
    
    if(Math.abs(ship.speed()) < 15) { // if its nearly stopped, turn
        ship.angle += Math.PI * 2;
    }
    if(Math.abs(ship.speed()) > 250) { // If Its going fast, turn around to slow down
        ship.angle = ship.movement_angle() + Math.PI;
    }
    ship.push(ship.angle, 1000, elapsed); // push in the direction its pointing (thrusters?)

    ship.update(elapsed);
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