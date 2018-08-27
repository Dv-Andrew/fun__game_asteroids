"use strict";

import { drawGrid } from './modules/learnCanvas.min.js';
import { Ship, Asteroid } from './modules/gameObjects.min.js';

var canvas = document.querySelector('.game__asteroids');
var context = canvas.getContext('2d');

//------------------------------------------------------
var asteroids = [];
for (let i = 0; i < 10; i++) {
    asteroids[i] = new Asteroid(context, Math.random() * canvas.width, Math.random() * canvas.height, 10000);
    asteroids[i].push(Math.random() * Math.PI * 2, 2000, 60);
    asteroids[i].twist((Math.random() - 0.5) * 500, 60);
}

var ship = new Ship(context, canvas.width / 2, canvas.height / 2, 1000);
window.ship = ship;

var projectiles = [];

//------------------------------
// ОТРИСОВКА И ОБНОВЛЕНИЕ:
function draw(ctx, guide) {
    if (guide) {
        drawGrid(ctx);
    }
    asteroids.forEach(function(asteroid) {
        asteroid.draw();
    });

    ship.draw();

    projectiles.forEach(function(projectile) {
        projectile.draw();
    });
}

function update(elapsed) {
    asteroids.forEach(function(asteroid) {
        asteroid.update(elapsed);
    });

    ship.update(elapsed);

    projectiles.forEach(function(projectile, i, projectiles) {
        projectile.update(elapsed);
        if (projectile.life <= 0) {
            projectiles.splice(i, 1);
        }
    });
    if (ship.trigger && ship.isLoaded) {
        projectiles.push(ship.shoot(elapsed));
    }
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
    draw(context, false);

    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);
//==================================

// controls:
canvas.focus();
canvas.addEventListener("keydown", function(event) {
    let key = event.key || event.keyCode;
    let nothingHandled = false;
    switch (key) {
        case "ArrowLeft":
        case 37: // left arrow keyCode
            ship.leftThruster = true;
            break;
        case "ArrowUp":
        case 38: // up arrow keyCode
            ship.isThrusterOn = true;
            break;
        case "ArrowRight":
        case 39: // right arrow keyCode
            ship.rightThruster = true;
            break;
        case "ArrowDown":
        case 40: // down arrow keyCode
            break;

        case " ":
        case 32: // space keyCode
            ship.trigger = true;
            break;

        default:
            nothingHandled = true;
    }
    if (!nothingHandled) {
        event.preventDefault();
    }
});

canvas.addEventListener("keyup", function(event) {
    let key = event.key || event.keyCode;
    let nothingHandled = false;
    switch (key) {
        case "ArrowLeft":
        case 37: // left arrow keyCode
            ship.leftThruster = false;
            break;
        case "ArrowUp":
        case 38: // up arrow keyCode
            ship.isThrusterOn = false;
            break;
        case "ArrowRight":
        case 39: // right arrow keyCode
            ship.rightThruster = false;
            break;
        case "ArrowDown":
        case 40: // down arrow keyCode
            break;

        case " ":
        case 32: // space keyCode
            ship.trigger = false;
            break;

        default:
            nothingHandled = true;
    }
    if (!nothingHandled) {
        event.preventDefault();
    }
});