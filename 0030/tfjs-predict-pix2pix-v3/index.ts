console.log(`> Loading TensorFlow.js for Node.js..`);

// Dependencies
import * as tf from '@tensorflow/tfjs-node';
import { formatWithOptions } from 'util';
const fs = require('fs');
const jpeg = require('jpeg-js');

// Variables
const NUMBER_OF_CHANNELS = 3;
let model : tf.LayersModel;

// Config
const imagePath = `/Users/nono/repos/Live/30/c-input.jpg`;
const savePath = imagePath.replace(`input`, `output`);

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
    console.log(`> Loading Pix2Pix model..`);
    model = await tf.loadLayersModel(
        'http://127.0.0.1:8080/model.json'
    );

    // Print a model summary
    model.summary();

    // Load input image from file to a Tensor
    console.log(`Loading input..`);
    const image = readImage(imagePath);
    const input = imageToInput(image, NUMBER_OF_CHANNELS);
    const inputBatch = tf.cast(input.div(255.0), 'float32').expandDims(0);

    // Predict
    console.log(`Predicting..`);
    const prediction = (await model.apply(
        inputBatch,
        { training: true }
    ) as tf.Tensor);

    // Save our prediction output as an image
    // (-1.0, +1.0) › (0, 255)
    // (-0.5, +0.5) + 1.0 › (0.0, 1.0) › (0, 255)
    const output = tf.cast(
        prediction.mul(0.5).add(0.5).mul(255),
        'int32'
    );
    const newImage = await tf.node.encodePng(output.squeeze());
    console.log(`Exporting output..`);
    fs.writeFileSync(savePath, newImage);

})();