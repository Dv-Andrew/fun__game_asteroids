import { drawGrid } from './modules/learnCanvas.min.js';
import { drawPackman } from './modules/learnCanvas.min.js';
import { drawShip } from './modules/learnCanvas.min.js';

var canvas = document.querySelector('.game__asteroids');
var context = canvas.getContext('2d');

drawGrid(canvas, context);

drawShip(canvas, context, 200, 200, 150, {guide: true});