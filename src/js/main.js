import { drawGrid } from './modules/learnCanvas.min.js';

var canvas = document.querySelector('.game__asteroids');
var context = canvas.getContext('2d');

drawGrid(canvas, context);