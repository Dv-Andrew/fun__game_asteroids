import { drawGrid } from './modules/learnCanvas.min.js';
import { drawPacman } from './modules/learnCanvas.min.js';
import { drawShip, drawAsteroid } from './modules/learnCanvas.min.js';

var canvas = document.querySelector('.game__asteroids');
var context = canvas.getContext('2d');

drawGrid(context);

context.strokeStyle = "white";
context.lineWidth = 1.5;

let radius = 40
let x = 0 + radius, y = 0 + radius;
let xspeed = 50.5, yspeed = 50, gravity = 0.1;
let mouth = 0;

function frame() {
    context.clearRect(0, 0, context.canvas.width, context.
    canvas.height);
    draw(context);
    update();
}

function update() {
    x += xspeed;
    y += yspeed;

    yspeed += gravity;

    if (y >= context.canvas.height - radius) {

        y = context.canvas.height - radius;
        // add an extra radius
        yspeed *= -0.9;
        // reverse and slow down
        xspeed *= 0.95;
        // just slow down a bit
    }
    if (y <= 0) {
        y = 0 + radius;
        yspeed *= -0.9;
    }

    if (x <= 0 || x >= context.canvas.width) {
        // x = (x + context.canvas.width) % context.canvas.width;
        xspeed *= -0.95;

        if (x <= 0) {
            x = 0 + radius - (radius / 2);
        }
        if (x >= context.canvas.width) {
            x = context.canvas.width - radius + (radius / 2);
        }
    }

    mouth = Math.abs(Math.sin(6 * Math.PI * x / (context.canvas.width)));
}

function draw(ctx) {
    drawGrid(context);
    ctx.save();
    ctx.translate(x, y);
    drawPacman(context, radius, mouth);
    ctx.restore();
}

setInterval(frame, 1000.0/60.0); // 60 fps