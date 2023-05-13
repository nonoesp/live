## Marker AI Transcripts

### Requirements

Install `ffmpeg-python` and `openai-whisper` in your Python environment.

Here's an example on how to create an Anaconda environment with these dependencies.

```sh
conda create -n markers python=3.10 -y
conda activate markers
pip install pip install git+https://github.com/openai/whisper.git ffmpeg-python
```

## Usage

### Add marker and transcribe

```sh
python marker_add_and_transcribe.py \
    -f path/to/recording.mp4
```

### Transcribe a specific marker

```sh
python marker_add_and_transcribe.py \
    -ts 01:10 \
    -f path/to/recording.mp4
```

### Transcribe all existing markers offline

```sh
python marker_add_and_transcribe.py \
    -ts all \
    -f path/to/recording.mp4
```

### Custom paramters

```sh
python marker_add_and_transcribe.py \
    -tp 3 \
    -td 8 \
    -f path/to/recording.mp4
```