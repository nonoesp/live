import * as tf from '@tensorflow/tfjs-node';

const fs = require('fs');
const jpeg = require('jpeg-js');

const NUMBER_OF_CHANNELS = 3

console.log(`Loaded TensorFlow.js Node.js`);

const readImage = path => {
    const buf = fs.readFileSync(path)
    const pixels = jpeg.decode(buf, true)
    return pixels
}

const imageByteArray = (image, numChannels) => {
    const pixels = image.data
    const numPixels = image.width * image.height;
    const values = new Int32Array(numPixels * numChannels);
  
    for (let i = 0; i < numPixels; i++) {
      for (let channel = 0; channel < numChannels; ++channel) {
        values[i * numChannels + channel] = pixels[i * 4 + channel];
      }
    }
  
    return values
  }
  
  const imageToInput = (image, numChannels) => {
    const values = imageByteArray(image, numChannels)
    const outShape: [number, number, number] = [image.height, image.width, numChannels];
    const input = tf.tensor3d(values, outShape, 'float32');
  
    return input
  }

const imagePath = "/Users/nono/Desktop/input.jpg";
const savePath = "/Users/nono/Desktop/output.jpg";
// const imageAsBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

// Define model variable
let model: tf.LayersModel;

(async () => {

    console.log(`Loading TensorFlow.js model..`);

    // You need to load the model from an HTTP or HTTPS
    // server. If your model is local, you could serve
    // its directory using the http-server npm package
    // e.g., npm i http-server && http-server /path/to/model
    model = await tf.loadLayersModel(
        'http://127.0.0.1:8080/model.json'
    )
    model.summary();
    
    // Load image from file into a Tensor
    const image = readImage(imagePath);
    const input = imageToInput(image, NUMBER_OF_CHANNELS)
    const inputBatch = tf.cast(input.div(255.0), 'float32').expandDims(0);

    // Predict
    // -1 1 -- ( x * 0.5 + 0.5 ) * 255
    console.log(`Predicting..`);
    const prediction = (await model.apply(inputBatch, {training: true}) as tf.Tensor);
    // const data = prediction.mul(255).squeeze().dataSync();
    // console.log(data);

    // Save prediction output
    const output = tf.cast(prediction.mul(0.5).add(0.5).mul(255), 'int32');
    const newImg = await tf.node.encodePng(output.squeeze());
    fs.writeFileSync(savePath, newImg);


})();
