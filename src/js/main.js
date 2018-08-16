import { drawGrid } from './modules/learnCanvas.min.js';
import { drawPacman } from './modules/learnCanvas.min.js';
import { drawShip, drawAsteroid } from './modules/learnCanvas.min.js';
import { Asteroid } from './modules/gameObjects.min.js';

var canvas = document.querySelector('.game__asteroids');
var context = canvas.getContext('2d');

//------------------------------------------------------
var asteroids = [
    new Asteroid(context, 24, 50, 0.2),
    new Asteroid(context, 24, 50, 0.5),
    new Asteroid(context, 5, 50, 0.2)
];

function draw(ctx, guide) {
    if(guide) {
        drawGrid(ctx);
    }

    asteroids.forEach(function(asteroid) {
        asteroid.draw(ctx, guide);
    });
}

function update(ctx, elapsed) {
    asteroids.forEach(function(asteroid) {
        asteroid.update(ctx, elapsed);
    });
}

var previous, elapsed;

function frame(timestamp) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    if (!previous) {
        previous = timestamp;
    }

    elapsed = timestamp - previous;
    update(context, elapsed / 1000);
    draw(context, true);
    previous = timestamp;
    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);