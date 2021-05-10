# Convert Pix2Pix TensorFlow Core model to TensorFlow.js

- Grab an existing TensorFlow Core Pix2Pix model in the Keras h5 format

```bash
210121_212952_edges2tulips-live_tf-2.4.0@last.h5
```

- Create a Python environment and install the `tensorflowjs_converter`

```bash
conda create -n live-30 python=3.8 ipykernel
conda activate live-30
pip install tensorflowjs
```

- Convert our model from Keras `.h5` to TensorFlow.js

```bash
tensorflowjs_converter --input_format keras \
                       path/to/my_model.h5 \
                       path/to/tfjs_target_dir
```

- References

  - 🎥 [How to create Python conda environments](https://www.youtube.com/watch?v=saEm8FJ62kI)
