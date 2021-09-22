let r = 1;
let h = 4;
let s = 0;
let tick = 0;
// get the canvas

var svg = d3.select("svg");
// calculate extents and midpoint
let canvY = 300;
let canvX = 300;
let canvMidX = canvX / 2;
let canvMidY = canvY / 2;

// get page search params for hole circle params
document.getElementById("graph").onclick = function () {
    // remove any graphics currently in the svg
    svg.selectAll("*").remove();
    r = document.getElementById("r").value;
    h = document.getElementById("h").value;
    s = document.getElementById("s").value;
    let d = holes(r, h, s);
    draw(d);
}

//change degrees to radians
function toRadians (angle) {
    return angle * (Math.PI / 180);
}

// calculate hole from center
function hole(radius, angle) {
    let a = (Math.cos(angle) * radius).toFixed(4);
    let b = (Math.sin(angle) * radius).toFixed(4);
    return {x:a, y:b};
}

// calculate number of holes and angles for each point
function holes(radius, numHoles, startAngle) {
    let angle = 360 / numHoles;
    let currHole = 0;
    let points = [];

    while (currHole < numHoles) {
        points[currHole] = hole(radius, toRadians((angle * currHole) + parseFloat(startAngle)));
        currHole++;
    }
    return points;
}

function draw(d) {
    // draw x axis in svg
    svg.append("line")
    .attr("class", "axis")
    .attr("x1", canvMidX)
    .attr("y1", 0)
    .attr("x2", canvMidX)
    .attr("y2", canvY);
    // draw y axis in svg
    svg.append("line")
    .attr("class", "axis")
    .attr("x1", 0)
    .attr("y1", canvMidY)
    .attr("x2", canvX)
    .attr("y2", canvMidY);

    // calculate tick size according to canvas size
    tick = Math.min(canvX, canvY) / ((2 * r) + 1);

    // draw bolt hole circle in svg
    svg.append("circle")
    .attr("class", "hole-circle")
    .attr("cx", canvMidX)
    .attr("cy", canvMidY)
    .attr("r", tick * r)
    .attr("fill", "none");

    // draw holes and point text
    d.forEach(drawPoint);

    // draw the ticks on the axes
    drawTicks(r, tick, tick);
}

// draw a point and text on the canvas
function drawPoint(item, index) {
    let circX = (canvMidX + (tick * parseFloat(item.x)));
    let circY = (canvMidY - (tick * parseFloat(item.y)));

    svg.append("circle")
    .attr("class", "hole-point")
    .attr("cx", circX)
    .attr("cy", circY)
    .attr("r", 5)
    .attr("fill", "none");
    svg.append("text")
    .attr("class", "hole-text")
    .attr("x", circX - 40)
    .attr("y", circY + 20)
    .text(item.x + ", " + item.y);
}

// draw the ticks on the axes
function drawTicks(rad, tx, ty) {
    let counter = 0;
    // bolt hole circle was scaled to fit in radius + 1
    while (counter < parseFloat(rad) + 1) {
        let tkSz = 0;
        // set larger tick for whole number points on axes
        if (decimalNumber(counter)) {
            tkSz = 2;
        } else {
            tkSz = 4;
        }
        // above and below the x axis on both negative and positive sides
        svg.append("line")
        .attr("class", "tick")
        .attr("x1", canvMidX + counter * tx)
        .attr("y1", canvMidY - tkSz)
        .attr("x2", canvMidX + counter * tx)
        .attr("y2", canvMidY + tkSz);
        svg.append("line")
        .attr("class", "tick")
        .attr("x1", canvMidX - counter * tx)
        .attr("y1", canvMidY - tkSz)
        .attr("x2", canvMidX - counter * tx)
        .attr("y2", canvMidY + tkSz);
        // to the left and right of the y axis on both negative and positive sides
        svg.append("line")
        .attr("class", "tick")
        .attr("x1", canvMidX - tkSz)
        .attr("y1", canvMidY + counter * ty)
        .attr("x2", canvMidX + tkSz)
        .attr("y2", canvMidY + counter * ty);
        svg.append("line")
        .attr("class", "tick")
        .attr("x1", canvMidX - tkSz)
        .attr("y1", canvMidY - counter * ty)
        .attr("x2", canvMidX + tkSz)
        .attr("y2", canvMidY - counter * ty);
        // work in .5 increments for the ticks
        counter = counter + 0.5;

    }
}

// check whether the point is whole number or decimal
function decimalNumber(num) {
    return (num - Math.floor(num)) !== 0;
}