var capture;
var img;
var canvasHeight;
var canvasWidth;
var pixelCount;
var colors;
var blend;

function applyNeonFilter() {
    if (pixels.length > 0) {
        for (var i = 0; i < pixelCount; i += 4) {
            var totalDiff;
            var closestTargetColor;
            var minColorPixelDiff = 0;
            for (var colorKey in colors) {
                var c = colors[colorKey];
                currentPixelDiff = Math.abs(pixels[i] - c[0]) + Math.abs(pixels[i + 1] - c[1]) + Math.abs(pixels[i + 2] - c[2]);
                if (minColorPixelDiff == 0 || minColorPixelDiff > currentPixelDiff) {
                    closestTargetColor = colorKey;
                    minColorPixelDiff = currentPixelDiff;
                };
            }
            pixels[i] = pixels[i] * (1 - blend) + blend * colors[closestTargetColor][0];
            pixels[i + 1] = pixels[i + 1] * (1 - blend) + blend * colors[closestTargetColor][1];
            pixels[i + 2] = pixels[i + 2] * (1 - blend) + blend * colors[closestTargetColor][2];
            pixels[i + 3] = 255;
        }
    }
    else {
        console.log("No image detected");
    }
}

function setup() {
    colors = {
        'neonGreen': [131,245,44],
        'highlighterGreen': (193,253,51),
        'neonOrange': [255,103,0],
        'neonPink': [255,0,153],
        'highlighterPink': [252,90,184],
        'neonPurple': [110,13,208],
        'neonBlue': [13,213,252],
        'neonYellow': [243,243,21]
    }
    var targetVideoWidth = windowWidth * 0.50;
    var targetVideoHeight = windowHeight * 0.50;

    capture = createCapture(VIDEO);
    capture.size(targetVideoWidth, targetVideoHeight);
    capture.hide();

    blendSlider = createSlider(-1, 1, .2, .1);
    blendSlider.style('width', '80px');
    blendSlider.position(5, capture.height + capture.height / 10);

    var pixelD = pixelDensity();
    pixelCount = 4 * (capture.width * pixelD) * (capture.height * pixelD);

}

function draw() {
    canvasWidth = capture.width;
    canvasHeight = blendSlider.y + blendSlider.height*2;
    var canvas = createCanvas(canvasWidth, canvasHeight);
    background(13,213,252);
    var pixelD = pixelDensity();
    pixelCount = 4 * (capture.width * pixelD) * (capture.height * pixelD);

    image(capture, 0, 0, capture.width, capture.height);
    blend = blendSlider.value();

    textSize(32);
    fill(255,103,0);
    stroke(2);
    text("neon-blend", blendSlider.x * 2 + blendSlider.width, blendSlider.y + blendSlider.height / 2);

    loadPixels();
    applyNeonFilter();
    updatePixels();
}

// many thanks to github:@jimmyland for helping debug frame rate issues!
