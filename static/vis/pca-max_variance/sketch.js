PASTELRED = "#d20000";
PASTELBLUE = "#007aff";
PASTELPURPLE = "#6E66BA";
PASTELYELLOW = "#FBC05E";
PASTELGREEN = "#8fc34f";


function make_data() {

    let x = [
        -3.4, -2.8, -2.1, -1.4, -0.9, 0.5, .9, 1.7, 2.3, 3.2
    ];

    let y = Array(x.length).fill(0);

    let delta = [
        -0.31420552,  0.58716784,
        -0.14771454,  0.1945921 , -0.08954943,
        -0.82894763,  0.68777209, -0.70625193,
        -0.93611341, -0.86743565
    ];

    for (let i=0; i<x.length; i++) {
        y[i] = x[i] + delta[i];
    }

    return [x, y]
}


function sketch_scatter (sketch) {

    let figure;
    let data = make_data();
    let x = data[0];
    let y = data[1];

    let theta;
    let u1;
    let u2;

    let variance;

    function rotate(pt, theta) {
        return [
            Math.cos(theta) * pt[0] - Math.sin(theta) * pt[1],
            Math.sin(theta) * pt[0] + Math.cos(theta) * pt[1]
        ]
    }

    function draw_unit_vector() {
        figure.plot([0, 2*u1], [0, 2*u2]);

        let arrow_width = .075;

        let t1 = rotate([1.9, arrow_width], theta);
        let t2 = rotate([1.9, -arrow_width], theta);

        st0 = figure.screen_coordinates([2*u1, 2*u2]);
        st1 = figure.screen_coordinates(t1);
        st2 = figure.screen_coordinates(t2);

        sketch.triangle(...st0, ...st1, ...st2);
    }

    function draw_projections() {
        for (let i=0; i<x.length; i++) {
            let ox = x[i];
            let oy = y[i];

            let dp = ox * u1 + oy * u2;

            let px = dp * u1;
            let py = dp * u2;

            sketch.fill("#ffffff");
            sketch.stroke("black");
            sketch.strokeWeight(2);

            figure.scatter([px], [py]);

            sketch.noFill();

            sketch.stroke(PASTELRED + '55');
            sketch.strokeWeight(2);
            sketch.drawingContext.setLineDash([5, 5]);

            figure.plot([ox, px], [oy, py]);

            sketch.drawingContext.setLineDash([]);

        }
    }

    function compute_variance() {

        function computeVariance(arr) {
            const n = arr.length;
            const mean = arr.reduce((acc, val) => acc + val, 0) / n;
            const variance = arr.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n;
            return variance;
        }

        let zs = [];
        for (let i=0; i<x.length; i++) {
            let ox = x[i];
            let oy = y[i];

            let z = ox * u1 + oy * u2;
            zs.push(z);
        }

        return computeVariance(zs);
    }

    function draw_dashed_line() {
        sketch.drawingContext.setLineDash([10, 10]);

        sketch.stroke(PASTELBLUE + '55')
        figure.plot([-9*u1, 9*u1], [-9*u2, 9*u2]);

        sketch.drawingContext.setLineDash([]);
    }

    sketch.setup = function() {
        let div = sketch.select('#canvas-scatter');

        // put setup code here
        let w = div.width * .75
        let scale = w / 8;
        sketch.createCanvas(w, w);
        figure = new Figure(sketch, [0, 0], [-4, 4], [-4, 4], scale, scale);
    }


    sketch.draw = function() {
        sketch.background('#fff');

        theta = sketch.select('#theta').value();
        u1 = Math.cos(theta);
        u2 = Math.sin(theta);

        sketch.select('#u1').html(u1.toFixed(3));
        sketch.select('#u2').html(u2.toFixed(3));

        sketch.strokeWeight(2);
        sketch.stroke('black');
        sketch.fill("#000000");
        figure.draw_axes();
        figure.scatter(x, y);

        sketch.stroke(PASTELBLUE);
        sketch.strokeWeight(5);

        draw_unit_vector();
        draw_dashed_line();
        let show_proj = sketch.select("#show-projections").checked();
        if (show_proj) {
            draw_projections();
        }

        variance = compute_variance();
        sketch.select('#variance').html(variance.toFixed(3));

    }

}

new p5(sketch_scatter, 'canvas-scatter');
