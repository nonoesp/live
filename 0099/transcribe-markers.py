print('Loading...')
import argparse
import ffmpeg
import whisper
# Clip marker audio
print('Clipping...')

def timestamp_to_seconds(ts):
    parts = ts.split(':')
    parts = list(map(lambda x: int(x), parts))
    if len(parts) == 3:
        hours, minutes, seconds = parts
    elif len(parts) == 2:
        hours = 0
        minutes, seconds = parts
    duration_seconds = ((hours * 60 + minutes) * 60) + seconds
    return duration_seconds

def transcribe(file_path):
    '''Transcribes an audio clip.'''

    print(f'Transcribing {file_path}...')
    
    # Load the model.
    model = whisper.load_model("tiny")

    # Transcribe.
    result = model.transcribe(file_path)
    
    # Print the recognized text.
    return result

# ffmpeg-python API
# https://kkroening.github.io/ffmpeg-python/

def video_marker_to_audio_clip(input_path, output_path, marker_timestamp, before_padding_seconds, duration_seconds):
    '''Trims a video marker's audio clip.'''
    
    in_file = ffmpeg.input(input_path)

    marker_seconds = timestamp_to_seconds(marker_timestamp)
    trim_start = max(marker_seconds - before_padding_seconds, 0)
    trim_end = marker_seconds + duration_seconds

    print('marker_seconds', '→', marker_seconds)
    print('trim_start', '→', trim_start)
    print('trim_end', '→', trim_end)

    audio_clip = (
        in_file
        .filter_('atrim', start = trim_start, end = trim_end)
        .filter_('asetpts', 'PTS-STARTPTS')
    )

    output = ffmpeg.output(audio_clip, output_path)
    output.run(overwrite_output=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Create a marker for an ongoing recording.')
    parser.add_argument(
        '-t',
        '--timestamp',
        type=str,
        default='00:01:00',
        help='Marker timestamp, e.g., 01:23:45 or 12:34.',
    )
    parser.add_argument(
        '-i',
        '--input',
        type=str,
        default=None,
        help='Path to input video file.',
        required=True        
    )
    parser.add_argument(
        '-o',
        '--output',
        type=str,
        default='clip.wav',
        help='Path to output audio clip.',
    )
    parser.add_argument(
        '-p',
        '--padding',
        type=int,
        default=6,
        help='Seconds to add before timestamp.',
    )
    parser.add_argument(
        '-d',
        '--duration',
        type=int,
        default=30,
        help='Seconds to clip from the marker timestamp.',
    )

    opt = parser.parse_args()
    video_marker_to_audio_clip(
        input_path=opt.input,
        output_path=opt.output,
        marker_timestamp=opt.timestamp,
        before_padding_seconds=opt.padding,
        duration_seconds=opt.duration
    )
    transcript = transcribe(opt.output)

    print(transcript['text'])
    print(opt)

#################################################3


#################################################3

# Trim a clip with video and audio.

# vid = (
#     in_file
#     .trim(start = 1800, end = 1810)
#     .setpts('PTS-STARTPTS')
# )
# aud = (
#     in_file
#     .filter_('atrim', start = 1800, end = 1810)
#     .filter_('asetpts', 'PTS-STARTPTS')
# )

# joined = ffmpeg.concat(vid, aud, v=1, a=1).node
# output = ffmpeg.output(joined[0], joined[1], 'out.mp4')
# output.run(overwrite_output=True)

#################################################