import * as tf from '@tensorflow/tfjs-node';

console.log(`Loaded TensorFlow.js Node.js`);

let model: tf.LayersModel;

(async () => {

    console.log(`Loading TensorFlow.js model..`);

    // You need to load the model from an HTTP or HTTPS
    // server. If your model is local, you could serve
    // its directory using the http-server npm package
    // e.g., npm i http-server && http-server /path/to/model
    model = await tf.loadLayersModel(
        'http://127.0.0.1:8080/model/model.json'
    )

    // Predict
    console.log(`Predicting..`);
    const inputTensor = tf.randomUniform([1,256,256,3]);
    const prediction = (await model.predict(inputTensor) as tf.Tensor);
    // Print output
    console.log(prediction.arraySync());

    // Make more predictions
    console.log(`Predicting..`);
    (await model.predict(inputTensor) as tf.Tensor);
    console.log(`Predicting..`);
    (await model.predict(inputTensor) as tf.Tensor);


})();
