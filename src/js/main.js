import { drawGrid } from './modules/learnCanvas.min.js';
import { drawPackman } from './modules/learnCanvas.min.js';
import { drawShip } from './modules/learnCanvas.min.js';

var canvas = document.querySelector('.game__asteroids');
var context = canvas.getContext('2d');

drawGrid(context);

// drawShip(context, 150, {guide: true});

let w = context.canvas.width,
    h = context.canvas.height;

let x = w / 2,
    y = h / 2,
    angle = 0;

context.save();
context.translate(x, y);
drawShip(context, 150, {
    curve1: Math.random(),
    curve2: Math.random(),
    guide: true
});