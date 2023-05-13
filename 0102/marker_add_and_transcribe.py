# Python 3.9
# script.py
#!/usr/bin/env python
# coding: utf-8

import atexit
import logging
logging.basicConfig(filename='/Users/nono/Desktop/example.log', encoding='utf-8', level=logging.DEBUG)

'''
Creates YouTube-friendly markers for on-going audio and video recordings.
'''

import argparse
import os
import math
from glob import glob

atexit.register(logging.info,"Exiting Python Script!")

def elapsed_seconds_since_start(path):
    return os.path.getmtime(path)-os.stat(path).st_birthtime


def duration_seconds_to_hours_minutes_seconds(seconds):
    hours = math.floor(seconds / (60*60))
    minutes = math.floor(seconds / 60 % 60)
    seconds = math.ceil(seconds % 60)
    return (hours, minutes, seconds)


def duration_to_timestamp(hours, minutes, seconds):
    hours_string = str(hours).zfill(2)
    minutes_string = str(minutes).zfill(2)
    seconds_string = str(seconds).zfill(2)
    if hours == 0:
        return f'{minutes_string}:{seconds_string}'
    return f'{hours_string}:{minutes_string}:{seconds_string}'

def seconds_to_timestamp(seconds):
    hours, minutes, _seconds = duration_seconds_to_hours_minutes_seconds(seconds)
    return duration_to_timestamp(hours, minutes, _seconds)


def timestamp(path):
    '''Returns the timestamp of an ongoing recording as hh:mm:ss.'''
    seconds = elapsed_seconds_since_start(path)
    hours, minutes, seconds = duration_seconds_to_hours_minutes_seconds(
        seconds)
    return duration_to_timestamp(hours, minutes, seconds)


def timestamp_to_seconds(ts):
    '''Converts a string hh:mm:ss timestamp into seconds.'''
    parts = ts.split(':')
    parts = list(map(lambda x: int(x), parts))
    if len(parts) == 3:
        hours, minutes, seconds = parts
    elif len(parts) == 2:
        hours = 0
        minutes, seconds = parts
    duration_seconds = ((hours * 60 + minutes) * 60) + seconds
    return duration_seconds


def transcribe(file_path, initial_prompt, whisper_model='tiny'):
    '''Transcribes an audio clip.'''

    # Lazily import whisper.
    import whisper    

    print(f'Transcribing {file_path}...')
    
    # Load the model.
    model = whisper.load_model(whisper_model)

    # Transcribe.
    result = model.transcribe(file_path, initial_prompt=initial_prompt)
    
    # Print the recognized text.
    return result


# ffmpeg-python API
# https://kkroening.github.io/ffmpeg-python/

def video_marker_to_audio_clip(input_path, output_path, marker_timestamp, start_seconds, end_seconds):
    '''Trims a video marker's audio clip.'''
    
    # Lazily import ffmpeg.
    import ffmpeg

    in_file = ffmpeg.input(input_path)
    logging.info(input_path)

    marker_seconds = timestamp_to_seconds(marker_timestamp)

    audio_clip = (
        in_file
        .filter_('atrim', start = start_seconds, end = end_seconds)
        .filter_('asetpts', 'PTS-STARTPTS')
    )

    output = ffmpeg.output(audio_clip, output_path)
    
    logging.info(f'run and saving to {output_path}...')
    # TODO: This does not run from Stream Deck.
    output.run(overwrite_output=True)


def add_marker(text, recording_path=None, recording_dir=None):

    if recording_path is None:

        file_types = [
            'mov',
            'MOV',
            'mp4',
            'MP4',
            'mkv',
            'MKV',
            # 'aiff',
            # 'AIFF',
            'mp3',
            'MP3',
            'wav',
            'WAV',
        ]
        # types = ('*.pdf', '*.cpp') # the tuple of file types
        recording_paths = []
        for file_type in file_types:
            recording_paths.extend(glob(f'{recording_dir}/*.{file_type}'))

        most_recent_modification_date = 0
        for file_path in recording_paths:
            modification_date = os.path.getmtime(file_path)
            if (modification_date > most_recent_modification_date):
                most_recent_modification_date = modification_date
                recording_path = file_path

    log_path = f'{recording_path}.markers.txt'

    with open(log_path, 'a') as f:
        stamp = timestamp(recording_path)
        marker_text = f'{stamp} {text}\n'
        f.write(marker_text)

    recording_name = os.path.basename(recording_path)
    print(f'Created marker for {recording_name} → {marker_text}', end='')
    return stamp, recording_path


def wait_and_transcribe(input_path, marker_timestamp, transcript_padding_seconds, transcript_duration_seconds, initial_prompt, whisper_model='tiny'):

    import time

    file_duration = elapsed_seconds_since_start(input_path)
    marker_timestamp_seconds = timestamp_to_seconds(marker_timestamp)
    transcript_start_seconds = marker_timestamp_seconds - transcript_padding_seconds
    transcript_end_seconds = marker_timestamp_seconds + transcript_duration_seconds
    seconds_to_wait = max(transcript_end_seconds - file_duration, 0) + 0.25

    print(f'Waiting for {seconds_to_wait} seconds...')

    time.sleep(seconds_to_wait + 1)
    output_clip_path = f'{input_path}.clip.wav'

    video_marker_to_audio_clip(
        input_path=input_path,
        output_path=output_clip_path,
        marker_timestamp=marker_timestamp,
        start_seconds=transcript_start_seconds,
        end_seconds=transcript_end_seconds,
    )
    transcript = transcribe(output_clip_path, initial_prompt, whisper_model)
    return transcript


def markers_from_file(file_path):
    # Open the marker's file in read mode.
    my_file = open(file_path, 'r')

    # Read all file contents
    lines = my_file.readlines()

    # Map each line to its timestamp.
    lines = list(map(lambda x: x.split(' ')[0], lines))

    return lines


def add_marker_transcript(text, marker_timestamp, markers_file_path):

        # Define a separator after which to append the transcript.
        TRANSCRIPT_SEPARATOR = ' › '

        # Open the marker's file in read mode.
        my_file = open(markers_file_path, 'r')

        # Read all file contents
        lines = my_file.readlines()

        new_lines = []
        for line in lines:
            if len(line.split(marker_timestamp)) > 1:

                ## (1) Append transcript at the end.
                if len(line.split(TRANSCRIPT_SEPARATOR)) > 1:
                    new_line_text = f'{line.split(TRANSCRIPT_SEPARATOR)[0]}{TRANSCRIPT_SEPARATOR}{text}\n'
                else:
                    new_line_text = line.replace('\n',f'{TRANSCRIPT_SEPARATOR}{text}\n')
                    
                # (2) Replace 'Marker' word only with transcript.
                # new_line_text = line.replace('Marker', text)
                
                # (3) Set timestamp and transcript (ignoring existing text).
                # new_line_text = f'{marker_timestamp} {text}\n'

                new_lines.append(new_line_text.replace('  ', ' '))
            else:
                new_lines.append(line)

        # Close the file
        my_file.close()
        
        # Open the marker's file in write mode.
        my_file = open(markers_file_path, 'w')
        my_file.write(''.join(new_lines))

WHISPER_MODELS = ['tiny', 'base', 'small', 'medium', 'large-v2']

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Create a marker for an ongoing recording.')
    parser.add_argument(
        '-t',
        '--text',
        type=str,
        default='Marker',
        help='Marker text.',
    )
    parser.add_argument(
        '-d',
        '--directory',
        type=str,
        default='/Users/nono/Dropbox/0_Inbox/recordings-obs',
        help='Directory containing recordings.',
    )
    parser.add_argument(
        '-f',
        '--file',
        type=str,
        default=None,
        help='Path to recording file.',
    )
    parser.add_argument(
        '-tp',
        '--transcript-padding',
        type=int,
        default=4,
        help='Seconds to add before timestamp.',
    )
    parser.add_argument(
        '-td',
        '--transcript-duration',
        type=int,
        default=10,
        help='Seconds to clip from the marker timestamp.',
    )    
    parser.add_argument(
        '-ts',
        '--timestamp',
        type=str,
        default=None,
        help='Timestamp to transcribe.',
    )
    parser.add_argument(
        '-m',
        '--model',
        type=str,
        default='tiny',
        help='Whisper model to use for transcription. [tiny, base, small, medium, large-v2]',
    )
    parser.add_argument(
        '-p',
        '--initial-prompt',
        type=str,
        default='Nono Martínez Alonso',
        help='Whisper\'s initial prompt.',
    )

    opt = parser.parse_args()

    marker_timestamps = None
    whisper_model = opt.model

    if whisper_model not in WHISPER_MODELS:
        print(f'Whisper model {whisper_model} not available.')
        whisper_model = 'tiny'
    print(f'Using Whisper\'s {whisper_model} model.')


    if opt.timestamp is None:
        # Add marker to input file or last modified file in directory.
        marker_timestamp, recording_path = add_marker(opt.text, opt.file, opt.directory)
    elif opt.file is not None:
        # On-demand transcription.
        recording_path = opt.file
        marker_timestamp = opt.timestamp
        if marker_timestamp == 'all':
            marker_timestamps = markers_from_file(f'{recording_path}.markers.txt')

    marker_timestamps = [marker_timestamp] if marker_timestamps is None else marker_timestamps

    for _timestamp in marker_timestamps:
        
        print(f'Transcribing {_timestamp}...')

        transcript = wait_and_transcribe(
            recording_path,
            _timestamp,
            opt.transcript_padding,
            opt.transcript_duration,
            initial_prompt=opt.initial_prompt,
            whisper_model=whisper_model
        )

        if transcript is not None:
            print(transcript['text'])

            add_marker_transcript(
                transcript['text'],
                _timestamp,
                f'{recording_path}.markers.txt'
            )


    print('Done!')

    

