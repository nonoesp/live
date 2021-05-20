console.log(`› Loading TensorFlow.js for Node.js..`);
console.log();

// Dependencies
import * as tf from '@tensorflow/tfjs-node';
import { formatWithOptions } from 'util';
const fs = require('fs');
const jpeg = require('jpeg-js');

// Variables
const NUMBER_OF_CHANNELS = 3;
const LABELS_FILE = `ImageNetLabels.txt`;
let model : tf.GraphModel;

// Config
const dir = `/Users/nono/repos/Live/32/images-224x224/`;
const images = [
    'download-0.jpg',
    'download-1.jpg',
    'download-2.jpg',
    'download-3.jpg',
    'download-4.jpg',
    'download-5.jpg',
    'download-6.jpg',
    'download-7.jpg',
    'download-8.jpg',
    'download-9.jpg',
    'download-10.jpg',
    'download-11.jpg',
];
// const imagePath = `/Users/nono/repos/Live/32/images-224x224/download-0.jpg`;
// const jsonPath = imagePath.replace(`.jpg`, `.jpg.json`);

// Get ImageNextLabels
const labels = fs.readFileSync(LABELS_FILE, `utf-8`).split('\n');

// Utilities
const readImage = path => {
    const buf = fs.readFileSync(path);
    const pixels = jpeg.decode(buf, true);
    return pixels
}

const imageToInput = (image, numChannels) => {
    const values = imageByteArray(image, numChannels);
    const outShape: [number, number, number] = [
        image.height,
        image.width,
        numChannels,
    ];
    const input = tf.tensor3d(values, outShape, 'float32');
    return input;
}

const imageByteArray = (image, numChannels) => {
    const pixels = image.data;
    const numPixels = image.width * image.height;
    const values = new Int32Array(numPixels * numChannels);

    for (let i = 0; i < numPixels; i++) {
        for (let channel = 0; channel < numChannels; ++channel) {
            values[i * numChannels + channel] = pixels[i * 4 + channel];
        }
    }

    return values;
}


(async () => {

    // Load our model
    console.log();
    console.log(`› Loading model from TensorFlow Hub..`);
    model = await tf.loadGraphModel(
        "https://tfhub.dev/google/tfjs-model/imagenet/resnet_v2_50/classification/3/default/1",
        {
            fromTFHub: true
        }
    );

    console.log();
    console.log(`› Predicting..`);
    console.log();

    for (let imageName of images) {
        
        const imagePath = `${dir}${imageName}`;

        // Load input image from file to a Tensor
        // console.log();
        // console.log(`› Loading input..`);
        const image = readImage(imagePath);
        const input = imageToInput(image, NUMBER_OF_CHANNELS);
        const inputBatch = tf.cast(input.div(255.0), 'float32').expandDims(0);
        
        // Predict
        // console.log(`› Predicting..`);
        const logits = await model.predict(inputBatch) as tf.Tensor;
        const probabilities = await tf.softmax(logits).data();
        const result = await tf.argMax(probabilities).dataSync();

        // Log prediction to console
        const topPrediction = labels[result[0]];
        console.log(`› ${imageName} » ${labels[result[0]]} (${result})`);

        // Save JSON file with top prediction
        const predictionJson = {
            "labels": [
                topPrediction
            ]
        };
        const jsonPath = imagePath.replace('.jpg', '.jpg.json');
        fs.writeFileSync(jsonPath, JSON.stringify(predictionJson));

    }

})();