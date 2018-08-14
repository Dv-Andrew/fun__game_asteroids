import { drawGrid } from './modules/learnCanvas.min.js';
import { drawPackman } from './modules/learnCanvas.min.js';
import { drawShip, drawAsteroid } from './modules/learnCanvas.min.js';

var canvas = document.querySelector('.game__asteroids');
var context = canvas.getContext('2d');

drawGrid(context);

// drawShip(context, 150, {guide: true});

let w = context.canvas.width,
    h = context.canvas.height;

let x = w / 2,
    y = h / 2,
    angle = 0;

// context.save();
//     context.translate(100, 100);
//     context.rotate((Math.PI * angle) / 180);

//     drawShip(context, 50, {
//         curve1: Math.random(),
//         curve2: Math.random(),
//         guide: true
//     });
// context.restore();

var segments = 15,
    noise = 0;
var shape = [];

for (var i = 0; i < segments; i++) {
    shape.push(2 * (Math.random() - 0.5));
}
for (let y = 0.1; y < 1; y += 0.2) {
    for (let x = 0.1; x < 1; x += 0.2) {
        context.save();
            context.translate(canvas.width * x, canvas.height * y);
            context.rotate((Math.PI * angle) / 180);
        
            drawAsteroid(context, canvas.width / 16, shape, {
                noise: noise,
                guide: true
            });
        context.restore();
        noise += 0.025;
    }
}