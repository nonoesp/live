

// Initialize the image classifier
let classifier;

// Image to be predicted on
let img;

const models = [
    'MobileNet',
    'DoodleNet',
]

function preload() {
    img = loadImage('images/doodle.jpg');
    classifier = ml5.imageClassifier(models[1]);
}

// p5js setup method
function setup () {
    createCanvas(600, 600);
    image(img, 0, 0);
    // stroke(255);
    // strokeWeight(4);
    // line(20,20, 500,300);
    console.log(`Classifying...`);
    classifier.classify(img, gotResult);
}

function gotResult(error, results) {

    if (error) {
        console.error(error);
    } else {
        // The results are returned in an array
        // ordered by confidence
        console.log(results);
        const label = results[0].label;
        const confidence = nf(results[0].confidence, 0, 2) * 100
        const status = document.getElementsByClassName('status')[0];
        status.innerHTML = `<strong>${label}</strong> @ ${confidence}%`;
    }
}