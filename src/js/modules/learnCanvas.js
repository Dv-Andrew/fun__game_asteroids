export function drawGrid(canvas, context, minor, major, stroke, fill) {
    minor = minor || 10;
    major = major || minor * 5;
    stroke = stroke || "#00ff00";
    fill = fill || "#009900";

    context.strokeStyle = stroke;
    context.fillStyle = fill;

    for(var x = 0; x < canvas.width; x+=minor) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.lineWidth = (x % major == 0) ? 0.5 : 0.25;
        context.stroke();
        if (x % major == 0) {
            context.fillText(x, x + 2, 10);
        }
    }
    for(var y = 0; y < canvas.height; y+=minor) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.lineWidth = (y % major == 0) ? 0.5 : 0.25;
        context.stroke();
        if (y % major == 0) {
            if (y != 0) {
                context.fillText(y, 2, y + 10);
            }
        }
    }
}